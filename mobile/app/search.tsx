import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Searchbar, Text } from "react-native-paper";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useTheme } from "@react-navigation/native";
import { GreenRideTheme } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useWilayaStore } from "@/src/store/useWilayaStore";

// Use wilayas from context for suggestions
//TODO : search bar should get real data from maps based on current location, or suggested list
export default function SearchScreen() {
  const router = useRouter();
  const { colors } = useTheme() as GreenRideTheme;
  const navigation = useNavigation();
  const { wilayas } = useWilayaStore();
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState(wilayas);
  React.useEffect(() => {
    setSuggestions(wilayas || []);
  }, [wilayas]);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (!text) {
      setSuggestions(wilayas || []);
      return;
    }
    setSuggestions(wilayas);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#A5D6A7" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#231942" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.searchBoxContainer}>
        <Searchbar
          style={{ marginBlock: 10 }}
          placeholder="Search"
          value={search}
          icon={() => <Ionicons name="location" size={28} color="#231942" />}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={suggestions}
        style={[styles.list, { backgroundColor: colors.background }]}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push(
                `/(map)?wilaya=${item.admin_name}&lat=${item.lat}&lng=${item.lng}`
              )
            }
          >
            <Text style={styles.listItem}>{item.admin_name}</Text>
            <View style={styles.divider} />
          </TouchableOpacity>
        )}
        keyboardShouldPersistTaps="handled"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#231942",
    textAlign: "center",
  },
  searchBoxContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 2,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  searchBoxText: {
    fontSize: 20,
    color: "#231942",
    fontWeight: "500",
  },
  input: {
    flex: 1,
    fontSize: 20,
    color: "#231942",
    fontWeight: "500",
    padding: 0,
    margin: 0,
  },
  list: {
    marginTop: 16,
    borderTopLeftRadius: 50,
    padding: 20,
  },
  listItem: {
    fontSize: 22,
    color: "#231942",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginHorizontal: 24,
  },
});
