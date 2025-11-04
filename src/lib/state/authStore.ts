import { zustandStorage } from "@/lib/const/storage";
import Session from "@/lib/types/Session";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AuthStore {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

export const useAuth = create<AuthStore>()(
  persist(
    set => ({
      session: null,
      setSession: (session: Session | null) => set({ session }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
