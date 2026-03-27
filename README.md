# Task 4 – React Weather App (TypeScript + Vite)

A simple, fast weather dashboard built with React, TypeScript, and Vite. It supports current weather, a 5‑day forecast, saved locations, light/dark theme, and now automatically detects your current location on startup (with graceful fallbacks).

## 🌐 Live Demo

**Hosted project:** [https://task-4-react-weather-app.vercel.app/](https://task-4-react-weather-app.vercel.app/)

## Features

- Auto-detect current location on app load (with permission prompt)
- Search cities with suggestions and save favorite locations
- Current conditions + 5‑day forecast
- Unit toggle (°C/°F)
- Theme toggle (light/dark)

## Prerequisites

- Node.js 18+ (recommended LTS)

## Getting started

1) Install dependencies

```powershell
npm install
```

2) Run the dev server

```powershell
npm run dev
```

Open the printed local URL (usually http://localhost:5173) in your browser.

## Geolocation and permissions

- On first load, the app will request access to your device location to fetch local weather automatically.
- If you deny permission or your device can’t determine a position in time, the app falls back to a default city (London). You can always use the “My Location” button or search manually.
- For best results, access the app over HTTPS and ensure location services are enabled for your browser.

## API key

This project uses the OpenWeather API. An example key is currently embedded for convenience in development code. For production use, replace it with your own key and move it to an environment variable or a secure server endpoint.

## Scripts

- npm run dev – Start the development server
- npm run build – Type-check and build for production
- npm run preview – Preview the production build locally
- npm run lint – Lint the project

## Troubleshooting

- Location request timed out:
  - Make sure browser location permissions are allowed for the site
  - Try switching networks (Wi‑Fi vs mobile)
  - Desktop devices without GPS can be slower; retry or search a city manually
- CORS or fetch errors: ensure you have a stable internet connection

## Project structure

- src/components – UI components (CurrentWeather, Forecast, LocationSearch, etc.)
- src/context – Global app state (theme, weather)
- src/api – Requests to OpenWeather (current and forecast)
- src/services – Geolocation utilities

## License

For learning and demo purposes.
