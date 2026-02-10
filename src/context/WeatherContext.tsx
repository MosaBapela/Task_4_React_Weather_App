import React, { useState, useEffect, createContext, useContext, type ReactNode } from 'react';

/**
 * The interface that defines the shape of our context's value.
 * This ensures type safety when components consume the context.
 */
interface WeatherContextType {
  currentLocation: string;
  setCurrentLocation: (location: string) => void;
  currentCoords: { lat: number; lon: number } | null;
  setCurrentCoords: (coords: { lat: number; lon: number } | null) => void;
  savedLocations: string[];
  setSavedLocations: (locations: string[]) => void;
  unit: 'metric' | 'imperial';
  setUnit: (unit: 'metric' | 'imperial') => void;
  isUsingGeolocation: boolean;
  setIsUsingGeolocation: (value: boolean) => void;
}

// Create the context. We provide an initial undefined value.
const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

/**
 * A custom hook to easily access the weather context.
 * It ensures that the hook is only used within a WeatherProvider,
 * and throws an error if it's not.
 * @returns The WeatherContextType object.
 */
export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

/**
 * The provider component that wraps the entire application or
 * a part of the component tree that needs access to the weather state.
 * @param children - The child components to be rendered within the provider.
 */
interface WeatherProviderProps {
  children: ReactNode;
}

export const WeatherProvider: React.FC<WeatherProviderProps> = ({ children }) => {
  // State for the current location and a list of saved locations
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [savedLocations, setSavedLocations] = useState<string[]>([]);
  // State for the unit system (Celsius or Fahrenheit)
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  // State to track if we're using geolocation
  const [isUsingGeolocation, setIsUsingGeolocation] = useState<boolean>(false);

  // Load saved locations from local storage on initial render
  useEffect(() => {
    const saved = localStorage.getItem('savedLocations');
    if (saved) {
      setSavedLocations(JSON.parse(saved));
    }
  }, []);

  // Save locations to local storage whenever the list changes
  useEffect(() => {
    localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
  }, [savedLocations]);
  
  // The value object to be provided to consuming components.
  const value = {
    currentLocation,
    setCurrentLocation,
    currentCoords,
    setCurrentCoords,
    savedLocations,
    setSavedLocations,
    unit,
    setUnit,
    isUsingGeolocation,
    setIsUsingGeolocation,
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};
