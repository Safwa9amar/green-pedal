import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button } from "react-native-paper";

export default function VerificationScreen({ navigation, route }: any) {
  const [code, setCode] = useState(["", "", "", ""]);

  const handleChange = (value: string, idx: number) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[idx] = value;
      setCode(newCode);
      // Focus next input if value entered
      if (value && idx < 3) {
        const nextInput = `codeInput${idx + 1}`;
        // @ts-ignore
        refs[nextInput]?.focus();
      }
    }
  };

  const handleContinue = () => {
    // TODO: Implement verification logic
    navigation.navigate("Login");
  };

  // Refs for input focus
  const refs: any = {};

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#A5D6A7" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Verification</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.codeRow}>
          {[0, 1, 2, 3].map((idx) => (
            <TextInput
              key={idx}
              mode="outlined"
              keyboardType="number-pad"
              maxLength={1}
              value={code[idx]}
              onChangeText={(val) => handleChange(val, idx)}
              textAlign="center"
            />
          ))}
        </View>
        <Text style={styles.infoText}>
          Enter the code sent to your phone number
        </Text>
        <Button
          mode="contained"
          onPress={handleContinue}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Continue
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 80,
    paddingBottom: 32,
    paddingHorizontal: 24,
    backgroundColor: "#A5D6A7",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#3A0A3A",
  },
  formContainer: {
    backgroundColor: "#fff",
    margin: 24,
    borderRadius: 40,
    padding: 32,
    marginTop: -40,
    alignItems: "center",
  },
  codeRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  codeInput: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    fontSize: 32,
    marginHorizontal: 8,
    backgroundColor: "#f8f8f8",
    color: "#3A0A3A",
  },
  infoText: {
    color: "#3A0A3A",
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#00F6FF",
    borderRadius: 40,
    paddingVertical: 20,
    paddingHorizontal: 60,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    fontSize: 28,
    color: "#3A0A3A",
    fontWeight: "bold",
  },
});
