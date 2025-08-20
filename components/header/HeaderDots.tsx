import { StyleSheet, View } from "react-native";

export default function HeaderDots() {
  return (
    <View style={styles.headerDecoration}>
      <View style={styles.headerDot1} />
      <View style={styles.headerDot2} />
      <View style={styles.headerDot3} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerDecoration: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerDot1: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginRight: 4,
  },
  headerDot2: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginRight: 4,
  },
  headerDot3: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
});
