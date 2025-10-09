import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Slot, useRouter } from "expo-router";
import * as Linking from "expo-linking";
export default function _layout() {
  const router = useRouter();
  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      console.log("Incoming link:", url);
      console.log(url);

      const path = Linking.parse(url).path; // e.g., "bike/123"
      if (path) {
        router.replace(path as any); // Navigate directly to the screen
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Handle initial URL if app is cold started
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      subscription.remove();
    };
  }, [router]);

  return <Slot />;
}
