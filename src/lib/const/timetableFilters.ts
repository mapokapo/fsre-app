import Department from "@/lib/types/Department";
import StudyYear from "@/lib/types/StudyYear";
import TimetableFilter from "@/lib/types/TimetableFilter";

export const days: TimetableFilter<"0" | "1" | "2" | "3" | "4" | "5" | "6">[] =
  [
    { value: null, label: t => t("common.all") },
    { value: "1", label: t => t("common.weekDays.monday") },
    { value: "2", label: t => t("common.weekDays.tuesday") },
    { value: "3", label: t => t("common.weekDays.wednesday") },
    { value: "4", label: t => t("common.weekDays.thursday") },
    { value: "5", label: t => t("common.weekDays.friday") },
    { value: "6", label: t => t("common.weekDays.saturday") },
    { value: "0", label: t => t("common.weekDays.sunday") },
  ] as const;
export const years: TimetableFilter<StudyYear>[] = [
  { value: null, label: t => t("common.all") },
  {
    value: "FIRST",
    label: t => t("common.studyYear", { count: 1 }),
  },
  { value: "SECOND", label: t => t("common.studyYear", { count: 2 }) },
  { value: "THIRD", label: t => t("common.studyYear", { count: 3 }) },
  { value: "FOURTH", label: t => t("common.studyYear", { count: 4 }) },
  { value: "FIFTH", label: t => t("common.studyYear", { count: 5 }) },
];
export const departments: TimetableFilter<Department>[] = [
  { value: null, label: t => t("common.all") },
  {
    value: "COMPUTER_SCIENCE",
    label: t => t("common.departments.computerScience"),
  },
  {
    value: "ELECTRICAL_ENGINEERING",
    label: t => t("common.departments.electricalEngineering"),
  },
  {
    value: "MECHANICAL_ENGINEERING",
    label: t => t("common.departments.mechanicalEngineering"),
  },
];
