// components/StationCard.tsx
import React from "react";
import {
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";

interface StationCardProps {
  name: string;
  distance: string;
  available: number;
  imageSource?: any;
  onPress?: () => void; // ✅ Add this
}

const StationCard: React.FC<StationCardProps> = ({
  name,
  distance,
  available,
  imageSource,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <ImageBackground
        source={imageSource || require("@/assets/images/bike-station.png")}
        style={styles.card}
      >
        <View style={styles.overlay}>
          <Text style={styles.StationName}>{name}</Text>
          <Text style={styles.availableText}>{available} available bikes</Text>
          <View style={styles.badge}>
            <Text style={styles.distanceValue}>Distance {distance}</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 300,
    height: 320,
    marginLeft: 14,
    marginTop: 16,
    borderRadius: 32,
    justifyContent: "center",
    overflow: "hidden",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    width: 250,
    backgroundColor: "#A5D6A7",
    paddingHorizontal: 10,
    margin: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  StationName: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 2,
    textAlign: "center",
  },
  distanceValue: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#fff",
  },
  availableText: {
    fontSize: 18,
    color: "#fff",
    marginTop: 8,
    marginBottom: 4,
    textAlign: "center",
  },
});

export default StationCard;
