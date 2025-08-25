import { THEME } from "@/lib/theme";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

export default function HeaderBackground() {
  return (
    <LinearGradient
      colors={[
        THEME["light"]["fsreGradient1"],
        THEME["light"]["fsreGradient2"],
        THEME["light"]["fsreGradient3"],
      ]}
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
