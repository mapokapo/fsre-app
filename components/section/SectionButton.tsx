import { ChevronRight } from "lucide-react-native";
import { Pressable, PressableProps, StyleSheet, Text } from "react-native";

export type SectionButtonProps = Omit<PressableProps, "children"> & {
  title: string;
};

export default function SectionButton({ title, ...props }: SectionButtonProps) {
  return (
    <Pressable
      style={styles.sectionButton}
      {...props}>
      <Text style={styles.sectionButtonText}>{title}</Text>
      <ChevronRight
        color="#0A4977"
        size={18}
        strokeWidth={2.5}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sectionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "rgba(10, 73, 119, 0.1)",
    borderRadius: 18,
  },
  sectionButtonText: {
    fontSize: 13,
    fontFamily: "Inter-SemiBold",
    color: "#0A4977",
    marginRight: 5,
  },
});
