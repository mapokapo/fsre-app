import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { X } from "lucide-react-native";

export type ModalCloseButtonProps = {
  onClose: () => void;
};

export default function ModalCloseButton({ onClose }: ModalCloseButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onPress={onClose}>
      <Icon
        as={X}
        size={20}
      />
    </Button>
  );
}
