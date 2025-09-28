import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import { useAuthStore } from "@/src/store";
import { login as apiLogin } from "@/api";

const LoginScreen = () => {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Google Auth
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_ID_CLEINT,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      // TODO: Send authentication.accessToken to your backend for login
      // Example: router.push('/(tabs)');
    }
  }, [response]);

  const handleLogin = async () => {
    await fetch("http://localhost:3000/api/auth/login");
    // login(
    //   {
    //     id: 1,
    //     balance: 23,
    //     email: "asdad@asdsad",
    //     name: "hamza safwan",
    //     role: "user",
    //     phone: "0674020244",
    //   },
    //   "asdasd"
    // );
  };
  useEffect(() => {
    isAuthenticated && router.push("/");
  }, [isAuthenticated]);
  return (
    <View style={styles.formContainer}>
      {/* <Text variant="displaySmall">Login, enjoy your ride </Text> */}
      <Image
        alt="logo"
        style={{ width: 200, height: 200, alignSelf: "center" }}
        source={require("@/assets/images/logo.png")}
      />
      <TextInput
        mode="flat"
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        mode="flat"
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        theme={{ colors: { primary: "#00F5FF" } }}
      >
        Log in
      </Button>
      <Text
        style={{
          marginTop: 20,
          textAlign: "center",
          color: "#888",
          fontSize: 16,
        }}
      >
        Or
      </Text>
      <Button
        mode="outlined"
        icon="google"
        onPress={() => promptAsync()}
        style={{ marginTop: 16 }}
        disabled={!request}
        theme={{
          colors: {
            primary: "#A5D6A7",
            outline: "#A5D6A7",
          },
        }}
      >
        Log in with Google
      </Button>
    </View>
  );
};
const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    borderTopStartRadius: 50,
    padding: 32,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  input: {
    fontSize: 18,
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  button: {
    borderRadius: 40,
    marginTop: 10,
    paddingVertical: 2,
  },
  buttonText: {
    fontSize: 16,
    color: "#3A0A3A",
    textTransform: "none",
  },
  errorText: {
    color: "#FF3B5C",
    fontSize: 18,
    marginBottom: 8,
  },
});

export default LoginScreen;
