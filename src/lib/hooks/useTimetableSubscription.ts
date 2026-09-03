import { messaging } from "@/lib/firebase";
import {
  resolveStudyProgramId,
  syncTimetableSubscription,
} from "@/lib/services/timetableSubscription";
import { useTimetableSubscriptionStore } from "@/lib/state/timetableSubscriptionStore";
import Department from "@/lib/types/Department";
import StudyYear from "@/lib/types/StudyYear";
import { useCallback, useEffect, useRef, useState } from "react";
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
  "idle" | "incomplete" | "subscribing" | "subscribed" | "failed";

export function useTimetableSubscription({
  selectedYear,
  selectedDepartment,
  selectedDirection,
  studyPrograms,
  subscribeToTimetable,
  unsubscribeFromTimetable,
  enabled = true,
  notificationsEnabled = true,
}: {
  selectedYear: StudyYear | null;
  selectedDepartment: Department | null;
  selectedDirection: string | null;
  studyPrograms: StudyProgram[] | undefined;
  subscribeToTimetable: SubscriptionMutation;
  unsubscribeFromTimetable: SubscriptionMutation;
  enabled?: boolean;
  notificationsEnabled?: boolean;
}) {
  const setSubscriptionKey = useTimetableSubscriptionStore(
    state => state.setSubscriptionKey
  );
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<TimetableSubscriptionStatus>("idle");
  const [retryCount, setRetryCount] = useState(0);

  const subscribeRef = useRef(subscribeToTimetable);
  const unsubscribeRef = useRef(unsubscribeFromTimetable);
  subscribeRef.current = subscribeToTimetable;
  unsubscribeRef.current = unsubscribeFromTimetable;

  const retrySubscription = useCallback(() => {
    setRetryCount(current => current + 1);
  }, []);

  useEffect(() => {
    if (Platform.OS === "web" || !messaging || !enabled) {
      setSubscriptionStatus("idle");
      return;
    }

    // Study programs must be loaded before we can resolve or clear a selection.
    // Otherwise a restored direction looks unresolved and we unsubscribe.
    if (studyPrograms === undefined) {
      setSubscriptionStatus("idle");
      return;
    }

    const subscriptionKey =
      useTimetableSubscriptionStore.getState().subscriptionKey;

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

    if (!notificationsEnabled) {
      setSubscriptionStatus(studyProgramId === null ? "incomplete" : "idle");
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
      subscribeToTimetable: variables => subscribeRef.current(variables),
      unsubscribeFromTimetable: variables => unsubscribeRef.current(variables),
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
    notificationsEnabled,
    retryCount,
    selectedDepartment,
    selectedDirection,
    selectedYear,
    setSubscriptionKey,
    studyPrograms,
  ]);

  return { subscriptionStatus, retrySubscription };
}
