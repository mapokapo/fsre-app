import Color from "@/lib/types/Color";
import Notification from "@/lib/types/Notification";
import Profile from "@/lib/types/Profile";
import Stat from "@/lib/types/Stat";
import { addDays, addHours } from "date-fns";
import { Award, TrendingUp, Users } from "lucide-react-native";

const now = new Date();

const mockStats: Stat[] = [
  {
    key: "activeStudents",
    label: t => t("stats.activeStudents.label"),
    value: "1,247",
    icon: Users,
    color: Color.fromHex("#4ECDC4"),
  },
  {
    key: "completedProjects",
    label: t => t("stats.completedProjects.label"),
    value: "89",
    icon: Award,
    color: Color.fromHex("#FF6B6B"),
  },
  {
    key: "successRate",
    label: t => t("stats.successRate.label"),
    value: "94%",
    icon: TrendingUp,
    color: Color.fromHex("#45B7D1"),
  },
];

const mockProfileData: Profile = {
  name: "Testni Korisnik",
  indexNumber: "12345",
  year: "THIRD",
  department: "COMPUTER_SCIENCE",
  email: "test@fsre.sum.ba",
};

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "Prijava za ispitni rok",
    message: "Prijava za zimski ispitni rok otvorena do 15. siječnja",
    datetime: addHours(now, 2),
    urgent: true,
    iconCode: "timetable",
    gradientFrom: "#FF6B6B",
    gradientTo: "#FF8E8E",
  },
  {
    id: 2,
    title: "AI & Machine Learning radionica",
    message: "Besplatna radionica za studente u laboratoriju L-3",
    datetime: addDays(now, 1),
    urgent: false,
    iconCode: "tech-news",
    gradientFrom: "#4ECDC4",
    gradientTo: "#44A08D",
  },
  {
    id: 3,
    title: "Novi laboratorijski termini",
    message: "Dodani su novi termini za laboratorijske vježbe",
    datetime: addDays(now, 3),
    urgent: false,
    iconCode: "student",
    gradientFrom: "#A8E6CF",
    gradientTo: "#7FCDCD",
  },
];

export default class MockData {
  static getStats() {
    console.warn("You are using mock data: mockStats");
    return mockStats;
  }

  static getProfile(): Profile {
    console.warn("You are using mock data: mockProfileData");
    return mockProfileData;
  }

  static getNotifications() {
    console.warn("You are using mock data: mockNotifications");
    return mockNotifications;
  }
}
