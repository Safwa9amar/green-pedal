import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function PaymentFailure() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>❌ Payment Failed</Text>
      <Text style={styles.message}>
        Something went wrong during the payment process. Please try again or
        contact support.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFEBEE",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#C62828",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: "#B71C1C",
    textAlign: "center",
  },
});
