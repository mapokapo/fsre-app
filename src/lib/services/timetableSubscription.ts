import Department from "@/lib/types/Department";
import StudyYear from "@/lib/types/StudyYear";
import SubscriptionKey from "@/lib/types/SubscriptionKey";
import type { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { getToken } from "@react-native-firebase/messaging";

type StudyProgram = {
  studyYear: StudyYear;
  department: Department;
  direction: string | null;
  id: number;
};

type SubscriptionMutation = (variables: {
  body: { studyProgramId: number; fcmToken: string };
}) => Promise<unknown>;

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
  body: { studyProgramId: number; fcmToken: string }
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
      fcmToken,
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
      fcmToken,
    });
  }

  await runMessagingMutation(subscribeToTimetable, {
    studyProgramId,
    fcmToken,
  });

  if (!isCancelled() && selectedDepartment !== null && selectedYear !== null) {
    setSubscriptionKey({
      direction: selectedDirection,
      department: selectedDepartment,
      year: selectedYear,
      studyProgramId,
    });
  }
}
