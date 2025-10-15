import { Chat, GoogleGenAI } from "@google/genai";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? "";

if (!API_KEY) {
  console.warn(
    "Gemini API key is not set. Chatbot will not function properly."
  );
}

const genAI = new GoogleGenAI({
  apiKey: API_KEY,
});

const SYSTEM_PROMPT = `You are FSRE AI Assistant, a helpful chatbot for students at the Faculty of Mechanical Engineering, Computing and Electrical Engineering (FSRE) at the University of Mostar (SUM).

You help students with questions about:
- Class schedules and timetables
- Exam registration and dates
- Laboratory exercises and reservations
- Scholarships and financial aid
- Enrollment procedures
- Contact information
- E-books and learning materials
- WiFi access
- General faculty information

Keep your responses:
- Friendly and helpful
- Concise but informative (2-4 sentences)
- In the same language as the user's question (Croatian or English)
- Honest - if you don't know something specific, suggest contacting the student services

Faculty contact info:
- Address: Matice hrvatske bb, 88000 Mostar
- Phone: +387 36 337-001
- Email: fsre@sum.ba`;

export async function createGeminiChat() {
  return genAI.chats.create({
    model: "gemini-pro",
    config: {
      systemInstruction: SYSTEM_PROMPT,
      maxOutputTokens: 500,
    },
  });
}

export async function generateGeminiResponse(
  chat: Chat,
  userMessage: string
): Promise<
  | {
      isSuccess: true;
      response: string;
    }
  | {
      isSuccess: false;
      error: string;
    }
> {
  try {
    const result = await chat.sendMessage({
      message: userMessage,
    });

    const text = result.text;
    if (!text) {
      throw new Error("No response text from Gemini");
    }

    return {
      isSuccess: true,
      response: text,
    };
  } catch (error) {
    console.error("Error generating Gemini response:", error);

    return {
      isSuccess: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
