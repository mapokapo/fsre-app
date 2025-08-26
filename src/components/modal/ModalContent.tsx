import { PropsWithChildren } from "react";
import { View } from "react-native";

export type ModalContentProps = PropsWithChildren;

export default function ModalContent({ children }: ModalContentProps) {
  return <View className="items-center p-6">{children}</View>;
}
