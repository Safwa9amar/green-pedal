import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Alert } from "react-native";
import { Text } from "react-native-paper";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useAuthStore, User } from "@/src/store";
import { useRouter } from "expo-router";
import { uploadIdCard } from "@/api";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";

const { width } = Dimensions.get("window");
const SCAN_SIZE = width * 0.7;

export default function UnlockBike() {
  const { user } = useAuthStore();
  const { idCardVerified } = user as User;
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const [uploading, setUploading] = useState(false);

  // فتح الكاميرا
  const pickFromCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      let photo = result.assets[0].uri;
      let type = result.assets[0].mimeType;
      await handleUpload(photo, type);
    }
  };

  // فتح المعرض
  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      let photo = result.assets[0].uri;
      let type = result.assets[0].mimeType;
      await handleUpload(photo, type);
    }
  };

  const handleUpload = async (photo: any, type: any) => {
    if (!photo) return;

    const cardPhoto = {
      name: "identity-card",
      type: type,
      uri: photo,
    } as any;

    setUploading(true);

    const formData = new FormData();
    formData.append("userId", user?.id ?? "");
    formData.append("idCard", cardPhoto);

    try {
      let res = await uploadIdCard(formData);

      setUploading(false);

      if (res.status === 200) {
        alert("Identity card successfully uploaded ✅");
      } else {
        const errorText = res.data;
        alert("Failed to upload. " + errorText);
      }
    } catch (err) {
      setUploading(false);
      console.error(err);
      alert("Upload failed ❌");
    }
  };

  const handleBarCodeScanned = (result: any) => {
    if (scanned) return;
    setScanned(true);
    // TODO: handle unlock logic with scanned data
    if (!idCardVerified) {
      return Alert.alert(
        "please upload your card identity",
        "To start your ride you should upload your card identity for your safety",
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
