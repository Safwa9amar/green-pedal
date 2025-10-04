import api from "@/api";
import { create } from "zustand";

export interface BikeStation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  capacity: number;
  bikes: Bike[];
}

export interface Bike {
  id: number;
  stationId: number;
  status: "AVAILABLE" | "IN_USE" | "MAINTENANCE";
  currentLocationLat: number;
  currentLocationLng: number;
  station?: BikeStation;
  image: any;
  name: string;
}

export interface BikeLocation {
  id: number;
  bikeId: number;
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface BikeState {
  bikes: Bike[];
  stations: BikeStation[];
  selectedBike: Bike | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Actions
  setBikes: (bikes: Bike[]) => void;
  setStations: (stations: BikeStation[]) => void;
  setSelectedBike: (bike: Bike | null) => void;
  updateBikeStatus: (bikeId: number, status: Bike["status"]) => void;
  updateBikeLocation: (bikeId: number, lat: number, lng: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setLastUpdated: (date: Date) => void;
  refreshBikes: () => void;
  refrechStations: () => void;
}

export const useBikeStore = create<BikeState>((set, get) => ({
  bikes: [],
  stations: [],
  selectedBike: null,
  isLoading: false,
  error: null,
  lastUpdated: null,

  setBikes: (bikes) => set({ bikes, lastUpdated: new Date() }),
  setStations: (stations) => set({ stations }),
  setSelectedBike: (bike) => set({ selectedBike: bike }),

  updateBikeStatus: (bikeId, status) =>
    set((state) => ({
      bikes: state.bikes.map((bike) =>
        bike.id === bikeId ? { ...bike, status } : bike
      ),
    })),

  updateBikeLocation: (bikeId, lat, lng) =>
    set((state) => ({
      bikes: state.bikes.map((bike) =>
        bike.id === bikeId
          ? { ...bike, currentLocationLat: lat, currentLocationLng: lng }
          : bike
      ),
    })),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setLastUpdated: (date) => set({ lastUpdated: date }),

  refreshBikes: () => {
    const { setLoading, setError } = get();
    setLoading(true);
    setError(null);
    // This will be called by the API service
  },
  refrechStations: async () => {
    const { setLoading, setError, setStations } = get();
    setLoading(true);
    setError(null);
    const res = await api.get("/stations");
    setStations(res.data["stations"]);
  },
}));
