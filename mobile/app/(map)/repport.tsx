import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";

const REPORT_OPTIONS = [
  { label: "Broken bike" },
  { label: "Unauthorized lock" },
];

export default function Repport() {
  return (
    <View style={styles.container}>
      {REPORT_OPTIONS.map((option, idx) => (
        <TouchableOpacity
          key={option.label}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingBottom: 40,
  },
  button: {
    width: "90%",
    backgroundColor: "#A5D6A7",
    borderRadius: 40,
    paddingVertical: 22,
    marginBottom: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "400",
    color: "#222",
  },
});
