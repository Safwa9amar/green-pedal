import { create } from "zustand";

export interface BikeStation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  capacity: number;
  bikes: any[];
}

interface StationState {
  stations: BikeStation[];
  nearbyStations: BikeStation[];
  isLoading: boolean;
  error: string | null;
  setStations: (stations: BikeStation[]) => void;
  setNearbyStations: (
    userLat: number,
    userLng: number,
    radiusKm: number
  ) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

export const useStationStore = create<StationState>((set, get) => ({
  stations: [],
  nearbyStations: [],
  isLoading: false,
  error: null,
  setStations: (stations) => set({ stations }),
  setNearbyStations: (userLat, userLng, radiusKm) => {
    const stations = get().stations;
    const filtered = stations.filter(
      (station) =>
        getDistanceFromLatLonInKm(
          userLat,
          userLng,
          station.latitude,
          station.longitude
        ) <= radiusKm
    );
    set({ nearbyStations: filtered });
  },
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
