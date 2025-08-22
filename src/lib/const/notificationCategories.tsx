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
    title: "Predavanja",
    description: "Obavijesti prije početka predavanja",
    icon: <BookOpen />,
    gradientFrom: "#0A4977",
    gradientTo: "#1E5A8A",
  },
  {
    key: "exercises",
    title: "Vježbe",
    description: "Obavijesti prije početka vježbi",
    icon: <Users />,
    gradientFrom: "#059669",
    gradientTo: "#10B981",
  },
  {
    key: "labs",
    title: "Laboratoriji",
    description: "Obavijesti prije laboratorijskih vježbi",
    icon: <FlaskConical />,
    gradientFrom: "#DC2626",
    gradientTo: "#EF4444",
  },
  {
    key: "exams",
    title: "Ispiti",
    description: "Obavijesti o ispitnim rokovima",
    icon: <Calendar />,
    gradientFrom: "#7C3AED",
    gradientTo: "#A855F7",
  },
  {
    key: "news",
    title: "Novosti",
    description: "Obavijesti o novostima fakulteta",
    icon: <Newspaper />,
    gradientFrom: "#EA580C",
    gradientTo: "#F97316",
  },
];
