import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { useRouteStore } from "@/src/store/useRouteStore";

interface Station {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  bikes: any[];
}

interface StationInfoCardProps {
  visible: boolean;
  station?: Station;
  onNavigate?: () => void;
}

const StationInfoCard: React.FC<StationInfoCardProps> = ({
  visible,
  station,
  onNavigate,
}) => {
  const { distance, duration } = useRouteStore();

  if (!visible || !station) return null;

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{station.name}</Text>
        <Text style={styles.text}>
          🚲 Bikes available: {station.bikes?.length ?? 0}
        </Text>
        <Text style={styles.text}>
          📏 Distance: {distance ? (distance / 1000).toFixed(2) : "-"} km
        </Text>
        <Text style={styles.text}>
          ⏱ ETA: {duration ? Math.round(duration / 60 / 60) : "-"} hrs
        </Text>

        <Button
          mode="contained"
          buttonColor="#A5D6A7"
          textColor="black"
          style={styles.button}
          onPress={onNavigate}
        >
          Navigate
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
    position: "absolute",
    bottom: 0,
    paddingBottom: 120,
    left: 0,
    backgroundColor: "#E8F5E9",
    width: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: "center",
  },
  button: {
    marginTop: 16,
    borderRadius: 12,
  },
});

export default StationInfoCard;
