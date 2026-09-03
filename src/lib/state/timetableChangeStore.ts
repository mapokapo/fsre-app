import { zustandStorage } from "@/lib/const/storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/** Timetable changes older than this are dropped and never reach the chatbot. */
export const CHANGE_RETENTION_MS = 14 * 24 * 60 * 60 * 1000;

export interface TimetableChangeStore {
  changes: { receivedAt: number; text: string; studyProgramId: number }[];
  recordChange: (change: TimetableChangeStore["changes"][number]) => void;
}

export const useTimetableChangeStore = create<TimetableChangeStore>()(
  persist(
    set => ({
      changes: [],
      recordChange: change =>
        set(({ changes }) => {
          // The same notification can arrive twice (alert, then tap to open).
          if (changes[0]?.text === change.text) return { changes };

          const cutoff = Date.now() - CHANGE_RETENTION_MS;
          return {
            changes: [change, ...changes].filter(
              ({ receivedAt }) => receivedAt >= cutoff
            ),
          };
        }),
    }),
    {
      name: "timetable-changes",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
