import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import { Colors } from "@/constants/theme";

interface RideDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  currentRental: any;
  formattedStartTime: string;
  formattedElapsedTime: string;
  isActive: boolean;
}

export const RideDetailsModal: React.FC<RideDetailsModalProps> = ({
  visible,
  onClose,
  currentRental,
  formattedStartTime,
  formattedElapsedTime,
  isActive,
}) => {
  if (!visible) return null;

  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "timing", duration: 200 }}
      style={styles.modalOverlay}
    >
      <MotiView
        from={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "timing", duration: 300 }}
        style={styles.modalContent}
      >
        <View style={styles.modalHeader}>
          <Ionicons name="bicycle" size={32} color={Colors.light.primary} />
          <Text style={styles.modalTitle}>Ride Details</Text>
        </View>

        <View style={styles.rideDetailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Bike ID</Text>
            <Text style={styles.detailValue}>
              {currentRental?.bikeId || "N/A"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Start Time</Text>
            <Text style={styles.detailValue}>{formattedStartTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>{formattedElapsedTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status</Text>
            <Text
              style={[
                styles.detailValue,
                {
                  color: isActive ? Colors.light.success : Colors.light.warning,
                },
              ]}
            >
              {isActive ? "Active" : "Completed"}
            </Text>
          </View>
        </View>

        <View style={styles.modalActions}>
          <Button
            mode="contained"
            onPress={onClose}
            style={styles.modalButton}
            labelStyle={styles.modalButtonLabel}
          >
            Close
          </Button>
        </View>
      </MotiView>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 320,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.text,
    marginTop: 8,
  },
  rideDetailsContainer: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.icon,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
  },
  modalButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
});
