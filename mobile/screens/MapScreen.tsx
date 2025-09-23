
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getAvailableBikes } from '../api';

const MapScreen = () => {
  const [bikes, setBikes] = useState([]);

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const res = await getAvailableBikes();
        setBikes(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBikes();
  }, []);

  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        {bikes.map((bike) => (
          <Marker
            key={bike.id}
            coordinate={{
              latitude: bike.currentLocationLat,
              longitude: bike.currentLocationLng,
            }}
            title={`Bike ${bike.id}`}
            description={bike.status}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapScreen;
