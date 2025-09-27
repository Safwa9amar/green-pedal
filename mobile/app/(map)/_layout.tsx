import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapTabBar from "@/components/MapTabBar";
import BikeInfoCard from "@/components/BikeInfoCard";
import { Button, Text } from "react-native-paper";
import { Image, View } from "react-native";
import { GreenRideTheme } from "@/constants/theme";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { useBikeStore, useRideStore } from "@/src/store";
import RideInfo from "@/components/RideInfo";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme() as GreenRideTheme;
  const { currentBike, isRiding } = useRideStore();
  const { selectedBike } = useBikeStore();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ state, descriptors, navigation }) => {
        return (
          <>
            <MapTabBar
              state={state}
              descriptors={descriptors}
              navigation={navigation}
              insets={insets}
            />
          </>
        );
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Map",
          tabBarLabel: "Home",
          headerTitle: "Green Pedal Map",
        }}
      />

      <Tabs.Screen
        name="start-ride"
        options={{
          title: "Start ride",
        }}
      />
      <Tabs.Screen
        name="end-ride"
        options={{
          title: "End ride",
        }}
      />
      <Tabs.Screen
        name="unlock"
        options={{
          title: "Ulock bike",
        }}
      />
    </Tabs>
  );
}
