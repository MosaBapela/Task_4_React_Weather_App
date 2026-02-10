interface GeolocationData {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

export const getCurrentLocation = async (): Promise<GeolocationData> => {
  if (!('geolocation' in navigator)) {
    throw new Error('Geolocation is not supported by this browser');
  }

  const getPosition = (options: PositionOptions) =>
    new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });

  const reverseGeocode = async (latitude: number, longitude: number) => {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=54d5aeff17af811f5ff3c152373f2183`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        city: data[0].name as string,
        country: data[0].country as string,
      };
    }
    throw new Error('Unable to determine city from coordinates');
  };

  // First attempt: high accuracy, shorter timeout
  try {
    const pos = await getPosition({
      enableHighAccuracy: true,
      timeout: 15000, // 15s
      maximumAge: 300000, // 5 minutes
    });
    const { latitude, longitude } = pos.coords;
    const place = await reverseGeocode(latitude, longitude);
    return { latitude, longitude, ...place };
  } catch (err: any) {
    // If permission denied, don't retry; surface clear message
    if (err && typeof err === 'object' && 'code' in err) {
      const geErr = err as GeolocationPositionError;
      if (geErr.code === geErr.PERMISSION_DENIED) {
        throw new Error('Location access denied. Please enable location permissions and try again.');
      }
    }

    // Fallback attempt: lower accuracy, longer timeout, allow older cached positions
    try {
      const pos = await getPosition({
        enableHighAccuracy: false,
        timeout: 30000, // 30s
        maximumAge: 900000, // 15 minutes
      });
      const { latitude, longitude } = pos.coords;
      const place = await reverseGeocode(latitude, longitude);
      return { latitude, longitude, ...place };
    } catch (err2: any) {
      let errorMessage = 'Unable to retrieve location';
      if (err2 && typeof err2 === 'object' && 'code' in err2) {
        const geErr2 = err2 as GeolocationPositionError;
        switch (geErr2.code) {
          case geErr2.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions and try again.';
            break;
          case geErr2.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is currently unavailable.';
            break;
          case geErr2.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
        }
      }
      throw new Error(errorMessage);
    }
  }
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