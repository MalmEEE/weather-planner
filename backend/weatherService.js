const axios = require('axios');

// Convert a place name into lat/lon
async function geocodeLocation(name) {
  const res = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
    params: { name, count: 1 }
  });
  if (!res.data.results || res.data.results.length === 0) {
    throw new Error('Location not found');
  }
  const { latitude, longitude, name: resolvedName, country } = res.data.results[0];
  return { latitude, longitude, resolvedName, country };
}

// Get current weather (temp, wind, precipitation)
async function getWeather(lat, lon) {
  const res = await axios.get('https://api.open-meteo.com/v1/forecast', {
    params: {
      latitude: lat,
      longitude: lon,
      current: 'temperature_2m,wind_speed_10m,precipitation_probability'
    }
  });
  return res.data.current;
}

// Get air quality (US AQI)
async function getAirQuality(lat, lon) {
  const res = await axios.get('https://air-quality-api.open-meteo.com/v1/air-quality', {
    params: {
      latitude: lat,
      longitude: lon,
      current: 'us_aqi'
    }
  });
  return res.data.current.us_aqi;
}

module.exports = { geocodeLocation, getWeather, getAirQuality };