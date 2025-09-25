import React from 'react';

function formatWind(speed, units) {
    // speed from API: m/s if metric, miles/hour if imperial? OpenWeather returns m/s by default with metric.
    // For 'imperial' units the API returns wind speed in miles/hour, for simplicity we'll display units label
    return `${Math.round(speed)} ${units === 'metric' ? 'm/s' : 'mph'}`;
}

export default function WeatherCard({ weather, units }) {
    if (!weather) return null;

    const {
        name,
        sys: { country } = {},
        main: { temp, feels_like, humidity } = {},
        weather: weatherArr = [],
        wind: { speed } = {}
    } = weather;

    const w = weatherArr[0] || {};
    const icon = w.icon;
    const description = w.description;

    const iconUrl = icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : null;

    return (
        <div className="card">
            <div className="card-header">
                <div>
                    <h2 className="location">{name}{country ? `, ${country}` : ''}</h2>
                    <div className="desc">{description}</div>
                </div>

                {iconUrl && (
                    <img src={iconUrl} alt={description || 'weather icon'} width="80" height="80" />
                )}
            </div>

            <div className="card-body">
                <div className="temp">
                    {Math.round(temp)} {units === 'metric' ? '°C' : '°F'}
                </div>

                <div className="more">
                    <div><strong>Feels like:</strong> {Math.round(feels_like)}{units === 'metric' ? '°C' : '°F'}</div>
                    <div><strong>Humidity:</strong> {humidity}%</div>
                    <div><strong>Wind:</strong> {formatWind(speed, units)}</div>
                </div>
            </div>
        </div>
    );
}
