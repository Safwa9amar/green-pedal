"use client";

import { create } from "zustand";
import { rentalApi } from "@/src/services/api"; // Adjust if path differs
import { useAuthStore } from "@/src/store/useAuthStore";
import { socket } from "../services/socket";

type RentalStatus = "IDLE" | "ACTIVE" | "COMPLETED";

interface Rental {
  id?: string;
  bikeId?: string;
  startTime?: string;
  endTime?: string | null;
  totalCost?: number | null;
  status?: RentalStatus;
}

interface RentalState {
  currentRental: Rental | null;
  elapsedTime: number;
  isConnected: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  connectSocket: () => void;
  disconnectSocket: () => void;
  startRental: (bikeId: string) => Promise<void>;
  endRental: () => Promise<void>;
  resetRental: () => void;
}

export const useRentalStore = create<RentalState>((set, get) => ({
  currentRental: null,
  elapsedTime: 0,
  isConnected: false,
  loading: false,
  error: null,

  /** 🔌 Connect to Socket Server */
  connectSocket: () => {
    const { token, user } = useAuthStore.getState();
    if (!token || !user?.id) return;

    if (socket.connected) return;

    socket.auth = { token };
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("join", `user:${user.id}`);
      set({ isConnected: true });
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      set({ isConnected: false });
    });

    socket.on("rental:timeUpdate", (data: any) => {
      set({ elapsedTime: data.elapsed });
      console.log(data.elapsed);
    });

    socket.on("rental:ended", (data: any) => {
      console.log("📩 Rental ended via socket:", data);
      set({
        currentRental: { ...data, status: "COMPLETED" },
        elapsedTime: 0,
      });
    });
  },

  /** 🔌 Disconnect Socket */
  disconnectSocket: () => {
    socket.disconnect();
    set({ isConnected: false });
  },

  /** 🚴 Start Rental */
  startRental: async (bikeId: string) => {
    try {
      set({ loading: true, error: null });
      const data = await rentalApi.startRide(bikeId);
      const rental = data.rental;

      // connect socket if not connected
      if (!get().isConnected) get().connectSocket();

      set({
        currentRental: {
          id: rental.id,
          bikeId: rental.bikeId,
          startTime: rental.startTime,
          status: "ACTIVE",
        },
        elapsedTime: 0,
        loading: false,
      });
    } catch (err: any) {
      console.error("Failed to start rental:", err);
      set({ error: "Failed to start rental", loading: false });
    }
  },

  /** 🛑 End Rental */
  endRental: async () => {
    try {
      const { currentRental } = get();
      if (!currentRental?.id) return;

      set({ loading: true });
      const response = await rentalApi.endRide(currentRental.id);

      socket.emit("rental:end", { rentalId: currentRental.id });

      set({
        currentRental: { ...response.rental, status: "COMPLETED" },
        elapsedTime: 0,
        loading: false,
      });
    } catch (err: any) {
      console.error("Failed to end rental:", err);
      set({ error: "Failed to end rental", loading: false });
    }
  },

  /** ♻️ Reset state */
  resetRental: () => {
    set({
      currentRental: null,
      elapsedTime: 0,
      loading: false,
      error: null,
    });
  },
}));
