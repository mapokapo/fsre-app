import { LucideIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";

export default interface RouteData {
  title: (t: ReturnType<typeof useTranslation>[0]) => string;
  subtitle: (t: ReturnType<typeof useTranslation>[0]) => string;
  icon: LucideIcon | null;
  isMain: boolean;
}
