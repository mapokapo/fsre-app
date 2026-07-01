import { describe, expect, test } from "bun:test";

import { getCachedQuickQuestionResponse } from "@/lib/const/quickQuestionCache";
import { resources } from "@/lib/i18n/resources";

describe("getCachedQuickQuestionResponse", () => {
  const contactQuestion =
    resources.hr.translation.chatbot.quickQuestions.contact.text;
  const contactResponse =
    resources.hr.translation.chatbot.quickQuestions.contact.response;

  test("returns a cached response for a known quick question", () => {
    expect(getCachedQuickQuestionResponse(contactQuestion)).toBe(
      contactResponse
    );
  });

  test("matches prompts case-insensitively and ignoring whitespace", () => {
    expect(
      getCachedQuickQuestionResponse(
        contactQuestion.toUpperCase().replace(/\s/g, "  ")
      )
    ).toBe(contactResponse);
  });

  test("returns null for unknown prompts", () => {
    expect(
      getCachedQuickQuestionResponse("totally unknown question")
    ).toBeNull();
  });
});
