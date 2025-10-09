import { useAuthStore } from "@/src/store";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-paper";
export function TabsHeader({ navigation, router }) {
  const { user } = useAuthStore();
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Avatar.Image
          size={40}
          source={
            user?.photo
              ? {
                  uri: `${process.env.EXPO_PUBLIC_SERVER_URL + user?.photo}`,
                  cache: "reload",
                }
              : { uri: user?.avatar }
          }
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.searchIcon}
        onPress={() => router.push("/search")}
      >
        <Ionicons name="search" size={36} color="#231942" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 24,
    marginTop: 50,
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
    marginTop: 8,
  },
});
