import { clsx, type ClassValue } from "clsx";
import { formatDistance } from "date-fns";
import { hr } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

import { NAV_THEME } from "@/lib/theme";
import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDistanceTo(date: Date, now = new Date()): string {
  return formatDistance(date, now, {
    addSuffix: true,
    locale: {
      ...hr,
      formatDistance: (token, count, options) => {
        const result = hr.formatDistance(token, count, options);
        return result.replace("oko ", "").trim();
      },
    },
  });
}

export async function setAndroidNavigationBar(theme: "light" | "dark") {
  if (Platform.OS !== "android") return;
  await NavigationBar.setButtonStyleAsync(theme === "dark" ? "light" : "dark");
  await NavigationBar.setBackgroundColorAsync(
    theme === "dark" ? NAV_THEME.dark.background : NAV_THEME.light.background
  );
}
