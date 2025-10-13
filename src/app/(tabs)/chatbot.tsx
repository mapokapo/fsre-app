import Dots from "@/components/Dots";
import MessageItem from "@/components/partials/MessageItem";
import QuickQuestionItem from "@/components/partials/QuickQuestionItem";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { quickQuestions } from "@/lib/const/quickQuestions";
import useIntroAnimation from "@/lib/hooks/useIntroAnimation";
import { useKeyboard } from "@/lib/hooks/useKeyboardHeight";
import { generateGeminiResponse } from "@/lib/services/gemini";
import Message from "@/lib/types/Message";
import { useNavigation } from "expo-router";
import { Send } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
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
  const [isTyping, setIsTyping] = useState(false);
  const [bottomContainerHeight, setBottomContainerHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const navigation = useNavigation();
  const { introAnimatedStyle, introAnimatedOpacityStyle } = useIntroAnimation();
  const { keyboardHeight } = useKeyboard();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Dots isAnimating={isTyping} />,
    });
  }, [isTyping, navigation]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = async () => {
    if (inputText.trim() === "" || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    const userQuestion = inputText.trim();
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: `typing-${Date.now()}`,
      text: "",
      isUser: false,
      timestamp: new Date(),
      typing: true,
    };

    setTimeout(() => {
      setMessages(prev => [...prev, typingMessage]);
    }, 500);

    // Get AI response from Gemini
    try {
      const botResponse = await generateGeminiResponse(userQuestion);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => prev.filter(msg => !msg.typing).concat([botMessage]));
    } catch (error) {
      console.error("Error getting chatbot response:", error);
      const errorMessage: Message = {
        id: `bot-${Date.now()}`,
        text: t("chatbot.responses.unknown"),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => prev.filter(msg => !msg.typing).concat([errorMessage]));
    } finally {
      setIsTyping(false);
    }
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
        {messages.map(message => (
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
            disabled={inputText.trim() === "" || isTyping}>
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
