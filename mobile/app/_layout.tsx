import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Slot, useRouter } from "expo-router";
import * as Linking from "expo-linking";
import * as Updates from "expo-updates";

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

  useEffect(() => {
    const autoUpdate = async () => {
      try {
        // 1️⃣ Check for available update
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          // 2️⃣ Download and apply it immediately
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync(); // restarts app to apply new code
        }
      } catch (error) {
        console.log("Auto-update check failed:", error);
      }
    };

    autoUpdate();
  }, []);
  return <Slot />;
}
