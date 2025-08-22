import { ColorValue } from "react-native";

export default interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  imageUrl: string;
  datetime: Date;
  link: string;
  categoryCode: "tech" | "awards" | "labs" | "scholarships" | "lectures";
  gradientFrom: ColorValue;
  gradientTo: ColorValue;
}
