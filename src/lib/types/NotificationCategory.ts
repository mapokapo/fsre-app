import NotificationSettings from "@/lib/types/NotificationSettings";
import { LucideIcon } from "lucide-react-native";
import { ColorValue } from "react-native";

export default interface NotificationCategory {
  key: keyof NotificationSettings;
  title: string;
  description: string;
  icon: LucideIcon;
  gradientFrom: ColorValue;
  gradientTo: ColorValue;
}
