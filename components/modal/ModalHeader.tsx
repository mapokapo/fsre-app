import React, { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

export type ModalHeaderProps = PropsWithChildren;

export default function ModalHeader({ children }: ModalHeaderProps) {
  return <View style={styles.modalHeader}>{children}</View>;
}

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
});
