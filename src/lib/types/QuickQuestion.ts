import { LucideIcon } from "lucide-react-native";
import { ColorValue } from "react-native";

export default interface QuickQuestion {
  text: string;
  icon: LucideIcon;
  gradientFrom: ColorValue;
  gradientTo: ColorValue;
  description: string;
}
