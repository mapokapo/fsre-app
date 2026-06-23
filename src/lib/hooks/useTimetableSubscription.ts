import { messaging } from "@/lib/firebase";
import {
  resolveStudyProgramId,
  syncTimetableSubscription,
} from "@/lib/services/timetableSubscription";
import { useTimetableSubscriptionStore } from "@/lib/state/timetableSubscriptionStore";
import Department from "@/lib/types/Department";
import StudyYear from "@/lib/types/StudyYear";
import { useEffect } from "react";
import { Platform } from "react-native";

type StudyProgram = {
  studyYear: StudyYear;
  department: Department;
  direction: string | null;
  id: number;
};

type SubscriptionMutation = (variables: {
  body: { studyProgramId: number; fcmToken: string };
}) => Promise<unknown>;

export function useTimetableSubscription({
  selectedYear,
  selectedDepartment,
  selectedDirection,
  studyPrograms,
  subscribeToTimetable,
  unsubscribeFromTimetable,
  enabled = true,
}: {
  selectedYear: StudyYear | null;
  selectedDepartment: Department | null;
  selectedDirection: string | null;
  studyPrograms: StudyProgram[] | undefined;
  subscribeToTimetable: SubscriptionMutation;
  unsubscribeFromTimetable: SubscriptionMutation;
  enabled?: boolean;
}) {
  const { subscriptionKey, setSubscriptionKey } =
    useTimetableSubscriptionStore();

  useEffect(() => {
    if (Platform.OS === "web" || !messaging || !enabled) return;

    let cancelled = false;

    const studyProgramId = resolveStudyProgramId(
      selectedYear,
      selectedDepartment,
      selectedDirection,
      studyPrograms
    );

    syncTimetableSubscription({
      firebaseMessaging: messaging,
      studyProgramId,
      subscriptionKey,
      selectedDirection,
      selectedDepartment,
      selectedYear,
      subscribeToTimetable,
      unsubscribeFromTimetable,
      setSubscriptionKey,
      isCancelled: () => cancelled,
    }).catch(error => {
      console.error("Failed to manage timetable subscription:", error);
    });

    return () => {
      cancelled = true;
    };
  }, [
    enabled,
    selectedDepartment,
    selectedDirection,
    selectedYear,
    setSubscriptionKey,
    studyPrograms,
    subscribeToTimetable,
    subscriptionKey,
    unsubscribeFromTimetable,
  ]);
}
