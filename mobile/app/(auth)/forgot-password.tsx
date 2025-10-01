import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "react-native-paper";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleRequestReset = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/request-reset`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      console.log(res.status);

      if (res.ok) {
        Alert.alert("Check your email", data.message);
        setStep("confirm");
      } else {
        if (res.status === 404) {
          Alert.alert(
            "Account not registered",
            "This account is not registered. Please sign up."
          );
        } else {
          Alert.alert("Error", data.message || "Failed to send reset code.");
        }
      }
    } catch (e) {
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/confirm-reset`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code, newPassword }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        Alert.alert("Success", data.message, [
          { text: "OK", onPress: () => router.replace("/(auth)/login") },
        ]);
      } else {
        Alert.alert("Error", data.message || "Failed to reset password.");
      }
    } catch (e) {
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      {step === "request" ? (
        <>
          <Text style={styles.label}>Enter your email address:</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
          />
          <Button
            style={{
              backgroundColor: "#A5D6A7",
            }}
            textColor="white"
            loading={loading}
            onPress={handleRequestReset}
          >
            {loading ? "Sending..." : "Send Reset Code"}
          </Button>
        </>
      ) : (
        <>
          <Text style={styles.label}>Enter the code sent to your email:</Text>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            placeholder="Reset Code"
            autoCapitalize="none"
          />
          <Text style={styles.label}>New Password:</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New Password"
            secureTextEntry
          />
          <Text style={styles.label}>Confirm New Password:</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm Password"
            secureTextEntry
          />
          <Button
            onPress={handleConfirmReset}
            disabled={loading || !code || !newPassword || !confirmPassword}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
    borderTopStartRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
});
