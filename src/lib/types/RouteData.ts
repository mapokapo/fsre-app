import { LucideIcon } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";

type RouteData = {
  subtitle: (t: ReturnType<typeof useTranslation>[0]) => string;
  icon: LucideIcon | null;
  isMain: boolean;
} & (
  | {
      title: (t: ReturnType<typeof useTranslation>[0]) => string;
    }
  | {
      image: React.ReactNode;
    }
);

export default RouteData;
