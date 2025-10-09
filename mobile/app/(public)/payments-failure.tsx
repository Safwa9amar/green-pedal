import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Button } from "react-native-paper";

export default function PaymentFailure() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Image
        alt="logo"
        style={{ width: 200, height: 200, alignSelf: "center" }}
        source={require("@/assets/images/logo.png")}
      />
      <Text style={styles.title}>❌ Payment Failed</Text>
      <Text style={styles.message}>
        Something went wrong during the payment process. Please try again or
        contact support.
      </Text>
      <Button
        mode="contained"
        textColor="#1B5E20"
        theme={{ colors: { primary: "#C8E6C9" } }}
        onPress={() => router.replace("/")}
        icon={() => <AntDesign name="home" size={20} color="#1B5E20" />}
        style={{ margin: 20 }}
      >
        Go back
      </Button>
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
