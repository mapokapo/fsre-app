import Dots from "@/components/Dots";
import MessageMarkdown from "@/components/partials/MessageMarkdown";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { THEME } from "@/lib/theme";
import Message from "@/lib/types/Message";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { Bot, User } from "lucide-react-native";
import { View, ViewProps } from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";

export type MessageItemProps = AnimatedProps<ViewProps> & {
  message: Message;
};

export default function MessageItem({ message, ...props }: MessageItemProps) {
  const { colorScheme } = useColorScheme();

  return (
    <Animated.View
      className={cn(
        "flex-row items-end",
        message.isUser ? "justify-end" : "justify-start"
      )}
      {...props}>
      {!message.isUser && (
        <View className="mb-1 mr-4">
          <LinearGradient
            colors={["#4ECDC4", "#44A08D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="h-10 w-10 items-center justify-center overflow-hidden rounded-full">
            <Icon
              as={Bot}
              className="text-fsre-gradient-foreground"
              size={22}
              strokeWidth={2.5}
            />
          </LinearGradient>
        </View>
      )}

      <View
        className={cn(
          "max-w-[75%] rounded-2xl p-4",
          message.isUser
            ? "rounded-br-md bg-fsre-gradient-1"
            : "rounded-bl-md bg-secondary shadow-md"
        )}>
        {message.typing ? (
          <Dots
            color="#4ECDC4"
            isAnimating={message.typing}
          />
        ) : (
          <>
            {message.isUser ? (
              <Text
                selectable
                className="mb-2 text-fsre-gradient-foreground">
                {message.text}
              </Text>
            ) : (
              <MessageMarkdown>{message.text}</MessageMarkdown>
            )}
            <Text
              className={cn(
                "self-end text-xs",
                message.isUser
                  ? "text-fsre-gradient-foreground/60"
                  : "text-muted-foreground"
              )}>
              {format(message.timestamp, "HH:mm")}
            </Text>
          </>
        )}
      </View>

      {message.isUser && (
        <View className="mb-1 ml-4">
          <LinearGradient
            colors={[
              THEME[colorScheme].fsreGradient1,
              THEME[colorScheme].fsreGradient2,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="h-10 w-10 items-center justify-center overflow-hidden rounded-full">
            <Icon
              as={User}
              className="text-fsre-gradient-foreground"
              size={22}
              strokeWidth={2.5}
            />
          </LinearGradient>
        </View>
      )}
    </Animated.View>
  );
}
