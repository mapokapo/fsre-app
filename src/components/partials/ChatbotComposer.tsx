import QuickQuestionItem from "@/components/partials/QuickQuestionItem";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import QuickQuestion from "@/lib/types/QuickQuestion";
import { TFunction } from "i18next";
import { Send } from "lucide-react-native";
import { ScrollView, View, ViewStyle } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const CHAT_INPUT_NATIVE_ID = "chat-input";
const BOTTOM_MARGIN = -64;

export type ChatbotComposerProps = {
  t: TFunction;
  inputText: string;
  isLoading: boolean;
  isUnavailable: boolean;
  showQuickQuestions: boolean;
  quickQuestions: QuickQuestion[];
  introAnimatedStyle: ViewStyle;
  onInputChange: (text: string) => void;
  onSend: () => void;
  onQuickQuestion: (question: string) => void;
};

export default function ChatbotComposer({
  t,
  inputText,
  isLoading,
  isUnavailable,
  showQuickQuestions,
  quickQuestions,
  introAnimatedStyle,
  onInputChange,
  onSend,
  onQuickQuestion,
}: Readonly<ChatbotComposerProps>) {
  const { bottom } = useSafeAreaInsets();
  const isSendDisabled = isUnavailable || inputText.trim() === "" || isLoading;

  return (
    <KeyboardStickyView
      className="pb-8"
      offset={{ opened: Math.max(bottom - BOTTOM_MARGIN, 0) }}>
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
                disabled={isLoading}
              />
            );
          })}
        </ScrollView>
      )}
      <View className="mx-4 flex-row items-center rounded-full bg-secondary shadow-md shadow-black/35">
        <Input
          nativeID={CHAT_INPUT_NATIVE_ID}
          className="h-auto flex-1 rounded-full border-transparent bg-transparent px-4 py-5"
          placeholder={
            isUnavailable
              ? t("chatbot.unavailable.inputPlaceholder")
              : t("chatbot.input.placeholder")
          }
          value={inputText}
          onChangeText={onInputChange}
          maxLength={500}
          onSubmitEditing={onSend}
          editable={!isUnavailable && !isLoading}
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
    </KeyboardStickyView>
  );
}
