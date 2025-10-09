import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Linking,
  RefreshControl,
  Alert,
} from "react-native";
import { useAuthStore } from "@/src/store/useAuthStore";
import { paymentApi } from "@/src/services/api";
import { MaterialIcons } from "@expo/vector-icons";

export default function MyWallet() {
  const { user, isLoading, checkAuth, setLoading } = useAuthStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const handleTopUpPress = () => {
    setModalVisible(true);
  };

  const handlePaymentMethod = async (method: "Chargily" | "Stripe") => {
    try {
      if (!selectedAmount) {
        Alert.alert(
          "Select Amount",
          "Please select an amount before continuing."
        );
        return;
      }

      setModalVisible(false);
      setLoading(true);

      if (method === "Chargily") {
        const data: {
          success: boolean;
          checkout_url: string;
          checkout: any;
        } = await paymentApi.createChargilyCheckout(selectedAmount);

        if (data?.checkout_url) {
          Linking.openURL(data.checkout_url);
        } else {
          Alert.alert("Error", "Failed to create payment link.");
        }
      }

      if (method === "Stripe") {
        Alert.alert(
          "Coming soon",
          "Stripe payment gateway will be available soon."
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong while creating payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={checkAuth} />
        }
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.gradientBackground}>
            <Text style={styles.appTitle}>Green Pedal Wallet</Text>
            <Text style={styles.balanceAmount}>
              DZD {user?.balance?.toFixed(2) ?? "0.00"}
            </Text>
            <Text style={styles.balanceLabel}>Available Balance</Text>

            <TouchableOpacity
              style={styles.topUpButton}
              onPress={handleTopUpPress}
              disabled={isLoading}
            >
              <Text style={styles.topUpText}>Top Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* History Section */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Transaction History</Text>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#2E7D32"
              style={{ marginTop: 30 }}
            />
          ) : user?.balanceTransactions?.length === 0 ? (
            <Text style={styles.emptyText}>No transactions found.</Text>
          ) : (
            user?.balanceTransactions.map((item) => (
              <TransactionItem
                key={item.id}
                title={"Recharge"}
                date={new Date(item.createdAt).toLocaleDateString()}
                amount={item.amount}
                type={item.type}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Payment Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Amount</Text>

            <View style={styles.amountContainer}>
              {[500, 1000, 2000, 5000].map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={[
                    styles.amountBox,
                    selectedAmount === amount && styles.amountBoxSelected,
                  ]}
                  onPress={() => setSelectedAmount(amount)}
                >
                  <Text
                    style={[
                      styles.amountText,
                      selectedAmount === amount && styles.amountTextSelected,
                    ]}
                  >
                    {amount} DZD
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalSubtitle}>Select Payment Method</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handlePaymentMethod("Chargily")}
            >
              <Text style={styles.modalButtonText}>Chargily (ElDahabia)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handlePaymentMethod("Stripe")}
            >
              <Text style={styles.modalButtonText}>Stripe</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, { color: "#B71C1C" }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const TransactionItem = ({
  title,
  date,
  amount,
  type,
}: {
  title: string;
  date: string;
  amount: number;
  type: "RECHARGE" | "DEDUCTION";
}) => {
  const isCredit = type === "RECHARGE";
  return (
    <View
      style={[
        styles.transactionItem,
        {
          borderLeftWidth: 5,
          borderLeftColor: isCredit ? "#43A047" : "#E53935",
        },
      ]}
    >
      <View style={styles.iconContainer}>
        {isCredit ? (
          <MaterialIcons name="arrow-downward" size={28} color="#43A047" />
        ) : (
          <MaterialIcons name="arrow-upward" size={28} color="#E53935" />
        )}
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>{title}</Text>
        <Text style={styles.transactionDate}>{date}</Text>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          { color: isCredit ? "#1B5E20" : "#B71C1C" },
        ]}
      >
        {isCredit ? "+ " : "- "}DZD {amount.toFixed(2)}
      </Text>
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    position: "fixed",
  },
  balanceCard: {
    backgroundColor: "#2E7D32",
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    overflow: "hidden",
    elevation: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  gradientBackground: {
    alignItems: "center",
    paddingBottom: 50,
    backgroundColor: "#A5D6A7",
  },
  appTitle: {
    color: "#1B5E20",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  balanceAmount: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "900",
  },
  balanceLabel: {
    color: "#E8F5E9",
    fontSize: 17,
    marginBottom: 26,
  },
  topUpButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 44,
    borderRadius: 30,
    elevation: 5,
  },
  topUpText: {
    color: "#2E7D32",
    fontWeight: "700",
    fontSize: 16,
  },
  historySection: { marginTop: 35, paddingHorizontal: 20 },
  historyTitle: {
    color: "#1B5E20",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 15,
  },
  emptyText: { textAlign: "center", color: "#5F6368", marginTop: 20 },

  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 50,
    marginRight: 14,
    backgroundColor: "#A5D6A7",
  },
  transactionInfo: { flex: 1 },
  transactionTitle: { color: "#212121", fontSize: 16, fontWeight: "600" },
  transactionDate: { color: "#757575", fontSize: 13 },
  transactionAmount: { fontSize: 18, fontWeight: "700", color: "#2E7D32" },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 25,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    color: "#2E7D32",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#2E7D32",
    marginTop: 20,
    marginBottom: 10,
  },
  amountContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 10,
  },
  amountBox: {
    backgroundColor: "#E8F5E9",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    margin: 6,
  },
  amountBoxSelected: { backgroundColor: "#2E7D32" },
  amountText: { color: "#2E7D32", fontWeight: "700" },
  amountTextSelected: { color: "#FFFFFF" },
  modalButton: {
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#A5D6A7",
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
  },
  modalButtonText: { color: "#1B5E20", fontWeight: "700", fontSize: 16 },
  modalCancelButton: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#B71C1C",
  },
});
