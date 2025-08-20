import MockData from "@/lib/const/mockData";
import ReactStyleStateSetter from "@/lib/types/ReactStyleStateSetter";
import Stat from "@/lib/types/Stat";
import { create } from "zustand";

export interface StatsStore {
  stats: Stat[];
  setStats: (newStatesOrSetterFn: ReactStyleStateSetter<Stat[]>) => void;
}

export const useStatsStore = create<StatsStore>(set => ({
  stats: MockData.getStats(),
  setStats: newStatsOrSetterFn =>
    set(state => ({
      stats:
        typeof newStatsOrSetterFn === "function"
          ? newStatsOrSetterFn(state.stats)
          : newStatsOrSetterFn,
    })),
}));
