import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native-paper";
import { MotiView } from "moti";
import WeatherCard from "@/components/WeatherCard";
import StationCard from "@/components/StationCard";
import { useTheme } from "@react-navigation/native";
import { GreenRideTheme } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useAuthStore, useBikeStore, useRouteStore } from "@/src/store";
import { useUserLocation } from "@/src/store/useUserLocation";
import { getDistanceFromLatLonInMeters } from "@/src/utils/getDistanceFromLatLonInMeters";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BikeStation } from "@/src/store/useStationStore";
import * as Linking from "expo-linking";
export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useTheme() as GreenRideTheme;
  const { user } = useAuthStore();
  const { location, loading, refresh } = useUserLocation();
  const { stations } = useBikeStore();
  const [nearbyStations, setNearbyStations] = useState<BikeStation[]>([]);
  const { setDestination } = useRouteStore();
  const [tip, setTip] = useState("Loading eco tip...");

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
        .filter((s) => s.distance < 10000)
        .sort((a, b) => a.distance - b.distance);

      setNearbyStations(filtered);
    }
  }, [location, stations]);

  const greeting =
    new Date().getHours() < 12
      ? "Good morning"
      : new Date().getHours() < 18
      ? "Good afternoon"
      : "Good evening";

  useEffect(() => {
    const fetchGeminiTip = async () => {
      try {
        const genAI = new GoogleGenerativeAI(
          process.env.EXPO_PUBLIC_GEMINI_API_KEY!
        );
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt =
          "Give me one short, inspiring eco-friendly tip about biking";
        const result = await model.generateContent(prompt);
        const text = result.response.text().replaceAll("*", "").trim();
        if (text) setTip(text);
      } catch (error) {
        console.warn("Gemini tip fetch failed:", error);
        // fallback to local
        const localTips = [
          "Biking 5 km saves ~1 kg of CO₂ emissions! 🌍",
          "Stay hydrated and always wear your helmet 🪖",
          "Short rides can make a big difference — go green 🚴‍♂️",
        ];
        setTip(localTips[Math.floor(Math.random() * localTips.length)]);
      }
    };

    fetchGeminiTip();
  }, [loading]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} />
      }
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* HEADER */}
      <MotiView
        from={{ opacity: 0, translateY: -10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 100, duration: 400 }}
        style={styles.header}
      >
        <View>
          <Text style={styles.greeting}>{greeting},</Text>
          <Text style={styles.username}>{user?.name || "Rider"} 👋</Text>
        </View>
      </MotiView>
      {/* WEATHER CARD */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 300, duration: 500 }}
      >
        <WeatherCard />
      </MotiView>
      {/* QUICK ACTIONS */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 700, duration: 500 }}
        style={styles.quickActions}
      >
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#4CAF50" }]}
          onPress={() => router.push("/(protected)/(tabs)/unlock")}
        >
          <Ionicons name="bicycle-outline" size={26} color="#fff" />
          <Text style={styles.actionText}>Rent Bike</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#1976D2" }]}
          onPress={() => router.push("/stations-map")}
        >
          <Ionicons name="map-outline" size={26} color="#fff" />
          <Text style={styles.actionText}>My Routes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#FF9800" }]}
          onPress={() => router.push("/(protected)/(profile)/my-wallet")}
        >
          <Ionicons name="wallet-outline" size={26} color="#fff" />
          <Text style={styles.actionText}>Wallet </Text>
          <Text style={{ fontSize: 10, color: "#fff" }}>
            {user?.balance} DZD
          </Text>
        </TouchableOpacity>
      </MotiView>
      {/* ECO TIP (Gemini) */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 500, duration: 500 }}
        style={styles.tipBox}
      >
        <Ionicons name="leaf-outline" size={20} color="#2E7D32" />
        <Text style={styles.tipText}>{tip}</Text>
      </MotiView>

      {/* NEARBY STATIONS */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 900, duration: 500 }}
        style={styles.nearHeader}
      >
        <Text style={styles.nearTitle}>Nearby Stations</Text>
        <TouchableOpacity
          style={styles.browseMap}
          onPress={() => router.push("/stations-map")}
        >
          <Text style={styles.browseMapText}>Browse Map</Text>
          <Ionicons name="chevron-forward" size={20} color="#231942" />
        </TouchableOpacity>
      </MotiView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {nearbyStations.length > 0 ? (
          nearbyStations.map((station, index) => (
            <MotiView
              key={station.id}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 1000 + index * 150, duration: 400 }}
            >
              <StationCard
                name={station.name}
                distance={`${Math.round(station.distance)} m`}
                available={station?.bikes?.length}
                imageSource={{
                  uri: process.env.EXPO_PUBLIC_SERVER_URL + station.photoUrl,
                }}
                onPress={() => {
                  setDestination({
                    latitude: station.latitude,
                    longitude: station.longitude,
                  });
                  router.push("/stations-map");
                }}
              />
            </MotiView>
          ))
        ) : (
          <Text style={{ marginLeft: 24, marginTop: 8 }}>
            No nearby stations found.
          </Text>
        )}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 24,
    marginVertical: 20,
  },
  greeting: { color: "#231942", fontSize: 18 },
  username: { color: "#231942", fontSize: 22, fontWeight: "700" },
  tipBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    padding: 10,
    borderRadius: 12,
    marginHorizontal: 24,
    marginVertical: 20,
  },
  tipText: { color: "#2E7D32", marginLeft: 8, fontSize: 14, flex: 1 },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginHorizontal: 24,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 4,
  },
  actionText: { color: "#fff", fontWeight: "600", marginTop: 6 },
  nearHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 24,
    marginTop: 24,
  },
  nearTitle: { fontSize: 20, fontWeight: "bold", color: "#231942" },
  browseMap: { flexDirection: "row", alignItems: "center" },
  browseMapText: { fontSize: 16, fontWeight: "500", marginRight: 4 },
});
