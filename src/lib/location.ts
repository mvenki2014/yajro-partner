import axios from "axios";

export interface LocationData {
  address: string;
  city?: string;
  neighbourhood?: string;
  latitude?: number;
  longitude?: number;
  ip?: string;
  locationType?: string;
  selectedDate?: string;
  slot?: string;
}

/**
 * Fetch public IP address using ipify
 */
export const getIPAddress = async (): Promise<string | null> => {
  try {
    const { data } = await axios.get("https://api.ipify.org?format=json", { timeout: 5000 });
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP address:", error);
    return null;
  }
};

/**
 * Fetch location details by IP using ip-api.com
 */
export const getIPLocation = async (ip?: string): Promise<LocationData | null> => {
  try {
    const targetIp = ip || (await getIPAddress()) || "";
    const url = targetIp ? `https://ip-api.com/json/${targetIp}` : "https://ip-api.com/json/";
    
    const { data } = await axios.get(url, { timeout: 5000 });
    
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

/**
 * Reverse geocode coordinates using OpenStreetMap Nominatim
 */
export const reverseGeocode = async (latitude: number, longitude: number): Promise<LocationData | null> => {
  try {
    const { data } = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
      { 
        timeout: 5000,
        headers: { "Accept-Language": "en" }
      }
    );
    
    if (data.address) {
      const city = data.address.city || data.address.town || data.address.village || "";
      const suburb = data.address.suburb || data.address.neighbourhood || "";
      
      let address = "";
      if (suburb && city && suburb !== city) {
        address = `${suburb}, ${city}`;
      } else if (suburb || city) {
        address = suburb || city;
      } else {
        address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      }

      return {
        address,
        city,
        neighbourhood: suburb,
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

/**
 * Get current GPS position
 */
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
