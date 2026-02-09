import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getCurrentLocation, getIPLocation, reverseGeocode, LocationData } from '@/lib/location';

interface LocationState {
  data: LocationData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: LocationState = {
  data: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

export const fetchLocation = createAsyncThunk(
  'location/fetchLocation',
  async (_, ) => {
    // 1. Log IP as requested in previous requirements
    const ipData = await getIPLocation();
    if (ipData?.ip) {
      console.log("App loading with IP (RTK):", ipData.ip);
    }

    try {
      // 2. Try GPS
      const position = await getCurrentLocation();
      const { latitude, longitude } = position.coords;
      
      // 3. Reverse Geocode
      const geoData = await reverseGeocode(latitude, longitude);
      if (geoData) return { ...geoData, ip: ipData?.ip };
      
      return ipData;
    } catch (error) {
      console.error("GPS Error, falling back to IP:", error);
      return ipData;
    }
  }
);

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    clearLocation: (state) => {
      state.data = null;
      state.lastUpdated = null;
    },
    setLocation: (state, action: PayloadAction<LocationData>) => {
      state.data = action.payload;
      state.lastUpdated = Date.now();
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocation.fulfilled, (state, action: PayloadAction<LocationData | null>) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch location';
      });
  },
});

export const { clearLocation, setLocation } = locationSlice.actions;
export default locationSlice.reducer;
