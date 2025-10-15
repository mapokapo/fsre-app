import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { components, paths } from "./v1";

export const fetchClient = createFetchClient<paths>({
  baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || "",
});

export const $api = createClient(fetchClient);

export type Timetable = components["schemas"]["Timetable"];
export type TimetableEvent = components["schemas"]["TimetableEvent"];
export type TimetableDatabase = components["schemas"]["TimetableDatabase"];
