import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Alert } from "react-native";
import { Text } from "react-native-paper";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useAuthStore, User } from "@/src/store";
import { useNavigation, useRouter } from "expo-router";
import { getProfile, uploadIdCard } from "@/api";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import { useIdCardVerification } from "@/hooks/useIdCardVerification";
import { useIsFocused } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const SCAN_SIZE = width * 0.7;

export default function UnlockBike() {
  const isFocused = useIsFocused();
  const router = useRouter();
  const { user, login, token } = useAuthStore();
  const { idCardVerified } = user as User;
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation();
  const { pickFromCamera, pickFromGallery, uploading } =
    useIdCardVerification();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "",
    });
  }, []);

  const handleBarCodeScanned = (result: any) => {
    if (scanned) return;
    if (!idCardVerified) {
      return Alert.alert(
        "please upload your card identity",
        "To start your ride you should upload your national card identity ",
        [
          {
            text: "dismise",
            style: "cancel",
          },
          {
            text: "upload",
            onPress: pickFromGallery,
          },
          {
            text: "Camera",
            onPress: pickFromCamera,
          },
        ]
      );
    }
    setScanned(true);

    router.push(`/(tabs)/unlock/bike-details?${result.data}`);
  };

  useEffect(() => {
    isFocused && setScanned(false);
  }, [isFocused]);

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
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {uploading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            style={{
              width: 140,
              height: 150,
              borderRadius: 100,
            }}
            source={require("@/assets/images/gif/bike-animation.gif")}
          />
          <Text>Uploading your ID card please wait a momnet</Text>
        </View>
      ) : (
        <>
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
        </>
      )}
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
