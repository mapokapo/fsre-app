import QuickQuestion from "@/lib/types/QuickQuestion";
import { MessageSquare, Zap } from "lucide-react-native";

export const quickQuestions: QuickQuestion[] = [
  {
    text: t => t("chatbot.quickQuestions.schedule.text"),
    description: t => t("chatbot.quickQuestions.schedule.description"),
    icon: MessageSquare,
    gradientFrom: "#667eea",
    gradientTo: "#764ba2",
  },
  {
    text: t => t("chatbot.quickQuestions.exams.text"),
    description: t => t("chatbot.quickQuestions.exams.description"),
    icon: Zap,
    gradientFrom: "#f093fb",
    gradientTo: "#f5576c",
  },
  {
    text: t => t("chatbot.quickQuestions.contact.text"),
    description: t => t("chatbot.quickQuestions.contact.description"),
    icon: MessageSquare,
    gradientFrom: "#4facfe",
    gradientTo: "#00f2fe",
  },
  {
    text: t => t("chatbot.quickQuestions.labs.text"),
    description: t => t("chatbot.quickQuestions.labs.description"),
    icon: Zap,
    gradientFrom: "#43e97b",
    gradientTo: "#38f9d7",
  },
];
