import { PropsWithChildren } from "react";
import { StyleSheet, Text } from "react-native";

export type ModalTitleProps = PropsWithChildren;

export default function ModalTitle({ children }: ModalTitleProps) {
  return <Text style={styles.modalTitle}>{children}</Text>;
}

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#1A1A1A",
  },
});
