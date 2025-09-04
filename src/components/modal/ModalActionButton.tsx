import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react-native";
import { TouchableOpacityProps, View } from "react-native";

export type ModalActionButtonProps = TouchableOpacityProps & {
  icon: React.ReactNode;
  text?: string;
  destructive?: boolean;
};

export default function ModalActionButton({
  icon,
  text,
  destructive = false,
  children,
  ...props
}: ModalActionButtonProps) {
  return (
    <Button
      variant={destructive ? "destructive" : "outline"}
      className="h-auto justify-start px-2 py-2 web:!h-auto"
      {...props}>
      <View className="h-10 w-10 items-center justify-center rounded-full">
        {icon}
      </View>
      {text && <Text className="flex-1 font-semibold">{text}</Text>}
      {children === undefined && (
        <Icon
          as={ChevronRight}
          className={cn(destructive && "text-fsre-gradient-foreground")}
        />
      )}
      {children}
    </Button>
  );
}
