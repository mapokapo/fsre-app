import { storage } from "@/lib/const/storage";
import SubscriptionKey from "@/lib/types/SubscriptionKey";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

type Nullable<T extends object> = {
  [K in keyof T]: T[K] | null;
};

export interface TimetableSubscriptionStore {
  subscriptionKey: SubscriptionKey | null;
  setSubscriptionKey: (
    newSubscriptionKey: Nullable<SubscriptionKey> | null
  ) => void;
}

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: name => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: name => {
    return storage.remove(name);
  },
};

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
