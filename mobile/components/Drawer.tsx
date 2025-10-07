import { useAuthStore } from "@/src/store";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Avatar, Text } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { usersAPI } from "@/src/services/api";

type DrawerItem = {
  label: string;
  value: string;
  icon: React.ReactNode;
  right?: (user: any) => string | undefined;
  route: string;
};

const DRAWER_ITEMS: DrawerItem[] = [
  {
    label: "My Wallet",
    value: "wallet",
    icon: <MaterialCommunityIcons name="wallet" size={22} color="#3B185F" />,
    right: (user: any) =>
      user ? `DZD ${user.balance?.toFixed(2)}` : undefined,
    route: "/(profile)/my-wallet",
  },
  {
    label: "Rental History",
    value: "history",
    icon: <MaterialCommunityIcons name="history" size={22} color="#3B185F" />,
    route: "/(profile)/rental-history",
  },
  {
    label: "Support",
    value: "support",
    icon: <MaterialIcons name="support-agent" size={22} color="#3B185F" />,
    route: "/(profile)/support",
  },
  {
    label: "Privacy & Policy",
    value: "privacy-policy",
    icon: (
      <MaterialCommunityIcons name="shield-lock" size={22} color="#3B185F" />
    ),
    route: "/(profile)/privacy-policy",
  },
  {
    label: "Frequent Questions",
    value: "faq",
    icon: <MaterialIcons name="help-outline" size={22} color="#3B185F" />,
    route: "/(profile)/faq",
  },
  {
    label: "Settings",
    value: "settings",
    icon: <MaterialIcons name="settings" size={22} color="#3B185F" />,
    route: "/(profile)/settings",
  },
];

export default function CustomDrawer({ onLogout }: { onLogout: () => void }) {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

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

      const formData = new FormData();
      formData.append("photo", { uri, type, name } as any);

      const data = await usersAPI.updateProfile(formData);
      setUser({ ...data?.user, photo: `${data?.user?.photo}?v=${Date.now()}` });
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        width: "100%",
      }}
    >
      {/* Header */}
      <View
        style={{
          backgroundColor: "#A5D6A7",
          alignItems: "center",
          paddingTop: 60,
          paddingBottom: 32,
        }}
      >
        <TouchableOpacity
          style={{
            position: "relative",
            borderWidth: 5,
            borderColor: "#2E7D32",
            borderRadius: 100,
            aspectRatio: 1 / 1,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}
          onPress={handleImagePick}
        >
          <MaterialCommunityIcons
            style={{
              position: "absolute",
              zIndex: 10,
              right: 0,
              bottom: 0,
            }}
            name="camera"
            size={36}
            color={"#FFF"}
          />
          <Avatar.Image
            size={150}
            source={
              user?.photo
                ? {
                    uri: `${process.env.EXPO_PUBLIC_SERVER_URL + user?.photo}`,
                  }
                : { uri: user?.avatar }
            }
            style={{
              backgroundColor: "#fff",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(profile)/settings")}>
          <Text
            style={{
              fontSize: 20,
              color: "#3B185F",
              fontWeight: "400",
              marginBottom: 8,
              textDecorationLine: "underline",
              textTransform: "capitalize",
            }}
          >
            {user?.name || "User"}
            <MaterialCommunityIcons name="pencil" size={20} />
          </Text>
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <View
        style={{
          backgroundColor: "#fff",
          borderTopLeftRadius: 40,
          flex: 1,
          marginTop: -30,
          paddingTop: 30,
        }}
      >
        {DRAWER_ITEMS.map((item, idx) => (
          <TouchableOpacity
            key={item.value}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 32,
              paddingVertical: 22,
              borderBottomWidth: idx < DRAWER_ITEMS.length - 1 ? 1 : 0,
              borderBottomColor: "#eee",
            }}
            activeOpacity={0.7}
            onPress={() => router.push(item.route as any)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {item.icon}
              <Text
                style={{
                  fontSize: 16,
                  color: "#3B185F",
                  fontWeight: "400",
                  marginLeft: 12,
                }}
              >
                {item.label}
              </Text>
            </View>
            {item.right && (
              <Text
                style={{ fontSize: 16, color: "#3B185F", fontWeight: "700" }}
              >
                {item.right(user)}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 32,
          marginTop: 16,
        }}
        onPress={onLogout}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name="logout"
          size={22}
          color="#3B185F"
          style={{ marginRight: 12 }}
        />
        <Text style={{ fontSize: 16, color: "#3B185F", fontWeight: "400" }}>
          Log Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}
