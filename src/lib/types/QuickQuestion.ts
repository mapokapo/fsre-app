import { LucideIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ColorValue } from "react-native";

export default interface QuickQuestion {
  text: (t: ReturnType<typeof useTranslation>[0]) => string;
  description: (t: ReturnType<typeof useTranslation>[0]) => string;
  icon: LucideIcon;
  gradientFrom: ColorValue;
  gradientTo: ColorValue;
}
