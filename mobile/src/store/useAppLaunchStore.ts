import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';

interface AppLaunchState {
  isFirstLaunch: boolean | null;
  checkFirstLaunch: () => Promise<void>;
  setNotFirstLaunch: () => Promise<void>;
}

export const useAppLaunchStore = create<AppLaunchState>((set) => ({
  isFirstLaunch: null,
  checkFirstLaunch: async () => {
    try {
      const value = await AsyncStorage.getItem('hasLaunched');
      if (value === null) {
        set({ isFirstLaunch: true });
      } else {
        set({ isFirstLaunch: false });
      }
    } catch (e) {
      set({ isFirstLaunch: false });
    }
  },
  setNotFirstLaunch: async () => {
    await AsyncStorage.setItem('hasLaunched', 'true');
    set({ isFirstLaunch: false });
  },
}));

export const useClearAsyncStorage = () => {
  const clear = useCallback(async () => {
    await AsyncStorage.clear();
    // Optionally reset the launch state in the store
    useAppLaunchStore.setState({ isFirstLaunch: null });
  }, []);
  return clear;
};
