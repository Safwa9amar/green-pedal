import { Tabs, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapTabBar from "@/components/MapTabBar";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/src/store";
import { Text } from "react-native-paper";
import { Modal, View } from "react-native";
import IdCardPage from "../(auth)/id-card";

function TabLayout() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  return (
    <>
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
          name="unlock"
          options={{
            title: "Ulock bike",
          }}
        />
      </Tabs>
    </>
  );
}

export default TabLayout;
