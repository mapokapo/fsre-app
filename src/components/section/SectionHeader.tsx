import React, { PropsWithChildren, ReactNode } from "react";
import { StyleSheet, ViewProps } from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";

export type SectionHeaderProps = AnimatedProps<ViewProps> & PropsWithChildren;

export default function SectionHeader({
  children,
  style,
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
      style={[styles.sectionHeader, style]}
      {...props}>
      {sectionTitle}
      {defaultChildren}
      {sectionButton}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
});
