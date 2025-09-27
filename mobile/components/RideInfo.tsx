import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { Bike } from "@/src/store/useBikeStore";
import { useRideStore } from "@/src/store";

// --- Pricing Types and Constants ---
export type PricingRule = {
  label: string;
  minMinutes: number;
  price: number;
};

export const PRICING_RULES: PricingRule[] = [
  { label: "Monthly", minMinutes: 43200, price: 3500 }, // 30 days
  { label: "Daily", minMinutes: 1440, price: 400 }, // 1 day
  { label: "Hourly", minMinutes: 60, price: 120 }, // 1 hour
  { label: "Per Minute", minMinutes: 0, price: 2 }, // fallback per minute
];

interface RideInfoProps {
  visible: boolean;
  bike?: Bike;
}

const RideInfo: React.FC<RideInfoProps> = ({ visible, bike }) => {
  const { activeRental, rideStartTime } = useRideStore();
  if (!visible || !bike) return null;

  // Calculate ride duration in minutes
  const time = rideStartTime
    ? Math.floor((Date.now() - rideStartTime.getTime()) / 60000)
    : 0;

  // Pricing logic using rules
  let cost = 0;
  let plan = PRICING_RULES[PRICING_RULES.length - 1];
  for (const rule of PRICING_RULES) {
    if (time >= rule.minMinutes) {
      plan = rule;
      break;
    }
  }
  if (plan.label === "Per Minute") {
    cost = time * plan.price;
  } else {
    cost = plan.price;
  }

  // TODO: Replace with real distance calculation if available
  const distance = 2.3; // e.g. 2.3 km

  return (
    <View style={styles.container}>
      <View style={styles.infoItem}>
        <Text variant="bodyLarge">Cost</Text>
        <Text style={styles.infoText}>{cost.toFixed(2)} DZD</Text>
      </View>
      <View style={styles.infoItem}>
        <Text variant="bodyLarge">Distance</Text>
        <Text style={styles.infoText}>{distance.toFixed(2)} km</Text>
      </View>
      <View style={styles.infoItem}>
        <Text variant="bodyLarge">Time</Text>
        <Text style={styles.infoText}>{time} min</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 100,
    bottom: 0,
    left: 0,
    backgroundColor: "#A5D6A7",
    width: "100%",
    height: 180,
    borderTopLeftRadius: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  infoItem: {
    alignItems: "center",
    marginRight: 20,
    width: 100,
  },
  infoText: {
    fontWeight: "bold",
  },
});

export default RideInfo;
