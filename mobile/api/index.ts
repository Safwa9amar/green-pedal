import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.9:3000/api"; // Replace with your backend URL

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const AuthStorage: any = await AsyncStorage.getItem("auth-storage");
  const token = JSON.parse(AuthStorage)?.state?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

interface RideData {
  bikeId: string;
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

export const startRide = (data: StartRideData) =>
  api.post<StartRideResponse>("/rides/start", data);
interface EndRideData {
  rideId: string;
  [key: string]: any;
}

interface EndRideResponse {
  rideId: string;
  endTime: string;
  [key: string]: any;
}

export const register = (data: RegisterData) =>
  api.post("/auth/register", data);
export const login = (data: LoginData) =>
  api.post<{ token: string }>("/auth/login", data);
export const getProfile = () => api.get("/users/profile");
export const endRide = (data: EndRideData) =>
  api.post<EndRideResponse>("/rides/end", data);
export const getRideHistory = () => api.get("/rides/history");
export const getAvailableBikes = () => api.get("/bikes");

interface UploadCardIdResponse {
  url: string;
}

export const uploadIdCard = (data: FormData | null) =>
  api.post<UploadCardIdResponse>("/users/upload-id-card", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export default api;
