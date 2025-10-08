import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function PaymentSuccess() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ Payment Successful!</Text>
      <Text style={styles.message}>
        Your payment has been processed successfully. Thank you for your
        recharge.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8F5E9",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: "#388E3C",
    textAlign: "center",
  },
});
