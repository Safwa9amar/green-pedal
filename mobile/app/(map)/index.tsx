import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Button,
  Linking,
} from "react-native";
import { Avatar, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useBikeStore } from "@/src/store";
import { useUserLocation } from "@/src/store/useUserLocation";
import { useRouteStore } from "@/src/store/useRouteStore";
import BikeInfoCard from "@/components/BikeInfoCard";
import StationInfoCard from "@/components/StationInfoCard";

export default function HomeScreen() {
  const navigation = useNavigation() as any;
  const { stations, connectSocket } = useBikeStore();
  const {
    location: userLocation,
    loading: locationLoading,
    error: locationError,
  } = useUserLocation();

  // get route store actions and state
  const {
    destination,
    routeCoords,
    distance,
    duration,
    isLoading: routeLoading,
    setDestination,
    fetchRoute,
    clearRoute,
  } = useRouteStore();

  // connect socket once
  useEffect(() => {
    connectSocket();
  }, []);

  // fetch route when user selects a station
  useEffect(() => {
    let isMounted = true;
    async function getRoute() {
      if (userLocation && destination) {
        await fetchRoute(userLocation, destination, "driving-car");
      } else {
        clearRoute();
      }
    }
    if (isMounted) getRoute();
    return () => {
      isMounted = false;
    };
  }, [userLocation, destination]);

  return (
    <View style={styles.container}>
      {/* Menu button */}
      <TouchableOpacity
        style={styles.menu}
        onPress={() => navigation.openDrawer()}
      >
        <Avatar.Image
          size={56}
          source={require("@/assets/images/profile.png")}
        />
      </TouchableOpacity>

      <MapView
        style={styles.map}
        showsUserLocation={true}
        showsMyLocationButton={true}
        mapType="hybrid"
      >
        {/* Stations Markers */}
        {stations.map((station) => (
          <Marker
            key={station.id}
            coordinate={{
              latitude: station.latitude,
              longitude: station.longitude,
            }}
            title={`Station: ${station.name}`}
            description={`Bikes: ${station?.bikes?.length}`}
            pinColor={station.bikes.length > 0 ? "#4CAF50" : "#FF0000"}
            onPress={() =>
              setDestination({
                latitude: station.latitude,
                longitude: station.longitude,
              })
            }
          />
        ))}

        {/* Route between user and selected station */}
        {routeCoords?.length > 1 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#2196F3"
            strokeWidth={4}
          />
        )}
      </MapView>
      <StationInfoCard
        visible={!!destination}
        station={stations.find(
          (s) =>
            s.latitude === destination?.latitude &&
            s.longitude === destination?.longitude
        )}
        onNavigate={() => {
          if (destination) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}`;
            Linking.openURL(url);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  menu: {
    position: "absolute",
    top: 10,
    left: 5,
    zIndex: 9999,
  },
});
