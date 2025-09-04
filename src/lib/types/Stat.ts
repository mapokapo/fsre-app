import Color from "@/lib/types/Color";
import { LucideIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";

export default interface Stat {
  key: string;
  label: (t: ReturnType<typeof useTranslation>[0]) => string;
  value: string;
  icon: LucideIcon;
  color: Color;
}
