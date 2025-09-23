
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token);
      setLoading(false);
    };
    checkToken();
  }, []);

  const login = async (token) => {
    await AsyncStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return { isLoggedIn, loading, login, logout };
};
