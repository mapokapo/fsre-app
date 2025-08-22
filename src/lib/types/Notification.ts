import { ColorValue } from "react-native";

export default interface Notification {
  id: number;
  title: string;
  message: string;
  datetime: Date;
  urgent: boolean;
  iconCode: "timetable" | "tech-news" | "student";
  gradientFrom: ColorValue;
  gradientTo: ColorValue;
}
