function getSuggestion({ temperature, windSpeed, precipitationProb, aqi }) {
  let parts = [];

  // 1. Air quality (can override everything)
  if (aqi >= 201) {
    parts.push("Air quality is very unhealthy today — it's best to stay indoors.");
  } else if (aqi >= 151) {
    parts.push("Air quality is unhealthy — limit outdoor time and consider a mask.");
  } else if (aqi >= 101) {
    parts.push("Air quality is unhealthy for sensitive groups — a mask is a good idea if you're sensitive to pollution.");
  } else if (aqi >= 51) {
    parts.push("Air quality is moderate today.");
  }

  // 2. Precipitation
  if (precipitationProb >= 70) {
    parts.push("High chance of rain — bring an umbrella or raincoat, and consider indoor plans.");
  } else if (precipitationProb >= 30) {
    parts.push("There's a moderate chance of rain — might be worth carrying an umbrella just in case.");
  }

  // 3. Temperature
  if (temperature >= 32) {
    parts.push("It's hot — wear light, breathable clothing and avoid strenuous activity during midday.");
  } else if (temperature >= 26) {
    parts.push("It's warm — normal light clothing works well, good day for most outdoor plans.");
  } else {
    parts.push("It's cooler than usual — a light layer might be comfortable.");
  }

  // 4. Wind
  if (windSpeed >= 40) {
    parts.push("Winds are strong — secure any loose items and be cautious if biking or using an umbrella.");
  } else if (windSpeed >= 15) {
    parts.push("It's a bit breezy today.");
  }

  return parts.join(" ");
}

module.exports = { getSuggestion };