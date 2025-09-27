import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useAuthStore } from "@/src/store/useAuthStore";

export default function Payment() {
  const { user } = useAuthStore();
  // Dummy payment methods
  const paymentMethods = [
    { id: 1, type: "Visa", last4: "1234" },
    { id: 2, type: "Mastercard", last4: "5678" },
  ];
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={styles.sectionTitle}>Payment Methods</Text>
        {paymentMethods.map((method) => (
          <View key={method.id} style={styles.methodRow}>
            <Text style={styles.methodType}>{method.type}</Text>
            <Text style={styles.methodLast4}>•••• {method.last4}</Text>
            <TouchableOpacity style={styles.removeBtn}>
              <Text style={styles.removeBtnText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ Add Payment Method</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 40,
  },
  header: {
    backgroundColor: "#00FF88",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    marginRight: 12,
    padding: 8,
  },
  backArrow: {
    fontSize: 32,
    color: "#222",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 36,
    color: "#222",
    fontWeight: "700",
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 22,
    color: "#3B185F",
    fontWeight: "400",
    marginBottom: 18,
  },
  methodRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F8F8",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  methodType: {
    fontSize: 20,
    color: "#3B185F",
    fontWeight: "600",
  },
  methodLast4: {
    fontSize: 20,
    color: "#3B185F",
    fontWeight: "400",
    marginLeft: 12,
  },
  removeBtn: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingVertical: 6,
    paddingHorizontal: 18,
    marginLeft: 16,
  },
  removeBtnText: {
    color: "#3B185F",
    fontSize: 16,
    fontWeight: "600",
  },
  addBtn: {
    backgroundColor: "#00FF88",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 18,
  },
  addBtnText: {
    color: "#3B185F",
    fontSize: 20,
    fontWeight: "600",
  },
});
