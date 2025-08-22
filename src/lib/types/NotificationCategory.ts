import NotificationSettings from "@/lib/types/NotificationSettings";
import React from "react";
import { ColorValue } from "react-native";

export default interface NotificationCategory {
  key: keyof NotificationSettings;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradientFrom: ColorValue;
  gradientTo: ColorValue;
}
