import { Stack, useRouter } from "expo-router";
import { ThemeProvider, useNavigation } from "@react-navigation/native";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useEffect, useRef } from "react";
import { useAuthStore } from "../src/store/useAuthStore";
import { useAppLaunchStore } from "../src/store/useAppLaunchStore";
import { darkTheme, defaultTheme } from "@/constants/theme";
import CustomDrawer from "@/components/Drawer";
import { Drawer } from "expo-router/drawer";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { getProfile } from "@/api";
import { useBikeStore } from "@/src/store";
import { socket } from "@/src/services/socket";
import useSocket from "@/hooks/useSocket";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapTabBar from "@/components/MapTabBar";
import { Avatar } from "react-native-paper";

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
        <Drawer.Screen name="(auth)" />
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
