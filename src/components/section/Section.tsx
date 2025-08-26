import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";
import { ViewProps } from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";

export type SectionProps = PropsWithChildren & AnimatedProps<ViewProps>;

export default function Section({
  children,
  className,
  ...props
}: SectionProps) {
  return (
    <Animated.View
      className={cn("mb-10 px-7", className)}
      {...props}>
      {children}
    </Animated.View>
  );
}
