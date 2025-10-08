import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { pricingOptions } from "@/constants/pricing";

export default function PricingInfoModal() {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      {/* Info Button */}
      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => setVisible(true)}
      >
        <MaterialIcons name="info-outline" size={24} color="#3B82F6" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Pricing Information</Text>
              <Pressable onPress={() => setVisible(false)}>
                <MaterialIcons name="close" size={24} color="#1E293B" />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
              {pricingOptions.map((option, index) => (
                <View key={index} style={styles.card}>
                  <Text style={styles.label}>{option.label}</Text>
                  <Text style={styles.price}>{option.price} DZD</Text>
                  <Text style={styles.unit}>per {option.unit}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  infoButton: {
    alignSelf: "flex-end",
    padding: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  scrollContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 16,
    width: "48%",
    marginBottom: 12,
    alignItems: "center",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3B82F6",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 6,
  },
  unit: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
});
