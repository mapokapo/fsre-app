import { storage } from "@/lib/const/storage";
import { setAndroidNavigationBar } from "@/lib/utils";
import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { useCallback, useEffect } from "react";
import { Appearance } from "react-native";

export const THEME_STORAGE_KEY = "@app_theme";

export type ColorScheme = "light" | "dark";

export function getPersistedColorScheme(): ColorScheme {
  const saved = storage.getString(THEME_STORAGE_KEY);
  if (saved === "light" || saved === "dark") {
    return saved;
  }

  return Appearance.getColorScheme() === "light" ? "light" : "dark";
}

export function useColorScheme() {
  const {
    colorScheme,
    setColorScheme: setNativewindColorScheme,
    toggleColorScheme,
  } = useNativewindColorScheme();

  useEffect(() => {
    const persisted = getPersistedColorScheme();
    setNativewindColorScheme(persisted);
    setAndroidNavigationBar(persisted);
  }, [setNativewindColorScheme]);

  const setColorScheme = useCallback(
    (scheme: ColorScheme) => {
      storage.set(THEME_STORAGE_KEY, scheme);
      setNativewindColorScheme(scheme);
      setAndroidNavigationBar(scheme);
    },
    [setNativewindColorScheme]
  );

  const resolvedColorScheme = colorScheme ?? getPersistedColorScheme();

  return {
    colorScheme: resolvedColorScheme,
    isDarkColorScheme: resolvedColorScheme === "dark",
    setColorScheme,
    toggleColorScheme,
  };
}
