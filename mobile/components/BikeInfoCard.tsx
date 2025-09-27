import { Bike } from "@/src/store/useBikeStore";
import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";

interface BikeInfoCardProps {
  visible: boolean;
  bike?: Bike;
  onStartRide?: () => void;
}

import { useRideStore } from "@/src/store";
const BikeInfoCard: React.FC<BikeInfoCardProps> = ({
  visible,
  bike,
  onStartRide,
}) => {
  const { startRide } = useRideStore();
  if (!visible || !bike) return null;
  return (
    <View style={styles.container}>
      <Image
        source={bike.image || require("@/assets/images/bike.png")}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={{ alignItems: "center" }}>
        <Text style={styles.name}>{bike.name}</Text>
        {bike.status === "AVAILABLE" ? (
          <Button
            mode="outlined"
            onPress={() => {
              // Simulate rental object for now
              startRide(
                {
                  id: Date.now(),
                  userId: 1,
                  bikeId: bike.id,
                  startTime: new Date().toISOString(),
                  status: "ONGOING",
                  bike,
                },
                bike
              );
              if (onStartRide) onStartRide();
            }}
            style={styles.button}
          >
            Start Ride
          </Button>
        ) : (
          <Text style={{ color: "red", marginTop: 10 }}>Not Available</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "#A5D6A7",
    width: "100%",
    height: 230,
    borderTopLeftRadius: 40,
    flexDirection: "row",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: "50%",
    height: "50%",
    marginRight: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  button: {
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
  },
});

export default BikeInfoCard;
