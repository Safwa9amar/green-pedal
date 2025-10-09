import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { Easing } from "react-native-reanimated";

interface BikeLoaderModalProps {
  visible?: boolean;
  onClose?: () => void;
}

export default function BikeLoaderModal({
  visible = true,
  onClose,
}: BikeLoaderModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Background overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      {/* Modal content */}
      <View style={styles.container}>
        {/* Animated Bike Icon */}
        <MotiView
          from={{ translateX: -20, opacity: 0.8 }}
          animate={{ translateX: 20, opacity: 1 }}
          transition={{
            loop: true,
            type: "timing",
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
          }}
          style={styles.iconWrapper}
        >
          <Ionicons name="bicycle-outline" size={60} color="#1976D2" />
        </MotiView>

        {/* Animated Text */}
        <MotiView
          from={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          transition={{
            loop: true,
            type: "timing",
            duration: 1500,
          }}
        >
          <Text style={styles.text}>Getting your ride ready...</Text>
        </MotiView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapper: {
    marginBottom: 16,
  },
  text: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
