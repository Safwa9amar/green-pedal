import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Onboarding from '../../app/onboarding';
import OnboardingProfile from '../../app/onboardingProfile';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }} />
        <Stack.Screen name="OnboardingProfile" component={OnboardingProfile} options={{ headerShown: true }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}