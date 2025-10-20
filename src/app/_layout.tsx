import ErrorMessage from "@/components/ErrorMessage";
import "@/global.css";
import { messaging } from "@/lib/firebase";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import "@/lib/i18n";
import { NAV_THEME } from "@/lib/theme";
import { setAndroidNavigationBar } from "@/lib/utils";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/inter";
import {
  AuthorizationStatus,
  requestPermission,
} from "@react-native-firebase/messaging";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "expo-dev-client";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useLayoutEffect } from "react";
import { Appearance, PermissionsAndroid, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

const useSetWebBackgroundClassName = () => {
  useIsomorphicLayoutEffect(() => {
    document.documentElement.classList.add("bg-background");
  }, []);
};

function useSetAndroidNavigationBar() {
  useLayoutEffect(() => {
    setAndroidNavigationBar(Appearance.getColorScheme() ?? "light");
  }, []);
}

const usePlatformSpecificSetup = Platform.select({
  web: useSetWebBackgroundClassName,
  android: useSetAndroidNavigationBar,
  default: () => {},
});

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? useEffect
    : useLayoutEffect;

const queryClient = new QueryClient();

export default function RootLayout() {
  const { isDarkColorScheme } = useColorScheme();

  const [fontsLoaded, fontError] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
    "Inter-ExtraBold": Inter_800ExtraBold,
  });

  usePlatformSpecificSetup();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      const statusIos = await requestPermission(messaging!);
      const statusAndroid = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );

      if (
        statusIos !== AuthorizationStatus.AUTHORIZED ||
        statusAndroid !== "granted"
      ) {
        console.warn("User denied notifications");
      }
    };

    if (fontsLoaded && !fontError && Platform.OS !== "web") {
      requestNotificationPermission();
    }
  }, [fontError, fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  if (fontError) {
    return <ErrorMessage error={fontError} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        value={isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light}>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="login" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="light" />
        </SafeAreaProvider>
        <PortalHost />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
