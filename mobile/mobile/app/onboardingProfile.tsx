import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';

export default function OnboardingProfile() {
  const navigation = useNavigation();

  const handleContinue = () => {
    // Logic to handle profile setup can be added here
    navigation.replace('/(auth)/login'); // Navigate to login after profile setup
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Up Your Profile</Text>
      <Text style={styles.description}>Please provide your details to continue.</Text>
      {/* Additional input fields for profile setup can be added here */}
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#1C1742',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 28,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});