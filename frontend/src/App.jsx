import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Mascot from './Mascot';

const API_BASE = 'http://localhost:5000';

function getWeatherEmoji(temperature, precipitationChance) {
  if (precipitationChance >= 70) return '🌧️';
  if (precipitationChance >= 30) return '🌦️';
  if (temperature >= 32) return '☀️';
  if (temperature >= 26) return '🌤️';
  return '☁️';
}

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  const fetchByCoords = async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/api/planner`, { params: { lat, lon } });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const fetchByPlace = async (place) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/api/planner`, { params: { place } });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Location not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
        () => setError('Location access denied — try searching instead')
      );
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) fetchByPlace(searchInput.trim());
  };

  return (
    <div className="card">
      <h1>What to wear today? 🌈</h1>

      <form onSubmit={handleSearch}>
        <input
          className="search-bar"
          type="text"
          placeholder="Search a city..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </form>

      {loading && <p>Checking the sky for you... ☁️</p>}
      {error && <p style={{ color: 'var(--coral)' }}>{error}</p>}

      {data && !loading && (
        <>
          <div className="weather-icon">
            <Mascot
              temperature={data.temperature}
              precipitationProb={data.precipitationProb}
              windSpeed={data.windSpeed}
              aqi={data.aqi}
            />
          </div>
          <p><strong>{data.location}</strong></p>
          <p>{data.temperature}°C · Wind {data.windSpeed} km/h · AQI {data.aqi}</p>
          <div className="suggestion-bubble">{data.suggestion}</div>
        </>
      )}
    </div>
  );
}

export default App;