
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoadingScreen from '../screens/LoadingScreen';
import { useAuth } from '../context/AuthContext';

const AuthStack = createStackNavigator();
const AuthNavigator = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const Tab = createBottomTabNavigator();
const MainNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Map" component={MapScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppStack = createStackNavigator();
const AppNavigator = () => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
      <AppStack.Navigator >
        {isLoggedIn ? (
          <AppStack.Screen name="App" component={MainNavigator} />
        ) : (
          <AppStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </AppStack.Navigator>
  );
};

export default AppNavigator;
