import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

interface MapTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
  insets: any;
}

const MapTabBar: React.FC<MapTabBarProps> = ({
  state,
  descriptors,
  navigation,
  insets,
}) => {
  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        let icon;
        let iconBg = "transparent";
        let iconColor = isFocused ? "#4B185A" : "#C3C3C3";
        if (route.name === "index") {
          icon = (
            <Ionicons name="compass-outline" size={32} color={iconColor} />
          );
          iconBg = isFocused ? "#fff" : "transparent";
        } else if (route.name === "unlock") {
          icon = (
            <Ionicons name="lock-open-outline" size={32} color={iconColor} />
          );
        } else if (route.name === "repport") {
          icon = (
            <MaterialIcons name="report-problem" size={32} color="black" />
          );
        }
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={() => {
              if (!isFocused) navigation.navigate(route.name);
            }}
            activeOpacity={0.7}
            style={
              isFocused
                ? styles.underline
                : { borderBottomWidth: 2, borderColor: "transparent" }
            }
          >
            <View style={[styles.iconWrapper, { backgroundColor: iconBg }]}>
              {icon}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#fff",
    width: "100%",
    height: 100,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderTopLeftRadius: 50,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#4B185A",
  },
  underline: {
    borderColor: "#A5D6A7",
    borderBottomWidth: 4,
  },
});

export default MapTabBar;
