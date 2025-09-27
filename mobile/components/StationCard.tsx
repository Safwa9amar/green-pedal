import React from "react";
import {
  StyleSheet,
  Image,
  View,
  ViewStyle,
  ImageBackground,
} from "react-native";
import { Text, Button, Chip } from "react-native-paper";

interface StationCardProps {
  name: string;
  distance: string;
  available: number;
  imageSource?: any;
}

const StationCard: React.FC<StationCardProps> = ({
  name,
  distance,
  available,
  imageSource,
}) => {
  return (
    <ImageBackground
      source={imageSource || require("@/assets/images/bike-station.png")}
      style={styles.card}
    >
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={styles.StationName}>{name}</Text>
        <Text style={styles.availableText}>{available} available bikes</Text>
        <View style={styles.badge}>
          <Text style={styles.distanceValue}>Distance {distance}</Text>
        </View>
      </View>
    </ImageBackground>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 12,
    paddingBottom: 0,
  },
  leftImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  badge: {
    width: 250,
    backgroundColor: "#A5D6A7",
    paddingHorizontal: 10,
    margin: 10,
    borderRadius: 20,
    alignItems: "center",
    alignSelf: "center",
  },
  cover: {
    width: "100%",
    height: 90,
    backgroundColor: "transparent",
    marginTop: 8,
    borderRadius: 16,
  },
  StationName: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 2,
    textAlign: "center",
  },
  distanceText: {
    fontSize: 18,
    color: "#fff",
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
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 4,
  },
  button: {
    borderRadius: 20,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 0,
    marginTop: 0,
  },
});

export default StationCard;
