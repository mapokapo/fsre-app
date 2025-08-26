import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { THEME } from "@/lib/theme";
import QuickQuestion from "@/lib/types/QuickQuestion";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { View, ViewProps } from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";

export type QuickQuestionItemProps = AnimatedProps<ViewProps> & {
  question: QuickQuestion;
  onPress: () => void;
};

export default function QuickQuestionItem({
  question,
  onPress,
  ...props
}: QuickQuestionItemProps) {
  const { colorScheme } = useColorScheme();

  return (
    <Animated.View
      className="min-w-32 flex-1 overflow-hidden rounded-2xl shadow-md"
      {...props}>
      <Button
        variant="ghost"
        className="h-auto overflow-hidden rounded-2xl p-0"
        onPress={onPress}>
        <LinearGradient
          colors={[
            THEME[colorScheme].cardGradient1,
            THEME[colorScheme].cardGradient2,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="p-5">
          <View className="mb-3 flex-row items-center justify-between">
            <LinearGradient
              colors={[question.gradientFrom, question.gradientTo]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="h-9 w-9 items-center justify-center overflow-hidden rounded-full">
              <Icon
                as={question.icon}
                className="text-fsre-gradient-foreground"
                size={18}
              />
            </LinearGradient>
            <Icon as={ChevronRight} />
          </View>
          <Text className="mb-2 font-semibold">{question.text}</Text>
          <Text className="text-sm text-muted-foreground">
            {question.description}
          </Text>
        </LinearGradient>
      </Button>
    </Animated.View>
  );
}
