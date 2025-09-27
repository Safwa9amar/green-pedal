import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";

const { width } = Dimensions.get("window");
const AMOUNTS = [5, 10, 25, 50];

export default function TopUp() {
  const [selected, setSelected] = useState(AMOUNTS[0]);
  return (
    <View style={styles.container}>
      {/* Amount selection */}
      <View style={styles.amountGrid}>
        {AMOUNTS.map((amt) => (
          <TouchableOpacity
            key={amt}
            style={[
              styles.amountBox,
              selected === amt && styles.amountBoxSelected,
            ]}
            onPress={() => setSelected(amt)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.amountText,
                selected === amt && styles.amountTextSelected,
              ]}
            >
              $ {amt}
            </Text>
            {selected === amt && (
              <View style={styles.checkCircle}>
                <Text style={styles.checkMark}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Payment method */}
      <View style={styles.paymentRow}>
        <Text style={styles.paymentLabel}>MasterCard</Text>
        {/* <Image
          source={require("@/assets/images/mastercard.png")}
          style={styles.paymentLogo}
        /> */}
        <Text style={styles.paymentArrow}>{">"}</Text>
      </View>

      {/* Top Up Button */}
      <TouchableOpacity style={styles.topUpBtn}>
        <Text style={styles.topUpBtnText}>Top Up</Text>
      </TouchableOpacity>
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
    justifyContent: "center",
  },
  backBtn: {
    position: "absolute",
    left: 16,
    top: 60,
    padding: 8,
    zIndex: 2,
  },
  backArrow: {
    fontSize: 32,
    color: "#222",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 32,
    color: "#222",
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },
  amountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: -40,
    marginHorizontal: 24,
    marginBottom: 32,
  },
  amountBox: {
    width: width * 0.4,
    height: width * 0.22,
    backgroundColor: "#fff",
    borderRadius: 24,
    marginBottom: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 2,
    borderColor: "#fff",
    position: "relative",
  },
  amountBoxSelected: {
    borderColor: "#00FF88",
  },
  amountText: {
    fontSize: 32,
    color: "#3B185F",
    fontWeight: "700",
  },
  amountTextSelected: {
    color: "#3B185F",
  },
  checkCircle: {
    position: "absolute",
    bottom: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#00FF88",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  checkMark: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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
    fontSize: 22,
    fontWeight: "400",
  },
  paymentLogo: {
    width: 48,
    height: 32,
    resizeMode: "contain",
    marginRight: 8,
  },
  paymentArrow: {
    color: "#3B185F",
    fontSize: 28,
    fontWeight: "400",
  },
  topUpBtn: {
    backgroundColor: "#00F6FF",
    borderRadius: 40,
    paddingVertical: 18,
    alignItems: "center",
    marginHorizontal: 24,
    marginTop: 40,
    marginBottom: 16,
  },
  topUpBtnText: {
    color: "#222",
    fontSize: 22,
    fontWeight: "400",
  },
});
