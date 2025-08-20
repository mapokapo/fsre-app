import React, { PropsWithChildren, ReactNode } from "react";
import { StyleSheet, View } from "react-native";

export type SectionHeaderProps = PropsWithChildren;

export default function SectionHeader({ children }: SectionHeaderProps) {
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
    <View style={styles.sectionHeader}>
      {sectionTitle}
      {defaultChildren}
      {sectionButton}
    </View>
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
