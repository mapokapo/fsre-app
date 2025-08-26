import { cn } from "@/lib/utils";
import React, { PropsWithChildren, ReactNode } from "react";
import { ViewProps } from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";

export type SectionHeaderProps = AnimatedProps<ViewProps> & PropsWithChildren;

export default function SectionHeader({
  children,
  className,
  ...props
}: SectionHeaderProps) {
  let sectionTitle: ReactNode | null = null;
  let sectionButton: ReactNode | null = null;
  const defaultChildren: ReactNode[] = [];

  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) return;

    if (typeof child.type === "string" || !("name" in child.type)) return;

    switch (child.type.name) {
      case "SectionTitle":
        sectionTitle = child;
        break;
      case "SectionButton":
        sectionButton = child;
        break;
      default:
        defaultChildren.push(child);
    }
  });

  return (
    <Animated.View
      className={cn("mb-6 flex-row items-center justify-between", className)}
      {...props}>
      {sectionTitle}
      {defaultChildren}
      {sectionButton}
    </Animated.View>
  );
}
