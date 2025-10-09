// src/store/useAppLaunchStore.ts
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppLaunchState {
  isFirstLaunch: boolean | null;
  checkFirstLaunch: () => Promise<void>;
  setNotFirstLaunch: () => Promise<void>;
  resetLaunchState: () => Promise<void>;
}

export const useAppLaunchStore = create<AppLaunchState>((set) => {
  // Auto-check when the store initializes
  (async () => {
    try {
      const value = await AsyncStorage.getItem("hasLaunched");
      if (value === null) {
        // first launch ever
        set({ isFirstLaunch: true });
      } else {
        set({ isFirstLaunch: false });
      }
    } catch (error) {
      console.warn("❌ Failed to check app launch:", error);
      set({ isFirstLaunch: false });
    }
  })();

  return {
    isFirstLaunch: null,

    // Manually recheck (if ever needed)
    checkFirstLaunch: async () => {
      try {
        const value = await AsyncStorage.getItem("hasLaunched");
        set({ isFirstLaunch: value === null });
      } catch {
        set({ isFirstLaunch: false });
      }
    },

    // Mark app as not first launch
    setNotFirstLaunch: async () => {
      await AsyncStorage.setItem("hasLaunched", "true");
      set({ isFirstLaunch: false });
    },

    // Reset launch state (for debugging or onboarding replay)
    resetLaunchState: async () => {
      await AsyncStorage.removeItem("hasLaunched");
      set({ isFirstLaunch: true });
    },
  };
});
