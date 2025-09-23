
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000/api'; // Replace with your backend URL

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getProfile = () => api.get('/users/profile');
export const startRide = (data) => api.post('/rides/start', data);
export const endRide = (data) => api.post('/rides/end', data);
export const getRideHistory = () => api.get('/rides/history');
export const getAvailableBikes = () => api.get('/bikes');

export default api;
