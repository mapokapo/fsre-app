import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

export type ContactItemProps = {
  title: string;
  icon?: React.ReactNode;
};

export default function ContactItem({ title, icon }: ContactItemProps) {
  return (
    <Button
      variant="ghost"
      className="h-auto flex-row items-center justify-start p-0">
      <View className="mr-4 h-12 w-12 items-center justify-center overflow-hidden rounded-full">
        {icon}
      </View>
      <Text className="flex-1">{title}</Text>
    </Button>
  );
}
