import React, { useState } from 'react';

export default function SearchBar({ onSearch, onUseLocation, units, setUnits }) {
    const [value, setValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = value.trim();
        if (!trimmed) return;
        onSearch(trimmed);
    };

    return (
        <div className="search-bar">
            <form onSubmit={handleSubmit} className="search-form" aria-label="Search weather by city">
                <input
                    type="text"
                    placeholder="Enter city (e.g. London)"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    aria-label="City name"
                />
                <button type="submit" className="btn">Search</button>
                <button type="button" className="btn btn-ghost" onClick={onUseLocation}>
                    Use my location
                </button>
            </form>

            <div className="units-toggle" role="radiogroup" aria-label="Units">
                <label>
                    <input
                        type="radio"
                        name="units"
                        checked={units === 'metric'}
                        onChange={() => setUnits('metric')}
                    />
                    °C
                </label>
                <label>
                    <input
                        type="radio"
                        name="units"
                        checked={units === 'imperial'}
                        onChange={() => setUnits('imperial')}
                    />
                    °F
                </label>
            </div>
        </div>
    );
}
