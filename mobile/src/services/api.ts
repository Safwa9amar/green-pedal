import axios, { AxiosInstance, AxiosResponse } from "axios";
import { useAuthStore } from "../store/useAuthStore";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let refreshSubscribers: any[] = [];

function onRefreshed(newToken: string) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { refreshToken, setToken, logout } = useAuthStore.getState();
    // ⛔ If no refresh token or already retried, logout
    if (
      error.response?.status === 401 &&
      refreshToken &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // Queue the requests until refresh completes
        return new Promise((resolve) => {
          refreshSubscribers.push((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/auth/refresh-accesstoken`,
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
          }
        );

        const newToken = data.accessToken;
        setToken(newToken);
        onRefreshed(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
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
  getBikeByID: async (id: string) => {
    const response = await api.get(`/bikes/${id}`);
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

  updateProfile: async (updates: FormData) => {
    const response = await api.put("/users/profile", updates, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
// payment API
export const paymentApi = {
  createChargilyCheckout: async (amount: number) => {
    const response = await api.get(
      `/payment/chargily/create-chargily-link?amount=${amount}`
    );
    return response.data;
  },
  createStripePaymentLink: async () => {
    const response = await api.get("/payment/create-stripe-link");
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
