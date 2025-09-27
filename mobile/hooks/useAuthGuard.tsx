import React from "react";
import { useAuthStore } from "../src/store/useAuthStore";
import { View, ActivityIndicator, Text } from "react-native";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const useAuthGuard = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  return { isAuthenticated, isLoading };
};

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const { isAuthenticated, isLoading } = useAuthGuard();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#231942" />
      </View>
    );
  }
  if (!isAuthenticated) {
    return (
      fallback || (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>You must be logged in to view this content.</Text>
        </View>
      )
    );
  }
  return <>{children}</>;
};
