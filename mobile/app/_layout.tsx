import { Stack, useRouter } from "expo-router";
import { ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { useEffect } from "react";
import { useAuthStore } from "../src/store/useAuthStore";
import { useAppLaunchStore } from "../src/store/useAppLaunchStore";
import { darkTheme, defaultTheme } from "@/constants/theme";
import CustomDrawer from "@/components/Drawer";
import { Drawer } from "expo-router/drawer";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading, user, logout } = useAuthStore();
  const { isFirstLaunch, checkFirstLaunch } = useAppLaunchStore();

  // Only check first launch if not already determined
  useEffect(() => {
    if (isFirstLaunch === null) {
      checkFirstLaunch();
    }
  }, []);

  // Show nothing until auth state is loaded
  if (isLoading) {
    return null;
  }

  // Show splash screen or onboarding if first launch
  if (isFirstLaunch === null || isFirstLaunch === true) {
    return (
      <ThemeProvider value={colorScheme === "dark" ? darkTheme : defaultTheme}>
        <Stack initialRouteName="SplashScreen">
          <Stack.Screen name="SplashScreen" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    );
  }
  // Show auth stack if not authenticated
  if (!isAuthenticated) {
    return (
      <ThemeProvider value={colorScheme === "dark" ? darkTheme : defaultTheme}>
        <Stack initialRouteName="(auth)">
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    );
  }

  // Authenticated: show main app drawer
  return (
    <ThemeProvider value={colorScheme === "dark" ? darkTheme : defaultTheme}>
      <Drawer
        drawerContent={(props) => (
          <CustomDrawer
            user={user}
            onLogout={() => {
              logout();
            }}
            {...props}
          />
        )}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Drawer.Screen name="index" />
        <Drawer.Screen
          options={{
            headerShown: true,
            headerTitle: "Find stations",
          }}
          name="(map)"
        />
        <Drawer.Screen name="(auth)" />
      </Drawer>
    </ThemeProvider>
  );
}
