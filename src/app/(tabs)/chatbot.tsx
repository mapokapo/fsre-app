import Dots from "@/components/Dots";
import MessageItem from "@/components/partials/MessageItem";
import QuickQuestionItem from "@/components/partials/QuickQuestionItem";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { quickQuestions } from "@/lib/const/quickQuestions";
import useIntroAnimation from "@/lib/hooks/useIntroAnimation";
import { useKeyboard } from "@/lib/hooks/useKeyboardHeight";
import {
  createGeminiChat,
  generateGeminiResponse,
} from "@/lib/services/gemini";
import Message from "@/lib/types/Message";
import { Chat } from "@google/genai";
import { useNavigation } from "expo-router";
import { Send } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import Animated from "react-native-reanimated";

export default function ChatbotScreen() {
  const { t } = useTranslation();
  const [geminiChat, setGeminiChat] = useState<Chat | null>(null);
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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Dots isAnimating={isLoading} />,
    });
  }, [isLoading, navigation]);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  useEffect(() => {
    async function initChat() {
      try {
        const chat = await createGeminiChat();
        setGeminiChat(chat);
      } catch (error) {
        console.error("Error initializing Gemini chat:", error);
      }
    }

    initChat();
  }, []);

  const handleSend = async () => {
    if (inputText.trim() === "" || isLoading || !geminiChat) return;

    setIsLoading(true);
    setInputText("");

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    const botResponse = await generateGeminiResponse(
      geminiChat,
      inputText.trim()
    );

    if (!botResponse.isSuccess) {
      const errorMessage: Message = {
        id: `bot-${Date.now()}`,
        text: t("chatbot.error"),
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

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  return (
    <View className="flex-1 bg-background">
      <Animated.ScrollView
        ref={scrollViewRef}
        contentContainerClassName="p-4 gap-4"
        contentContainerStyle={{
          paddingBottom:
            bottomContainerHeight + Math.max(keyboardHeight - 80, 0),
        }}>
        {[
          ...messages,
          ...(isLoading
            ? [
                {
                  id: "typing-indicator",
                  text: "",
                  isUser: false,
                  timestamp: new Date(),
                  typing: true,
                },
              ]
            : []),
        ].map(message => (
          <MessageItem
            key={message.id}
            message={message}
            style={introAnimatedOpacityStyle}
          />
        ))}
      </Animated.ScrollView>
      <KeyboardAvoidingView
        behavior="position"
        className="absolute bottom-8 left-0 right-0"
        keyboardVerticalOffset={175}
        onLayout={e =>
          setBottomContainerHeight(e.nativeEvent.layout.height + 48)
        }>
        {messages.length === 1 && (
          <ScrollView
            horizontal
            contentContainerClassName="mt-auto pb-3 justify-center gap-3 min-w-full px-4">
            {quickQuestions.map((question, index) => (
              <QuickQuestionItem
                key={index}
                question={question}
                onPress={() => handleQuickQuestion(question.text(t))}
                style={introAnimatedStyle}
              />
            ))}
          </ScrollView>
        )}
        <View className="mx-4 flex-row items-center rounded-full bg-secondary shadow-md shadow-black/35">
          <Input
            className="h-auto flex-1 rounded-full border-transparent bg-transparent px-4 py-5"
            placeholder={t("chatbot.input.placeholder")}
            value={inputText}
            onChangeText={setInputText}
            maxLength={500}
            onSubmitEditing={handleSend}
          />
          <Button
            size="icon"
            className="mr-2 h-12 w-12 overflow-hidden rounded-full"
            onPress={handleSend}
            disabled={inputText.trim() === "" || isLoading}>
            <Icon
              as={Send}
              className="text-fsre-gradient-foreground"
              size={22}
              strokeWidth={2.5}
            />
          </Button>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
