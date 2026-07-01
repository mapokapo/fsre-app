import ChatbotComposer, {
  CHAT_INPUT_NATIVE_ID,
} from "@/components/partials/ChatbotComposer";
import ChatbotHeaderRight from "@/components/partials/ChatbotHeaderRight";
import ChatbotMessageList from "@/components/partials/ChatbotMessageList";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { quickQuestions } from "@/lib/const/quickQuestions";
import useIntroAnimation from "@/lib/hooks/useIntroAnimation";
import { useNavigationHeaderRight } from "@/lib/hooks/useNavigationHeaderRight";
import {
  generateGoogleGenAIResponse,
  isGoogleGenAIApiKeyMissing,
  type ConversationMessage,
} from "@/lib/services/googleGenAI";
import Message from "@/lib/types/Message";
import { toConversationHistory } from "@/lib/utils/chatbot";
import { useNavigation } from "expo-router";
import { BotOff } from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Alert, View } from "react-native";
import {
  KeyboardChatScrollView,
  KeyboardGestureArea,
} from "react-native-keyboard-controller";

export default function ChatbotScreen() {
  const { t } = useTranslation();
  const isApiKeyMissing = isGoogleGenAIApiKeyMissing();
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

  const handleClearChat = useCallback(() => {
    if (isLoading) return;

    Alert.alert(t("chatbot.clear.title"), t("chatbot.clear.message"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("chatbot.clear.confirm"),
        style: "destructive",
        onPress: () => {
          setMessages([
            {
              id: "initial-message",
              text: t("chatbot.intro"),
              isUser: false,
              timestamp: new Date(),
            },
          ]);
          setInputText("");
          setIsLoading(false);
        },
      },
    ]);
  }, [isLoading, t]);

  const headerRightProps = useMemo(
    () => ({
      isAnimating: isLoading,
      onClearChat: handleClearChat,
      disabled: isLoading,
    }),
    [handleClearChat, isLoading]
  );

  useNavigationHeaderRight(navigation, ChatbotHeaderRight, headerRightProps);

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
    async (userText: string, history: ConversationMessage[]) => {
      setIsLoading(true);

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
            : botResponse.errorType === "unavailable"
              ? t("chatbot.error.unavailable")
              : t("chatbot.error.generic");
        setMessages(prev => [
          ...prev,
          {
            id: `bot-error-${Date.now()}`,
            text: errorText,
            isUser: false,
            isError: true,
            timestamp: new Date(),
          },
        ]);
      }
      setIsLoading(false);
    },
    [t]
  );

  const sendMessage = useCallback(
    async (userText: string) => {
      const trimmedText = userText.trim();
      if (trimmedText === "" || isLoading) return;

      const history = toConversationHistory(messages, {
        dropTrailingUser: true,
      });
      const userMessageId = `user-${Date.now()}`;

      setMessages(prev => [
        ...prev,
        {
          id: userMessageId,
          text: trimmedText,
          isUser: true,
          timestamp: new Date(),
        },
      ]);

      await fetchBotResponse(trimmedText, history);
    },
    [fetchBotResponse, isLoading, messages]
  );

  const handleSend = useCallback(() => {
    if (isApiKeyMissing) return;

    const userText = inputText.trim();
    if (userText === "") return;

    setInputText("");
    void sendMessage(userText);
  }, [inputText, isApiKeyMissing, sendMessage]);

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
      await fetchBotResponse(userMessage.text, history);
    },
    [fetchBotResponse, isLoading, messages]
  );

  const handleQuickQuestion = useCallback(
    (question: string) => {
      void sendMessage(question);
    },
    [sendMessage]
  );

  return (
    <View className="flex-1 bg-background">
      {isApiKeyMissing && (
        <View className="mx-4 mt-2 flex-row items-start gap-3 rounded-xl bg-destructive/15 px-4 py-3">
          <Icon
            as={BotOff}
            size={18}
            className="mt-0.5 text-destructive"
          />
          <Text className="flex-1 text-sm text-destructive">
            {t("chatbot.unavailable.banner")}
          </Text>
        </View>
      )}
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
          isUnavailable={isApiKeyMissing}
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
