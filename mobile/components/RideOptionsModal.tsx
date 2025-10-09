import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { MotiScrollView, MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { Portal, Modal, List } from "react-native-paper";
import { Colors } from "@/constants/theme";

const { height: screenHeight } = Dimensions.get("window");

interface RideOptionsModalProps {
  visible: boolean;
  onDismiss: () => void;
  isActive: boolean;
  pulseAnim: any;
  formattedElapsedTime: string;
  displayCost: number | undefined;
  onEndRide: () => void;
  onCenterMap: () => void;
  onFindStation: () => void;
  onShareLocation: () => void;
  onRideDetails: () => void;
  onSafetyTips: () => void;
  onContactSupport: () => void;
  onReportIssue: () => void;
  onEmergency: () => void;
}

export const RideOptionsModal: React.FC<RideOptionsModalProps> = ({
  visible,
  onDismiss,
  isActive,
  pulseAnim,
  formattedElapsedTime,
  displayCost,
  onEndRide,
  onCenterMap,
  onFindStation,
  onShareLocation,
  onRideDetails,
  onSafetyTips,
  onContactSupport,
  onReportIssue,
  onEmergency,
}) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.dropdownContainer}
      >
        <MotiScrollView
          from={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "timing", duration: 300 }}
          style={styles.dropdownContent}
        >
          {/* Header with Ride Status */}
          <View style={styles.dropdownHeader}>
            <View style={styles.headerLeft}>
              <MotiView
                animate={{
                  scale: isActive ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  type: "timing",
                  duration: 1000,
                  loop: isActive,
                }}
                style={[
                  styles.headerStatusDot,
                  {
                    backgroundColor: isActive
                      ? Colors.light.success
                      : Colors.light.warning,
                  },
                ]}
              />
              <View>
                <Text style={styles.dropdownTitle}>Ride Options</Text>
                <Text style={styles.dropdownSubtitle}>
                  {isActive ? "Active Ride" : "Ride Completed"}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.light.icon} />
            </TouchableOpacity>
          </View>

          {/* Primary Actions */}
          <List.Section>
            <List.Subheader style={styles.sectionHeader}>
              Primary Actions
            </List.Subheader>

            <List.Item
              title="End Ride"
              description={
                isActive ? "Stop your current ride" : "Ride already ended"
              }
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="stop-circle"
                  color={Colors.light.error}
                />
              )}
              onPress={() => {
                onDismiss();
                onEndRide();
              }}
              disabled={!isActive}
              style={[styles.dropdownItem, !isActive && styles.disabledItem]}
              titleStyle={!isActive ? { color: Colors.light.icon } : undefined}
              descriptionStyle={
                !isActive ? { color: Colors.light.icon } : undefined
              }
            />
          </List.Section>

          {/* Navigation & Location */}
          <List.Section>
            <List.Subheader style={styles.sectionHeader}>
              Navigation
            </List.Subheader>

            <List.Item
              title="Center Map"
              description="Focus on your current location"
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="crosshairs-gps"
                  color={Colors.light.primary}
                />
              )}
              onPress={() => {
                onDismiss();
                onCenterMap();
              }}
              style={styles.dropdownItem}
            />

            <List.Item
              title="Find Station"
              description="Locate nearest bike station"
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="map-marker"
                  color={Colors.light.primary}
                />
              )}
              onPress={() => {
                onDismiss();
                onFindStation();
              }}
              style={styles.dropdownItem}
            />

            <List.Item
              title="Share Location"
              description="Share your current location"
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="share"
                  color={Colors.light.primary}
                />
              )}
              onPress={() => {
                onDismiss();
                onShareLocation();
              }}
              style={styles.dropdownItem}
            />
          </List.Section>

          {/* Ride Information */}
          <List.Section>
            <List.Subheader style={styles.sectionHeader}>
              Information
            </List.Subheader>

            <List.Item
              title="Ride Details"
              description="View detailed ride information"
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="information"
                  color={Colors.light.secondary}
                />
              )}
              onPress={() => {
                onDismiss();
                onRideDetails();
              }}
              style={styles.dropdownItem}
            />

            <List.Item
              title="Safety Tips"
              description="Important safety information"
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="shield-check"
                  color={Colors.light.secondary}
                />
              )}
              onPress={() => {
                onDismiss();
                onSafetyTips();
              }}
              style={styles.dropdownItem}
            />
          </List.Section>

          {/* Support & Help */}
          <List.Section>
            <List.Subheader style={styles.sectionHeader}>
              Support
            </List.Subheader>

            <List.Item
              title="Contact Support"
              description="Get help from our team"
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="headset"
                  color={Colors.light.warning}
                />
              )}
              onPress={() => {
                onDismiss();
                onContactSupport();
              }}
              style={styles.dropdownItem}
            />

            <List.Item
              title="Report Issue"
              description="Report a problem with your ride"
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="alert-circle"
                  color={Colors.light.warning}
                />
              )}
              onPress={() => {
                onDismiss();
                onReportIssue();
              }}
              style={styles.dropdownItem}
            />

            <List.Item
              title="Emergency"
              description="Emergency contact - Call 911"
              left={(props) => (
                <List.Icon {...props} icon="phone" color={Colors.light.error} />
              )}
              onPress={() => {
                onDismiss();
                onEmergency();
              }}
              style={[styles.dropdownItem, styles.emergencyItem]}
              titleStyle={{ color: Colors.light.error, fontWeight: "600" }}
              descriptionStyle={{ color: Colors.light.error }}
            />
          </List.Section>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Duration</Text>
              <Text style={styles.statValue}>{formattedElapsedTime}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Cost</Text>
              <Text style={styles.statValue}>
                {displayCost?.toFixed(2)} DZD
              </Text>
            </View>
          </View>
        </MotiScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  // Enhanced Dropdown Menu Styles
  dropdownContainer: {
    backgroundColor: Colors.light.card,
    margin: 20,
    borderRadius: 20,
    maxHeight: screenHeight * 0.8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  dropdownContent: {
    paddingVertical: 0,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    backgroundColor: Colors.light.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  dropdownTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 2,
  },
  dropdownSubtitle: {
    fontSize: 14,
    color: Colors.light.icon,
    fontWeight: "500",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.background,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 4,
  },
  dropdownItem: {
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  disabledItem: {
    opacity: 0.5,
  },
  emergencyItem: {
    backgroundColor: Colors.light.surface,
    marginHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.error,
  },
  quickStats: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.light.surface,
    marginTop: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.light.icon,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.light.border,
    marginHorizontal: 16,
  },
});
