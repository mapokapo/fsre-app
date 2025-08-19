import NotificationSettings from "@/lib/types/NotificationSettings";
import ReactStyleStateSetter from "@/lib/types/ReactStyleStateSetter";
import { create } from "zustand";

export interface NotificationSettingsStore {
  notificationSettings: NotificationSettings;
  setNotificationSettings: (
    newSettingsOrSetterFn: ReactStyleStateSetter<NotificationSettings>
  ) => void;
}

export const useNotificationsStore = create<NotificationSettingsStore>(set => ({
  notificationSettings: {
    lectures: true,
    exercises: true,
    labs: true,
    exams: true,
    news: true,
  },
  setNotificationSettings: newSettingsOrSetterFn =>
    set(state => ({
      notificationSettings:
        typeof newSettingsOrSetterFn === "function"
          ? newSettingsOrSetterFn(state.notificationSettings)
          : newSettingsOrSetterFn,
    })),
}));
