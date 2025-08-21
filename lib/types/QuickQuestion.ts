import React from "react";
import { ColorValue } from "react-native";

export default interface QuickQuestion {
  text: string;
  icon: React.ReactNode;
  gradientFrom: ColorValue;
  gradientTo: ColorValue;
  description: string;
}
