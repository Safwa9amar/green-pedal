import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { Stack, usePathname, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "react-native-paper";
import { capitalizeWords } from "@/src/utils/capitalizeWords";

export default function Layout() {
  const router = useRouter();
  let path = usePathname().replace("/", "").replace("-", " ").replace("/", " ");

  return (
    <Stack
      screenOptions={{
        header: () => (
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.replace("/")}
            >
              <MaterialCommunityIcons name="arrow-left" size={35} />
              <Text style={styles.headerTitle}>{capitalizeWords(path)}</Text>
            </TouchableOpacity>
            <View />
          </View>
        ),

        contentStyle: {
          backgroundColor: "#A5D6A7",
        },
      }}
    >
      <Stack.Screen name="settings" />
      <Stack.Screen name="privacy-policy" />
      <Stack.Screen name="rental-history" />
      <Stack.Screen name="my-wallet" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="faq" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 150,
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    flexDirection: "row",
  },
  backBtn: {
    marginRight: 12,
    padding: 8,
    flexDirection: "row",
    gap: 5,
  },
  backArrow: {
    fontSize: 32,
    color: "#222",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 3,
  },
});
