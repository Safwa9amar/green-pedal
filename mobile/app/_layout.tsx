import { Stack, useRouter } from "expo-router";
import { NavigationContainer, ThemeProvider } from "@react-navigation/native";
import {
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useEffect } from "react";
import { useAuthStore } from "../src/store/useAuthStore";
import { useAppLaunchStore } from "../src/store/useAppLaunchStore";
import { darkTheme, defaultTheme } from "@/constants/theme";
import CustomDrawer from "@/components/Drawer";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useBikeStore } from "@/src/store";
import useSocket from "@/hooks/useSocket";
import { Avatar } from "react-native-paper";
import * as Linking from "expo-linking";
export default function RootLayout() {
  useSocket();
  const { getUpdates } = useBikeStore();
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading, user, logout, login, token } =
    useAuthStore();
  const { isFirstLaunch, checkFirstLaunch } = useAppLaunchStore();
  const router = useRouter();
  // Only check first launch if not already determined
  useEffect(() => {
    if (isFirstLaunch === null) {
      checkFirstLaunch();
    }
    isAuthenticated && getUpdates();

    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("Opened via deep link:", url);
      // parse URL and navigate inside app
    });

    // Check if app was opened from a deep link
    Linking.getInitialURL().then((url) => {
      if (url) console.log("Initial URL:", url);
    });

    return () => subscription.remove();
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
        <Stack initialRouteName="(auth)/login">
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    );
  }

  // Authenticated: show main app drawer
  return (
    <ThemeProvider value={colorScheme === "dark" ? darkTheme : defaultTheme}>
      <StatusBar barStyle={"dark-content"} />
      <Drawer
        initialRouteName="(tabs)"
        drawerContent={(props) => (
          <CustomDrawer
            onLogout={() => {
              logout();
            }}
            {...props}
          />
        )}
        screenOptions={{
          header: ({ navigation }) => (
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Avatar.Image
                  size={40}
                  source={
                    user?.photo
                      ? {
                          uri: `${
                            process.env.EXPO_PUBLIC_SERVER_URL + user?.photo
                          }`,
                        }
                      : { uri: user?.avatar }
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.searchIcon}
                onPress={() => router.push("/search")}
              >
                <Ionicons name="search" size={36} color="#231942" />
              </TouchableOpacity>
            </View>
          ),
        }}
      >
        <Drawer.Screen name="(tabs)" />
        <Drawer.Screen name="(profile)" options={{ headerShown: false }} />
      </Drawer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 24,
    marginTop: 50,
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
    marginTop: 8,
  },
});
