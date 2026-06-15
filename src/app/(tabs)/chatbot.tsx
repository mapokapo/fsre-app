import ChatbotComposer from "@/components/partials/ChatbotComposer";
import ChatbotHeaderRight from "@/components/partials/ChatbotHeaderRight";
import ChatbotMessageList from "@/components/partials/ChatbotMessageList";
import { quickQuestions } from "@/lib/const/quickQuestions";
import useIntroAnimation from "@/lib/hooks/useIntroAnimation";
import { useKeyboard } from "@/lib/hooks/useKeyboardHeight";
import { useNavigationHeaderRight } from "@/lib/hooks/useNavigationHeaderRight";
import { generateGeminiResponse } from "@/lib/services/gemini";
import Message from "@/lib/types/Message";
import { useNavigation } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LayoutChangeEvent, View } from "react-native";
import Animated from "react-native-reanimated";

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
  const [bottomContainerHeight, setBottomContainerHeight] = useState(0);
  const scrollViewRef = useRef<Animated.ScrollView>(null);

  const navigation = useNavigation();
  const { introAnimatedStyle, introAnimatedOpacityStyle } = useIntroAnimation();
  const { keyboardHeight } = useKeyboard();

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

  const handleSend = async () => {
    if (inputText.trim() === "" || isLoading) return;

    setIsLoading(true);
    setInputText("");

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    const botResponse = await generateGeminiResponse(inputText.trim());

    if (!botResponse.isSuccess) {
      const errorMessage: Message = {
        id: `bot-${Date.now()}`,
        text:
          botResponse.errorType === "busy"
            ? t("chatbot.error.busy")
            : t("chatbot.error.generic"),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
      return;
    }

    const botText = botResponse.response;
    const botMessage: Message = {
      id: `bot-${Date.now()}`,
      text: botText,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, botMessage]);

    setIsLoading(false);
  };

  const handleQuickQuestion = useCallback((question: string) => {
    setInputText(question);
  }, []);

  const handleComposerLayout = useCallback((event: LayoutChangeEvent) => {
    setBottomContainerHeight(event.nativeEvent.layout.height + 80);
  }, []);

  return (
    <View className="flex-1 bg-background">
      <ChatbotMessageList
        messages={messages}
        isLoading={isLoading}
        introAnimatedOpacityStyle={introAnimatedOpacityStyle}
        scrollViewRef={scrollViewRef}
        bottomContainerHeight={bottomContainerHeight}
        keyboardHeight={keyboardHeight}
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
        onLayout={handleComposerLayout}
      />
    </View>
  );
}
