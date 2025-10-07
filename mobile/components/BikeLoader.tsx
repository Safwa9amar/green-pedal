import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { Easing } from "react-native-reanimated"; // ✅ correct import

export default function BikeLoader() {
  return (
    <View style={styles.container}>
      {/* Animated Bike Icon */}
      <MotiView
        from={{ translateX: -20, opacity: 0.8 }}
        animate={{ translateX: 20, opacity: 1 }}
        transition={{
          loop: true,
          type: "timing",
          duration: 1000,
          easing: Easing.inOut(Easing.ease), // ✅ Reanimated easing function
        }}
        style={styles.iconWrapper}
      >
        <Ionicons name="bicycle-outline" size={60} color="#1976D2" />
      </MotiView>

      {/* Animated Text */}
      <MotiView
        from={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{
          loop: true,
          type: "timing",
          duration: 1500,
        }}
      >
        <Text style={styles.text}>Getting your ride ready...</Text>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F9FF",
  },
  iconWrapper: {
    marginBottom: 16,
  },
  text: {
    color: "#555",
    fontSize: 16,
    fontWeight: "500",
  },
});
