import React, { useEffect, useState, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';

const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;

function App() {
  const [query, setQuery] = useState('');
  const [units, setUnits] = useState('metric'); // 'metric' or 'imperial'
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeatherByCity = useCallback(async (city, unitsParam = units) => {
    if (!city) return;
    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&units=${unitsParam}&appid=${API_KEY}`;

      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Could not fetch weather');
      } else {
        setWeather(data);
      }
    } catch (err) {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  }, [API_KEY, units]);

  const fetchWeatherByCoords = useCallback(async (lat, lon, unitsParam = units) => {
    if (lat == null || lon == null) return;
    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unitsParam}&appid=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Could not fetch weather');
      } else {
        setWeather(data);
      }
    } catch (err) {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  }, [API_KEY, units]);

  useEffect(() => {
    if (!navigator.geolocation) {
      fetchWeatherByCity('Toronto', units);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude, units);
      },
      () => {
        fetchWeatherByCity('Toronto', units);
      },
      { timeout: 5000 }
    );
  }, [fetchWeatherByCity, fetchWeatherByCoords, units]);

  useEffect(() => {
    if (!weather) return;
    if (weather?.name) {
      fetchWeatherByCity(weather.name, units);
    }
  }, [units]);

  const handleSearch = (city) => {
    if (!city) return;
    setQuery(city);
    fetchWeatherByCity(city, units);
  };

  const handleUseCoords = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported in this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude, units);
      },
      () => {
        setError('Unable to get your location.');
      }
    );
  };

  // Determine background video (sunny, rain, night)
  const getVideoForWeather = () => {
    if (!weather) return '/videos/sunny.mp4';

    const main = weather.weather[0].main.toLowerCase();
    const current = weather.dt; // city's current time
    const sunrise = weather.sys.sunrise;
    const sunset = weather.sys.sunset;
    const isDay = current >= sunrise && current <= sunset;

    if (['rain', 'drizzle', 'thunderstorm'].includes(main)) {
      return '/videos/rain.mp4';
    } else if (main === 'clear') {
      return isDay ? '/videos/sunny.mp4' : '/videos/night.mp4';
    } else {
      return isDay ? '/videos/sunny.mp4' : '/videos/night.mp4';
    }
  };

  return (
    <div className="app">
      {weather && (
        <video
          autoPlay
          loop
          muted
          className="background-video"
          key={weather.weather[0].main + weather.dt}
        >
          <source src={getVideoForWeather()} type="video/mp4" />
        </video>
      )}

      <div className="content">
        <header className="app-header">
          <h1>Chelsi Dodia - Weather Now</h1>
          <p className="subtitle">
            {weather ? `${weather.name} (${weather.weather[0].main})` : 'Search any city to get the current weather'}
          </p>
        </header>

        <main className="container">
          <div className="weather-container">
            <SearchBar
              onSearch={handleSearch}
              onUseLocation={handleUseCoords}
              units={units}
              setUnits={(u) => setUnits(u)}
            />

            {loading && <div className="status">Loading…</div>}
            {error && <div className="status status-error">{error}</div>}

            {weather && !loading && <WeatherCard weather={weather} units={units} />}
          </div>

          <footer className="footer">
            <small>
              Weather App by Chelsi Dodia. Data from OpenWeather. Temperature in {units === 'metric' ? '°C' : '°F'}.
            </small>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
