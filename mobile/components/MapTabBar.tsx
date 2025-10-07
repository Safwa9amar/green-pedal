import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePathname, useRouter } from "expo-router";

const routes = [
  { name: "/", icon: "home", type: "Ionicons" },
  { name: "/stations-map", icon: "compass-outline", type: "Ionicons" },
  { name: "/unlock", icon: "lock-open-outline", type: "Ionicons" },
  { name: "/repport", icon: "report-problem", type: "MaterialIcons" },
];

const MapTabBar: React.FC = () => {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
      {routes.map((route) => {
        const isFocused = pathname === route.name;
        const iconColor = isFocused ? "#4B185A" : "#C3C3C3";

        const IconComponent =
          route.type === "Ionicons" ? Ionicons : MaterialIcons;

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={() => {
              if (!isFocused) router.push(`${route.name}` as any);
            }}
            activeOpacity={0.8}
            style={[styles.iconWrapper, isFocused ? styles.activeIcon : null]}
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
    borderBottomWidth: 4,
    borderBottomColor: "#A5D6A7",
  },
});

export default MapTabBar;
