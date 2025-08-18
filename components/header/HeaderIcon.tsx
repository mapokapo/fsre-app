import { Sparkles } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

export default function HeaderIcon() {
  return (
    <View style={styles.headerIcon}>
      <Sparkles
        color="#ffffff"
        size={24}
        strokeWidth={2.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
});
