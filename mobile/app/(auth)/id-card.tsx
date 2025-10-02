import React, { useState } from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "@/src/store";
import { useRouter } from "expo-router";
import { uploadIdCard } from "@/api";

const FormData = global.FormData;

export default function IdCardPage() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [type, setType] = useState<string | undefined>(undefined);
  const [uploading, setUploading] = useState(false);
  const { token, user } = useAuthStore();
  const router = useRouter();

  // فتح الكاميرا
  const pickFromCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setPhoto(result.assets[0].uri);
      setType(result.assets[0].mimeType);
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
      setPhoto(result.assets[0].uri);
      setType(result.assets[0].mimeType);
    }
  };

  const handleUpload = async () => {
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
        setPhoto(null);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload your Identity Card</Text>

      {photo ? (
        <Image source={{ uri: photo }} style={styles.image} />
      ) : (
        <View style={styles.buttonRow}>
          <Button title="📷 Take Photo" onPress={pickFromCamera} />
          <Button title="🖼 Choose from Gallery" onPress={pickFromGallery} />
        </View>
      )}

      {photo && (
        <Button
          title={uploading ? "Uploading..." : "Submit"}
          onPress={handleUpload}
          disabled={uploading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  image: {
    width: 300,
    height: 200,
    marginBottom: 24,
    borderRadius: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
    marginBottom: 20,
  },
});
