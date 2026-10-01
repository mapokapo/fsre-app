import { fetchClient } from "@/lib/api/client";
import { useTimetableSubscriptionStore } from "@/lib/state/timetableSubscriptionStore";
import Department from "@/lib/types/Department";
import StudyYear from "@/lib/types/StudyYear";
import SubscriptionKey from "@/lib/types/SubscriptionKey";
import type { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { getToken } from "@react-native-firebase/messaging";
import { getCalendars } from "expo-localization";

type StudyProgram = {
  studyYear: StudyYear;
  department: Department;
  direction: string | null;
  id: number;
};

type SubscriptionBody = {
  studyProgramId: number;
  fcmToken: string;
  /** IANA time zone the backend formats notification times in. */
  timeZone?: string;
};

type SubscriptionMutation = (variables: {
  body: SubscriptionBody;
}) => Promise<unknown>;

/** The device's IANA time zone, if the platform reports one. */
export function deviceTimeZone(): string | undefined {
  return getCalendars()[0]?.timeZone ?? undefined;
}

export function isMessagingConflictError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const record = error as Record<string, unknown>;

  if (record.status === 409 || record.status === "CONFLICT") {
    return true;
  }

  const response = record.response;
  if (
    typeof response === "object" &&
    response !== null &&
    (response as { status?: number }).status === 409
  ) {
    return true;
  }

  const nestedError = record.error;
  if (
    typeof nestedError === "object" &&
    nestedError !== null &&
    (nestedError as { status?: string }).status === "409 CONFLICT"
  ) {
    return true;
  }

  return false;
}

async function runMessagingMutation(
  mutation: SubscriptionMutation,
  body: SubscriptionBody
): Promise<void> {
  try {
    await mutation({ body });
  } catch (error) {
    if (isMessagingConflictError(error)) {
      return;
    }
    throw error;
  }
}

export function resolveStudyProgramId(
  selectedYear: StudyYear | null,
  selectedDepartment: Department | null,
  selectedDirection: string | null,
  studyPrograms: StudyProgram[] | undefined
): number | null {
  if (selectedYear === null || selectedDepartment === null) {
    return null;
  }

  return (
    studyPrograms?.find(
      program =>
        program.studyYear === selectedYear &&
        program.department === selectedDepartment &&
        program.direction === selectedDirection
    )?.id ?? null
  );
}

export async function syncTimetableSubscription({
  firebaseMessaging,
  studyProgramId,
  subscriptionKey,
  selectedDirection,
  selectedDepartment,
  selectedYear,
  subscribeToTimetable,
  unsubscribeFromTimetable,
  setSubscriptionKey,
  isCancelled,
}: {
  firebaseMessaging: FirebaseMessagingTypes.Module;
  studyProgramId: number | null;
  subscriptionKey: SubscriptionKey | null;
  selectedDirection: string | null;
  selectedDepartment: Department | null;
  selectedYear: StudyYear | null;
  subscribeToTimetable: SubscriptionMutation;
  unsubscribeFromTimetable: SubscriptionMutation;
  setSubscriptionKey: (key: SubscriptionKey | null) => void;
  isCancelled: () => boolean;
}): Promise<void> {
  if (subscriptionKey?.studyProgramId === studyProgramId) return;

  const fcmToken = await getToken(firebaseMessaging);

  if (studyProgramId === null) {
    if (subscriptionKey === null) return;

    await runMessagingMutation(unsubscribeFromTimetable, {
      studyProgramId: subscriptionKey.studyProgramId,
      fcmToken: subscriptionKey.fcmToken ?? fcmToken,
    });
    if (!isCancelled()) setSubscriptionKey(null);
    return;
  }
  if (
    subscriptionKey !== null &&
    subscriptionKey.studyProgramId !== studyProgramId
  ) {
    await runMessagingMutation(unsubscribeFromTimetable, {
      studyProgramId: subscriptionKey.studyProgramId,
      fcmToken: subscriptionKey.fcmToken ?? fcmToken,
    });
  }

  const timeZone = deviceTimeZone();
  await runMessagingMutation(subscribeToTimetable, {
    studyProgramId,
    fcmToken,
    timeZone,
  });

  if (!isCancelled() && selectedDepartment !== null && selectedYear !== null) {
    setSubscriptionKey({
      direction: selectedDirection,
      department: selectedDepartment,
      year: selectedYear,
      studyProgramId,
      fcmToken,
      timeZone,
    });
  }
}

/**
 * Keeps the backend subscription working when the FCM token rotates or the device moves to
 * another time zone: resubscribes with the current values and unsubscribes the old token.
 */
export async function refreshTimetableSubscription(
  fcmToken: string
): Promise<void> {
  const { subscriptionKey, setSubscriptionKey } =
    useTimetableSubscriptionStore.getState();
  const timeZone = deviceTimeZone();
  if (
    subscriptionKey === null ||
    (subscriptionKey.fcmToken === fcmToken &&
      subscriptionKey.timeZone === timeZone)
  ) {
    return;
  }

  const { studyProgramId, fcmToken: previousToken } = subscriptionKey;
  if (previousToken !== undefined && previousToken !== fcmToken) {
    await fetchClient.POST("/messaging/unsubscribe", {
      body: { studyProgramId, fcmToken: previousToken },
    });
  }
  const { error } = await fetchClient.POST("/messaging/subscribe", {
    body: { studyProgramId, fcmToken, timeZone },
  });

  // The user may have picked another study program in the meantime.
  const current = useTimetableSubscriptionStore.getState().subscriptionKey;
  if (error === undefined && current?.studyProgramId === studyProgramId) {
    setSubscriptionKey({ ...current, fcmToken, timeZone });
  }
}
