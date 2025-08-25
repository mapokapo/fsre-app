import MockData from "@/lib/const/mockData";
import ReactStyleStateSetter from "@/lib/types/ReactStyleStateSetter";
import Timetable from "@/lib/types/Timetable";
import { create } from "zustand";

export interface TimetableStore {
  timetable: Timetable;
  setTimetable: (
    newTimetableOrSetterFn: ReactStyleStateSetter<Timetable>
  ) => void;
}

export const useTimetableStore = create<TimetableStore>(set => ({
  timetable: MockData.getTimetable(),
  setTimetable: newTimetableOrSetterFn =>
    set(state => ({
      timetable:
        typeof newTimetableOrSetterFn === "function"
          ? newTimetableOrSetterFn(state.timetable)
          : newTimetableOrSetterFn,
    })),
}));
