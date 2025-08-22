import { Link } from "expo-router";
import React, { ComponentProps } from "react";
import { ColorValue } from "react-native";

type QuickLink = {
  label: string;
  icon: React.ReactNode;
  gradientFrom: ColorValue;
  gradientTo: ColorValue;
} & (
  | {
      action: "navigate";
      to: ComponentProps<typeof Link>["href"];
    }
  | {
      url: string;
    }
);

export default QuickLink;
