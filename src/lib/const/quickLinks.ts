import QuickLink from "@/lib/types/QuickLink";
import { Calendar, ExternalLink, Globe, Mail } from "lucide-react-native";

export const quickLinks: QuickLink[] = [
  {
    label: t => t("quickLinks.studomat"),
    icon: ExternalLink,
    gradientFrom: "#667eea",
    gradientTo: "#764ba2",
    url: "https://studomat.sum.ba",
  },
  {
    label: t => t("quickLinks.eLearning"),
    icon: Globe,
    gradientFrom: "#f093fb",
    gradientTo: "#f5576c",
    url: "https://elearning.sum.ba",
  },
  {
    label: t => t("quickLinks.webmail"),
    icon: Mail,
    gradientFrom: "#4facfe",
    gradientTo: "#00f2fe",
    url: "https://webmail.sum.ba",
  },
  {
    label: t => t("quickLinks.schedule"),
    icon: Calendar,
    gradientFrom: "#43e97b",
    gradientTo: "#38f9d7",
    action: "navigate",
    to: "/(tabs)/timetable",
  },
];
