import MessageItem from "@/components/partials/MessageItem";
import Message from "@/lib/types/Message";
import { RefObject } from "react";
import { Platform, ViewStyle } from "react-native";
import { KeyboardChatScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BOTTOM_MARGIN = -64;

const typingIndicator: Message = {
  id: "typing-indicator",
  text: "",
  isUser: false,
  timestamp: new Date(),
  typing: true,
};

function getDisplayedMessages(
  messages: Message[],
  isLoading: boolean
): Message[] {
  if (!isLoading) {
    return messages;
  }

  return [...messages, typingIndicator];
}

export type ChatbotMessageListProps = {
  messages: Message[];
  isLoading: boolean;
  retryMessageId: string | null;
  onRetry: (userMessageId: string) => void;
  introAnimatedOpacityStyle: ViewStyle;
  scrollViewRef: RefObject<React.ComponentRef<
    typeof KeyboardChatScrollView
  > | null>;
};

export default function ChatbotMessageList({
  messages,
  isLoading,
  retryMessageId,
  onRetry,
  introAnimatedOpacityStyle,
  scrollViewRef,
}: Readonly<ChatbotMessageListProps>) {
  const { bottom } = useSafeAreaInsets();
  const displayedMessages = getDisplayedMessages(messages, isLoading);

  return (
    <KeyboardChatScrollView
      ref={scrollViewRef}
      style={{ flex: 1 }}
      contentContainerClassName="p-4 gap-4"
      keyboardDismissMode="interactive"
      automaticallyAdjustContentInsets={false}
      applyWorkaroundForContentInsetHitTestBug={Platform.OS === "ios"}
      offset={Math.max(bottom - BOTTOM_MARGIN, 0)}>
      {displayedMessages.map(message => (
        <MessageItem
          key={message.id}
          message={message}
          showRetry={!isLoading && message.id === retryMessageId}
          onRetry={() => onRetry(message.id)}
          style={introAnimatedOpacityStyle}
        />
      ))}
    </KeyboardChatScrollView>
  );
}
