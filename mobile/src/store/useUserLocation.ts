import { useEffect, useState, useCallback } from "react";
import * as Location from "expo-location";

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission denied");
        setLoading(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    } catch (e: any) {
      setError(e.message || "Failed to get location");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return { location, loading, error, refresh: getLocation, setLocation };
}
