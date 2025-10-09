import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { getProfile, uploadIdCard } from "@/src/api";
import { useAuthStore } from "@/src/store";

export function useIdCardVerification() {
  const { user, login, token } = useAuthStore();
  const [uploading, setUploading] = useState(false);

  const pickFromCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const photo = result.assets[0].uri;
      const type = result.assets[0].mimeType;
      await handleUpload(photo, type);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const photo = result.assets[0].uri;
      const type = result.assets[0].mimeType;
      await handleUpload(photo, type);
    }
  };

  const handleUpload = async (photo: string, type?: string) => {
    if (!photo) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("userId", user?.id ?? "");
    formData.append("idCard", {
      name: "identity-card",
      type: type || "image/jpeg",
      uri: photo,
    } as any);

    try {
      const res = await uploadIdCard(formData);
      setUploading(false);

      if (res.status === 200) {
        alert("✅ Identity card uploaded successfully!");
        const profileRes = await getProfile();
        if (profileRes.status === 200) {
          const updatedUser = profileRes.data;
          if (token) login(updatedUser, token);
        }
      } else {
        alert("❌ Upload failed: " + res.data);
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
      setUploading(false);
    }
  };

  return {
    uploading,
    pickFromCamera,
    pickFromGallery,
    handleUpload,
  };
}
