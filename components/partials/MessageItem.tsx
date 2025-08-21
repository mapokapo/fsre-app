import Dots from "@/components/Dots";
import Message from "@/lib/types/Message";
import { format } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { Bot, User } from "lucide-react-native";
import { StyleSheet, Text, View, ViewProps } from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";

export type MessageItemProps = AnimatedProps<ViewProps> & {
  message: Message;
};

export default function MessageItem({
  message,
  style,
  ...props
}: MessageItemProps) {
  return (
    <Animated.View
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.botMessage,
        style,
      ]}
      {...props}>
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
              {format(message.timestamp, "HH:mm")}
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
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
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
});
