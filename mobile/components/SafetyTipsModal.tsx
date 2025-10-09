import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import { Colors } from "@/constants/theme";

interface SafetyTipsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SafetyTipsModal: React.FC<SafetyTipsModalProps> = ({
  visible,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "timing", duration: 200 }}
      style={styles.modalOverlay}
    >
      <MotiView
        from={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "timing", duration: 300 }}
        style={styles.modalContent}
      >
        <View style={styles.modalHeader}>
          <Ionicons
            name="shield-checkmark"
            size={32}
            color={Colors.light.success}
          />
          <Text style={styles.modalTitle}>Safety Tips</Text>
        </View>

        <View style={styles.safetyTipsContainer}>
          <View style={styles.safetyTip}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={Colors.light.success}
            />
            <Text style={styles.safetyTipText}>Always wear a helmet</Text>
          </View>
          <View style={styles.safetyTip}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={Colors.light.success}
            />
            <Text style={styles.safetyTipText}>
              Follow traffic rules and signals
            </Text>
          </View>
          <View style={styles.safetyTip}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={Colors.light.success}
            />
            <Text style={styles.safetyTipText}>
              Stay visible with lights at night
            </Text>
          </View>
          <View style={styles.safetyTip}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={Colors.light.success}
            />
            <Text style={styles.safetyTipText}>
              Keep both hands on handlebars
            </Text>
          </View>
          <View style={styles.safetyTip}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={Colors.light.success}
            />
            <Text style={styles.safetyTipText}>
              Be aware of your surroundings
            </Text>
          </View>
        </View>

        <View style={styles.modalActions}>
          <Button
            mode="contained"
            onPress={onClose}
            style={styles.modalButton}
            labelStyle={styles.modalButtonLabel}
          >
            Got it!
          </Button>
        </View>
      </MotiView>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 320,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.text,
    marginTop: 8,
  },
  safetyTipsContainer: {
    marginBottom: 24,
    gap: 12,
  },
  safetyTip: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: Colors.light.surface,
    borderRadius: 8,
  },
  safetyTipText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
    marginLeft: 12,
    flex: 1,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
  },
  modalButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
});
