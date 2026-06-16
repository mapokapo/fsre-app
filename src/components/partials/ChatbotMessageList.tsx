import MessageItem from "@/components/partials/MessageItem";
import Message from "@/lib/types/Message";
import { RefObject } from "react";
import { ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

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
  introAnimatedOpacityStyle: ViewStyle;
  scrollViewRef: RefObject<Animated.ScrollView | null>;
  bottomContainerHeight: number;
  keyboardHeight: number;
};

export default function ChatbotMessageList({
  messages,
  isLoading,
  introAnimatedOpacityStyle,
  scrollViewRef,
  bottomContainerHeight,
  keyboardHeight,
}: Readonly<ChatbotMessageListProps>) {
  const displayedMessages = getDisplayedMessages(messages, isLoading);
  const paddingBottom =
    bottomContainerHeight + Math.max(keyboardHeight - 80, 0);

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      contentContainerClassName="p-4 gap-4"
      contentContainerStyle={{ paddingBottom }}>
      {displayedMessages.map(message => (
        <MessageItem
          key={message.id}
          message={message}
          style={introAnimatedOpacityStyle}
        />
      ))}
    </Animated.ScrollView>
  );
}
