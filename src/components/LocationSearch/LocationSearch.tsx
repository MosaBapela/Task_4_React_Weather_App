import React, { useState, useEffect, useRef } from 'react';
import { searchLocation, searchCities } from '../../api/weatherService';
import { useWeather } from '../../context/WeatherContext';
import { getCurrentLocation, checkGeolocationSupport } from '../../services/geolocationService';
import './LocationSearch.css';

interface LocationSearchProps {
  onLocationSelect: (lat: number, lon: number, city: string) => void;
}

interface CitySuggestion {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { savedLocations, setSavedLocations } = useWeather();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const fetchSuggestions = async () => {
    try {
      const cities = await searchCities(searchQuery);
      setSuggestions(cities);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setLocationError(null);
    try {
      const locations = await searchLocation(searchQuery);
      if (locations && locations.length > 0) {
        const { lat, lon, name, country, state } = locations[0];
        const cityName = state ? `${name}, ${state}, ${country}` : `${name}, ${country}`;
        onLocationSelect(lat, lon, cityName);
        setSearchQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error searching location:', error);
      setLocationError('Failed to search for location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetCurrentLocation = async () => {
    if (!checkGeolocationSupport()) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);
    
    try {
      const locationData = await getCurrentLocation();
      const cityName = `${locationData.city}, ${locationData.country}`;
      
      // Update the search query to show the detected location
      setSearchQuery(cityName);
      
      // Select this location
      onLocationSelect(locationData.latitude, locationData.longitude, cityName);
      
      // Clear suggestions
      setSuggestions([]);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Error getting current location:', error);
      setLocationError(error instanceof Error ? error.message : 'Failed to get your location.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleSuggestionClick = (city: CitySuggestion) => {
    const cityName = city.state ? `${city.name}, ${city.state}, ${city.country}` : `${city.name}, ${city.country}`;
    onLocationSelect(city.lat, city.lon, cityName);
    setSearchQuery(cityName);
    setSuggestions([]);
    setShowSuggestions(false);
    setLocationError(null);
  };

  const handleSaveLocation = (city: CitySuggestion) => {
    const cityName = city.state ? `${city.name}, ${city.state}, ${city.country}` : `${city.name}, ${city.country}`;
    
    // Check if location already exists
    const exists = savedLocations.some(loc => loc === cityName);
    if (!exists) {
      const newLocations = [...savedLocations, cityName];
      setSavedLocations(newLocations);
    }
  };

  return (
    <div className="location-search" ref={searchRef}>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.trim().length > 2 && setShowSuggestions(true)}
          placeholder="Search for a city..."
          className="search-input"
        />
        <button type="submit" disabled={isLoading} className="search-button">
          {isLoading ? 'Searching...' : 'Search'}
        </button>
        <button 
          type="button" 
          onClick={handleGetCurrentLocation}
          disabled={isGettingLocation}
          className="location-button"
          title="Get my current location"
        >
          {isGettingLocation ? 'Getting...' : 'My Location'}
        </button>
      </form>
      
      {locationError && (
        <div className="location-error">
          {locationError}
        </div>
      )}
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((city, index) => (
            <div
              key={`${city.lat}-${city.lon}-${index}`}
              className="suggestion-item"
            >
              <span onClick={() => handleSuggestionClick(city)}>
                {city.state ? `${city.name}, ${city.state}, ${city.country}` : `${city.name}, ${city.country}`}
              </span>
              <button 
                className="save-location-btn"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  handleSaveLocation(city);
                }}
                title="Save this location"
              >
                Save
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;