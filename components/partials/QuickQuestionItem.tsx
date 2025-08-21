import QuickQuestion from "@/lib/types/QuickQuestion";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View, ViewProps } from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";

export type QuickQuestionItemProps = AnimatedProps<ViewProps> & {
  question: QuickQuestion;
  onPress: () => void;
};

export default function QuickQuestionItem({
  question,
  style,
  onPress,
  ...props
}: QuickQuestionItemProps) {
  return (
    <Animated.View
      style={[styles.quickQuestionButton, style]}
      {...props}>
      <Pressable onPress={onPress}>
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.95)", "rgba(248, 250, 252, 0.95)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.quickQuestionGradient}>
          <View style={styles.quickQuestionHeader}>
            <LinearGradient
              colors={[question.gradientFrom, question.gradientTo]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.quickQuestionIcon}>
              {React.cloneElement(
                question.icon as React.ReactElement<{
                  color: string;
                  size: number;
                  strokeWidth: number;
                }>,
                {
                  color: "#ffffff",
                  size: 18,
                  strokeWidth: 2.5,
                }
              )}
            </LinearGradient>
            <ChevronRight
              color="#94A3B8"
              size={16}
              strokeWidth={2.5}
            />
          </View>
          <Text style={styles.quickQuestionText}>{question.text}</Text>
          <Text style={styles.quickQuestionDescription}>
            {question.description}
          </Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  quickQuestionsTitle: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#1A1A1A",
    marginBottom: 18,
  },
  quickQuestionButton: {
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "0px 3px 10px rgba(10, 73, 119, 0.1)",
    elevation: 4,
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
});
