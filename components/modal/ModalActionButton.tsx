import { ChevronRight } from "lucide-react-native";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

export type ModalActionButtonProps = TouchableOpacityProps & {
  icon: React.ReactNode;
  text: string;
  textStyle?: StyleProp<TextStyle>;
};

export default function ModalActionButton({
  onPress,
  icon,
  text,
  textStyle,
}: ModalActionButtonProps) {
  return (
    <TouchableOpacity
      style={styles.modalActionButton}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.modalActionButtonContent}>
        <View style={styles.modalActionIcon}>{icon}</View>
        <Text style={[styles.modalActionButtonText, textStyle]}>{text}</Text>
        <ChevronRight
          color="#94A3B8"
          size={16}
          strokeWidth={2.5}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  modalActionButton: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  modalActionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  modalActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(10, 73, 119, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  modalActionButtonText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#1A1A1A",
  },
});
