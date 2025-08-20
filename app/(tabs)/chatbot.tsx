import Dots from "@/components/Dots";
import useIntroAnimation from "@/hooks/useIntroAnimation";
import useKeyboardVisibility from "@/hooks/useKeyboardVisibility";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import {
  Bot,
  ChevronRight,
  LucideIcon,
  MessageSquare,
  Send,
  User,
  Zap,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ColorValue,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  typing?: boolean;
}

interface QuickQuestion {
  text: string;
  icon: LucideIcon;
  gradient: [ColorValue, ColorValue, ...ColorValue[]];
  description: string;
}

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
    gradient: ["#667eea", "#764ba2"],
    description: "Pronađite raspored predavanja i vježbi",
  },
  {
    text: "Kako se prijaviti za ispite?",
    icon: Zap,
    gradient: ["#f093fb", "#f5576c"],
    description: "Informacije o prijavi ispita",
  },
  {
    text: "Kontakt informacije",
    icon: MessageSquare,
    gradient: ["#4facfe", "#00f2fe"],
    description: "Adresa, telefon i email fakulteta",
  },
  {
    text: "O laboratorijima",
    icon: Zap,
    gradient: ["#43e97b", "#38f9d7"],
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

  const navigation = useNavigation();
  const { isKeyboardVisible } = useKeyboardVisibility();
  const { introAnimationStyle } = useIntroAnimation();

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("hr-HR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      {/* Messages */}
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}>
          {messages.map(message => (
            <Animated.View
              key={message.id}
              style={[
                styles.messageContainer,
                introAnimationStyle,
                message.isUser ? styles.userMessage : styles.botMessage,
              ]}>
              {!message.isUser && (
                <View style={styles.botAvatar}>
                  <LinearGradient
                    colors={["#4ECDC4", "#44A08D"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.botAvatarGradient}>
                    <Bot
                      color="#ffffff"
                      size={18}
                      strokeWidth={2.5}
                    />
                  </LinearGradient>
                </View>
              )}

              <View
                style={[
                  styles.messageBubble,
                  message.isUser ? styles.userBubble : styles.botBubble,
                ]}>
                {message.typing ? (
                  <Dots
                    color="#4ECDC4"
                    isAnimating={message.typing}
                  />
                ) : (
                  <>
                    <Text
                      style={[
                        styles.messageText,
                        message.isUser ? styles.userText : styles.botText,
                      ]}>
                      {message.text}
                    </Text>
                    <Text
                      style={[
                        styles.messageTime,
                        message.isUser ? styles.userTime : styles.botTime,
                      ]}>
                      {formatTime(message.timestamp)}
                    </Text>
                  </>
                )}
              </View>

              {message.isUser && (
                <View style={styles.userAvatar}>
                  <LinearGradient
                    colors={["#0A4977", "#1E5A8A"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.userAvatarGradient}>
                    <User
                      color="#ffffff"
                      size={18}
                      strokeWidth={2.5}
                    />
                  </LinearGradient>
                </View>
              )}
            </Animated.View>
          ))}
        </ScrollView>
      </View>

      {/* Input - Fixed positioning with keyboard handling */}
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.inputContainer}>
        {!isKeyboardVisible && messages.length === 1 && (
          <Animated.View
            style={[styles.quickQuestionsContainer, introAnimationStyle]}>
            <Text style={styles.quickQuestionsTitle}>Brza pitanja:</Text>
            <ScrollView
              horizontal
              contentContainerStyle={styles.quickQuestionsList}>
              {quickQuestions.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickQuestionButton}
                  onPress={() => handleQuickQuestion(question.text)}
                  activeOpacity={0.8}>
                  <LinearGradient
                    colors={[
                      "rgba(255, 255, 255, 0.95)",
                      "rgba(248, 250, 252, 0.95)",
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.quickQuestionGradient}>
                    <View style={styles.quickQuestionHeader}>
                      <LinearGradient
                        colors={question.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.quickQuestionIcon}>
                        <question.icon
                          color="#ffffff"
                          size={18}
                          strokeWidth={2.5}
                        />
                      </LinearGradient>
                      <ChevronRight
                        color="#94A3B8"
                        size={16}
                        strokeWidth={2.5}
                      />
                    </View>
                    <Text style={styles.quickQuestionText}>
                      {question.text}
                    </Text>
                    <Text style={styles.quickQuestionDescription}>
                      {question.description}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}
        <View
          style={[
            styles.inputWrapper,
            isKeyboardVisible && {
              bottom: 16,
            },
          ]}>
          <TextInput
            style={styles.textInput}
            placeholder="Unesite vaše pitanje..."
            placeholderTextColor="#94A3B8"
            value={inputText}
            onChangeText={setInputText}
            maxLength={500}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() === "" && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={inputText.trim() === "" || isTyping}
            activeOpacity={0.8}>
            <LinearGradient
              colors={
                inputText.trim() === ""
                  ? ["#E2E8F0", "#E2E8F0"]
                  : ["#0A4977", "#1E5A8A"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sendButtonGradient}>
              <Send
                color={inputText.trim() === "" ? "#94A3B8" : "#ffffff"}
                size={20}
                strokeWidth={2.5}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    marginBottom: 30,
  },
  messagesContainer: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 22,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-end",
  },
  userMessage: {
    justifyContent: "flex-end",
  },
  botMessage: {
    justifyContent: "flex-start",
  },
  botAvatar: {
    marginRight: 14,
    marginBottom: 5,
  },
  botAvatarGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  userAvatar: {
    marginLeft: 14,
    marginBottom: 5,
  },
  userAvatarGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  messageBubble: {
    maxWidth: "75%",
    borderRadius: 22,
    padding: 18,
  },
  userBubble: {
    backgroundColor: "#0A4977",
    borderBottomRightRadius: 8,
  },
  botBubble: {
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 8,
    boxShadow: "0px 3px 10px rgba(10, 73, 119, 0.1)",
    elevation: 6,
  },
  messageText: {
    fontSize: 15,
    fontFamily: "Inter-Regular",
    lineHeight: 22,
    marginBottom: 8,
  },
  userText: {
    color: "#ffffff",
  },
  botText: {
    color: "#1A1A1A",
  },
  messageTime: {
    fontSize: 11,
    fontFamily: "Inter-Medium",
    alignSelf: "flex-end",
  },
  userTime: {
    color: "rgba(255, 255, 255, 0.6)",
  },
  botTime: {
    color: "#94A3B8",
  },
  quickQuestionsContainer: {
    marginTop: "auto",
  },
  quickQuestionsList: {
    paddingVertical: 10,
    justifyContent: "center",
    gap: 12,
    minWidth: "100%",
    paddingHorizontal: 16,
  },
  quickQuestionsTitle: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#1A1A1A",
    marginBottom: 18,
  },
  quickQuestionButton: {
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "0px 4px 12px rgba(10, 73, 119, 0.1)",
    elevation: 6,
    flex: 1,
    minWidth: 120,
  },
  quickQuestionGradient: {
    padding: 20,
  },
  quickQuestionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  quickQuestionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  quickQuestionText: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  quickQuestionDescription: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    color: "#64748B",
    lineHeight: 18,
  },
  inputContainer: {
    marginHorizontal: 16,
    gap: 16,
    backgroundColor: "transparent",
    bottom: 15,
  },
  inputWrapper: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 22,
    paddingVertical: 14,
    boxShadow: "0px 10px 20px rgba(10, 73, 119, 0.18)",
    elevation: 15,
  },
  textInput: {
    flex: 1,
    fontFamily: "Inter-Regular",
    color: "#1A1A1A",
    height: 40,
    lineHeight: 30,
  },
  sendButton: {
    marginLeft: 14,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});
