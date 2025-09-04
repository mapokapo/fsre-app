import { Link } from "expo-router";
import { LucideIcon } from "lucide-react-native";
import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { ColorValue } from "react-native";

type QuickLink = {
  label: (t: ReturnType<typeof useTranslation>[0]) => string;
  icon: LucideIcon;
  gradientFrom: ColorValue;
  gradientTo: ColorValue;
} & (
  | {
      action: "navigate";
      to: ComponentProps<typeof Link>["href"];
    }
  | {
      url: string;
    }
);

export default QuickLink;
