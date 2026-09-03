import { fetchClient, type Timetable } from "@/lib/api/client";
import { getCachedQuickQuestionResponse } from "@/lib/const/quickQuestionCache";
import { departments, years } from "@/lib/const/timetableFilters";
import { resolveStudyProgramId } from "@/lib/services/timetableSubscription";
import {
  CHANGE_RETENTION_MS,
  useTimetableChangeStore,
} from "@/lib/state/timetableChangeStore";
import { useTimetableSubscriptionStore } from "@/lib/state/timetableSubscriptionStore";
import {
  ApiError,
  Content,
  GoogleGenAI,
  Part,
  Type,
  type FunctionDeclaration,
} from "@google/genai";
import { format } from "date-fns";

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_GENAI_API_KEY ?? "";

export function isGoogleGenAIApiKeyMissing(): boolean {
  return API_KEY.trim() === "";
}

const MODEL = "gemini-3.1-flash-lite";
const MAX_HISTORY_TURNS = 10;
const MAX_TOOL_ROUNDS = 3;
const CACHED_RESPONSE_DELAY_MS = 1000;
const RETENTION_DAYS = CHANGE_RETENTION_MS / (24 * 60 * 60 * 1000);

const studyYears = years.flatMap(({ value }) => value ?? []);
const studyDepartments = departments.flatMap(({ value }) => value ?? []);

if (isGoogleGenAIApiKeyMissing()) {
  console.warn(
    "Google AI Studio API key is not set. Chatbot will not function properly."
  );
}

const genAI = new GoogleGenAI({
  apiKey: API_KEY,
});

const timetableTool: FunctionDeclaration = {
  name: "get_timetable",
  description: `Returns the events of one week of the timetable for a single study program. Call it whenever the user asks what is scheduled, when or where a subject is held, or whether a subject takes place in some week. Departments: računarstvo/CS is COMPUTER_SCIENCE, elektrotehnika/EE is ELECTRICAL_ENGINEERING, strojarstvo/ME is MECHANICAL_ENGINEERING. Only some year and department combinations are split into directions (for example fourth year computer science has the directions PIIS and RIIS); all others have no direction, so pass a direction only when the study program actually has one.`,
  parameters: {
    type: Type.OBJECT,
    properties: {
      year: { type: Type.STRING, enum: studyYears },
      department: { type: Type.STRING, enum: studyDepartments },
      direction: {
        type: Type.STRING,
        nullable: true,
        description: "Direction of the study program, if it has one",
      },
      isoWeek: { type: Type.STRING, description: "ISO week, e.g. 2026-W12" },
    },
    required: ["year", "department", "isoWeek"],
  },
};

