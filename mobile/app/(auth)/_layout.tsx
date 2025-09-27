import { useAuthStore } from "@/src/store";
import { Stack, useNavigation, usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";

const Authentication = () => {
  const router = useRouter();
  const path = usePathname();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    isAuthenticated && router.replace("/");
  }, [isAuthenticated]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#A5D6A7" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#A5D6A7" />
      <View style={styles.header}>
        <View style={styles.tabRow}>
          <TouchableOpacity onPress={() => router.push("./login ")}>
            <Text style={[styles.tab, path === "/login" && styles.tabActive]}>
              Log in
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("./register")}>
            <Text
              style={[styles.tab, path === "/register" && styles.tabActive]}
            >
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Stack
        screenOptions={{
          animation: "none",
          contentStyle: { backgroundColor: "#A5D6A7" },
          title: "Login",
          headerTintColor: "#000",
          headerTitleStyle: { fontWeight: "700" },
          headerShown: false,
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </KeyboardAvoidingView>
  );
};

export default Authentication;

const styles = StyleSheet.create({
  header: {
    paddingTop: 80,
    paddingBottom: 32,
    paddingHorizontal: 24,
    backgroundColor: "#A5D6A7",
  },
  tabRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  tab: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginRight: 32,
    opacity: 0.5,
  },
  tabActive: {
    fontSize: 28,
    opacity: 1,
    color: "#3A0A3A",
    borderBottomWidth: 4,
    borderBottomColor: "#fff",
  },
});
