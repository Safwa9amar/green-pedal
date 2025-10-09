import { Redirect, Router, useRouter } from "expo-router";
import { ThemeProvider } from "@react-navigation/native";
import {
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useEffect } from "react";
import { useAuthStore, User } from "../../src/store/useAuthStore";
import { useAppLaunchStore } from "../../src/store/useAppLaunchStore";
import { darkTheme, defaultTheme } from "@/constants/theme";
import CustomDrawer from "@/components/Drawer";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useBikeStore } from "@/src/store";
import { Avatar } from "react-native-paper";
import useSocket from "@/src/hooks/useSocket";
import { TabsHeader } from "@/components/CustomHeader";
export default function RootLayout() {
  useSocket();
  const { getUpdates } = useBikeStore();
  const colorScheme = useColorScheme();
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    isAuthenticated && getUpdates();
  }, []);

  if (!user) {
    return <Redirect href="/(auth)" />;
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
            <TabsHeader navigation={navigation} router={router} />
          ),
        }}
      >
        <Drawer.Screen name="(tabs)" />
        <Drawer.Screen name="(profile)" options={{ headerShown: false }} />
      </Drawer>
    </ThemeProvider>
  );
}
