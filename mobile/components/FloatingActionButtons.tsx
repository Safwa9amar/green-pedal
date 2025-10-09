import React from "react";
import { View, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

interface FloatingActionButtonsProps {
  onCenterMap: () => void;
  onOpenMenu: () => void;
  onEndRide: () => void;
  isActive: boolean;
}

export const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  onCenterMap,
  onOpenMenu,
  onEndRide,
  isActive,
}) => {
  return (
    <View style={styles.floatingButtons}>
      <TouchableOpacity onPress={onCenterMap} style={styles.floatingButton}>
        <Ionicons name="locate" size={24} color={Colors.light.text} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onOpenMenu}
        style={[styles.floatingButton, styles.menuButton]}
      >
        <Ionicons
          name="ellipsis-vertical"
          size={24}
          color={Colors.light.text}
        />
      </TouchableOpacity>

      {isActive && (
        <TouchableOpacity
          style={[styles.floatingButton, styles.menuButton]}
          onPress={onEndRide}
        >
          <Ionicons name="stop-circle" size={24} color={Colors.dark.error} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  floatingButtons: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    right: 20,
    flexDirection: "column",
    gap: 12,
  },
  floatingButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.card,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  menuButton: {
    backgroundColor: Colors.light.surface,
  },
});
