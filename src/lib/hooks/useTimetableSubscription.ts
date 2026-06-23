import { messaging } from "@/lib/firebase";
import {
  resolveStudyProgramId,
  syncTimetableSubscription,
} from "@/lib/services/timetableSubscription";
import { useTimetableSubscriptionStore } from "@/lib/state/timetableSubscriptionStore";
import Department from "@/lib/types/Department";
import StudyYear from "@/lib/types/StudyYear";
import { useCallback, useEffect, useState } from "react";
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

export type TimetableSubscriptionStatus =
  | "idle"
  | "incomplete"
  | "subscribing"
  | "subscribed"
  | "failed";

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
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<TimetableSubscriptionStatus>("idle");
  const [retryCount, setRetryCount] = useState(0);

  const retrySubscription = useCallback(() => {
    setRetryCount(current => current + 1);
  }, []);

  useEffect(() => {
    if (Platform.OS === "web" || !messaging || !enabled) {
      setSubscriptionStatus("idle");
      return;
    }

    const studyProgramId = resolveStudyProgramId(
      selectedYear,
      selectedDepartment,
      selectedDirection,
      studyPrograms
    );

    if (
      studyProgramId !== null &&
      subscriptionKey?.studyProgramId === studyProgramId
    ) {
      setSubscriptionStatus("subscribed");
      return;
    }

    if (studyProgramId === null && subscriptionKey === null) {
      setSubscriptionStatus("incomplete");
      return;
    }

    let cancelled = false;
    setSubscriptionStatus("subscribing");

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
    })
      .then(() => {
        if (cancelled) return;

        setSubscriptionStatus(
          studyProgramId === null ? "incomplete" : "subscribed"
        );
      })
      .catch(() => {
        if (!cancelled) {
          setSubscriptionStatus("failed");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    enabled,
    retryCount,
    selectedDepartment,
    selectedDirection,
    selectedYear,
    setSubscriptionKey,
    studyPrograms,
    subscribeToTimetable,
    subscriptionKey,
    unsubscribeFromTimetable,
  ]);

  return { subscriptionStatus, retrySubscription };
}
