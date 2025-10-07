import { create } from "zustand";
import { Bike } from "./useRideStore";
import { BikeStation } from "./useStationStore";
import { socket } from "../services/socket";
import api from "@/api";

export interface BikeState {
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

  getUpdates: () => void;
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

  getUpdates: async () => {
    set({ isLoading: true });
    const res = await api.get("/stations");
    set({ stations: res.data["stations"] });

    set({ isLoading: false });

    socket.on("stations:update", (stations: BikeStation[]) => {
      set({ stations });
    });

    socket.on("bikes:update", (bikes: Bike[]) => {
      set({ bikes, lastUpdated: new Date() });
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from socket");
    });
  },
}));
