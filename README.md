# What to Wear Today 🌦️

A playful full-stack weather planner that turns live weather and air quality data into a single, clear **"what to wear and whether to go out"** recommendation — powered entirely by free, keyless APIs.

Instead of just showing raw numbers, the app runs a small **scoring engine** that weighs temperature, rain, wind, and air quality together to produce one coherent piece of advice for the day.

<img width="485" height="796" alt="image" src="https://github.com/user-attachments/assets/6debc2e3-379d-4778-813b-ec737e6b9e72" />  <img width="493" height="802" alt="image" src="https://github.com/user-attachments/assets/a95ddff5-9bad-4aeb-be4d-70cb9f9d90e4" />

---

## ✨ Features

- **Live weather + air quality** from [Open-Meteo](https://open-meteo.com/) — no API key, no billing, no signup
- **Auto-location** via browser geolocation, plus manual **city search**
- **"Feels like" temperature** (apparent temperature)
- **Scoring engine** that produces coherent, non-contradictory advice (see below)
- **Glassmorphism UI** with condition-based 3D icons and per-card color tinting
- Fully **responsive** — works on mobile and desktop

---

## 🧠 How the advice works

Rather than gluing together one sentence per weather factor (which can contradict itself), the engine:

1. Converts each factor — temperature, rain %, wind, AQI — into a **penalty score** (0 = ideal, 100 = worst) using continuous formulas.
2. Finds the single **limiting factor** (air quality and rain are weighted heaviest).
3. Computes an overall **outdoor score** driven by the worst factor — so one severe condition can't be "averaged away."
4. Builds one coherent recommendation:
   - **What to wear** — decided by temperature only
   - **Whether to go out** — one verdict from the overall score
   - Plus a specific tip about the limiting factor (e.g. "take an umbrella")

**Example** (26°C, 84% rain, AQI 50):
> "It's 26°C — light, comfortable clothing is ideal, and it's best to stay indoors today. Also, rain is very likely, so take an umbrella."

---

## 🛠️ Tech stack

| Layer | Tech |
|-------|------|
| Frontend | React (Vite), plain JavaScript |
| Backend | Node.js, Express |
| Data | Open-Meteo (weather, geocoding, air quality) |
| HTTP | Axios |

---

## 🚀 Getting started

### Prerequisites
- Node.js 18+ installed

### 1. Backend

```bash
cd backend
npm install
node index.js
```

The API runs on `http://localhost:5000`.

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

---

## 📡 API

`GET /api/planner`

| Query param | Description |
|-------------|-------------|
| `lat`, `lon` | Coordinates (from geolocation) |
| `place` | City name (from search) |

**Example:** `http://localhost:5000/api/planner?place=Colombo`

Returns location, temperature, feels-like, wind, AQI, precipitation chance, the suggestion text, an outdoor score, and the icon tags.

---

## 📁 Project structure

```
weather-planner/
├── backend/
│   ├── index.js            # Express server + /api/planner route
│   ├── weatherService.js   # Open-Meteo API calls (geocode, weather, air quality)
│   └── suggestionEngine.js # Scoring engine that generates the advice
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   └── assets/weather/  # condition icons
    └── index.html
```

---

## 📝 Notes

- Weather comfort thresholds (ideal temperature, wind cutoffs, etc.) are reasonable estimates and can be tuned to a specific climate.
- Air quality uses the US EPA AQI scale.

---

## 👤 Author

**Malmi Wimalaweera**
- GitHub: [@MalmEEE](https://github.com/MalmEEE)
- LinkedIn: [malmi-wimalaweera](https://www.linkedin.com/in/malmi-wimalaweera-ba4071315)

---

## 📄 License

MIT
