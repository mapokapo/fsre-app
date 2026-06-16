import type { ConversationMessage } from "@/lib/services/googleGenAI";
import Message from "@/lib/types/Message";

export function toConversationHistory(
  messages: Message[],
  { dropTrailingUser = false } = {}
): ConversationMessage[] {
  const history: ConversationMessage[] = messages
    .filter(message => message.id !== "initial-message")
    .map(message => ({
      text: message.text,
      role: message.isUser ? "user" : "model",
    }));

  if (dropTrailingUser) {
    while (history.length > 0 && history.at(-1)?.role === "user") {
      history.pop();
    }
  }

  return history;
}
