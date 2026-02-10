import React, { useEffect, useState } from 'react';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import { ThemeProvider } from './context/ThemeContext';
import CurrentWeather from './components/CurrentWeather/CurrentWeather';
import Forecast from './components/Forecast/Forecast';
import LocationSearch from './components/LocationSearch/LocationSearch';
import SavedLocations from './components/SavedLocations/SavedLocations';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import { getCurrentWeather, getForecast, getCurrentWeatherByCoords, getForecastByCoords } from './api/weatherService';
import type { CurrentWeatherData, ForecastData } from './api/weatherService';
import { getCurrentLocation, checkGeolocationSupport } from './services/geolocationService';
import './App.css';

/**
 * Main application component that contains all weather functionality
 */
const WeatherApp: React.FC = () => {
  const { 
    currentLocation, 
    setCurrentLocation, 
    unit, 
    setUnit,
    currentCoords,
    setCurrentCoords,
  } = useWeather();

  const [currentWeather, setCurrentWeather] = useState<CurrentWeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // App startup: attempt to use geolocation once, then fall back to a default
  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        if (checkGeolocationSupport()) {
          const loc = await getCurrentLocation();
          if (!cancelled) {
            setCurrentLocation(`${loc.city}, ${loc.country}`);
            setCurrentCoords({ lat: loc.latitude, lon: loc.longitude });
          }
        } else if (!cancelled) {
          setCurrentLocation('London');
          setCurrentCoords(null);
        }
      } catch {
        if (!cancelled) {
          setCurrentLocation('London');
          setCurrentCoords(null);
        }
      } finally {
        if (!cancelled) setInitialized(true);
      }
    };
    // Only attempt if no location has been set yet (e.g., first load)
    if (!currentLocation) {
      init();
    } else {
      setInitialized(true);
    }
    return () => {
      cancelled = true;
    };
  }, [currentLocation, setCurrentLocation]);

  // Fetch weather data when location or unit changes
  useEffect(() => {
    if (!currentLocation && !currentCoords) return;

    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let weatherData: CurrentWeatherData | null;
        let forecastData: ForecastData | null;

        if (currentCoords) {
          weatherData = await getCurrentWeatherByCoords(currentCoords.lat, currentCoords.lon, unit);
          forecastData = await getForecastByCoords(currentCoords.lat, currentCoords.lon, unit);
        } else {
          weatherData = await getCurrentWeather(currentLocation, unit);
          forecastData = await getForecast(currentLocation, unit);
        }

        if (!weatherData || !forecastData) {
          setError('Failed to fetch weather data. Please check the location name.');
          return;
        }

        setCurrentWeather(weatherData);
        setForecast(forecastData);
      } catch (err) {
        setError('An error occurred while fetching weather data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [currentLocation, unit, setCurrentLocation]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Weather Dashboard</h1>
        <ThemeToggle />
        <div className="unit-toggle">
          <button onClick={() => setUnit('metric')} className={unit === 'metric' ? 'active' : ''}>°C</button>
          <button onClick={() => setUnit('imperial')} className={unit === 'imperial' ? 'active' : ''}>°F</button>
        </div>
      </header>
      
      <main className="app-main">
        <div className="search-section">
          <LocationSearch onLocationSelect={(lat, lon, city) => {
            setCurrentLocation(city);
            setCurrentCoords({ lat, lon });
          }} />
        </div>
        {!initialized && (
          <div className="loading-message">Detecting your location…</div>
        )}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {loading && (
          <div className="loading-message">
            Loading weather data...
          </div>
        )}
        
        <div className="weather-display">
          {currentWeather && !loading && (
            <CurrentWeather 
              data={currentWeather}
              unit={unit} 
            />
          )}
          
          {forecast && !loading && (
            <Forecast 
              data={forecast}
              unit={unit} 
            />
          )}
        </div>
        
        <div className="saved-locations-section">
          <SavedLocations />
        </div>
      </main>
    </div>
  );
};

/**
 * Root App component that wraps everything with providers
 */
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <WeatherProvider>
        <WeatherApp />
      </WeatherProvider>
    </ThemeProvider>
  );
};

export default App;
