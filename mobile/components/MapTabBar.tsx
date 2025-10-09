import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePathname, useRouter } from "expo-router";

// Define all tab routes
const routes = [
  { name: "/", icon: "home", type: "Ionicons" },
  { name: "/stations-map", icon: "compass-outline", type: "Ionicons" },
  {
    name: "/unlock",
    icon: "lock-open-outline",
    type: "Ionicons",
  },
  { name: "/repport", icon: "report-problem", type: "MaterialIcons" },
];

const MapTabBar: React.FC = () => {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
      {routes.map((route) => {
        // --- UPDATED FOCUS LOGIC ---
        // 1. Check for exact match (e.g., pathname === '/')
        // 2. Check if the pathname starts with the route name followed by a slash (e.g., pathname startsWith '/unlock/')
        // This ensures nested routes like '/unlock/bike-details' activate the '/unlock' tab.
        const isActive =
          pathname === route.name || pathname.startsWith(`${route.name}/`);

        const iconColor = isActive ? "#4B185A" : "#C3C3C3";

        const IconComponent =
          route.type === "Ionicons" ? Ionicons : MaterialIcons;

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isActive ? { selected: true } : {}}
            onPress={() => {
              // We use router.replace() instead of push() inside a tab bar to reset the stack
              // to the root screen of the tab, which is usually better UX.
              router.replace(route.name as any);
            }}
            activeOpacity={0.8}
            style={[styles.iconWrapper, isActive ? styles.activeIcon : null]}
          >
            <IconComponent
              name={route.icon as any}
              size={30}
              color={iconColor}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    bottom: 0,
    backgroundColor: "#eeeeee88",
    width: "100%",
    height: 80,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderTopLeftRadius: 50,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#4B185A",
  },
  activeIcon: {
    // This style is applied when the route is active (focused or nested screen is open)
    borderBottomWidth: 4,
    borderBottomColor: "#A5D6A7",
  },
});

export default MapTabBar;
