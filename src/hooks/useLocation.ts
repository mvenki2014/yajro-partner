import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentLocation, getIPLocation, reverseGeocode, LocationData } from '@/lib/location';

export const LOCATION_QUERY_KEY = ['location'];

export function useLocation() {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: LOCATION_QUERY_KEY,
    queryFn: async (): Promise<LocationData | null> => {
      // 1. Fetch IP location
      const ipData = await getIPLocation();

      try {
        // 2. Try GPS
        const position = await getCurrentLocation();
        const { latitude, longitude } = position.coords;
        
        // 3. Reverse Geocode
        const geoData = await reverseGeocode(latitude, longitude);
        if (geoData) return { ...geoData, ip: ipData?.ip };
        
        return ipData;
      } catch (err) {
        console.error("GPS Error, falling back to IP:", err);
        return ipData;
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  const setLocation = (locationData: LocationData) => {
    queryClient.setQueryData(LOCATION_QUERY_KEY, locationData);
  };

  const clearLocation = () => {
    queryClient.setQueryData(LOCATION_QUERY_KEY, null);
  };

  return {
    location: data,
    isLoading,
    error,
    refreshLocation: refetch,
    setLocation,
    clearLocation,
  };
}
