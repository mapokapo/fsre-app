import QuickQuestionItem from "@/components/partials/QuickQuestionItem";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import QuickQuestion from "@/lib/types/QuickQuestion";
import { TFunction } from "i18next";
import { Send } from "lucide-react-native";
import {
  KeyboardAvoidingView,
  LayoutChangeEvent,
  ScrollView,
  View,
  ViewStyle,
} from "react-native";

export type ChatbotComposerProps = {
  t: TFunction;
  inputText: string;
  isLoading: boolean;
  showQuickQuestions: boolean;
  quickQuestions: QuickQuestion[];
  introAnimatedStyle: ViewStyle;
  onInputChange: (text: string) => void;
  onSend: () => void;
  onQuickQuestion: (question: string) => void;
  onLayout: (event: LayoutChangeEvent) => void;
};

export default function ChatbotComposer({
  t,
  inputText,
  isLoading,
  showQuickQuestions,
  quickQuestions,
  introAnimatedStyle,
  onInputChange,
  onSend,
  onQuickQuestion,
  onLayout,
}: Readonly<ChatbotComposerProps>) {
  const isSendDisabled = inputText.trim() === "" || isLoading;

  return (
    <KeyboardAvoidingView
      behavior="position"
      className="absolute bottom-8 left-0 right-0"
      keyboardVerticalOffset={175}
      onLayout={onLayout}>
      {showQuickQuestions && (
        <ScrollView
          horizontal
          contentContainerClassName="mt-auto pb-3 justify-center gap-3 min-w-full px-4">
          {quickQuestions.map(question => {
            const questionText = question.text(t);

            return (
              <QuickQuestionItem
                key={questionText}
                question={question}
                onPress={() => onQuickQuestion(questionText)}
                style={introAnimatedStyle}
              />
            );
          })}
        </ScrollView>
      )}
      <View className="mx-4 flex-row items-center rounded-full bg-secondary shadow-md shadow-black/35">
        <Input
          className="h-auto flex-1 rounded-full border-transparent bg-transparent px-4 py-5"
          placeholder={t("chatbot.input.placeholder")}
          value={inputText}
          onChangeText={onInputChange}
          maxLength={500}
          onSubmitEditing={onSend}
        />
        <Button
          size="icon"
          className="mr-2 h-12 w-12 overflow-hidden rounded-full"
          onPress={onSend}
          disabled={isSendDisabled}>
          <Icon
            as={Send}
            className="text-fsre-gradient-foreground"
            size={22}
            strokeWidth={2.5}
          />
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
