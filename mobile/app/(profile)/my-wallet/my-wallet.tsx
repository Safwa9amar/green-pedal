import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function MyWallet() {
  const { user } = useAuthStore();
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Pass Card */}
      <View style={styles.passCard}>
        <Image
          source={require("@/assets/images/bike.png")}
          style={styles.passImage}
          resizeMode="contain"
        />
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={styles.passTitle}>Weekly Pass</Text>
          <Text style={styles.passPrice}>$ 24.99</Text>
          <TouchableOpacity style={styles.purchaseBtn}>
            <Text style={styles.purchaseBtnText}>Purchase</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Balance and Top Up */}
      <View style={styles.rowBetween}>
        <View>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={styles.balanceValue}>
            $ {user?.balance?.toFixed(2) ?? "0.00"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.topUpBtn}
          onPress={() => router.push("/(profile)/my-wallet/top-up")}
        >
          <Text style={styles.topUpBtnText}>Top Up</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Row */}
      <TouchableOpacity
        style={styles.paymentRow}
        onPress={() => router.push("/(profile)/my-wallet/payment")}
      >
        <Text style={styles.paymentLabel}>Payment</Text>
        <Text style={styles.paymentArrow}>{">"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopStartRadius: 40,
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
  passCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 28,
    marginTop: -50,
    marginHorizontal: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    alignItems: "center",
  },
  passImage: {
    width: width * 0.32,
    height: width * 0.32,
    marginRight: 18,
  },
  passTitle: {
    fontSize: 20,
    color: "#3B185F",
    fontWeight: "400",
    marginBottom: 6,
  },
  passPrice: {
    fontSize: 20,
    color: "#3B185F",
    fontWeight: "700",
    marginBottom: 10,
  },
  purchaseBtn: {
    backgroundColor: "#00FF88",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 32,
    alignSelf: "flex-start",
  },
  purchaseBtnText: {
    color: "#3B185F",
    fontSize: 15,
    fontWeight: "600",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 36,
    marginHorizontal: 24,
    marginBottom: 18,
  },
  balanceLabel: {
    color: "#3B185F",
    fontSize: 21,
    fontWeight: "400",
    marginBottom: 2,
  },
  balanceValue: {
    color: "#3B185F",
    fontSize: 21,
    fontWeight: "700",
  },
  topUpBtn: {
    backgroundColor: "#fff",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingVertical: 10,
    paddingHorizontal: 32,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  topUpBtnText: {
    color: "#3B185F",
    fontSize: 15,
    fontWeight: "600",
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 24,
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: 8,
  },
  paymentLabel: {
    color: "#3B185F",
    fontSize: 21,
    fontWeight: "400",
  },
  paymentArrow: {
    color: "#3B185F",
    fontSize: 28,
    fontWeight: "400",
  },
});
