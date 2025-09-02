import { SubscriptionKey } from "@/lib/types/SubscriptionKey";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface TimetableSubscriptionStore {
  subscriptionKey: SubscriptionKey | null;
  setSubscriptionKey: (newSubscriptionKey: SubscriptionKey | null) => void;
}

export const useTimetableSubscriptionStore =
  create<TimetableSubscriptionStore>()(
    persist(
      set => ({
        subscriptionKey: null,
        setSubscriptionKey: (newSubscriptionKey: SubscriptionKey | null) =>
          set({ subscriptionKey: newSubscriptionKey }),
      }),
      {
        name: "timetable-subscription",
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  );
