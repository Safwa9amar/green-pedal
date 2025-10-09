import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { MotiView } from "moti";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import PricingInfoModal from "./PricingInfoModal";

interface RideInfoCardsProps {
  formattedStartTime: string;
  formattedElapsedTime: string;
  displayCost: number | null;
  status: string;
}

export const RideInfoCards: React.FC<RideInfoCardsProps> = ({
  formattedStartTime,
  formattedElapsedTime,
  displayCost,
  status,
}) => {
  return (
    <MotiView
      from={{ translateY: -20, opacity: 0 }}
      animate={{ translateY: 0, opacity: 1 }}
      transition={{ type: "timing", duration: 400, delay: 100 }}
      style={styles.infoCardsContainer}
    >
      {/* Time Information Card */}
      <View style={styles.infoCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="time" size={20} color={Colors.light.primary} />
            <Text style={styles.cardTitle}>Ride Duration</Text>
          </View>
        </View>

        <View style={styles.timeInfoContainer}>
          <View style={styles.timeItem}>
            <Text style={styles.timeLabel}>Started</Text>
            <Text style={styles.timeValue}>{formattedStartTime}</Text>
          </View>

          <View style={styles.timeDivider} />

          <View style={styles.timeItem}>
            <Text style={styles.timeLabel}>Elapsed</Text>
            <Text style={[styles.timeValue, styles.elapsedTime]}>
              {formattedElapsedTime}
            </Text>
          </View>
        </View>
      </View>

      {/* Cost Information Card */}
      <View style={styles.infoCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <PricingInfoModal />

            <Text style={styles.cardTitle}>Ride Cost</Text>
          </View>
        </View>

        <View style={styles.costContainer}>
          <Text style={styles.costLabel}>
            {status === "COMPLETED" ? "Total Cost" : "Estimated Cost"}
          </Text>
          <Text style={styles.costValue}>{displayCost?.toFixed(2)} DZD</Text>
          {status !== "COMPLETED" && (
            <Text style={styles.costNote}>Cost updates every minute</Text>
          )}
        </View>
      </View>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  infoCardsContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 14 : 30,
    left: 20,
    right: 20,
    gap: 16,
  },
  infoCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
    letterSpacing: 0.3,
  },
  timeInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeItem: {
    flex: 1,
    alignItems: "center",
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.light.icon,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
  },
  elapsedTime: {
    color: Colors.light.primary,
  },
  timeDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.light.border,
    marginHorizontal: 16,
    opacity: 0.6,
  },
  costContainer: {
    alignItems: "center",
  },
  costLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.light.icon,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  costValue: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.light.success,
    marginBottom: 4,
  },
  costNote: {
    fontSize: 10,
    color: Colors.light.icon,
    fontStyle: "italic",
  },
});
