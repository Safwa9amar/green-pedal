import create from 'zustand';

interface AppLaunchState {
  isFirstLaunch: boolean;
  setNotFirstLaunch: () => void;
}

export const useAppLaunchStore = create<AppLaunchState>((set) => ({
  isFirstLaunch: true,
  setNotFirstLaunch: () => set({ isFirstLaunch: false }),
}));