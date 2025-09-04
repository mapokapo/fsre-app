import NotificationCategory from "@/lib/types/NotificationCategory";
import {
  BookOpen,
  Calendar,
  FlaskConical,
  Newspaper,
  Users,
} from "lucide-react-native";

export const notificationCategories: NotificationCategory[] = [
  {
    key: "lectures",
    title: t => t("notifications.categories.lectures.title"),
    description: t => t("notifications.categories.lectures.description"),
    icon: BookOpen,
    gradientFrom: "#0A4977",
    gradientTo: "#1E5A8A",
  },
  {
    key: "exercises",
    title: t => t("notifications.categories.exercises.title"),
    description: t => t("notifications.categories.exercises.description"),
    icon: Users,
    gradientFrom: "#059669",
    gradientTo: "#10B981",
  },
  {
    key: "labs",
    title: t => t("notifications.categories.labs.title"),
    description: t => t("notifications.categories.labs.description"),
    icon: FlaskConical,
    gradientFrom: "#DC2626",
    gradientTo: "#EF4444",
  },
  {
    key: "exams",
    title: t => t("notifications.categories.exams.title"),
    description: t => t("notifications.categories.exams.description"),
    icon: Calendar,
    gradientFrom: "#7C3AED",
    gradientTo: "#A855F7",
  },
  {
    key: "news",
    title: t => t("notifications.categories.news.title"),
    description: t => t("notifications.categories.news.description"),
    icon: Newspaper,
    gradientFrom: "#EA580C",
    gradientTo: "#F97316",
  },
];
