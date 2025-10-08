import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type BatteryLevelProps = {
  level?: number; // 0–100
  charging?: boolean;
  size?: number;
};

export default function BatteryLevel({
  level = 50,
  charging = false,
  size = 28,
}: BatteryLevelProps) {
  let iconName = "battery-off-outline";
  let color = "#9CA3AF"; // default gray

  if (charging) {
    if (level > 80) iconName = "battery-charging-90";
    else if (level > 60) iconName = "battery-charging-70";
    else if (level > 40) iconName = "battery-charging-50";
    else if (level > 20) iconName = "battery-charging-30";
    else iconName = "battery-charging-10";
    color = "#22C55E"; // green for charging
  } else {
    if (level > 60) {
      iconName = "battery-high";
      color = "#16A34A";
    } else if (level > 20 && level < 60) {
      iconName = "battery-medium";
      color = "#84CC16";
    } else if (level < 20) {
      iconName = "battery-50";
      color = "#F59E0B";
    } else if (level < 10) {
      iconName = "battery-low";
      color = "#EF4444";
    } else {
      iconName = "battery-minus-outline";
      color = "#DC2626";
    }
  }

  return (
    <MaterialCommunityIcons name={iconName as any} size={size} color={color} />
  );
}
