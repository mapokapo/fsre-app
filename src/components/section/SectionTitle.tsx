import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

export type SectionTitleProps = {
  title: string;
  icon?: ReactNode;
};

export default function SectionTitle({ title, icon }: SectionTitleProps) {
  return (
    <View style={styles.sectionTitleContainer}>
      {icon}
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "#1A1A1A",
    marginLeft: 12,
  },
});
