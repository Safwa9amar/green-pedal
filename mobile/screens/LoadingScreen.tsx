
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoadingScreen = ({ navigation }) => {
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      navigation.navigate(token ? 'App' : 'Auth');
    };
    checkToken();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;
