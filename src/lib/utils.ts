import { clsx, type ClassValue } from "clsx";
import { formatDistance } from "date-fns";
import { twMerge } from "tailwind-merge";

import { getAppDateFnsLocale } from "@/lib/i18n";
import StudyYear from "@/lib/types/StudyYear";
import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";

export { filterTimetable, getTimetableEvents } from "@/lib/utils/timetable";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDistanceTo(date: Date, now = new Date()): string {
  return formatDistance(date, now, {
    addSuffix: true,
    locale: getAppDateFnsLocale(),
  });
}

export async function setAndroidNavigationBar(theme: "light" | "dark") {
  if (Platform.OS !== "android") return;
  await NavigationBar.setButtonStyleAsync(theme === "dark" ? "light" : "dark");
}

export function mapError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error";
}

export function studyYearToInt(year: StudyYear) {
  switch (year) {
    case "FIRST":
      return 1;
    case "SECOND":
      return 2;
    case "THIRD":
      return 3;
    case "FOURTH":
      return 4;
    case "FIFTH":
      return 5;
  }
}

export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}
