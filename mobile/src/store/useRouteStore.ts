import { create } from "zustand";
import { RouteProfile, OrsResponse } from "@/src/services/ors";

interface RouteState {
  routeCoords: { latitude: number; longitude: number }[];
  destination: { latitude: number; longitude: number } | null;
  distance: number | null; // meters
  duration: number | null; // seconds
  profile: keyof typeof RouteProfile;
  isLoading: boolean;
  error: string | null;

  // Actions
  setDestination: (
    destination: { latitude: number; longitude: number } | null
  ) => void;
  setProfile: (profile: keyof typeof RouteProfile) => void;
  clearRoute: () => void;
  fetchRoute: (
    start: { latitude: number; longitude: number },
    end: { latitude: number; longitude: number },
    profile:
      | "driving-car"
      | "driving-hgv"
      | "cycling-regular"
      | "cycling-road"
      | "cycling-mountain"
      | "cycling-electric"
  ) => Promise<void>;
}

export const useRouteStore = create<RouteState>((set) => ({
  routeCoords: [],
  destination: null,
  distance: null,
  duration: null,
  profile: "driving-car",
  isLoading: false,
  error: null,

  setDestination: (destination) => set({ destination }),
  setProfile: (profile) => set({ profile }),
  clearRoute: () =>
    set({
      routeCoords: [],
      destination: null,
      distance: null,
      duration: null,
      isLoading: false,
      error: null,
    }),

  fetchRoute: async (
    start,
    end,
    profile:
      | "driving-car"
      | "driving-hgv"
      | "cycling-regular"
      | "cycling-road"
      | "cycling-mountain"
      | "cycling-electric" = "driving-car"
  ) => {
    set({ isLoading: true, error: null });

    try {
      const url =
        `https://api.openrouteservice.org/v2/directions/${profile}?api_key=${process.env.EXPO_PUBLIC_ORS_API_KEY}` +
        `&start=${start.longitude},${start.latitude}` +
        `&end=${end.longitude},${end.latitude}`;

      const response = await fetch(url, {
        method: "GET",
      });
      if (!response.ok) throw new Error("Failed to fetch route");
      const data: OrsResponse = await response.json();

      const coords = data.features[0].geometry.coordinates.map(
        ([lng, lat]: [number, number]) => ({ latitude: lat, longitude: lng })
      );

      const { distance, duration } = data.features[0].properties.summary;

      set({
        routeCoords: coords,
        distance,
        duration,
        destination: end,
        isLoading: false,
      });
    } catch (error: any) {
      console.error(error);
      set({ error: error.message || "Route fetch failed", isLoading: false });
    }
  },
}));
