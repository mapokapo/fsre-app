import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { THEME } from "@/lib/theme";
import QuickQuestion from "@/lib/types/QuickQuestion";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { View, ViewProps } from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";

export type QuickQuestionItemProps = AnimatedProps<ViewProps> & {
  question: QuickQuestion;
  onPress: () => void;
  disabled?: boolean;
};

export default function QuickQuestionItem({
  question,
  onPress,
  disabled = false,
  ...props
}: QuickQuestionItemProps) {
  const { colorScheme } = useColorScheme();
  const { t } = useTranslation();

  return (
    <Animated.View
      className="min-w-32 flex-1 overflow-hidden rounded-2xl shadow-md"
      {...props}>
      <Button
        variant="ghost"
        className="h-auto overflow-hidden rounded-2xl p-0 web:!h-auto"
        onPress={onPress}
        disabled={disabled}>
        <LinearGradient
          colors={[
            THEME[colorScheme].cardGradient1,
            THEME[colorScheme].cardGradient2,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="h-full w-full p-5">
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
          <Text className="mb-2 font-semibold">{question.text(t)}</Text>
          <Text className="text-sm text-muted-foreground">
            {question.description(t)}
          </Text>
        </LinearGradient>
      </Button>
    </Animated.View>
  );
}
