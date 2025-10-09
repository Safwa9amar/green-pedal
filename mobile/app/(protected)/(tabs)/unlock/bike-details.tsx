import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { MotiView } from "moti";
import { useRouter, useSearchParams } from "expo-router/build/hooks";
import { bikesAPI, rentalApi } from "@/src/services/api";
import { useAuthStore } from "@/src/store";
import BikeLoader from "@/components/BikeLoader";
import BatteryLevel from "@/components/BatteryLevel";
import PricingInfoCard from "@/components/PricingInfoModal";
import { socket } from "@/src/services/socket";
import { useRentalStore } from "@/src/store/useRentalStore";
import type { Bike } from "@/src/types";
import { useFocusEffect } from "expo-router";

export default function BikeDetailsScreen() {
  const { user } = useAuthStore();
  const { startRental, resetRental, connectSocket, currentRental } =
    useRentalStore();
  const SearchParams = useSearchParams();
  const router = useRouter();
  const [bike, setBike] = useState<Bike>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bikeId = SearchParams.get("id") as string;

  const fetchBike = useCallback(async () => {
    try {
      setError(null);
      const data = await bikesAPI.getBikeByID(bikeId);
      console.log(data);

      setBike(data?.bike);
    } catch (err) {
      console.error(err);
      setError("Failed to load bike details");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [SearchParams]);

  const startRide = async () => {
    if (user && user.balance === 0) {
      Alert.alert(
        "Insufficient Balance",
        "Please recharge your wallet.",
        [
          {
            text: "Charge",
            onPress: () => router.push("/(protected)/(profile)/my-wallet"),
          },
          { text: "Dismiss", style: "cancel" },
        ],
        { cancelable: true }
      );
      return;
    }

    try {
      await startRental(bikeId); // ✅ use Zustand action instead of direct API
      router.push("/(protected)/(tabs)/unlock/active-rental");
    } catch (err) {
      console.error("Failed to start ride:", err);
      Alert.alert("Error", "Could not start the ride.");
    }
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBike();
  }, [fetchBike]);

  useEffect(() => {
    fetchBike();
  }, []);

  if (!bike && loading) return <BikeLoader />;
  if (error)
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchBike} style={styles.retryButton}>
          <Text style={styles.retryText}>↻ Retry</Text>
        </TouchableOpacity>
      </View>
    );

  if (!bike) return <Text style={styles.errorText}>No bike found</Text>;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 600 }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.bikeName}>{bike.name}</Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 5,
                  backgroundColor: "#E8F5E9",
                  padding: 2,
                  borderRadius: 5,
                }}
              >
                <MaterialIcons name="bike-scooter" size={24} color="#2E7D32" />
                <Text style={styles.bikeType}>{bike.station?.name}</Text>
              </View>
              <Text style={styles.bikeType}>{bike.type}</Text>
            </View>
          </View>

          {/* Battery Info */}
          <View style={styles.batteryContainer}>
            <BatteryLevel level={parseFloat(bike.batteryLevel)} />
            <View>
              <Text>{bike.batteryTime || "Unknown"} hours</Text>
              <Text>{bike.batteryLevel ?? 0}%</Text>
            </View>
          </View>
        </View>
      </MotiView>

      {/* Bike Image */}
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "timing", duration: 700 }}
        style={styles.imageWrapper}
      >
        <Image
          source={{
            uri: `${process.env.EXPO_PUBLIC_SERVER_URL}${bike.photo}`,
            cache: "reload",
          }}
          style={styles.bikeImage}
          resizeMode="contain"
        />
      </MotiView>

      {/* Specs Section */}
      <View style={styles.specsContainer}>
        <Text style={styles.sectionTitle}>Specifications</Text>
        <View style={styles.specGrid}>
          {bike?.specs?.length ? (
            bike.specs.map((spec: any, index: any) => (
              <MotiView
                key={index}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: index * 100, duration: 400 }}
                style={styles.specCard}
              >
                <MaterialCommunityIcons
                  name={(spec.icon as any) || "information-circle-outline"}
                  size={22}
                  color="#A5D6A7"
                />
                <Text style={styles.specLabel}>{spec.label}</Text>
                <Text style={styles.specValue}>{spec.value}</Text>
              </MotiView>
            ))
          ) : (
            <Text style={styles.noSpecsText}>No specifications available</Text>
          )}
        </View>
      </View>

      {/* Footer */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "spring", damping: 12 }}
        style={styles.footer}
      >
        <TouchableOpacity
          style={[
            styles.rentButton,
            bike.status !== "AVAILABLE" && styles.disabledButton,
          ]}
          disabled={bike.status !== "AVAILABLE"}
          onPress={startRide}
        >
          <Text style={styles.rentText}>
            {bike.status === "AVAILABLE"
              ? "Rent Bike"
              : bike.status.toLowerCase().replace("_", " ")}
          </Text>
        </TouchableOpacity>
        <PricingInfoCard />
      </MotiView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#DC2626", fontSize: 16, fontWeight: "600" },
  retryButton: {
    marginTop: 12,
    backgroundColor: "#3B82F6",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  retryText: { color: "#fff", fontWeight: "600" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  bikeName: { fontSize: 24, fontWeight: "700", color: "#1E293B" },
  bikeType: { fontSize: 16, color: "#2E7D32" },
  batteryContainer: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 10,
    marginTop: 14,
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  imageWrapper: { marginVertical: 30, alignItems: "center" },
  bikeImage: { width: "100%", height: 220 },
  specsContainer: { marginBottom: 40 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 10,
  },
  specGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  specCard: {
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    alignItems: "center",
  },
  specLabel: { fontSize: 13, color: "#64748B", marginTop: 5 },
  specValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginTop: 2,
  },
  noSpecsText: {
    textAlign: "center",
    color: "#94A3B8",
    fontStyle: "italic",
    width: "100%",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    justifyContent: "space-between",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 3,
  },
  rentButton: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  disabledButton: { backgroundColor: "#94A3B8" },
  rentText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
