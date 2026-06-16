import { resources, supportedLanguages } from "@/lib/i18n/resources";

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s/g, "");
}

const responseByNormalizedPrompt = new Map<string, string>();

const quickQuestionKeys = Object.keys(
  resources[supportedLanguages[0]!]!.translation.chatbot.quickQuestions
);

for (const locale of supportedLanguages) {
  const quickQuestions = resources[locale]!.translation.chatbot.quickQuestions;

  for (const key of quickQuestionKeys) {
    const question = quickQuestions[key as keyof typeof quickQuestions];
    responseByNormalizedPrompt.set(normalize(question.text), question.response);
  }
}

export function getCachedQuickQuestionResponse(
  userMessage: string
): string | null {
  return responseByNormalizedPrompt.get(normalize(userMessage)) ?? null;
}
