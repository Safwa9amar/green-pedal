import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, Text } from "react-native-paper";
import WeatherCard from "@/components/WeatherCard";
import StationCard from "@/components/StationCard";
import { useTheme } from "@react-navigation/native";
import { GreenRideTheme } from "@/constants/theme";
import { useRouter, useNavigation } from "expo-router";
import { useAuthStore, useBikeStore, useRouteStore } from "@/src/store";
import { useUserLocation } from "@/src/store/useUserLocation";
import { useStationStore } from "@/src/store/useStationStore";
import { getDistanceFromLatLonInMeters } from "@/src/utils/getDistanceFromLatLonInMeters";

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useTheme() as GreenRideTheme;
  const navigation = useNavigation() as any;
  const { user } = useAuthStore();
  const { location, loading, refresh } = useUserLocation();
  const { stations } = useBikeStore();
  const [nearbyStations, setNearbyStations] = useState<any[]>([]);
  const { setDestination } = useRouteStore();

  useEffect(() => {
    if (location && stations.length > 0) {
      const filtered = stations
        .map((station) => ({
          ...station,
          distance: getDistanceFromLatLonInMeters(
            location.latitude,
            location.longitude,
            station.latitude,
            station.longitude
          ),
        }))
        .filter((s) => s.distance < 10000) // show stations within 10km
        .sort((a, b) => a.distance - b.distance);

      setNearbyStations(filtered);
    }
  }, [location, stations]);

  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary]}
      style={styles.container}
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Avatar.Image
              size={56}
              source={
                user?.photo
                  ? {
                      uri: `${
                        process.env.EXPO_PUBLIC_SERVER_URL + user?.photo
                      }`,
                    }
                  : { uri: user?.avatar }
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.searchIcon}
            onPress={() => router.push("/search")}
          >
            <Ionicons name="search" size={36} color="#231942" />
          </TouchableOpacity>
        </View>

        <View style={{ paddingVertical: 10, marginHorizontal: 24 }}>
          <Text style={styles.helloText} variant="headlineLarge">
            Hello {user?.name}.
          </Text>
          <Text style={styles.subtitle} variant="bodyLarge">
            Wanna take a ride today?
          </Text>
        </View>

        <WeatherCard />

        <View style={styles.nearHeader}>
          <Text style={styles.nearTitle}>Nearby stations</Text>
          <TouchableOpacity
            style={styles.browseMap}
            onPress={() => router.push("/(map)")}
          >
            <Text style={styles.browseMapText}>Browse Map</Text>
            <Ionicons name="chevron-forward" size={22} color="#231942" />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal style={{ marginTop: 8, paddingBottom: 10 }}>
          {nearbyStations.length > 0 ? (
            nearbyStations.map((station) => (
              <StationCard
                key={station.id}
                name={station.name}
                distance={`${Math.round(station.distance)} m`}
                available={station.availableBikes}
                imageSource={
                  station.image ||
                  require("@/assets/images/sba-bike-station.png")
                }
                onPress={() => {
                  // ✅ Save the station coordinates
                  setDestination({
                    latitude: station.latitude,
                    longitude: station.longitude,
                  });
                  // ✅ Navigate to the map page
                  router.push("/(map)");
                }}
              />
            ))
          ) : (
            <Text style={{ marginLeft: 24 }}>No nearby stations found.</Text>
          )}
        </ScrollView>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 24,
    justifyContent: "space-between",
  },
  searchIcon: {
    marginRight: 8,
    marginTop: 8,
  },
  helloText: {
    fontWeight: "bold",
    color: "#231942",
  },
  subtitle: {
    color: "#231942",
  },
  nearHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 24,
    marginTop: 8,
  },
  nearTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  browseMap: {
    flexDirection: "row",
    alignItems: "center",
  },
  browseMapText: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 2,
  },
});
