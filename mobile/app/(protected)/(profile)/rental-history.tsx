import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";

export default function RentalHistory() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text>rental-history</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    position: "absolute",
    top: 150,
    borderTopLeftRadius: 50,
    width: "100%",
    height: "100%",
  },
  content: {
    padding: 20,
    paddingLeft: 30,
  },
});
