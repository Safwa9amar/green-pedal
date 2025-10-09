import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { rentalApi } from "@/src/services/api";
import { useAuthStore } from "@/src/store/useAuthStore";
import { socket } from "../services/socket";
import { Bike } from "../types";

type RentalStatus = "IDLE" | "ACTIVE" | "COMPLETED";

interface Rental {
  id?: string;
  bikeId?: string;
  startTime?: string;
  endTime?: string | null;
  totalCost?: number | null;
  status?: RentalStatus;
  bike?: Bike;
}

interface RentalState {
  currentRental: Rental | null;
  elapsedTime: number;
  loading: boolean;
  error: string | null;

  // Actions
  connectSocket: () => void;
  startRental: (bikeId: string) => Promise<void>;
  endRental: () => Promise<void>;
  resetRental: () => void;
  restoreRental: () => void;
}

let timer: NodeJS.Timeout | null = null;

export const useRentalStore = create<RentalState>()(
  persist(
    (set, get) => ({
      currentRental: null,
      elapsedTime: 0,
      loading: false,
      error: null,

      /** 🔌 Connect to Socket Server */
      connectSocket: () => {
        const { user } = useAuthStore.getState();
        if (!user?.id) return;

        socket.emit("join", `user:${user.id}`);

        socket.on("rental:ended", (data: any) => {
          console.log("📩 Rental ended via socket:", data);
          if (timer) clearInterval(timer);
          timer = null;

          set({
            currentRental: { ...data, status: "COMPLETED" },
            elapsedTime: 0,
          });
        });
      },

      /** 🚴 Start Rental */
      startRental: async (bikeId: string) => {
        try {
          set({ loading: true, error: null });
          const data = await rentalApi.startRide(bikeId);
          const rental = data.rental;
          if (rental.status === "COMPLETED") return;

          const startTime = new Date(rental.startTime).getTime();
          const newRental: Rental = {
            id: rental.id,
            bikeId: rental.bikeId,
            startTime: rental.startTime,
            status: "ACTIVE",
          };

          set({
            currentRental: newRental,
            elapsedTime: 0,
            loading: false,
          });

          // 🕒 Start timer
          if (timer) clearInterval(timer);
          timer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            set({ elapsedTime: elapsed });
          }, 1000) as any;
        } catch (err: any) {
          console.error("❌ Failed to start rental:", err);
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

          if (timer) clearInterval(timer);
          timer = null;

          set({
            currentRental: { ...response.rental, status: "COMPLETED" },
            elapsedTime: 0,
            loading: false,
          });
        } catch (err: any) {
          console.error("❌ Failed to end rental:", err);
          set({ error: "Failed to end rental", loading: false });
        }
      },

      /** ♻️ Reset state */
      resetRental: async () => {
        if (timer) clearInterval(timer);
        timer = null;

        set({
          currentRental: null,
          elapsedTime: 0,
          loading: false,
          error: null,
        });
      },

      /** 🔁 Restore rental from storage (called automatically by persist) */
      restoreRental: () => {
        const { currentRental } = get();
        if (currentRental?.status === "ACTIVE" && currentRental.startTime) {
          const startTime = new Date(currentRental.startTime).getTime();
          if (timer) clearInterval(timer);
          timer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            set({ elapsedTime: elapsed });
          }, 1000) as any;
        }
      },
    }),
    {
      name: "rental-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentRental: state.currentRental,
      }),
      onRehydrateStorage: () => (state) => {
        console.log("♻️ Restoring rental from storage...");
        // state?.restoreRental();
        state?.endRental();
        state?.resetRental;
      },
    }
  )
);
