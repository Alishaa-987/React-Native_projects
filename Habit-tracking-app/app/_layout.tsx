import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Slot, useRouter, useSegments } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View } from "react-native";
const theme = {
  colors: {
    onSurfaceVariant: '#2c3e50',
    primary: '#2c3e50',
  },
};

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoadingUser } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === "auth";
    if (!isLoadingUser && !user && !inAuthGroup) {
      router.replace("/auth");
    } else if (!isLoadingUser && user && inAuthGroup) {
      router.replace("/");

    }
  }, [isLoadingUser, user, router, segments]);
  return <>{children}</>

}


export default function RootLayout() {
  return (
<GestureHandlerRootView>
  <View style={{ flex: 1 }}></View>
    <AuthProvider>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <RouteGuard>
            <Slot />
          </RouteGuard>
        </SafeAreaProvider>
      </PaperProvider>
    </AuthProvider>
  </GestureHandlerRootView>
  );
}
