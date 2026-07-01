import Dots from "@/components/Dots";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Text } from "@/components/ui/text";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";

export type ChatbotHeaderRightProps = {
  isAnimating: boolean;
  onClearChat?: () => void;
  disabled?: boolean;
};

export default function ChatbotHeaderRight({
  isAnimating,
  onClearChat,
  disabled = false,
}: Readonly<ChatbotHeaderRightProps>) {
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        disabled={disabled}>
        <Pressable
          accessibilityLabel={t("chatbot.menu.a11y")}
          accessibilityRole="button"
          disabled={disabled}
          hitSlop={12}>
          <Dots isAnimating={isAnimating} />
        </Pressable>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom">
        <DropdownMenuItem
          variant="destructive"
          disabled={disabled || onClearChat === undefined}
          onPress={onClearChat}>
          <Text>{t("chatbot.menu.clearChat")}</Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
