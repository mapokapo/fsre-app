import { describe, expect, test } from "bun:test";

import Message from "@/lib/types/Message";
import { toConversationHistory } from "@/lib/utils/chatbot";

function makeMessage(
  overrides: Partial<Message> & Pick<Message, "id" | "text" | "isUser">
): Message {
  return {
    timestamp: new Date("2026-01-01T12:00:00Z"),
    ...overrides,
  };
}

describe("toConversationHistory", () => {
  test("maps messages to Gemini roles and drops the initial placeholder", () => {
    const history = toConversationHistory([
      makeMessage({
        id: "initial-message",
        text: "Welcome",
        isUser: false,
      }),
      makeMessage({
        id: "user-1",
        text: "Hello",
        isUser: true,
      }),
      makeMessage({
        id: "bot-1",
        text: "Hi there",
        isUser: false,
      }),
    ]);

    expect(history).toEqual([
      { text: "Hello", role: "user" },
      { text: "Hi there", role: "model" },
    ]);
  });

  test("removes trailing user messages when dropTrailingUser is true", () => {
    const history = toConversationHistory(
      [
        makeMessage({ id: "user-1", text: "First question", isUser: true }),
        makeMessage({ id: "bot-1", text: "First answer", isUser: false }),
        makeMessage({ id: "user-2", text: "Follow-up", isUser: true }),
      ],
      { dropTrailingUser: true }
    );

    expect(history).toEqual([
      { text: "First question", role: "user" },
      { text: "First answer", role: "model" },
    ]);
  });

  test("keeps trailing user messages by default", () => {
    const history = toConversationHistory([
      makeMessage({ id: "user-1", text: "Pending question", isUser: true }),
    ]);

    expect(history).toEqual([{ text: "Pending question", role: "user" }]);
  });
});
