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
}

export const useBikeStore = create<BikeState>((set, get) => ({
  bikes: [
    {
      id: 1,
      stationId: 1,
      status: "AVAILABLE",
      currentLocationLat: 33.7204940251195,
      currentLocationLng: 1.6877821493060277,
      image: require("@/assets/images/bike.png"),
      name: "City Cruiser",
    },
    {
      id: 2,
      stationId: 1,
      status: "MAINTENANCE",
      currentLocationLat: 33.718,
      currentLocationLng: 1.686,
      image: require("@/assets/images/bike.png"),
      name: "Mountain Explorer",
    },
    {
      id: 3,
      stationId: 2,
      status: "AVAILABLE",
      currentLocationLat: 27.880170410299044,
      currentLocationLng: -0.2909643087576213,
      image: require("@/assets/images/bike.png"),
      name: "Road Racer",
    },
  ],
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
}));
