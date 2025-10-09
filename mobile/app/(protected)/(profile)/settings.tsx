import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useForm } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { TextInput, Button, HelperText, Divider } from "react-native-paper";
import { useAuthStore } from "@/src/store/useAuthStore";
import api, { usersAPI } from "@/src/services/api";
import { useIdCardVerification } from "@/src/hooks/useIdCardVerification";

export default function ProfileSettings() {
  const { user, setUser, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const { uploading, pickFromCamera, pickFromGallery, handleUpload } =
    useIdCardVerification();

  const photoUri =
    user?.photo && `${process.env.EXPO_PUBLIC_SERVER_URL + user?.photo}`;
  const [avatar, setAvatar] = useState(photoUri || user?.avatar || "");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleInputChange = (name: string, value: string) => {
    setValue(name as any, value, { shouldValidate: true });
  };

  useEffect(() => {
    if (uploading) setLoading(true);
    else setLoading(false);
  }, [uploading]);

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#777" }}>
          Please log in to view your profile
        </Text>
      </View>
    );
  }

  // 🖼️ Handle profile image upload
  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const uri = asset.uri;
      const type = asset.mimeType || "image/jpeg";
      const name = `profile-photo.${type.split("/")[1]}`;

      setAvatar(uri);
      const formData = new FormData();
      formData.append("photo", { uri, type, name } as any);

      const data = await usersAPI.updateProfile(formData);
      setUser({ ...data?.user, photo: `${data?.user?.photo}?v=${Date.now()}` });
    }
  };

  // 🧾 Handle profile info save
  const onSaveProfile = async (formData: any) => {
    try {
      setLoading(true);
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("phone", formData.phone);

      const data = await usersAPI.updateProfile(dataToSend);
      setUser(data?.user);

      Alert.alert(
        "✅ Profile Updated",
        "Your profile was updated successfully!"
      );
    } catch (err) {
      Alert.alert("❌ Error", "Failed to update profile. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // 🔑 Handle password change
  const onChangePassword = async (formData: any) => {
    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert("Error", "New passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/change-password", {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      if (res.status === 200) {
        Alert.alert("✅ Password Changed", "Your password has been updated!");
        setShowPasswordSection(false);
      } else {
        Alert.alert(
          "❌ Error",
          res.data.message || "Failed to change password"
        );
      }
    } catch (error: any) {
      Alert.alert(
        "❌ Error",
        error?.response?.data?.message ||
          "Old password incorrect or network issue."
      );
    } finally {
      setLoading(false);
    }
  };

  // 🪪 Handle ID card upload
  const handleUploadIdCard = async () => {
    Alert.alert(
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
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Do you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Photo */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={handleImagePick}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <View style={styles.editIcon}>
            <Ionicons name="camera" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Name */}
      <TextInput
        label="Full Name"
        mode="outlined"
        value={watch("name")}
        onChangeText={(v) => handleInputChange("name", v)}
        error={!!errors.name}
        {...register("name", { required: "Full name is required" })}
        style={styles.input}
      />
      {errors.name && (
        <HelperText type="error">{errors.name.message}</HelperText>
      )}

      {/* Email */}
      <TextInput
        label="Email"
        mode="outlined"
        value={user.email}
        editable={false}
        style={[styles.input, styles.readonly]}
      />

      {/* Phone */}
      <TextInput
        label="Phone"
        mode="outlined"
        value={watch("phone")}
        keyboardType="phone-pad"
        onChangeText={(v) => handleInputChange("phone", v)}
        error={!!errors.phone}
        {...register("phone", {
          required: "Phone number is required",
          pattern: {
            value: /^[0-9]{8,15}$/,
            message: "Invalid phone number",
          },
        })}
        style={styles.input}
      />
      {errors.phone && (
        <HelperText type="error">{errors.phone.message}</HelperText>
      )}

      {/* 🪪 ID Card Verification */}
      <View style={styles.idCardBox}>
        <Ionicons
          name={user.idCardVerified ? "checkmark-circle" : "alert-circle"}
          size={22}
          color={user.idCardVerified ? "#4CAF50" : "#FFC107"}
        />
        <Text style={styles.idCardText}>
          {user.idCardVerified
            ? "ID Card Verified"
            : "ID Card Pending Verification"}
        </Text>

        {!user.idCardVerified && (
          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={handleUploadIdCard}
            disabled={uploading || loading}
          >
            {uploading || loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff" }}>Upload ID Card</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit(onSaveProfile)}
        loading={loading}
        disabled={loading}
        style={styles.saveBtn}
      >
        Save Profile
      </Button>

      {/* Password Section */}
      <TouchableOpacity
        style={styles.changePasswordToggle}
        onPress={() => setShowPasswordSection((prev) => !prev)}
      >
        <Text style={{ color: "#4CAF50", fontWeight: "600" }}>
          {showPasswordSection ? "Cancel" : "Change My Password"}
        </Text>
      </TouchableOpacity>

      {showPasswordSection && (
        <View style={styles.passwordSection}>
          {/* Password Inputs same as before */}
          <TextInput
            label="Old Password"
            mode="outlined"
            secureTextEntry
            value={watch("oldPassword")}
            onChangeText={(v) => handleInputChange("oldPassword", v)}
            error={!!errors.oldPassword}
            {...register("oldPassword", {
              required: "Old password is required",
            })}
            style={styles.input}
          />
          {errors.oldPassword && (
            <HelperText type="error">{errors.oldPassword.message}</HelperText>
          )}

          <TextInput
            label="New Password"
            mode="outlined"
            secureTextEntry
            value={watch("newPassword")}
            onChangeText={(v) => handleInputChange("newPassword", v)}
            error={!!errors.newPassword}
            {...register("newPassword", {
              required: "New password is required",
              minLength: { value: 6, message: "At least 6 characters" },
            })}
            style={styles.input}
          />
          {errors.newPassword && (
            <HelperText type="error">{errors.newPassword.message}</HelperText>
          )}

          <TextInput
            label="Confirm Password"
            mode="outlined"
            secureTextEntry
            value={watch("confirmPassword")}
            onChangeText={(v) => handleInputChange("confirmPassword", v)}
            error={!!errors.confirmPassword}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (v) =>
                v === watch("newPassword") || "Passwords do not match",
            })}
            style={styles.input}
          />
          {errors.confirmPassword && (
            <HelperText type="error">
              {errors.confirmPassword.message}
            </HelperText>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit(onChangePassword)}
            loading={loading}
            disabled={loading}
            style={[styles.saveBtn, { backgroundColor: "#4CAF50" }]}
          >
            Change Password
          </Button>
        </View>
      )}

      {/* Logout */}
      <Button
        mode="contained-tonal"
        onPress={handleLogout}
        style={styles.logoutBtn}
      >
        Logout
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    position: "fixed",
    borderTopLeftRadius: 50,
    width: "100%",
    height: "100%",
  },
  content: { padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  avatarContainer: { alignItems: "center", marginBottom: 20 },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 5,
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    padding: 5,
  },
  input: { marginBottom: 10, backgroundColor: "#fff" },
  readonly: { backgroundColor: "#f3f3f3" },
  saveBtn: { backgroundColor: "#4CAF50", marginTop: 10, borderRadius: 10 },
  logoutBtn: { marginTop: 20, backgroundColor: "#FF5252", borderRadius: 10 },
  changePasswordToggle: { alignSelf: "center", marginVertical: 15 },
  passwordSection: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  idCardBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    justifyContent: "space-between",
  },
  idCardText: { fontSize: 14, marginLeft: 10, flex: 1 },
  uploadBtn: {
    backgroundColor: "#4CAF50",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
});
