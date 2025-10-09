import React from "react";
import { Modal, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import QRCode from "react-native-qrcode-svg";

interface ShowEndRentalQRCodeProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  rentalId: string;
}

export const ShowEndRentalQRCode: React.FC<ShowEndRentalQRCodeProps> = ({
  visible,
  onClose,
  userId,
  rentalId,
}) => {
  if (!visible || !userId || !rentalId) return null;

  const qrData = JSON.stringify({ userId, rentalId });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>
            Show this QR code to the station camera
          </Text>
          <QRCode value={qrData} size={224} />
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    width: 320,
    maxWidth: "90%",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  button: {
    marginTop: 24,
    borderRadius: 12,
    backgroundColor: "#43A047",
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default ShowEndRentalQRCode;
