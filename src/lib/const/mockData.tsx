import Color from "@/lib/types/Color";
import NewsArticle from "@/lib/types/NewsArticle";
import Notification from "@/lib/types/Notification";
import Profile from "@/lib/types/Profile";
import Stat from "@/lib/types/Stat";
import { addDays, addHours, subDays } from "date-fns";
import { Award, TrendingUp, Users } from "lucide-react-native";

const mockProfileData: Profile = {
  name: "Marko Petrović",
  indexNumber: "R-2021/0123",
  year: "3. godina",
  department: "Računarstvo",
  email: "marko.petrovic@student.sum.ba",
};

const mockStats: Stat[] = [
  {
    key: "activeStudents",
    label: "Aktivnih studenata",
    value: "1,247",
    icon: <Users />,
    color: Color.fromHex("#4ECDC4"),
  },
  {
    key: "completedProjects",
    label: "Završenih projekata",
    value: "89",
    icon: <Award />,
    color: Color.fromHex("#FF6B6B"),
  },
  {
    key: "successRate",
    label: "Uspješnost",
    value: "94%",
    icon: <TrendingUp />,
    color: Color.fromHex("#45B7D1"),
  },
];

const now = new Date();

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

const mockNewsArticles: NewsArticle[] = [
  {
    id: 1,
    title: "FSRE dobio najnoviju računalnu opremu",
    summary:
      "Fakultet je opremljen najnovijim računalima i serverima za potrebe nastave i istraživanja. Studenti sada imaju pristup najmodernijoj tehnologiji.",
    imageUrl:
      "https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=800",
    link: "https://fsre.sum.ba/en",
    datetime: subDays(now, 3),
    categoryCode: "tech",
    gradientFrom: "#667eea",
    gradientTo: "#764ba2",
  },
  {
    id: 2,
    title: "Međunarodni uspjeh studenata",
    summary:
      "Tim studenata FSRE-a osvojio drugo mjesto na prestižnom hackathonu u Beču. Projekt se fokusirao na AI rješenja za održivi razvoj.",
    imageUrl:
      "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800",
    link: "https://fsre.sum.ba/en",
    datetime: subDays(now, 7),
    categoryCode: "awards",
    gradientFrom: "#f093fb",
    gradientTo: "#f5576c",
  },
  {
    id: 3,
    title: "Nova laboratorijska oprema",
    summary:
      "Fakultet je investirao u najnoviju laboratorijsku opremu za potrebe praktične nastave iz područja strojarstva i elektrotehnike.",
    imageUrl:
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
    link: "https://fsre.sum.ba/en",
    datetime: subDays(now, 14),
    categoryCode: "labs",
    gradientFrom: "#4facfe",
    gradientTo: "#00f2fe",
  },
  {
    id: 4,
    title: "Stipendije za izvrsne studente",
    summary:
      "Objavljene su nove stipendije za studente s izvrsnim akademskim rezultatima. Prijave su otvorene do kraja mjeseca.",
    imageUrl:
      "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800",
    link: "https://fsre.sum.ba/en",
    datetime: subDays(now, 5),
    categoryCode: "scholarships",
    gradientFrom: "#43e97b",
    gradientTo: "#38f9d7",
  },
  {
    id: 5,
    title: "Gostujuće predavanje o AI",
    summary:
      "Poznati stručnjak iz područja umjetne inteligencije održat će predavanje o budućnosti tehnologije i njezinoj primjeni.",
    imageUrl:
      "https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=800",
    link: "https://fsre.sum.ba/en",
    datetime: subDays(now, 1),
    categoryCode: "lectures",
    gradientFrom: "#fa709a",
    gradientTo: "#fee140",
  },
];

export default class MockData {
  static getProfile() {
    console.warn("You are using mock data: mockProfileData");
    return mockProfileData;
  }

  static getStats() {
    console.warn("You are using mock data: mockStats");
    return mockStats;
  }

  static getNotifications() {
    console.warn("You are using mock data: mockNotifications");
    return mockNotifications;
  }

  static getNewsArticles() {
    console.warn("You are using mock data: mockNewsArticles");
    return mockNewsArticles;
  }
}
