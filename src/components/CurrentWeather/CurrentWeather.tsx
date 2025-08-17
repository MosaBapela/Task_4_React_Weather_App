import React from 'react';
import './CurrentWeather.css';
import type { CurrentWeatherData } from '../../api/weatherService';

/**
 * Interface for the props of the CurrentWeather component.
 * @param data - The current weather data object.
 * @param unit - The unit system ('metric' or 'imperial').
 */
interface CurrentWeatherProps {
  data: CurrentWeatherData;
  unit: 'metric' | 'imperial';
}

/**
 * A React component that displays the current weather conditions.
 * It shows the city name, temperature, description, and other details like humidity and wind speed.
 * @param data - The CurrentWeatherData object containing the weather details.
 * @param unit - The unit system for temperature and wind speed.
 */
const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, unit }) => {
  if (!data) return null;

  const tempUnit = unit === 'metric' ? '°C' : '°F';
  const windUnit = unit === 'metric' ? 'm/s' : 'mph';

  return (
    <div className="weather-card">
      <h2 className="weather-card-title">{data.name}, {data.sys.country}</h2>
      <div className="weather-card-header">
        <img
          src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
          alt={data.weather[0].description}
          className="weather-icon"
        />
        <div className="weather-temp">
          <p>{Math.round(data.main.temp)}</p>
          <p className="weather-temp-unit">{tempUnit}</p>
        </div>
      </div>
      <p className="weather-description">{data.weather[0].description}</p>
      <div className="weather-grid">
        <div className="weather-info-item">
          <p className="weather-info-label">Feels Like</p>
          <p className="weather-info-value">{Math.round(data.main.feels_like)}{tempUnit}</p>
        </div>
        <div className="weather-info-item">
          <p className="weather-info-label">Humidity</p>
          <p className="weather-info-value">{data.main.humidity}%</p>
        </div>
        <div className="weather-info-item">
          <p className="weather-info-label">Wind Speed</p>
          <p className="weather-info-value">{data.wind.speed.toFixed(1)} {windUnit}</p>
        </div>
        <div className="weather-info-item">
          <p className="weather-info-label">Min Temp</p>
          <p className="weather-info-value">{Math.round(data.main.temp_min)}{tempUnit}</p>
        </div>
        <div className="weather-info-item">
          <p className="weather-info-label">Max Temp</p>
          <p className="weather-info-value">{Math.round(data.main.temp_max)}{tempUnit}</p>
        </div>
        <div className="weather-info-item">
          <p className="weather-info-label">Pressure</p>
          <p className="weather-info-value">{data.main.pressure} hPa</p>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
