import React, { PropsWithChildren } from "react";
import { View } from "react-native";

export type ModalHeaderProps = PropsWithChildren;

export default function ModalHeader({ children }: ModalHeaderProps) {
  return (
    <View className="flex-row items-center justify-between border-b border-b-border p-6">
      {children}
    </View>
  );
}
