import { PropsWithChildren } from "react";
import { View } from "react-native";

export type ModalFooterProps = PropsWithChildren;

export default function ModalFooter({ children }: ModalFooterProps) {
  return <View className="gap-3 p-6 pt-0">{children}</View>;
}
