import { getToken } from "@react-native-firebase/messaging";
import type { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import Department from "@/lib/types/Department";
import StudyYear from "@/lib/types/StudyYear";
import SubscriptionKey from "@/lib/types/SubscriptionKey";

type StudyProgram = {
  studyYear: StudyYear;
  department: Department;
  direction: string | null;
  id: number;
};

type SubscriptionMutation = (variables: {
  body: { studyProgramId: number; fcmToken: string };
}) => Promise<unknown>;

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

    await unsubscribeFromTimetable({
      body: {
        studyProgramId: subscriptionKey.studyProgramId,
        fcmToken,
      },
    });
    if (!isCancelled()) setSubscriptionKey(null);
    return;
  }

  if (
    subscriptionKey !== null &&
    subscriptionKey.studyProgramId !== studyProgramId
  ) {
    await unsubscribeFromTimetable({
      body: {
        studyProgramId: subscriptionKey.studyProgramId,
        fcmToken,
      },
    });
  }

  await subscribeToTimetable({
    body: {
      studyProgramId,
      fcmToken,
    },
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
