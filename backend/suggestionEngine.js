const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function getSuggestion({ temperature, windSpeed, precipitationProb, aqi }) {
  // 1. Turn each factor into a 0–100 "penalty" (0 = ideal, 100 = worst).
  //    These are formulas, not fixed buckets — every real value maps to a real number.
  const rainPenalty = clamp(precipitationProb, 0, 100);
  const aqiPenalty  = clamp((aqi - 50) * (100 / 150), 0, 100);        // 50→0, 200→100
  const windPenalty = clamp((windSpeed - 15) * (100 / 35), 0, 100);    // 15→0, 50→100
  const tempPenalty = temperature >= 24                                // ideal ≈ 24°C
    ? clamp((temperature - 24) * (100 / 16), 0, 100)                    // 24→0, 40→100
    : clamp((24 - temperature) * (100 / 20), 0, 100);                   // 24→0, 4→100

  // 2. Find the single limiting factor. Weight lets hazards outrank mild discomfort.
  const factors = [
    { key: 'air',  penalty: aqiPenalty,  weight: 1.3 },
    { key: 'rain', penalty: rainPenalty, weight: 1.2 },
    { key: 'heat', penalty: tempPenalty, weight: 1.0 },
    { key: 'wind', penalty: windPenalty, weight: 0.8 },
  ];
  const worst = factors.reduce((a, b) =>
    (b.penalty * b.weight > a.penalty * a.weight ? b : a));

  // 3. Overall outdoor score = 100 minus the worst factor (a chain is only as
  //    strong as its weakest link, so a single severe factor can't be "averaged away").
  const outdoorScore = Math.round(clamp(100 - Math.max(...factors.map(f => f.penalty)), 0, 100));

  // 4. Clothing — driven by temperature ONLY, so it can never fight the verdict.
  let clothing;
  if (temperature >= 32) clothing = 'wear light, breathable clothing and keep water handy';
  else if (temperature >= 26) clothing = 'light, comfortable clothing is ideal';
  else if (temperature >= 20) clothing = 'everyday clothing works well';
  else clothing = 'add a light layer to stay comfortable';

  // 5. ONE activity verdict, from the overall score.
  let verdict;
  if (outdoorScore >= 75) verdict = "it's a great day to be outside";
  else if (outdoorScore >= 50) verdict = 'outdoor plans are fine with a little care';
  else if (outdoorScore >= 30) verdict = 'better to keep outdoor time short today';
  else verdict = "it's best to stay indoors today";

  // 6. One specific tip about the limiting factor only.
  const tips = {
    air:  aqi >= 151 ? 'air quality is poor, so wear a mask if you head out'
        : aqi >= 101 ? 'air quality is a little high — sensitive people may want a mask' : null,
    rain: precipitationProb >= 70 ? 'rain is very likely, so take an umbrella'
        : precipitationProb >= 30 ? 'rain is possible, so an umbrella is worth carrying' : null,
    heat: temperature >= 32 ? 'it will feel hot, so avoid strenuous activity around midday' : null,
    wind: windSpeed >= 40 ? 'winds are strong, so secure loose items' : null,
  };
  const tip = tips[worst.key];

  // 7. Assemble one coherent sentence.
  let text = `It's ${Math.round(temperature)}°C — ${clothing}, and ${verdict}.`;
  if (tip) text += ` Also, ${tip}.`;

  // 8. Icon tags (unchanged — your 3D icons still work).
  const tags = [];
  if (aqi >= 201) tags.push('aqi_201plus');
  else if (aqi >= 151) tags.push('aqi_151_200');
  else if (aqi >= 101) tags.push('aqi_101_150');
  else if (aqi >= 51) tags.push('aqi_51_100');
  if (precipitationProb >= 70) tags.push('rain_70plus');
  else if (precipitationProb >= 30) tags.push('rain_30_69');
  if (temperature >= 32) tags.push('temp_hot_32plus');
  else if (temperature >= 26) tags.push('temp_warm_26_31');
  else tags.push('temp_cool_25');
  if (windSpeed >= 40) tags.push('wind_strong_40plus');
  else if (windSpeed >= 15) tags.push('wind_breezy_15_39');
  else tags.push('wind_calm_15minus');

  return { text, tags, outdoorScore };
}

module.exports = { getSuggestion };