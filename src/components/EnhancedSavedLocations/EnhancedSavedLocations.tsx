import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import './EnhancedSavedLocations.css';

interface EnhancedSavedLocationsProps {
  onLocationSelect: (location: string) => void;
}

const EnhancedSavedLocations: React.FC<EnhancedSavedLocationsProps> = ({ onLocationSelect }) => {
  const { savedLocations, setSavedLocations } = useWeather();

  const handleSelectLocation = (location: string) => {
    onLocationSelect(location);
  };

  const handleDeleteLocation = (locationToDelete: string) => {
    setSavedLocations(savedLocations.filter(location => location !== locationToDelete));
  };

  return (
    <div className="enhanced-saved-locations">
      <h3 className="locations-title">Saved Locations</h3>
      {savedLocations.length === 0 ? (
        <p className="no-locations">No saved locations yet</p>
      ) : (
        <div className="locations-list">
          {savedLocations.map((location, index) => (
            <div key={index} className="location-item">
              <button 
                className="location-select-btn"
                onClick={() => handleSelectLocation(location)}
              >
                {location}
              </button>
              <button 
                className="location-delete-btn"
                onClick={() => handleDeleteLocation(location)}
                aria-label={`Delete ${location}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedSavedLocations;
