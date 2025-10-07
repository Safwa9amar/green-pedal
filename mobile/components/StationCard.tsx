import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text, Avatar } from "react-native-paper";

interface StationCardProps {
  name: string;
  distance: string;
  available: number;
  imageSource?: any;
  onPress?: () => void;
}

const StationCard: React.FC<StationCardProps> = ({
  name,
  distance,
  available,
  imageSource,
  onPress,
}) => {
  return (
    <Card style={styles.card} onPress={onPress} mode="elevated">
      <Card.Cover
        source={imageSource || require("@/assets/images/bike-station.png")}
        style={styles.cover}
      />
      <Card.Title
        title={name}
        subtitle={`${available} available bikes`}
        left={(props) => (
          <Avatar.Icon {...props} icon="bike" style={styles.icon} />
        )}
        titleStyle={styles.title}
        subtitleStyle={styles.subtitle}
      />
      <Card.Content>
        <View style={styles.badge}>
          <Text style={styles.distanceText}> Distance: {distance}</Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 8,
    alignSelf: "stretch",
    maxHeight: 350,
  },
  cover: {
    height: 180,
  },
  icon: {
    backgroundColor: "#A5D6A7",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E7D32",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
  },
  badge: {
    backgroundColor: "#A5D6A7",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  distanceText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default StationCard;
