export interface LocationData {
  address: string;
  city?: string;
  neighbourhood?: string;
  latitude?: number;
  longitude?: number;
  ip?: string;
  locationType?: string;
}

export const getIPLocation = async (ip?: string): Promise<LocationData | null> => {
  try {
    // Use ip-api.com as requested
    const url = ip ? `http://ip-api.com/json/${ip}` : "http://ip-api.com/json/";
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === "success") {
      return {
        address: `${data.city}${data.regionName ? `, ${data.regionName}` : ""}`,
        city: data.city,
        ip: data.query,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching location by IP:", error);
    return null;
  }
};

export const reverseGeocode = async (latitude: number, longitude: number): Promise<LocationData | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
    );
    const data = await response.json();
    
    if (data.address) {
      const city = data.address.city || data.address.town || data.address.village || data.address.suburb || "";
      const neighbourhood = data.address.neighbourhood || data.address.suburb || "";
      
      let address = "";
      if (city || neighbourhood) {
        address = neighbourhood ? `${data.display_name}` : city;
      } else {
        address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      }

      return {
        address,
        city,
        neighbourhood,
        latitude,
        longitude
      };
    }
    return null;
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return null;
  }
};

export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  });
};
