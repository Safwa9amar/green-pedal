import { StyleSheet, View, type ViewStyle } from "react-native";
import { Text } from "react-native-paper";
import React from "react";
import { Colors } from "@/constants/theme";

/**
 * A reusable component to display a single row of information,
 * including an icon, a label, and a value.
 */
export const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  valueColor?: string;
  style?: ViewStyle;
}> = ({ icon, label, value, valueColor, style }) => (
  <View style={[styles.infoRow, style]}>
    <View style={styles.iconContainer}>{icon}</View>
    <View style={styles.infoTextContainer}>
      {/* Label Text - Using RNP Text with labelMedium variant */}
      <Text style={styles.labelText} variant="labelMedium">
        {label}
      </Text>

      {/* Value Text - Using RNP Text with titleMedium variant */}
      <Text
        style={[styles.infoValue, { color: valueColor || Colors.light.text }]}
        variant="titleMedium"
      >
        {value}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
  },
  iconContainer: {
    width: 32,
    height: 32,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.surface,
    borderRadius: 8,
  },
  infoTextContainer: {
    flex: 1,
  },
  labelText: {
    color: Colors.light.icon,
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
});
