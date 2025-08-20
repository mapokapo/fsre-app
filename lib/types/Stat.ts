import Color from "@/lib/types/Color";

export default interface Stat {
  key: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  color: Color;
}
