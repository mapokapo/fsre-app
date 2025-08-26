import Color from "@/lib/types/Color";
import { LucideIcon } from "lucide-react-native";

export default interface Stat {
  key: string;
  label: string;
  value: string;
  icon: LucideIcon;
  color: Color;
}
