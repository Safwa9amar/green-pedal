import { useAuthStore, User } from "@/src/store/useAuthStore";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

// ✅ API base URL
const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.9:3000/api";

const api = axios.create({
  baseURL: API_URL,
});

// ---------- Request Interceptor ----------
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token; // ✅ read from Zustand store
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------- Response Interceptor ----------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // ✅ Get refresh token from SecureStore
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        if (!refreshToken) throw new Error("No refresh token found");

        interface RefreshResponse {
          accessToken: string;
        }

        const res = await api.post<RefreshResponse>("/auth/refresh-token", {
          token: refreshToken,
        });

        const newAccessToken = res.data.accessToken;

        // ✅ Update Zustand store with new token
        useAuthStore.getState().setToken(newAccessToken);

        // ✅ Retry failed request with new token
        originalRequest.headers = {
          ...(originalRequest.headers || {}),
          Authorization: `Bearer ${newAccessToken}`,
        };

        return api(originalRequest);
      } catch (err) {
        // Refresh failed → logout via Zustand
        useAuthStore.getState().logout();
        await SecureStore.deleteItemAsync("refreshToken");
      }
    }

    return Promise.reject(error);
  }
);

// ---------- Types ----------
interface RegisterData {
  username: string;
  email: string;
  password: string;
  [key: string]: any;
}

interface LoginData {
  email: string;
  password: string;
  [key: string]: any;
}

interface StartRideData {
  bikeId: string;
  [key: string]: any;
}

interface StartRideResponse {
  rideId: string;
  startTime: string;
  [key: string]: any;
}

interface EndRideData {
  rideId: string;
  [key: string]: any;
}

interface EndRideResponse {
  rideId: string;
  endTime: string;
  [key: string]: any;
}

interface UploadCardIdResponse {
  url: string;
}

// ---------- API Calls ----------
export const register = (data: RegisterData) =>
  api.post("/auth/register", data);

export const login = (data: LoginData) =>
  api.post<{ accessToken: string; refreshToken: string; user: User }>(
    "/auth/login",
    data
  );

export const getProfile = () => api.get<User>("/users/profile");

export const startRide = (data: StartRideData) =>
  api.post<StartRideResponse>("/rides/start", data);

export const endRide = (data: EndRideData) =>
  api.post<EndRideResponse>("/rides/end", data);

export const getRideHistory = () => api.get("/rides/history");

export const getAvailableBikes = () => api.get("/bikes");

export const uploadIdCard = (data: FormData | null) =>
  api.post<UploadCardIdResponse>("/users/upload-id-card", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export default api;
