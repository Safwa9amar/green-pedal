import axios, { AxiosInstance, AxiosResponse } from "axios";
import { useAuthStore } from "../store/useAuthStore";

// API Configuration
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.9:3000/api";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, logout user
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  },
};

// Bikes API
export const bikesAPI = {
  getBikes: async () => {
    const response = await api.get("/bikes");
    return response.data;
  },

  updateBikeLocation: async (
    bikeId: number,
    latitude: number,
    longitude: number
  ) => {
    const response = await api.post("/bikes/gps-update", {
      bikeId,
      latitude,
      longitude,
    });
    return response.data;
  },
};

// Rides API
export const ridesAPI = {
  startRide: async (bikeId: number) => {
    const response = await api.post("/rides/start", { bikeId });
    return response.data;
  },

  endRide: async (rentalId: number) => {
    const response = await api.post("/rides/end", { rentalId });
    return response.data;
  },

  getRideHistory: async () => {
    const response = await api.get("/rides/history");
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  },

  updateProfile: async (updates: { name?: string; phone?: string }) => {
    const response = await api.put("/users/profile", updates);
    return response.data;
  },

  getBalance: async () => {
    const response = await api.get("/users/balance");
    return response.data;
  },

  rechargeBalance: async (amount: number) => {
    const response = await api.post("/users/balance", {
      amount,
      type: "RECHARGE",
    });
    return response.data;
  },
};

// Stations API
export const stationsAPI = {
  getStations: async () => {
    const response = await api.get("/stations");
    return response.data;
  },
};

export default api;
