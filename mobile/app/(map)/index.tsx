import React, { useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useAuthStore, useBikeStore } from "@/src/store";
import { useUserLocation } from "@/src/store/useUserLocation";
import { useRouteStore } from "@/src/store/useRouteStore";
import StationInfoCard from "@/components/StationInfoCard";

export default function HomeScreen() {
  const { user } = useAuthStore();
  const navigation = useNavigation() as any;
  const { stations, connectSocket } = useBikeStore();
  const { location: userLocation } = useUserLocation();

  const { destination, routeCoords, fetchRoute, clearRoute, setDestination } =
    useRouteStore();

  // ✅ Map reference
  const mapRef = useRef<MapView>(null);

  // ✅ Connect socket on mount
  useEffect(() => {
    connectSocket();
  }, []);

  // ✅ Animate to user’s location when available
  useEffect(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.1, // zoom level
          longitudeDelta: 0.01,
        },
        5000 // animation duration (ms)
      );
    }
  }, [userLocation]);

  // ✅ Fetch route when user selects a station
  useEffect(() => {
    async function getRoute() {
      if (userLocation && destination) {
        await fetchRoute(userLocation, destination, "driving-car");
      } else {
        clearRoute();
      }
    }
    getRoute();
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
          source={
            user?.photo
              ? { uri: `${process.env.EXPO_PUBLIC_SERVER_URL + user?.photo}` }
              : { uri: user?.avatar }
          }
        />
      </TouchableOpacity>

      {/* ✅ Attach ref to MapView */}
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        showsMyLocationButton={true}
        mapType="hybrid"
      >
        {/* Station markers */}
        {stations.map((station) => (
          <Marker
            key={station.id}
            coordinate={{
              latitude: station.latitude,
              longitude: station.longitude,
            }}
            title={`Station: ${station.name}`}
            description={`Bikes: ${station.bikes.length}`}
            pinColor={station.bikes.length > 0 ? "#4CAF50" : "#FF0000"}
            onPress={() =>
              setDestination({
                latitude: station.latitude,
                longitude: station.longitude,
              })
            }
          />
        ))}

        {/* Route polyline */}
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
