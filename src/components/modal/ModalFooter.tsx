import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

export type ModalFooterProps = PropsWithChildren;

export default function ModalFooter({ children }: ModalFooterProps) {
  return <View style={styles.modalFooter}>{children}</View>;
}

const styles = StyleSheet.create({
  modalFooter: {
    padding: 24,
    paddingTop: 0,
    gap: 12,
  },
});
