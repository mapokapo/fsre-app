import RouteData from "@/lib/types/RouteData";
import { Calendar, Sparkles } from "lucide-react-native";

export const routeData: Record<"/" | "/chatbot" | "/timetable", RouteData> = {
  "/": {
    title: t => t("header.home.title"),
    subtitle: t => t("header.home.subtitle"),
    icon: null,
    isMain: true,
  },
  "/chatbot": {
    title: t => t("header.chatbot.title"),
    subtitle: t => t("header.chatbot.subtitle"),
    icon: Sparkles,
    isMain: false,
  },
  "/timetable": {
    title: t => t("header.timetable.title"),
    subtitle: t => t("header.timetable.subtitle"),
    icon: Calendar,
    isMain: false,
  },
};
