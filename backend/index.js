const express = require('express');
const cors = require('cors');
const { geocodeLocation, getWeather, getAirQuality } = require('./weatherService');
const { getSuggestion } = require('./suggestionEngine');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/planner', async (req, res) => {
  try {
    const { lat, lon, place } = req.query;

    let latitude = lat;
    let longitude = lon;
    let locationName = null;

    if (place) {
      const geo = await geocodeLocation(place);
      latitude = geo.latitude;
      longitude = geo.longitude;
      locationName = `${geo.resolvedName}, ${geo.country}`;
    }

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Provide either lat/lon or a place name' });
    }

    const weather = await getWeather(latitude, longitude);
    const aqi = await getAirQuality(latitude, longitude);

    const suggestion = getSuggestion({
        temperature: weather.temperature_2m,
        windSpeed: weather.wind_speed_10m,
        precipitationProb: weather.precipitation_probability ?? 0,
        aqi
    });

    res.json({
        location: locationName,
        temperature: weather.temperature_2m,
        windSpeed: weather.wind_speed_10m,
        precipitationProb: weather.precipitation_probability ?? 0,
        aqi,
        suggestionText: suggestion.text,
        suggestionTags: suggestion.tags
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));