import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usersAPI } from "../services/api"; // <-- adjust import path if needed

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  balance: number;
  photo: string;
  avatar: string;
  idCardPhotoUrl?: string;
  idCardVerified?: boolean;
  recharge: recharge[];
}

type recharge = {
  id: string;
  userId: string;
  amount: number;
  paymentId: string;
  method: string;
  status: string;
  user: User;
  createdAt: string;
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateBalance: (balance: number) => void;
  checkAuth: () => Promise<void>; // <-- added
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),

      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      updateBalance: (balance) =>
        set((state) => ({
          user: state.user ? { ...state.user, balance } : null,
        })),

      // ✅ Automatically check if token is valid and login
      checkAuth: async () => {
        const { token, user } = get();
        if (!token) return;

        set({ isLoading: true });
        try {
          const profile = await usersAPI.getProfile();
          set({
            user: profile,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          console.warn("Auth check failed:", error?.response?.data || error);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      // ✅ This runs after hydration from AsyncStorage
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          // Once hydrated, check token validity and re-login automatically
          state.checkAuth?.();
        }
      },
    }
  )
);
