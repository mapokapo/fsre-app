import { LinearGradient } from "expo-linear-gradient";
import React, { PropsWithChildren, ReactNode } from "react";
import {
  Dimensions,
  Modal as RNModal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export type ModalProps = PropsWithChildren & {
  isVisible: boolean;
  onClose: () => void;
};

export default function Modal({ isVisible, onClose, children }: ModalProps) {
  let modalHeader: ReactNode | null = null;
  let modalContent: ReactNode | null = null;
  let modalFooter: ReactNode | null = null;
  const defaultChildren: ReactNode[] = [];

  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) return;

    if (typeof child.type === "string" || !("name" in child.type)) return;

    switch (child.type.name) {
      case "ModalHeader":
        modalHeader = child;
        break;
      case "ModalContent":
        modalContent = child;
        break;
      case "ModalFooter":
        modalFooter = child;
        break;
      default:
        defaultChildren.push(child);
    }
  });

  return (
    <RNModal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modal}>
          <LinearGradient
            colors={["#ffffff", "#f8fafc"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.modalGradient}>
            {modalHeader}
            {modalContent}
            {modalFooter}
          </LinearGradient>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modal: {
    width: width - 48,
    maxWidth: 400,
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "0px 20px 25px rgba(10, 73, 119, 0.25)",
    elevation: 20,
  },
  modalGradient: {
    padding: 0,
  },
});
