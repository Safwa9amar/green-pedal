import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { rentalApi } from "@/src/services/api";
import { useFocusEffect, useRouter } from "expo-router";

interface Rental {
  id: string;
  bikeId: string;
  bike: any;
  startTime: string;
  endTime?: string | null;
  totalCost?: number | null;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
}

export default function RentalHistory() {
  const router = useRouter();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** 🧭 Fetch user's rental history */
  const getData = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);

      const res = await rentalApi.getUserRentals();
      if (res?.data) {
        setRentals(res.data);
      } else {
        setError("No data found");
      }
    } catch (err: any) {
      console.error("❌ Failed to fetch rentals:", err);
      setError("Failed to fetch rental history");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [getData])
  );
  /** 🧾 Format date & cost */
  const formatDate = (date?: string | null) =>
    date ? new Date(date).toLocaleString() : "N/A";

  const formatCost = (cost?: number | null) =>
    cost ? `${cost.toFixed(2)} DZD` : "-";

  /** 🎨 UI Rendering */
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading your rentals...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={getData}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={getData} />
      }
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {rentals.length === 0 ? (
        <Text style={styles.emptyText}>No rentals found</Text>
      ) : (
        rentals.map((rental) => (
          <TouchableOpacity
            onPress={() =>
              rental.status === "ACTIVE" &&
              router.push("/(protected)/(tabs)/unlock/active-rental")
            }
            key={rental.id}
            style={styles.card}
          >
            <View style={styles.row}>
              <Text style={styles.label}>Bike ID:</Text>
              <Text style={styles.value}>{rental.bike?.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Start:</Text>
              <Text style={styles.value}>{formatDate(rental.startTime)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>End:</Text>
              <Text style={styles.value}>{formatDate(rental.endTime)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Cost:</Text>
              <Text style={styles.value}>{formatCost(rental.totalCost)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Status:</Text>
              <Text
                style={[
                  styles.status,
                  rental.status === "ACTIVE"
                    ? styles.statusActive
                    : rental.status === "COMPLETED"
                    ? styles.statusCompleted
                    : styles.statusCancelled,
                ]}
              >
                {rental.status}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  content: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    color: "#333",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    overflow: "hidden",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontWeight: "400",
    color: "#333",
  },
  status: {
    fontWeight: "700",
    textTransform: "capitalize",
  },
  statusActive: {
    color: "#FFA000",
  },
  statusCompleted: {
    color: "#2E7D32",
  },
  statusCancelled: {
    color: "#C62828",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  errorText: {
    color: "#C62828",
    fontSize: 16,
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFF",
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
    fontSize: 16,
  },
});
