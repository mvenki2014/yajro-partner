import { Geolocation, Position } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

export interface LocationResult {
  latitude: number;
  longitude: number;
  error?: string;
}

export async function getCurrentLocation(): Promise<LocationResult> {
  if (Capacitor.isNativePlatform()) {
    try {
      // Check permissions first
      const permissions = await Geolocation.checkPermissions();
      
      if (permissions.location !== 'granted') {
        const requestPermissions = await Geolocation.requestPermissions();
        if (requestPermissions.location !== 'granted') {
          throw new Error('Location permission denied');
        }
      }

      const position: Position = await Geolocation.getCurrentPosition();
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    } catch (err: any) {
      console.error('Capacitor Geolocation Error:', err);
      return {
        latitude: 0,
        longitude: 0,
        error: err.message || 'Error getting native location',
      };
    }
  } else {
    // Fallback to browser geolocation for web
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ latitude: 0, longitude: 0, error: 'Geolocation not supported by browser' });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          console.error('Browser Geolocation Error:', err);
          resolve({ latitude: 0, longitude: 0, error: err.message || 'Error getting browser location' });
        }
      );
    });
  }
}
