import { Text } from "@/components/ui/text";
import { PropsWithChildren } from "react";

export type ModalTitleProps = PropsWithChildren;

export default function ModalTitle({ children }: ModalTitleProps) {
  return <Text className="text-xl font-bold">{children}</Text>;
}
