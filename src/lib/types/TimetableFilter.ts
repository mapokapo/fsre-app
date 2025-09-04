import { useTranslation } from "react-i18next";

export default interface TimetableFilter<T> {
  value: T | null;
  label: (t: ReturnType<typeof useTranslation>[0]) => string;
}
