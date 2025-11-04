import { zustandStorage } from "@/lib/const/storage";
import SubscriptionKey from "@/lib/types/SubscriptionKey";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Nullable<T extends object> = {
  [K in keyof T]: T[K] | null;
};

export interface TimetableSubscriptionStore {
  subscriptionKey: SubscriptionKey | null;
  setSubscriptionKey: (
    newSubscriptionKey: Nullable<SubscriptionKey> | null
  ) => void;
}

export const useTimetableSubscriptionStore =
  create<TimetableSubscriptionStore>()(
    persist(
      set => ({
        subscriptionKey: null,
        setSubscriptionKey: (
          newSubscriptionKey: Nullable<SubscriptionKey> | null
        ) =>
          set({
            subscriptionKey:
              (newSubscriptionKey?.department ?? null) === null ||
              (newSubscriptionKey?.year ?? null) === null ||
              (newSubscriptionKey?.studyProgramId ?? null) === null
                ? null
                : (newSubscriptionKey as SubscriptionKey),
          }),
      }),
      {
        name: "timetable-subscription",
        storage: createJSONStorage(() => zustandStorage),
      }
    )
  );
