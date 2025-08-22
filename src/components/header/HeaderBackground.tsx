import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

export default function HeaderBackground() {
  return (
    <LinearGradient
      colors={["#0A4977", "#1E5A8A", "#3B82F6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}></LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    height: "100%",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
});
