import { AuthProvider } from "@/contexts/authContext";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const StackLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Splash Screen */}
      <Stack.Screen name="index" />
      
      {/* Auth Screens */}
      <Stack.Screen name="(auth)/welcome" />
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/register" />
      
      {/* Main Tabs */}
      <Stack.Screen name="(tabs)" />
      
      {/* Modal Screens */}
      <Stack.Screen
        name="(models)/profileModal"
        options={{
          presentation: "modal",
        }}
      />

      <Stack.Screen
        name="(models)/walletModal"
        options={{
          presentation: "modal",
        }}
      />

      <Stack.Screen
        name="(models)/transactionModal"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
};
export default function RootLayout() {
  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({});
