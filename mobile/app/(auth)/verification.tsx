import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";

const VerificationScreen = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerify = async () => {
    setMsg(null);
    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `${
          process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.9:3000/api"
        }/auth/verify-email`,
        { email, code }
      );
      setMsg(res.data.message || "Email confirmed! You can now log in.");
      setTimeout(() => router.replace("/(auth)"), 1500);
    } catch (error: any) {
      let errMsg = "Verification failed. Please try again.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errMsg = error.response.data.message;
      }
      setMsg(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Email Verification</Text>
      <Text style={styles.infoText}>
        Enter the 6-digit code sent to your email to confirm your account.
      </Text>
      <TextInput
        mode="flat"
        label="Confirmation Code"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        style={styles.input}
        maxLength={6}
      />
      {msg && <Text style={styles.errorText}>{msg}</Text>}
      <Button
        mode="contained"
        onPress={handleVerify}
        style={styles.button}
        loading={isSubmitting}
        disabled={isSubmitting || code.length !== 6}
      >
        Verify
      </Button>
    </View>
  );
};

export default VerificationScreen;

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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  infoText: {
    fontSize: 16,
    color: "#888",
    marginBottom: 16,
    textAlign: "center",
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
  errorText: {
    color: "#FF3B5C",
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },
});
