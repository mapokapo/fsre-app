import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

export type ModalContentProps = PropsWithChildren;

export default function ModalContent({ children }: ModalContentProps) {
  return <View style={styles.modalContent}>{children}</View>;
}

const styles = StyleSheet.create({
  modalContent: {
    padding: 24,
    alignItems: "center",
  },
});
