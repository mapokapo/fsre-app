import { X } from "lucide-react-native";
import { StyleSheet, TouchableOpacity } from "react-native";

export type ModalCloseButtonProps = {
  onClose: () => void;
};

export default function ModalCloseButton({ onClose }: ModalCloseButtonProps) {
  return (
    <TouchableOpacity
      style={styles.closeButton}
      onPress={onClose}
      activeOpacity={0.8}>
      <X
        color="#64748B"
        size={20}
        strokeWidth={2.5}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
});
