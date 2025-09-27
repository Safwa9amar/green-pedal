import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, Button, Text } from "react-native-paper";
import WeatherCard from "@/components/WeatherCard";
import BikeCard from "@/components/StationCard";
import { useTheme } from "@react-navigation/native";
import { GreenRideTheme } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "@/src/store";

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useTheme() as GreenRideTheme;
  const navigation = useNavigation() as any;
  const { user } = useAuthStore();

  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Avatar.Image
              size={56}
              source={require("../assets/images/profile.png")}
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

        <ScrollView
          horizontal
          style={{
            marginTop: 8,
            paddingBottom: 10,
          }}
        >
          <BikeCard
            name="Haibike Sduro FullSeven"
            distance="150 m"
            available={1}
            imageSource={require("@/assets/images/sba-bike-station.png")}
          />
          <BikeCard
            name="Haibike Sduro FullSeven"
            distance="150 m"
            available={1}
          />
        </ScrollView>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 24,
    justifyContent: "space-between",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 5,
    borderColor: "#fff",
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
