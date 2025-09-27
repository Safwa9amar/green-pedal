import { useRouter } from "expo-router";
import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Avatar, Text } from "react-native-paper";

type DrawerItem = {
  label: string;
  value: string;
  right?: (user: any) => string | undefined;
  route: string;
};

const DRAWER_ITEMS: DrawerItem[] = [
  {
    label: "My Wallet",
    value: "wallet",
    right: (user: any) => (user ? `$ ${user.balance?.toFixed(2)}` : undefined),
    route: "/(profile)/my-wallet",
  },

  // {
  //   label: "Invite Friends",
  //   value: "invite",
  //   route: "/(profile)/invite",
  // },
  {
    label: "Support",
    value: "support",
    route: "/(profile)/support",
  },
  {
    label: "Settings",
    value: "settings",
    route: "/(profile)/settings",
  },
];

export default function CustomDrawer({
  user,
  onLogout,
}: {
  user: any;
  onLogout: () => void;
}) {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: "#fff", width: "100%" }}>
      <View
        style={{
          backgroundColor: "#A5D6A7",
          alignItems: "center",
          paddingTop: 60,
          paddingBottom: 32,
        }}
      >
        <Avatar.Image
          size={110}
          source={
            user?.avatarUrl
              ? { uri: user.avatarUrl }
              : require("@/assets/images/profile.png")
          }
          style={{ marginBottom: 16, backgroundColor: "#fff" }}
        />
        <Text
          style={{
            fontSize: 28,
            color: "#3B185F",
            fontWeight: "400",
            marginBottom: 8,
          }}
        >
          {user?.name || "User"}
        </Text>
      </View>
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
            onPress={() => {
              router.push(item.route as any);
            }}
          >
            <Text style={{ fontSize: 16, color: "#3B185F", fontWeight: "400" }}>
              {item.label}
            </Text>
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
        <Text style={{ fontSize: 16, color: "#3B185F", marginRight: 12 }}>
          ↩️
        </Text>
        <Text style={{ fontSize: 16, color: "#3B185F", fontWeight: "400" }}>
          Log Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}
