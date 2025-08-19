import NotificationType from "@/lib/types/NotificationType";
import {
  BookOpen,
  Calendar,
  FlaskConical,
  Newspaper,
  Users,
} from "lucide-react-native";

export const notificationTypes: NotificationType[] = [
  {
    id: "lectures",
    title: "Predavanja",
    description: "Obavijesti prije početka predavanja",
    icon: <BookOpen />,
    gradient: ["#0A4977", "#1E5A8A"],
  },
  {
    id: "exercises",
    title: "Vježbe",
    description: "Obavijesti prije početka vježbi",
    icon: <Users />,
    gradient: ["#059669", "#10B981"],
  },
  {
    id: "labs",
    title: "Laboratoriji",
    description: "Obavijesti prije laboratorijskih vježbi",
    icon: <FlaskConical />,
    gradient: ["#DC2626", "#EF4444"],
  },
  {
    id: "exams",
    title: "Ispiti",
    description: "Obavijesti o ispitnim rokovima",
    icon: <Calendar />,
    gradient: ["#7C3AED", "#A855F7"],
  },
  {
    id: "news",
    title: "Novosti",
    description: "Obavijesti o novostima fakulteta",
    icon: <Newspaper />,
    gradient: ["#EA580C", "#F97316"],
  },
];
