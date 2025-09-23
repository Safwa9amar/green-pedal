
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { getProfile, getRideHistory } from '../api';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [rideHistory, setRideHistory] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setUser(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchRideHistory = async () => {
      try {
        const res = await getRideHistory();
        setRideHistory(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
    fetchRideHistory();
  }, []);

  return (
    <View style={styles.container}>
      {user && (
        <View>
          <Text style={styles.title}>Profile</Text>
          <Text>Name: {user.name}</Text>
          <Text>Email: {user.email}</Text>
          <Text>Balance: ${user.balance}</Text>
        </View>
      )}
      <Text style={styles.title}>Ride History</Text>
      {rideHistory.map((ride) => (
        <View key={ride.id} style={styles.rideContainer}>
          <Text>Bike ID: {ride.bikeId}</Text>
          <Text>Start Time: {new Date(ride.startTime).toLocaleString()}</Text>
          <Text>End Time: {new Date(ride.endTime).toLocaleString()}</Text>
          <Text>Cost: ${ride.totalCost}</Text>
        </View>
      ))}
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  rideContainer: {
    marginBottom: 16,
    padding: 16,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
  },
});

export default ProfileScreen;
