interface GeolocationData {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

export const getCurrentLocation = async (): Promise<GeolocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding to get city name from coordinates
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=1f509593c3f8a5d43ffc6e5cd60af2b8`
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch location data');
          }
          
          const data = await response.json();
          
          if (data && data.length > 0) {
            resolve({
              latitude,
              longitude,
              city: data[0].name,
              country: data[0].country
            });
          } else {
            reject(new Error('Unable to determine city from coordinates'));
          }
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is currently unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
        }
        
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

export const requestGeolocationPermission = async (): Promise<boolean> => {
  if ('permissions' in navigator) {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state === 'granted';
    } catch {
      return false;
    }
  }
  return false;
};

export const checkGeolocationSupport = (): boolean => {
  return 'geolocation' in navigator;
};