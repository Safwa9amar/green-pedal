import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { Searchbar, Text } from "react-native-paper";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import { useWilayaStore } from "@/src/store/useWilayaStore";
import { useRouteStore } from "@/src/store";
import { useUserLocation } from "@/src/store/useUserLocation";

export default function SearchScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { wilayas } = useWilayaStore();

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState(wilayas || []);
  const fadeAnim = useMemo(() => new Animated.Value(0), []);

  // Animate header fade-in
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!search.trim()) {
        setSuggestions(wilayas);
      } else {
        const filtered = wilayas.filter((item) =>
          item.admin_name.toLowerCase().includes(search.toLowerCase())
        );
        setSuggestions(filtered);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, wilayas]);

  const handleSelect = (item: any) => {
    router.push(`/(tabs)/stations-map?lat=${item.lat}&lng=${item.lng}`);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* SEARCH BAR */}
      <View style={styles.searchBoxContainer}>
        <Searchbar
          placeholder="Search for a city or wilaya..."
          value={search}
          onChangeText={setSearch}
          icon={() => <Ionicons name="search" size={24} color="#1B5E20" />}
          style={styles.searchbar}
          inputStyle={{ fontSize: 16 }}
        />
      </View>

      {/* RESULTS */}
      <View
        style={[styles.listContainer, { backgroundColor: colors.background }]}
      >
        {suggestions.length === 0 ? (
          <View style={styles.noResults}>
            <MaterialCommunityIcons
              name="map-search-outline"
              size={64}
              color="#A5D6A7"
            />
            <Text style={styles.noResultsText}>No locations found</Text>
          </View>
        ) : (
          <FlatList
            data={suggestions}
            keyExtractor={(item) =>
              `${item.admin_name}-${item.lat}-${item.lng}`
            }
            keyboardShouldPersistTaps="handled"
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                style={[
                  styles.listItem,
                  { backgroundColor: index % 2 === 0 ? "#FAFAFA" : "#F1F8E9" },
                ]}
              >
                <MaterialCommunityIcons
                  name="map-marker"
                  size={24}
                  color="#43A047"
                  style={{ marginRight: 12 }}
                />
                <Text style={styles.itemText}>{item.admin_name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
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
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1B5E20",
  },
  searchBoxContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  searchbar: {
    borderRadius: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  listContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
  },
  itemText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1B5E20",
  },
  noResults: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  noResultsText: {
    fontSize: 16,
    color: "#777",
    marginTop: 8,
  },
});
