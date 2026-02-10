/**
 * weatherService.ts
 *
 * This file contains the service layer for interacting with the OpenWeatherMap API.
 * It provides functions to fetch both current weather data and a 5-day forecast.
 */

// Placeholder for your API key. Replace with your actual key.
const API_KEY = "54d5aeff17af811f5ff3c152373f2183";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

/**
 * Interface representing the structure of the current weather data from the API.
 */
export interface CurrentWeatherData {
  coord: { lat: number; lon: number };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  name: string;
}

/**
 * Interface representing the structure of the 5-day forecast data from the API.
 */
export interface ForecastData {
  city: {
    name: string;
  };
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
    };
    weather: {
      description: string;
      icon: string;
    }[];
    wind: {
      speed: number;
    };
    dt_txt: string;
  }[];
}

/**
 * Fetches current weather data for a given location.
 * @param location The city name to search for.
 * @param unit The unit system to use ('metric' for Celsius, 'imperial' for Fahrenheit).
 * @returns A promise that resolves to the current weather data or null on failure.
 */
export const getCurrentWeather = async (location: string, unit: 'metric' | 'imperial'): Promise<CurrentWeatherData | null> => {
  const url = `${BASE_URL}/weather?q=${location}&units=${unit}&appid=${API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch current weather:", error);
    return null;
  }
};

/**
 * Fetches current weather data by geographic coordinates.
 */
export const getCurrentWeatherByCoords = async (
  lat: number,
  lon: number,
  unit: 'metric' | 'imperial'
): Promise<CurrentWeatherData | null> => {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch current weather by coords:', error);
    return null;
  }
};

/**
 * Fetches a 5-day weather forecast for a given location.
 * @param location The city name to search for.
 * @param unit The unit system to use ('metric' for Celsius, 'imperial' for Fahrenheit).
 * @returns A promise that resolves to the forecast data or null on failure.
 */
export const getForecast = async (location: string, unit: 'metric' | 'imperial'): Promise<ForecastData | null> => {
  const url = `${BASE_URL}/forecast?q=${location}&units=${unit}&appid=${API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch forecast:", error);
    return null;
  }
};

/**
 * Fetches a 5-day weather forecast by geographic coordinates.
 */
export const getForecastByCoords = async (
  lat: number,
  lon: number,
  unit: 'metric' | 'imperial'
): Promise<ForecastData | null> => {
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch forecast by coords:', error);
    return null;
  }
};

/**
 * Searches for locations based on a query string.
 * @param query The search query (city name).
 * @returns A promise that resolves to an array of location suggestions or null on failure.
 */
export const searchLocation = async (query: string) => {
  try {
    const response = await fetch(
      `${GEO_URL}/direct?q=${query}&limit=5&appid=${API_KEY}`
    );
    if (!response.ok) throw new Error('Failed to search location');
    return await response.json();
  } catch (error) {
    console.error('Error searching location:', error);
    throw error;
  }
};

/**
 * Searches for cities based on a query string for suggestions.
 * @param query The search query (city name).
 * @returns A promise that resolves to an array of city suggestions or null on failure.
 */
export const searchCities = async (query: string) => {
  try {
    const response = await fetch(
      `${GEO_URL}/direct?q=${query}&limit=10&appid=${API_KEY}`
    );
    if (!response.ok) throw new Error('Failed to search cities');
    return await response.json();
  } catch (error) {
    console.error('Error searching cities:', error);
    throw error;
  }
};
