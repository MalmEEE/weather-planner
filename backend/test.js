const { getSuggestion } = require('./suggestionEngine');

console.log(getSuggestion({ temperature: 33, windSpeed: 10, precipitationProb: 20, aqi: 40 }));
console.log(getSuggestion({ temperature: 27, windSpeed: 45, precipitationProb: 80, aqi: 160 }));