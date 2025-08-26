import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { THEME } from "@/lib/theme";
import { LinearGradient } from "expo-linear-gradient";
import React, { PropsWithChildren, ReactNode } from "react";
import { Modal as RNModal, TouchableOpacity, View } from "react-native";

export type ModalProps = PropsWithChildren & {
  isVisible: boolean;
  onClose: () => void;
};

export default function Modal({ isVisible, onClose, children }: ModalProps) {
  const { colorScheme } = useColorScheme();

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
      <View className="flex-1 items-center justify-center bg-black/50">
        <TouchableOpacity
          className="absolute inset-0"
          activeOpacity={1}
          onPress={onClose}
        />
        <View className="w-10/12 max-w-md overflow-hidden rounded-2xl shadow-md">
          <LinearGradient
            colors={[
              THEME[colorScheme].cardGradient1,
              THEME[colorScheme].cardGradient2,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}>
            {modalHeader}
            {modalContent}
            {defaultChildren}
            {modalFooter}
          </LinearGradient>
        </View>
      </View>
    </RNModal>
  );
}
