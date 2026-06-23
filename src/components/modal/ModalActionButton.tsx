import { Button, ButtonProps } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react-native";
import { PropsWithChildren } from "react";
import { Platform, View } from "react-native";

export type ModalActionButtonProps = Omit<ButtonProps, "children"> &
  PropsWithChildren & {
    icon: React.ReactNode;
    text?: string;
    destructive?: boolean;
    isButton?: boolean;
  };

export default function ModalActionButton({
  icon,
  text,
  destructive = false,
  children,
  isButton = true,
  ...props
}: ModalActionButtonProps) {
  const Component = isButton
    ? ({ children }: PropsWithChildren) => (
        <Button
          variant={destructive ? "destructive" : "outline"}
          className="h-auto justify-start px-2 py-2 web:!h-auto"
          {...props}>
          {children}
        </Button>
      )
    : ({ children }: PropsWithChildren) => (
        <View
          className={cn(
            "group shrink-0 flex-row items-center justify-start gap-2 rounded-md border border-border bg-background px-2 py-2 shadow-sm shadow-black/5 web:!h-auto dark:border-input dark:bg-input/30 sm:h-9",
            Platform.OS === "web" &&
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-10 whitespace-nowrap px-3 outline-none transition-all disabled:pointer-events-none has-[>svg]:px-3 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
          )}>
          {children}
        </View>
      );

  return (
    <Component>
      <View className="h-10 w-10 items-center justify-center rounded-full">
        {icon}
      </View>
      {text && (
        <Text
          className={cn(
            "flex-1 font-semibold",
            !isButton &&
              "pointer-events-none select-none text-sm text-foreground transition-colors"
          )}>
          {text}
        </Text>
      )}
      {isButton && children === undefined && (
        <Icon
          as={ChevronRight}
          className={cn(destructive && "text-fsre-gradient-foreground")}
        />
      )}
      {children}
    </Component>
  );
}
