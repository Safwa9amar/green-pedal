import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const RegisterScreen = () => {
  // Google Auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_ID_CLEINT,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      // TODO: Send authentication.accessToken to your backend for registration/login
      // Example: router.push('/(tabs)');
    }
  }, [response]);
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleRegister = async () => {
    // TODO: Implement register logic
    if (email === "dashington@mail.com") {
      setEmailError("This email is already registered!");
      return;
    }
    setEmailError("");
    router.push("./register");
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        mode="flat"
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      <TextInput
        mode="flat"
        label="Name"
        value={name}
        onChangeText={setName}
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
        onPress={handleRegister}
        style={styles.button}
        theme={{ colors: { primary: "#00F5FF" } }}
        labelStyle={styles.buttonText}
      >
        Sign up
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
        style={{ marginTop: 16, borderRadius: 40 }}
        disabled={!request}
        theme={{
          colors: {
            primary: "#A5D6A7",
            outline: "#A5D6A7",
          },
        }}
      >
        Sign up with Google
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
    fontSize: 18,
    color: "#3A0A3A",
    textTransform: "none",
  },
  errorText: {
    color: "#FF3B5C",
    fontSize: 18,
    marginBottom: 8,
  },
});

export default RegisterScreen;
