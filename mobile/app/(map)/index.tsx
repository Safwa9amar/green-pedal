import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useColorScheme } from "react-native";
import { useBikeStore, useRideStore } from "../../src/store";
import MapView, { Marker, Polyline } from "react-native-maps";
import RideInfo from "@/components/RideInfo";
import BikeInfoCard from "@/components/BikeInfoCard";
import { useGlobalSearchParams } from "expo-router/build/hooks";
import { useUserLocation } from "@/src/store/useUserLocation";
import { fetchRouteORS } from "@/src/services/ors";
import { Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation() as any;

  const { setSelectedBike, selectedBike } = useBikeStore();
  const {
    location: userLocation,
    loading: locationLoading,
    error: locationError,
    refresh: refreshLocation,
  } = useUserLocation();
  const searchParams = useGlobalSearchParams();
  const { bikes, setBikes, setLoading, setError } = useBikeStore();
  const { isRiding } = useRideStore();

  // State for destination selection
  const [selectedDestination, setSelectedDestination] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Polyline points for route (real route from OpenRouteService)
  const [routeCoords, setRouteCoords] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  // Fetch route when user selects a bike (before ride)
  useEffect(() => {
    let shouldUpdate = true;
    async function getRoute() {
      setRouteError(null);
      if (selectedBike && userLocation && !isRiding) {
        setRouteLoading(true);
        try {
          const coords = await fetchRouteORS(
            userLocation,
            getBikePosition(selectedBike)
          );

          if (shouldUpdate) setRouteCoords(coords);
        } catch (e: any) {
          if (shouldUpdate) setRouteError("Failed to fetch route");
        } finally {
          if (shouldUpdate) setRouteLoading(false);
        }
      } else {
        setRouteCoords([]);
      }
    }
    getRoute();
    return () => {
      shouldUpdate = false;
    };
  }, [selectedBike, userLocation, isRiding]);

  // Handle map press for destination selection (only when starting ride)
  const handleMapPress = (e: any) => {
    if (selectedBike && !isRiding) {
      setSelectedDestination(e.nativeEvent.coordinate);
    }
  };

  return (
    <>
      <RideInfo visible={isRiding} bike={selectedBike || undefined} />
      {!isRiding && (
        <BikeInfoCard
          visible={!!selectedBike}
          bike={selectedBike || undefined}
          onStartRide={() => {
            // Start ride logic is handled in BikeInfoCard
          }}
        />
      )}
      <View style={styles.container}>
        {/* Show RideInfo only if riding, otherwise show BikeInfoCard if a bike is selected */}
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
          mapType="standard"
          onPress={handleMapPress}
        >
          {/* add random marker baed on curent location */}
          {bikes.map((bike) => (
            <Marker
              key={bike.id}
              coordinate={{
                latitude: bike.currentLocationLat,
                longitude: bike.currentLocationLng,
              }}
              title={`Bike ${bike.id}`}
              description={`Status: ${bike.status}`}
              pinColor={bike.status === "AVAILABLE" ? "#A5D6A7" : "#FF0000"}
              onPress={() => {
                setSelectedBike(bike);
                setSelectedDestination(null); // reset destination on new bike select
              }}
            />
          ))}
          {/* Draw route polyline if available */}
          {routeCoords?.length > 1 && (
            <Polyline
              coordinates={routeCoords}
              strokeColor="#A5D6A7"
              strokeWidth={4}
            />
          )}
          {/* Show destination marker if selected */}
          {selectedDestination && !isRiding && (
            <Marker
              coordinate={selectedDestination}
              title="Destination"
              pinColor="#FFD600"
            />
          )}
        </MapView>
      </View>
    </>
  );
}
// Helper: get bike position
const getBikePosition = (bike: any) => ({
  latitude: bike.currentLocationLat,
  longitude: bike.currentLocationLng,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 12,
  },
  menu: {
    position: "absolute",
    top: 10,
    left: 5,
    zIndex: 9999,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  ridingCard: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#00e676",
  },
  ridingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  ridingText: {
    fontSize: 14,
    marginBottom: 8,
  },
  endRideButton: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  endRideButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  mapContainer: {
    height: 240,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  map: {
    flex: 1,
  },
  listSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  bikeCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
  },
  bikeId: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  bikeStatus: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  bikeLocation: {
    fontSize: 12,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    marginBottom: 4,
  },
  mapPlaceholderCoords: {
    fontSize: 12,
  },
  bikeMarkersPlaceholder: {
    marginTop: 12,
    padding: 8,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 8,
  },
  bikeMarkersText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
