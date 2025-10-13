import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini AI client
// TODO: Move this to environment variables for production
const API_KEY = "AIzaSyALuYJMU8Gd2JxYhp1Q08CJU9M8JajS45E";

if (!API_KEY) {
  console.warn("Gemini API key is not set. Chatbot will not function properly.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// System prompt to define the chatbot's behavior
const SYSTEM_PROMPT = `You are FSRE AI Assistant, a helpful chatbot for students at the Faculty of Mechanical Engineering, Computing and Electrical Engineering (FSRE) at the University of Mostar.

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
- Phone: +387 36 355 025
- Email: info@fsre.sum.ba`;

/**
 * Generate a response from Gemini AI
 * @param userMessage - The user's message
 * @returns The AI's response text
 */
export async function generateGeminiResponse(userMessage: string): Promise<string> {
  try {
    if (!API_KEY) {
      return "Извините, chatbot trenutno nije dostupan. Molimo kontaktirajte studentsku službu. / Sorry, the chatbot is currently unavailable. Please contact student services.";
    }

    // Use gemini-pro model (free tier)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create chat with system context
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "Razumijem! Ja sam FSRE AI asistent i tu sam da pomognem studentima s pitanjima o fakultetu. Bit ću prijazan, koncizan i odgovarati ću na istom jeziku kao što mi studenti postave pitanje. 😊" }],
        },
      ],
    });

    // Send the user's message
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error generating Gemini response:", error);
    
    // Return a friendly error message
    if (error instanceof Error && error.message.includes("API_KEY")) {
      return "Greška u konfiguraciji chatbota. Molimo kontaktirajte administratora. / Chatbot configuration error. Please contact the administrator.";
    }
    
    return "Izvinjavam se, došlo je do pogreške. Molimo pokušajte ponovo ili kontaktirajte studentsku službu. / Sorry, an error occurred. Please try again or contact student services.";
  }
}

/**
 * Check if the Gemini service is properly configured
 * @returns true if API key is set, false otherwise
 */
export function isGeminiConfigured(): boolean {
  return !!API_KEY;
}
