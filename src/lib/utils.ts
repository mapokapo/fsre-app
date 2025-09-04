import { clsx, type ClassValue } from "clsx";
import { Day, formatDistance } from "date-fns";
import { hr } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

import { Timetable, TimetableEvent } from "@/lib/api/client";
import { NAV_THEME } from "@/lib/theme";
import StudyYear from "@/lib/types/StudyYear";
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
    theme === "dark"
      ? NAV_THEME.dark.colors.background
      : NAV_THEME.light.colors.background
  );
}

export function filterTimetable(
  timetable: Timetable,
  predicate: (item: { event: TimetableEvent; day: Day }) => boolean
): Timetable {
  return {
    monday: timetable.monday.filter(event => predicate({ event, day: 1 })),
    tuesday: timetable.tuesday.filter(event => predicate({ event, day: 2 })),
    wednesday: timetable.wednesday.filter(event =>
      predicate({ event, day: 3 })
    ),
    thursday: timetable.thursday.filter(event => predicate({ event, day: 4 })),
    friday: timetable.friday.filter(event => predicate({ event, day: 5 })),
    saturday: timetable.saturday.filter(event => predicate({ event, day: 6 })),
    sunday: timetable.sunday.filter(event => predicate({ event, day: 0 })),
  };
}

export function getTimetableEvents(
  timetable: Timetable
): { day: Day; events: TimetableEvent[] }[] {
  return [
    { day: 1, events: timetable.monday },
    { day: 2, events: timetable.tuesday },
    { day: 3, events: timetable.wednesday },
    { day: 4, events: timetable.thursday },
    { day: 5, events: timetable.friday },
    { day: 6, events: timetable.saturday },
    { day: 0, events: timetable.sunday },
  ];
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
