import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import { Platform } from "react-native";
import type { components, paths } from "./v1";

export const fetchClient = createFetchClient<paths>({
  baseUrl:
    Platform.OS === "web"
      ? "http://localhost:5000"
      : "http://10.10.23.206:5000",
});

export const $api = createClient(fetchClient);

export type Timetable = components["schemas"]["Timetable"];
export type TimetableEvent = components["schemas"]["TimetableEvent"];
export type TimetableDatabase = components["schemas"]["TimetableDatabase"];