const SYSTEM_PROMPT = `You are FSRE AI Assistant, a helpful chatbot for students at the Faculty of Mechanical Engineering, Computing and Electrical Engineering (FSRE) at the University of Mostar (SUM).

Keep your responses:
- Friendly and helpful
- Concise but informative (2-4 sentences)
- In the same language as the user's question (Croatian or English)
- Honest - if you don't know something specific, suggest contacting the student services
- Informative - include links to relevant resources when applicable

Avoid:
- Making up answers
- Giving legal, medical, or financial advice
- Sharing personal opinions

AI implementation and data privacy (be transparent when users ask about privacy, data retention, or how the chatbot works):
- This chatbot is powered by Google AI Studio. Messages are sent from the user's device directly to Google's Gemini API. FSRE app developers do not operate their own AI servers.
- The model used is Gemini 3.1 Flash Lite.
- FSRE/SUM does not store chat messages or chat history on any of its own servers. Conversations exist only in the current app session on the user's device.
- Locally on the device, the app may save non-chat preferences (such as theme, language, and timetable filters) using on-device storage only, plus the text of timetable change notifications from the last ${RETENTION_DAYS} days.
- Google processes API requests according to Google's Privacy Policy (https://policies.google.com/privacy), Gemini API terms (https://ai.google.dev/gemini-api/terms), and Google AI Studio (https://aistudio.google.com/). For details on how Google handles API data, refer users to those Google resources rather than speculating.
- Do not claim FSRE stores, reviews, or retains user chat data on backend servers.

You have access to the following information about FSRE and SUM:

Faculty contact info:
- Address: Matice hrvatske bb, 88000 Mostar
- Phone: +387 36 337-001
- Email: fsre@sum.ba

Student services contact info:
- Phone: +387 36 337-003
- Email: referada@fsre.sum.ba

Information available on the FSRE websites (https://fsre.sum.ba and https://fsre.edupage.org/):
- General information about the faculty as well as specific departments (URIs are /strojarstvo, /racunarstvo, /elektrotehnika on https://fsre.sum.ba) such as exam dates, info about the department, and the lecture schedule.
- An online timetable viewer is available at https://fsre.edupage.org/timetable/view.php
- News and announcements about FSRE such as upcoming events, deadlines (when the year starts), scholarship info, awards, student activities, etc.
- Information about study programs (undergraduate, graduate, doctoral) such as curriculum, course descriptions, and program requirements.
- Information about faculty staff such as professors, lecturers, and administrative personnel.
- Information about how to become a student of FSRE through an online form (URI is /upisi).
- Various templates and guides for things like how to apply to the SUM Smart Hackathon, writing a thesis (undergraduate, graduate, doctoral), and other student activities.
- The student magazine Robot (URI is /robot).
- The student council (URI is /studentski-zbor).

Information available on the e-Learning website (https://eucenje.sum.ba/moodle/):
- Based on the Moodle platform.
- Access to all classes/subjects offered at FSRE - some of them are free to enroll in, others require a manual invite from the professor, and some require a password to enroll into.
- Access to course materials.
- Students can submit assignments and homework, and check their progress.

Information available on Studomat/ISS (https://studomat.sum.ba/):
- Student grades.
- Ability to register for exams and view personal details.
- All this information is also available through the e-Indeks mobile app.

Information available on the app (which the user is currently using):
- News (same as on the website but with a different UI)
- Quick links (Studomat, e-Learning, news, timetable)
- The AI chatbot (you)
- A timetable viewer where students can see their weekly schedule, list through weeks, filter by academic year, day of week, department (ME, CS, EE), and direction (only for 3rd year ME and graduate degrees). Once a user selects their filters, they are saved to the device, and automatically registered to receive notifications about changes to the timetable. The notifications can be disabled by simply un-setting all filters.

About the timetable:
- Never guess timetable events; read them with the get_timetable tool instead, and say so if the tool reports an error.
- The listed timetable changes come from notifications this device received, so they only cover the study program the user follows and only the last ${RETENTION_DAYS} days. For anything outside that, point the user to the timetable screen in the app.

In your responses:
- You may use simple Markdown for readability: **bold**, *italic*, [link text](url), and ordered or unordered lists
- Do not use HTML, tables, code blocks, images, or other advanced formatting
- When mentioning specific resources, use the exact names as they appear on the websites (e.g. "the online timetable viewer on the e-Learning website" instead of "the timetable viewer") and link them in Markdown, e.g. [online timetable viewer](https://fsre.edupage.org/timetable/view.php)
- If a user asks for information that is not available in the resources you have access to, suggest contacting the student services for more information.`;

export type ConversationMessage = {
  text: string;
  role: "user" | "model";
};

function buildSystemInstruction(): string {
  const now = new Date();
  const { subscriptionKey } = useTimetableSubscriptionStore.getState();
  const { changes } = useTimetableChangeStore.getState();
  const recentChanges = changes.filter(
    change =>
      change.studyProgramId === subscriptionKey?.studyProgramId &&
      change.receivedAt >= now.getTime() - CHANGE_RETENTION_MS
  );

  return [
    SYSTEM_PROMPT,
    `Today is ${format(now, "EEEE, d MMMM yyyy")}, which is ISO week ${format(now, "RRRR-'W'II")}.`,
    subscriptionKey === null
      ? "The user has not picked a study program in the app yet, so ask which one they mean before reading the timetable."
      : `The user follows year ${subscriptionKey.year}, department ${subscriptionKey.department}, direction ${subscriptionKey.direction ?? "none"} - assume this study program when they do not name one.`,
    recentChanges.length === 0
      ? "No timetable changes were announced on this device recently."
      : [
          "Timetable changes announced on this device, newest first:",
          ...recentChanges.map(
            ({ receivedAt, text }) =>
              `- ${format(receivedAt, "d MMMM")}: ${text}`
          ),
        ].join("\n"),
  ].join("\n\n");
}

