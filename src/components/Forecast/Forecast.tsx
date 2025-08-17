import React, { useState } from 'react';

import './Forecast.css';
import type { ForecastData } from '../../api/weatherService';

/**
 * Interface for the props of the Forecast component.
 * @param data - The 5-day forecast data object.
 * @param unit - The unit system ('metric' or 'imperial').
 */
interface ForecastProps {
  data: ForecastData;
  unit: 'metric' | 'imperial';
}

/**
 * A React component that displays the weather forecast.
 * It allows the user to toggle between a 24-hour and a 7-day view.
 * @param data - The ForecastData object containing the forecast details.
 * @param unit - The unit system for temperature.
 */
const Forecast: React.FC<ForecastProps> = ({ data, unit }) => {
  const [view, setView] = useState<'24hour' | '7day'>('24hour');

  if (!data) return null;

  const tempUnit = unit === 'metric' ? '°C' : '°F';
  const hourlyForecasts = data.list;

  /**
   * Renders a single forecast item for either 24-hour or 7-day view.
   * @param item - The forecast data object for a specific time.
   * @param index - The index of the item in the list.
   */
  const renderForecastItem = (item: any, index: number) => (
    <div key={index} className="forecast-item">
      <p className="forecast-time">
        {view === '24hour' 
          ? new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : new Date(item.dt * 1000).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
      </p>
      <img
        src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
        alt={item.weather[0].description}
        className="forecast-icon"
      />
      <p className="forecast-temp">{Math.round(item.main.temp)}{tempUnit}</p>
      <p className="forecast-description">{item.weather[0].description}</p>
    </div>
  );

  // Filter data based on view type
  const getFilteredData = () => {
    if (view === '24hour') {
      // Show next 24 hours (or all available hourly data)
      return hourlyForecasts.slice(0, 24);
    } else {
      // Show 7 days (group by day and take one per day)
      const dailyData = [];
      const seenDates = new Set();
      
      for (const item of hourlyForecasts) {
        const date = new Date(item.dt * 1000).toDateString();
        if (!seenDates.has(date)) {
          seenDates.add(date);
          dailyData.push(item);
          if (dailyData.length >= 7) break;
        }
      }
      
      return dailyData;
    }
  };

  return (
    <div className="forecast-container">
      <div className="forecast-header">
        <h3 className="forecast-title">Weather Forecast</h3>
        <div className="forecast-toggle">
          <button
            id="forecast-toggle-button"
            onClick={() => setView('24hour')}
            className={`forecast-toggle-button ${view === '24hour' ? 'active' : ''}`}
          >
            24 Hours
          </button>
          <button
            id="daily-forecast-toggle-button"
            onClick={() => setView('7day')}
            className={`forecast-toggle-button ${view === '7day' ? 'active' : ''}`}
          >
            7 Days
          </button>
        </div>
      </div>
      <div className="forecast-items-container">
        {getFilteredData().map((item, index) => renderForecastItem(item, index))}
      </div>
    </div>
  );
};

export default Forecast;
