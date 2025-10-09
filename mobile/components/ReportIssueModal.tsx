import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import { Colors } from "@/constants/theme";

interface ReportIssueModalProps {
  visible: boolean;
  onCancel: () => void;
  onReport: () => void;
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  visible,
  onCancel,
  onReport,
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
            name="alert-circle"
            size={32}
            color={Colors.light.warning}
          />
          <Text style={styles.modalTitle}>Report Issue</Text>
        </View>

        <Text style={styles.modalMessage}>
          What issue are you experiencing with your ride?
        </Text>

        <View style={styles.issueOptions}>
          <TouchableOpacity style={styles.issueOption}>
            <Ionicons name="bicycle" size={20} color={Colors.light.text} />
            <Text style={styles.issueOptionText}>Bike Problem</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.issueOption}>
            <Ionicons name="map" size={20} color={Colors.light.text} />
            <Text style={styles.issueOptionText}>Navigation Issue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.issueOption}>
            <Ionicons name="card" size={20} color={Colors.light.text} />
            <Text style={styles.issueOptionText}>Payment Problem</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.issueOption}>
            <Ionicons name="help-circle" size={20} color={Colors.light.text} />
            <Text style={styles.issueOptionText}>Other</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.modalActions}>
          <Button
            mode="outlined"
            onPress={onCancel}
            style={styles.modalButton}
            labelStyle={styles.modalButtonLabel}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={onReport}
            style={[styles.modalButton, styles.confirmButton]}
            labelStyle={styles.confirmButtonLabel}
          >
            Report
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
  modalMessage: {
    fontSize: 16,
    color: Colors.light.text,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  issueOptions: {
    marginBottom: 24,
    gap: 12,
  },
  issueOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  issueOptionText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
    marginLeft: 12,
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
  confirmButton: {
    backgroundColor: Colors.light.error,
  },
  confirmButtonLabel: {
    color: Colors.light.card,
  },
});