function buildChatHistory(messages: ConversationMessage[]): Content[] {
  const recentMessages = messages.slice(-MAX_HISTORY_TURNS * 2);

  return recentMessages.map(message => ({
    role: message.role,
    parts: [{ text: message.text }],
  }));
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function toToolEvents(timetable: Timetable) {
  return Object.entries(timetable).flatMap(([day, events]) =>
    events.map(event => ({
      day,
      name: event.name,
      type: event.type,
      from: event.startDateTime,
      to: event.endDateTime,
      classRooms: event.classRoomNames,
      teachers: event.teacherNames,
    }))
  );
}

async function readTimetable({
  year,
  department,
  direction,
  isoWeek,
}: Record<string, unknown>): Promise<Record<string, unknown>> {
  const studyYear = studyYears.find(value => value === year);
  const studyDepartment = studyDepartments.find(value => value === department);

  if (
    studyYear === undefined ||
    studyDepartment === undefined ||
    typeof isoWeek !== "string"
  ) {
    return { error: "year, department and isoWeek are required." };
  }

  const { data: database } = await fetchClient.GET("/timetable-database");
  const studyPrograms = database?.studyPrograms ?? [];
  const studyProgramId = resolveStudyProgramId(
    studyYear,
    studyDepartment,
    typeof direction === "string" && direction !== "" ? direction : null,
    studyPrograms
  );

  if (studyProgramId === null) {
    const knownDirections = studyPrograms
      .filter(
        program =>
          program.studyYear === studyYear &&
          program.department === studyDepartment
      )
      .map(program => program.direction ?? "none");

    return {
      error: `No such study program. Directions of ${studyYear} ${studyDepartment}: ${knownDirections.join(", ") || "unknown"}.`,
    };
  }

  const { data: timetable } = await fetchClient.GET("/timetable", {
    params: { query: { isoWeek, studyProgram: studyProgramId } },
  });

  return timetable === undefined
    ? { error: `The timetable of ${isoWeek} could not be read.` }
    : { isoWeek, events: toToolEvents(timetable) };
}

export async function generateGoogleGenAIResponse(
  userMessage: string,
  history: ConversationMessage[] = []
): Promise<
  | {
      isSuccess: true;
      response: string;
    }
  | {
      isSuccess: false;
      errorType: "busy" | "unavailable" | "unknown";
    }
> {
  const cachedResponse = getCachedQuickQuestionResponse(userMessage);
  if (cachedResponse) {
    await delay(CACHED_RESPONSE_DELAY_MS);
    return { isSuccess: true, response: cachedResponse };
  }

  if (isGoogleGenAIApiKeyMissing()) {
    return { isSuccess: false, errorType: "unavailable" };
  }

  try {
    const chat = genAI.chats.create({
      model: MODEL,
      config: {
        systemInstruction: buildSystemInstruction(),
        maxOutputTokens: 800,
        tools: [{ functionDeclarations: [timetableTool] }],
      },
      history: buildChatHistory(history),
    });

    let result = await chat.sendMessage({ message: userMessage });

    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const toolCalls = result.functionCalls;
      if (toolCalls === undefined || toolCalls.length === 0) break;

      const toolResponses: Part[] = await Promise.all(
        toolCalls.map(async ({ id, name, args }) => ({
          functionResponse: {
            id,
            name,
            response: await readTimetable(args ?? {}),
          },
        }))
      );

      result = await chat.sendMessage({ message: toolResponses });
    }

    const text = result.text;
    if (!text) {
      throw new Error("No response text from Google GenAI");
    }

    return {
      isSuccess: true,
      response: text,
    };
  } catch (error) {
    console.error("Error generating Google GenAI response:", error);

    if (error instanceof ApiError && error.status === 503) {
      return { isSuccess: false, errorType: "busy" };
    }

    return { isSuccess: false, errorType: "unknown" };
  }
}
