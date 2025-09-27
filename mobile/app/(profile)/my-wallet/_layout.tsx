import { View, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "react-native-paper";

export default function Layout() {
  return (
    <Stack
      initialRouteName="my-wallet"
      screenOptions={{
        header: ({ navigation, route }) => (
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <MaterialCommunityIcons name="arrow-left" size={32} />
            </TouchableOpacity>
            <Text variant="headlineSmall">My wallet</Text>
            <View />
          </View>
        ),
        contentStyle: {
          backgroundColor: "#A5D6A7",
        },
      }}
    >
      <Stack.Screen name="my-wallet" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="top-up" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 200,
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    flexDirection: "row",
  },
  backBtn: {
    marginRight: 12,
    padding: 8,
  },
  backArrow: {
    fontSize: 32,
    color: "#222",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 36,
    color: "#222",
    fontWeight: "700",
    marginLeft: 8,
  },
});
