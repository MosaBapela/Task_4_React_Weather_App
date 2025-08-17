import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import './SavedLocations.css';

/**
 * A React component that displays a list of saved locations as clickable buttons.
 * It uses the WeatherContext to get the list of locations and to set the current location.
 */
const SavedLocations: React.FC = () => {
  // Use the WeatherContext to get the saved locations and the function to set the current location.
  const { savedLocations, setCurrentLocation, setSavedLocations } = useWeather();

  /**
   * Handles the click event on a saved location button.
   * Sets the clicked location as the new current location.
   * @param location - The name of the city to set as the current location.
   */
  const handleSelectLocation = (location: string) => {
    setCurrentLocation(location);
  };

  /**
   * Handles the deletion of a saved location.
   * @param locationToDelete - The name of the city to remove from saved locations.
   */
  const handleDeleteLocation = (locationToDelete: string) => {
    const updatedLocations = savedLocations.filter(location => location !== locationToDelete);
    setSavedLocations(updatedLocations);
  };

  return (
    <div className="saved-locations-container">
      <h3 className="saved-locations-title">Saved Locations</h3>
      <div className="saved-locations-list">
        {savedLocations.length === 0 ? (
          <p className="no-locations-message">No saved locations yet. Search for a city to add it!</p>
        ) : (
          savedLocations.map((location, index) => (
            <div key={index} className="saved-location-item">
              <button
                onClick={() => handleSelectLocation(location)}
                className="saved-location-button"
              >
                {location}
              </button>
              <button
                onClick={() => handleDeleteLocation(location)}
                className="delete-location-button"
                title={`Delete ${location}`}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SavedLocations;
