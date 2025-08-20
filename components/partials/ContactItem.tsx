import { Pressable, StyleSheet, Text, View } from "react-native";

export type ContactItemProps = {
  title: string;
  icon?: React.ReactNode;
};

export default function ContactItem({ title, icon }: ContactItemProps) {
  return (
    <Pressable style={styles.contactRow}>
      <View style={styles.contactIcon}>{icon}</View>
      <Text style={styles.contactText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(10, 73, 119, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },
  contactText: {
    fontSize: 15,
    fontFamily: "Inter-Medium",
    color: "#1A1A1A",
    flex: 1,
  },
});
