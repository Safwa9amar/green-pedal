// app/(public)/_layout.tsx
import { useAppLaunchStore } from "@/src/store/useAppLaunchStore";
import { ThemeProvider } from "@react-navigation/native";
import { Redirect, Stack } from "expo-router";
import { darkTheme, defaultTheme } from "@/constants/theme";
import { useColorScheme } from "react-native";
import { useEffect } from "react";
import * as Linking from "expo-linking";
export default function PublicLayout() {
  const colorScheme = useColorScheme();
  useEffect(() => {
    const url = Linking.createURL("bike/123");
    console.log("Test deep link:", url);
  }, []);
  return (
    <ThemeProvider value={colorScheme === "dark" ? darkTheme : defaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="payments-failure" />
        <Stack.Screen name="payments-success" />
      </Stack>
    </ThemeProvider>
  );
}
