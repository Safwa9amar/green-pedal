import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { MotiView } from "moti";

import { useRentalStore } from "@/src/store/useRentalStore";
import { calculateOngoingRideCost } from "@/src/utils/calculateRideCost";
import { RideOptionsModal } from "@/components/RideOptionsModal";
import { FloatingActionButtons } from "@/components/FloatingActionButtons";
import { RideInfoCards } from "@/components/RideInfoCards";
import { EndRideConfirmationModal } from "@/components/EndRideConfirmationModal";
import { RideDetailsModal } from "@/components/RideDetailsModal";
import { ReportIssueModal } from "@/components/ReportIssueModal";
import { ShareRideModal } from "@/components/ShareRideModal";
import { SafetyTipsModal } from "@/components/SafetyTipsModal";
import { formatClockTime, formatTime } from "@/src/utils/formatTime";
import MapView from "react-native-maps";
import { useUserLocation } from "@/src/store/useUserLocation";
import { ALGERIA_REGION } from "@/constants/maps";
import { useFocusEffect, useNavigation } from "expo-router";
import { Colors } from "@/constants/theme";
import ShowEndRentalQRCode from "@/components/ShowEndRentalQRCode";
import { useAuthStore } from "@/src/store";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const CurrentRideScreen: React.FC = () => {
  const navigation = useNavigation();
  const { currentRental, elapsedTime, endRental } = useRentalStore();
  const status = currentRental?.status || "IDLE";
  const isActive = status === "ACTIVE";
  const { location, loading: userLocationLoading } = useUserLocation();
  const formattedElapsedTime = formatTime(elapsedTime);
  const formattedStartTime = formatClockTime(currentRental?.startTime);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showEndRideConfirmation, setShowEndRideConfirmation] = useState(false);
  const [showRideDetails, setShowRideDetails] = useState(false);
  const [showReportIssue, setShowReportIssue] = useState(false);
  const [showShareRide, setShowShareRide] = useState(false);
  const [showSafetyTips, setShowSafetyTips] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [showEndRentalQr, setShowEndRentalQr] = useState(false);
  const { user } = useAuthStore();

  const mapRef = useRef<MapView>(null);
  const displayCost =
    status === "COMPLETED" && currentRental?.totalCost !== undefined
      ? currentRental.totalCost
      : currentRental?.startTime
      ? calculateOngoingRideCost(
          currentRental.startTime,
          new Date(
            new Date(currentRental.startTime).getTime() + elapsedTime * 1000
          )
        ).cost
      : 0;

  // Pulse animation for active status
  useEffect(() => {
    if (isActive) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isActive, pulseAnim]);

  // Helper functions
  const handleEndRide = () => {
    setShowEndRideConfirmation(true);
  };

  const confirmEndRide = () => {
    setShowEndRentalQr(true);
    endRental();
    setShowEndRideConfirmation(false);
    setMenuVisible(false);
  };

  const cancelEndRide = () => {
    setShowEndRideConfirmation(false);
  };

  const centerOnUserLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (location && mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: location?.latitude,
            longitude: location?.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000
        );
      }
    }, [location])
  );

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({
        headerTitle: "",
        headerShown: false,
      });
      return () => {
        navigation.getParent()?.setOptions({
          headerTitle: "",
          headerShown: true,
        });
      };
    }, [navigation])
  );

  return (
    <View style={styles.container}>
      {/* Map View */}
      <MapView
        showsUserLocation={true}
        showsMyLocationButton={false}
        mapType="standard"
        showsCompass={false}
        showsScale={false}
        ref={mapRef}
        style={styles.map}
        initialRegion={
          location
            ? {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : ALGERIA_REGION
        }
      ></MapView>

      {/* Floating Action Buttons */}
      <FloatingActionButtons
        onCenterMap={centerOnUserLocation}
        onOpenMenu={() => setMenuVisible(true)}
        onEndRide={handleEndRide}
        isActive={isActive}
      />

      {/* Enhanced Info Cards */}
      <RideInfoCards
        formattedStartTime={formattedStartTime}
        formattedElapsedTime={formattedElapsedTime}
        displayCost={displayCost}
        status={status}
      />

      {/* Enhanced Dropdown Menu */}
      <RideOptionsModal
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        isActive={isActive}
        pulseAnim={pulseAnim}
        formattedElapsedTime={formattedElapsedTime}
        displayCost={displayCost || undefined}
        onEndRide={handleEndRide}
        onCenterMap={centerOnUserLocation}
        onFindStation={() => console.log("Finding nearest station")}
        onShareLocation={() => setShowShareRide(true)}
        onRideDetails={() => setShowRideDetails(true)}
        onSafetyTips={() => setShowSafetyTips(true)}
        onContactSupport={() => console.log("Contacting support")}
        onReportIssue={() => setShowReportIssue(true)}
        onEmergency={() => console.log("Emergency contact")}
      />

      {/* Modals */}
      <EndRideConfirmationModal
        visible={showEndRideConfirmation}
        onConfirm={confirmEndRide}
        onCancel={cancelEndRide}
      />

      <RideDetailsModal
        visible={showRideDetails}
        onClose={() => setShowRideDetails(false)}
        currentRental={currentRental}
        formattedStartTime={formattedStartTime}
        formattedElapsedTime={formattedElapsedTime}
        isActive={isActive}
      />

      <ReportIssueModal
        visible={showReportIssue}
        onCancel={() => setShowReportIssue(false)}
        onReport={() => {
          setShowReportIssue(false);
          console.log("Issue reported");
        }}
      />

      <ShareRideModal
        visible={showShareRide}
        onCancel={() => setShowShareRide(false)}
        onShare={() => {
          setShowShareRide(false);
          console.log("Ride shared");
        }}
      />

      <SafetyTipsModal
        visible={showSafetyTips}
        onClose={() => setShowSafetyTips(false)}
      />

      <ShowEndRentalQRCode
        visible={showEndRentalQr}
        onClose={() => setShowEndRentalQr(false)}
        userId={user?.id || ""}
        rentalId={currentRental?.id ? String(currentRental.id) : ""}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default CurrentRideScreen;
