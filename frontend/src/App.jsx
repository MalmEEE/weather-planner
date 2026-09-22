import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// import all 12 icons
import aqi201plus from './assets/weather/aqi_201plus.png';
import aqi151_200 from './assets/weather/aqi_151_200.png';
import aqi101_150 from './assets/weather/aqi_101_150.png';
import aqi51_100 from './assets/weather/aqi_51_100.png';
import rain70plus from './assets/weather/rain_70plus.png';
import rain30_69 from './assets/weather/rain_30_69.png';
import tempHot from './assets/weather/temp_hot_32plus.png';
import tempWarm from './assets/weather/temp_warm_26_31.png';
import tempCool from './assets/weather/temp_cool_25.png';
import windStrong from './assets/weather/wind_strong_40plus.png';
import windBreezy from './assets/weather/wind_breezy_15_39.png';
import windCalm from './assets/weather/wind_calm_15minus.png';

// average color of an image element -> "r,g,b"
function avgColor(img) {
  try {
    const c = document.createElement('canvas');
    c.width = 40; c.height = 40;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0, 40, 40);
    const { data } = ctx.getImageData(0, 0, 40, 40);
    let r = 0, g = 0, b = 0, n = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 128) continue; // skip transparent pixels
      r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
    }
    if (!n) return '138,123,232';
    return `${Math.round(r / n)},${Math.round(g / n)},${Math.round(b / n)}`;
  } catch {
    return '138,123,232'; // violet fallback
  }
}

const TINT = {
  aqi_101_150: '213,172,108', aqi_151_200: '202,121,143',
  aqi_201plus: '143,103,171', aqi_51_100: '150,185,166',
  rain_30_69: '160,188,236', rain_70plus: '107,159,208',
  temp_cool_25: '143,174,231', temp_hot_32plus: '211,164,147',
  temp_warm_26_31: '201,194,138', wind_breezy_15_39: '159,165,228',
  wind_calm_15minus: '156,184,203', wind_strong_40plus: '142,143,226',
};

const ICONS = {
  aqi_201plus: aqi201plus, aqi_151_200: aqi151_200, aqi_101_150: aqi101_150,
  aqi_51_100: aqi51_100, rain_70plus: rain70plus, rain_30_69: rain30_69,
  temp_hot_32plus: tempHot, temp_warm_26_31: tempWarm, temp_cool_25: tempCool,
  wind_strong_40plus: windStrong, wind_breezy_15_39: windBreezy, wind_calm_15minus: windCalm,
};

const API_BASE = 'http://localhost:5000';

// ---- helpers moved OUTSIDE the component (fixes remount/flicker) ----
function getHero(data) {
  if (data.precipitationProb >= 70) return { label: 'Rainy', sub: 'Bring an umbrella', tag: 'rain_70plus' };
  if (data.precipitationProb >= 30) return { label: 'Light Rain', sub: 'Maybe carry an umbrella', tag: 'rain_30_69' };
  if (data.temperature >= 32) return { label: 'Hot', sub: 'Stay cool & hydrated', tag: 'temp_hot_32plus' };
  if (data.temperature >= 26) return { label: 'Warm', sub: 'Great for outdoor plans', tag: 'temp_warm_26_31' };
  return { label: 'Mild', sub: 'A light layer helps', tag: 'temp_cool_25' };
}

function groupFor(tag) {
  if (tag.startsWith('aqi')) return 'Air';
  if (tag.startsWith('rain')) return 'Rain';
  if (tag.startsWith('temp')) return 'Temp';
  return 'Wind';
}

function labelFor(tag, data) {
  if (tag.startsWith('aqi')) return `AQI ${data.aqi}`;
  if (tag.startsWith('rain')) return `${data.precipitationProb}%`;
  if (tag.startsWith('temp')) return `${Math.round(data.temperature)}°C`;
  return `${data.windSpeed} km/h`;
}

function GlassStat({ tag, value, label }) {
  const [rgb, setRgb] = useState(TINT[tag] || '138,123,232');
  return (
    <div className="glass stat-card" style={{ background: `rgba(${rgb}, 0.28)` }}>
      <img src={ICONS[tag]} alt={label} onLoad={(e) => setRgb(avgColor(e.target))} />
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  );
}

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [heroRgb, setHeroRgb] = useState(null);

  const fetchByCoords = async (lat, lon) => {
    setLoading(true); setError(null);
    try {
      const res = await axios.get(`${API_BASE}/api/planner`, { params: { lat, lon } });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally { setLoading(false); }
  };

  const fetchByPlace = async (place) => {
    setLoading(true); setError(null);
    try {
      const res = await axios.get(`${API_BASE}/api/planner`, { params: { place } });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Location not found');
    } finally { setLoading(false); }
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
    <div className="app">
      <form onSubmit={handleSearch}>
        <input
          className="search-bar"
          type="text"
          placeholder="Search a city..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </form>

      {loading && <p className="status-text">Checking the sky for you... ☁️</p>}
      {error && <p className="status-text" style={{ color: '#FF8C69' }}>{error}</p>}

      {data && !loading && (() => {
        const hero = getHero(data);
        return (
          <>
            <div className="topbar">
              <div>
                <p className="location-name">📍 {data.location}</p>
                <p className="date-text">
                  {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })}
                </p>
              </div>
            </div>

            <div className="glass hero" style={{ background: `rgba(${heroRgb || TINT[hero.tag] || '138,123,232'}, 0.35)` }}>
              <img
                className="hero-icon"
                src={ICONS[hero.tag]}
                alt={hero.label}
                onLoad={(e) => setHeroRgb(avgColor(e.target))}
              />
              <p className="hero-condition">{hero.label}</p>
              <p className="hero-sub">{hero.sub}</p>
              <p className="hero-temp">{Math.round(data.temperature)}°</p>
              <p className="hero-feels">
                Feels like {Math.round(data.feelsLike ?? data.temperature)}° · AQI {data.aqi} · Wind {data.windSpeed} km/h
              </p>
            </div>

            <div className="stat-row">
              {data.suggestionTags.slice(0, 3).map((tag) => (
                <GlassStat key={tag} tag={tag} value={labelFor(tag, data)} label={groupFor(tag)} />
              ))}
            </div>

            <div className="glass suggestion-card">
              <p className="suggestion-title">💡 Today's tip</p>
              <p className="suggestion-text">{data.suggestionText}</p>
            </div>
          </>
        );
      })()}
    </div>
  );
}

export default App;