import { Text } from "@/components/ui/text";
import { ReactNode } from "react";
import { View } from "react-native";

export type SectionTitleProps = {
  title: string;
  icon?: ReactNode;
};

export default function SectionTitle({ title, icon }: SectionTitleProps) {
  return (
    <View className="flex-row items-center">
      {icon}
      <Text className="ml-3 text-2xl font-bold">{title}</Text>
    </View>
  );
}
