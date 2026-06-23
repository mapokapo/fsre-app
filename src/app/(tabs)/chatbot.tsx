import ChatbotComposer, {
  CHAT_INPUT_NATIVE_ID,
} from "@/components/partials/ChatbotComposer";
import ChatbotHeaderRight from "@/components/partials/ChatbotHeaderRight";
import ChatbotMessageList from "@/components/partials/ChatbotMessageList";
import { quickQuestions } from "@/lib/const/quickQuestions";
import useIntroAnimation from "@/lib/hooks/useIntroAnimation";
import { useNavigationHeaderRight } from "@/lib/hooks/useNavigationHeaderRight";
import {
  generateGoogleGenAIResponse,
  type ConversationMessage,
} from "@/lib/services/googleGenAI";
import Message from "@/lib/types/Message";
import { toConversationHistory } from "@/lib/utils/chatbot";
import { useNavigation } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import {
  KeyboardChatScrollView,
  KeyboardGestureArea,
} from "react-native-keyboard-controller";

export default function ChatbotScreen() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-message",
      text: t("chatbot.intro"),
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<React.ComponentRef<
    typeof KeyboardChatScrollView
  > | null>(null);

  const navigation = useNavigation();
  const { introAnimatedStyle, introAnimatedOpacityStyle } = useIntroAnimation();

  useNavigationHeaderRight(navigation, ChatbotHeaderRight, {
    isAnimating: isLoading,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    return () => clearTimeout(timer);
  }, [messages]);

  useEffect(() => {
    setMessages(prev =>
      prev.map(message =>
        message.id === "initial-message"
          ? { ...message, text: t("chatbot.intro") }
          : message
      )
    );
  }, [t]);

  const fetchBotResponse = useCallback(
    async (
      userText: string,
      history: ConversationMessage[],
      userMessageId: string
    ) => {
      setIsLoading(true);
      setMessages(prev =>
        prev.map(message =>
          message.id === userMessageId
            ? { ...message, error: undefined }
            : message
        )
      );

      const botResponse = await generateGoogleGenAIResponse(userText, history);
      if (botResponse.isSuccess) {
        setMessages(prev => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            text: botResponse.response,
            isUser: false,
            timestamp: new Date(),
          },
        ]);
      } else {
        const errorText =
          botResponse.errorType === "busy"
            ? t("chatbot.error.busy")
            : t("chatbot.error.generic");
        setMessages(prev =>
          prev.map(message =>
            message.id === userMessageId
              ? { ...message, error: errorText }
              : message
          )
        );
      }
      setIsLoading(false);
    },
    [t]
  );

  const handleSend = async () => {
    if (inputText.trim() === "" || isLoading) return;

    const userText = inputText.trim();
    setInputText("");

    const history = toConversationHistory(messages, { dropTrailingUser: true });
    const userMessageId = `user-${Date.now()}`;

    setMessages(prev => [
      ...prev,
      {
        id: userMessageId,
        text: userText,
        isUser: true,
        timestamp: new Date(),
      },
    ]);

    await fetchBotResponse(userText, history, userMessageId);
  };

  const lastUserMessageId = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i]!.isUser) return messages[i]!.id;
    }
    return null;
  }, [messages]);

  const handleRetry = useCallback(
    async (userMessageId: string) => {
      if (isLoading) return;

      const userIndex = messages.findIndex(
        message => message.id === userMessageId
      );
      if (userIndex === -1) return;

      const userMessage = messages[userIndex]!;
      const history = toConversationHistory(messages.slice(0, userIndex));

      setMessages(prev => prev.slice(0, userIndex + 1));
      await fetchBotResponse(userMessage.text, history, userMessageId);
    },
    [fetchBotResponse, isLoading, messages]
  );

  const handleQuickQuestion = useCallback((question: string) => {
    setInputText(question);
  }, []);

  return (
    <View className="flex-1 bg-background">
      <KeyboardGestureArea
        interpolator="ios"
        enableSwipeToDismiss={false}
        style={{ flex: 1 }}
        textInputNativeID={CHAT_INPUT_NATIVE_ID}>
        <ChatbotMessageList
          messages={messages}
          isLoading={isLoading}
          retryMessageId={lastUserMessageId}
          onRetry={handleRetry}
          introAnimatedOpacityStyle={introAnimatedOpacityStyle}
          scrollViewRef={scrollViewRef}
        />
        <ChatbotComposer
          t={t}
          inputText={inputText}
          isLoading={isLoading}
          showQuickQuestions={messages.length === 1}
          quickQuestions={quickQuestions}
          introAnimatedStyle={introAnimatedStyle}
          onInputChange={setInputText}
          onSend={handleSend}
          onQuickQuestion={handleQuickQuestion}
        />
      </KeyboardGestureArea>
    </View>
  );
}
