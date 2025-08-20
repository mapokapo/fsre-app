import { LinearGradient } from "expo-linear-gradient";
import { UserIcon } from "lucide-react-native";
import { StyleSheet } from "react-native";

export default function HeaderProfileButton() {
  return (
    <LinearGradient
      colors={["rgba(255, 255, 255, 0.2)", "rgba(255, 255, 255, 0.1)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.profileButtonGradient}>
      <UserIcon
        color="#ffffff"
        size={22}
        strokeWidth={2.5}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  profileButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    elevation: 22,
  },
});
