import Dots from "@/components/Dots";
import MessageItem from "@/components/partials/MessageItem";
import QuickQuestionItem from "@/components/partials/QuickQuestionItem";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { quickQuestions } from "@/lib/const/quickQuestions";
import useIntroAnimation from "@/lib/hooks/useIntroAnimation";
import { useKeyboard } from "@/lib/hooks/useKeyboardHeight";
import Message from "@/lib/types/Message";
import { useNavigation } from "expo-router";
import { Send } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import Animated from "react-native-reanimated";

const predefinedKeywords = {
  schedule: ["raspored", "schedule"],
  exams: ["ispiti", "exams"],
  labs: ["laboratoriji", "laboratorij", "labs", "lab"],
  scholarships: ["stipendije", "stipendija", "scholarships"],
  enrollment: ["upis", "enrollment"],
  contact: ["kontakt", "contact"],
  ebooks: ["ebook", "udžbenik", "ebooks", "books"],
  wifi: ["wifi", "wi-fi", "wi fi"],
  thanks: ["hvala", "thanks", "thank you"],
  greeting: ["pozdrav", "bok", "hello", "hi"],
} as const;

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

  const navigation = useNavigation();
  const { introAnimatedStyle, introAnimatedOpacityStyle } = useIntroAnimation();
  const { keyboardHeight } = useKeyboard();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Dots isAnimating={isTyping} />,
    });
  }, [isTyping, navigation]);

  const handleSend = () => {
    if (inputText.trim() === "" || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

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

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(inputText.toLowerCase());
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => prev.filter(msg => !msg.typing).concat([botMessage]));
      setIsTyping(false);
    }, 2000);
  };

  const getBotResponse = (input: string): string => {
    // keyword categories
    if (predefinedKeywords.schedule.some(k => input.includes(k))) {
      return t("chatbot.responses.schedule");
    }
    if (predefinedKeywords.exams.some(k => input.includes(k))) {
      return t("chatbot.responses.exams");
    }
    if (predefinedKeywords.labs.some(k => input.includes(k))) {
      return t("chatbot.responses.labs");
    }
    if (predefinedKeywords.scholarships.some(k => input.includes(k))) {
      return t("chatbot.responses.scholarships");
    }
    if (predefinedKeywords.enrollment.some(k => input.includes(k))) {
      return t("chatbot.responses.enrollment");
    }
    if (predefinedKeywords.contact.some(k => input.includes(k))) {
      return t("chatbot.responses.contact");
    }
    if (predefinedKeywords.ebooks.some(k => input.includes(k))) {
      return t("chatbot.responses.ebooks");
    }
    if (predefinedKeywords.wifi.some(k => input.includes(k))) {
      return t("chatbot.responses.wifi");
    }
    if (predefinedKeywords.thanks.some(k => input.includes(k))) {
      return t("chatbot.responses.thanks");
    }
    if (predefinedKeywords.greeting.some(k => input.includes(k))) {
      return t("chatbot.responses.greeting");
    }
    return t("chatbot.responses.unknown");
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  return (
    <View className="flex-1 bg-background">
      <Animated.ScrollView
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
