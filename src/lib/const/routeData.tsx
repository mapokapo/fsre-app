import RouteData from "@/lib/types/RouteData";
import { Calendar, Sparkles } from "lucide-react-native";
import { Image, View } from "react-native";

export const routeData: Record<"/" | "/chatbot" | "/timetable", RouteData> = {
  "/": {
    image: (
      <View className="my-1 flex h-12 w-32">
        <Image
          source={require("@/assets/images/fsre_logo.png")}
          resizeMode="contain"
          className="!h-full !w-full"
        />
      </View>
    ),
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
