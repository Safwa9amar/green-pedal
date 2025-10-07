import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import api from "@/api";
import { bikesAPI } from "@/src/services/api";
import { useSearchParams } from "expo-router/build/hooks";
import { Bike } from "@/src/store";
import BikeLoader from "@/components/BikeLoader";

export default function BikeDetailsScreen() {
  const SearchParams = useSearchParams();
  const [bike, setBike] = useState<Bike>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bikesAPI
      .getBikeByID(SearchParams.get("id") as string)
      .then((data) => setBike(data?.bike))
      .finally(() => {
        setLoading(false);
      });
  }, []);
  console.log("kljklj", bike);

  if (loading && !bike) return <BikeLoader />;

  return (
    <View style={styles.container}>
      {/* Bike Info */}
      <Text style={styles.bikeName}>{bike.name}</Text>
      <Text style={styles.bikeType}>{bike.type}</Text>

      {/* Battery Info */}
      <View style={styles.batteryContainer}>
        <MaterialCommunityIcons name="battery-high" size={20} color="#43A047" />
        <Text style={styles.batteryText}>
          {bike.batteryTime}
          <Text style={styles.batteryLevel}>{bike.batteryLevel}%</Text>
        </Text>
      </View>

      {/* Bike Image */}
      <Image
        source={{ uri: process.env.EXPO_PUBLIC_SERVER_URL + bike.photo }}
        style={styles.bikeImage}
        resizeMode="contain"
      />

      {/* Specs */}
      <View style={styles.specsContainer}>
        {bike?.specs?.map((spec, index) => (
          <View style={styles.specCard} key={index}>
            <FontAwesome5 name={spec.icon as any} size={20} color="#A5D6A7" />
            <Text style={styles.specLabel}>{spec.label}</Text>
            <Text style={styles.specValue}>{spec.value}</Text>
          </View>
        ))}
      </View>

      {/* Rent Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.rentButton}>
          <Text style={styles.rentText}>Rent Bike</Text>
        </TouchableOpacity>
        <Text style={styles.priceText}>pricePerHour</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bikeName: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 20,
    color: "#1E293B",
  },
  bikeType: {
    fontSize: 16,
    color: "#94A3B8",
  },
  batteryContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 10,
    marginTop: 10,
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  batteryText: {
    fontSize: 14,
    marginLeft: 8,
    color: "#475569",
  },
  batteryLevel: {
    fontWeight: "600",
    color: "#43A047",
  },
  bikeImage: {
    width: "100%",
    height: 200,
    alignSelf: "center",
    marginVertical: 30,
  },

  specsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  specCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    marginHorizontal: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  specLabel: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 6,
  },
  specValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginTop: 3,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    justifyContent: "space-between",
  },
  rentButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  rentText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3B82F6",
  },
});
