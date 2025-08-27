import Dots from "@/components/Dots";
import MessageItem from "@/components/partials/MessageItem";
import QuickQuestionItem from "@/components/partials/QuickQuestionItem";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import useIntroAnimation from "@/lib/hooks/useIntroAnimation";
import { useKeyboard } from "@/lib/hooks/useKeyboardHeight";
import Message from "@/lib/types/Message";
import QuickQuestion from "@/lib/types/QuickQuestion";
import { useNavigation } from "expo-router";
import { MessageSquare, Send, Zap } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import Animated from "react-native-reanimated";

const predefinedResponses: { [key: string]: string } = {
  raspored:
    'Možete pronaći raspored predavanja u sekciji "Raspored" u aplikaciji. Tamo možete filtrirati po godini studija i smjeru. 📅',
  ispiti:
    "Prijava za ispite se vrši preko Studomat sistema. Trenutno je otvorena prijava za zimski ispitni rok do 15. siječnja. 📝",
  laboratoriji:
    "FSRE ima moderne laboratorije za strojarstvo, računarstvo i elektrotehniku. Za rezervaciju laboratorija kontaktirajte nadležne asistente. 🔬",
  stipendije:
    "Informacije o stipendijama možete pronaći na službenim stranicama fakulteta ili se obratiti studentskoj službi. 💰",
  upis: "Upis u novu akademsku godinu počinje u lipnju. Detaljan raspored i uvjete možete naći na web stranici fakulteta. 🎓",
  kontakt:
    "Fakultet se nalazi na adresi Matice hrvatske bb, 88000 Mostar. Telefon: +387 36 355 025, Email: info@fsre.sum.ba 📍",
  ebook:
    "Elektronski udžbenici su dostupni preko eLearning platforme. Prijavite se s vašim studentskim podacima. 📚",
  wifi: 'WiFi mreža "FSRE-Student" je dostupna studentima. Podaci za prijavu se dobivaju u studentskoj službi. 📶',
};

const quickQuestions: QuickQuestion[] = [
  {
    text: "Gdje mogu vidjeti raspored?",
    icon: MessageSquare,
    gradientFrom: "#667eea",
    gradientTo: "#764ba2",
    description: "Pronađite raspored predavanja i vježbi",
  },
  {
    text: "Kako se prijaviti za ispite?",
    icon: Zap,
    gradientFrom: "#f093fb",
    gradientTo: "#f5576c",
    description: "Informacije o prijavi ispita",
  },
  {
    text: "Kontakt informacije",
    icon: MessageSquare,
    gradientFrom: "#4facfe",
    gradientTo: "#00f2fe",
    description: "Adresa, telefon i email fakulteta",
  },
  {
    text: "O laboratorijima",
    icon: Zap,
    gradientFrom: "#43e97b",
    gradientTo: "#38f9d7",
    description: "Informacije o laboratorijskim vježbama",
  },
];

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-message",
      text: "Pozdrav! 👋 Ja sam FSRE AI asistent. Kako vam mogu pomoći danas? Možete me pitati o rasporedu, ispitima, laboratorijima, stipendijama ili bilo čemu drugom vezanom za fakultet.",
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
    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (input.includes(key)) {
        return response;
      }
    }

    if (input.includes("hvala") || input.includes("thanks")) {
      return "Nema na čemu! 😊 Ako imate još pitanja, slobodno pitajte.";
    }

    if (
      input.includes("pozdrav") ||
      input.includes("bok") ||
      input.includes("hello")
    ) {
      return "Pozdrav! 👋 Kako vam mogu pomoći?";
    }

    return "Izvinjavam se, ali nisam siguran kako da odgovorim na to pitanje. 🤔 Možete me pitati o rasporedu, ispitima, laboratorijima, stipendijama, upisu ili kontakt informacijama. Također možete kontaktirati studentsku službu za detaljnije informacije.";
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
                onPress={() => handleQuickQuestion(question.text)}
                style={introAnimatedStyle}
              />
            ))}
          </ScrollView>
        )}
        <View className="mx-4 flex-row items-center rounded-full bg-secondary shadow-md shadow-black/35">
          <Input
            className="h-auto flex-1 rounded-full border-transparent bg-transparent px-4 py-5"
            placeholder="Unesite vaše pitanje..."
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
