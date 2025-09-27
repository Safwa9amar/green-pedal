import { create } from "zustand";

export interface Bike {
  id: number;
  stationId: number;
  status: "AVAILABLE" | "IN_USE" | "MAINTENANCE";
  currentLocationLat: number;
  currentLocationLng: number;
  station?: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    capacity: number;
    bikes: import("./useBikeStore").Bike[];
  };
  image: any;
  name: string;
}

export interface Rental {
  id: number;
  userId: number;
  bikeId: number;
  startTime: string;
  endTime?: string;
  totalCost?: number;
  status: "ONGOING" | "COMPLETED";
  bike?: Bike;
}

interface RideState {
  activeRental: Rental | null;
  isRiding: boolean;
  rideStartTime: Date | null;
  currentBike: Bike | null;
  rideHistory: Rental[];
  isLoading: boolean;
  error: string | null;

  // Actions
  startRide: (rental: Rental, bike: Bike) => void;
  endRide: (rental: Rental) => void;
  setCurrentBike: (bike: Bike | null) => void;
  setRideHistory: (history: Rental[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  resetRideState: () => void;
}

export const useRideStore = create<RideState>((set, get) => ({
  activeRental: null,
  isRiding: false,
  rideStartTime: null,
  currentBike: null,
  rideHistory: [],
  isLoading: false,
  error: null,

  startRide: (rental, bike) =>
    set({
      activeRental: rental,
      isRiding: true,
      rideStartTime: new Date(),
      currentBike: bike,
      error: null,
    }),

  endRide: (rental) =>
    set((state) => ({
      activeRental: rental,
      isRiding: false,
      rideStartTime: null,
      currentBike: null,
      rideHistory: [rental, ...state.rideHistory],
    })),

  setCurrentBike: (bike) => set({ currentBike: bike }),
  setRideHistory: (history) => set({ rideHistory: history }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  resetRideState: () =>
    set({
      activeRental: null,
      isRiding: false,
      rideStartTime: null,
      currentBike: null,
      error: null,
    }),
}));
