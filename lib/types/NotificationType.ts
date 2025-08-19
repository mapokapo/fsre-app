import NotificationSettings from "@/lib/types/NotificationSettings";
import React from "react";
import { ColorValue } from "react-native";

export default interface NotificationType {
  id: keyof NotificationSettings;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: [ColorValue, ColorValue, ...ColorValue[]];
}
