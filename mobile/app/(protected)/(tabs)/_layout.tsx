import React from "react";
import { Tabs } from "expo-router";
import MapTabBar from "@/components/MapTabBar";
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={() => <MapTabBar />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="stations-map" />
      <Tabs.Screen name="repport" />
      <Tabs.Screen name="search" />
      <Tabs.Screen name="unlock/index" />
    </Tabs>
  );
}
