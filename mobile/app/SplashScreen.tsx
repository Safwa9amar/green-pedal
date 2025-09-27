import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRouter } from "expo-router";
import { useAppLaunchStore } from "../src/store/useAppLaunchStore";
import { useTheme } from "@react-navigation/native";
import type { GreenRideTheme } from "@/constants/theme";

export default function SplashScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { setNotFirstLaunch } = useAppLaunchStore();
  const { colors } = useTheme() as GreenRideTheme;
  useEffect(() => {
    (async () => {
      await setNotFirstLaunch();
    })();
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handleGetStarted = async () => {
    router.push("/onboarding");
  };

  const handleLogin = async () => {
    router.push("/onboarding");
  };

  return (
    <LinearGradient
      colors={["#18F88F", "#18F8E3"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
        <Text style={styles.loginText}>
          Already have an account?{" "}
          <Text style={styles.loginLink} onPress={handleLogin}>
            Log in
          </Text>
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  logo: {
    width: 400,
    height: 550,
  },
  bottomContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 60,
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 40,
    paddingVertical: 18,
    paddingHorizontal: 60,
    marginBottom: 24,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: "#3A1C4B",
    fontSize: 22,
    fontWeight: "600",
  },
  loginText: {
    color: "#3A1C4B",
    fontSize: 16,
    marginTop: 4,
  },
  loginLink: {
    color: "#3A1C4B",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
