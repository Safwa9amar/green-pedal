import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import { CameraView, useCameraPermissions } from "expo-camera";

const { width } = Dimensions.get("window");
const SCAN_SIZE = width * 0.7;

export default function UnlockBike() {
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handleBarCodeScanned = (result: any) => {
    if (scanned) return;
    setScanned(true);
    // TODO: handle unlock logic with scanned data
    alert(`QR code scanned: ${result.data}`);
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>No access to camera</Text>
        <Text
          onPress={requestPermission}
          style={{ color: "#1976D2", marginTop: 16 }}
        >
          Grant Permission
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#A5D6A7" }}>
      <View style={styles.cameraContainer}>
        <CameraView
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.overlay}>
          <View style={styles.scanBox} />
        </View>
      </View>
      <View style={styles.bottomSheet}>
        <Text style={styles.bottomText}>Scan QR code on bike</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  scanBox: {
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    borderWidth: 4,
    borderColor: "#fff",
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.0)",
  },
  bottomSheet: {
    width: "100%",
    backgroundColor: "#A5D6A7",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingVertical: 32,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
  bottomText: {
    fontSize: 22,
    color: "#222",
    fontWeight: "400",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#A5D6A7",
  },
});
