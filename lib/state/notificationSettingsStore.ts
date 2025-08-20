import NotificationSettings from "@/lib/types/NotificationSettings";
import ReactStyleStateSetter from "@/lib/types/ReactStyleStateSetter";
import { create } from "zustand";

export interface NotificationSettingsStore {
  notificationSettings: NotificationSettings;
  setNotificationSettings: (
    newNotificationSettingsOrSetterFn: ReactStyleStateSetter<NotificationSettings>
  ) => void;
}

export const useNotificationSettingsStore = create<NotificationSettingsStore>(
  set => ({
    notificationSettings: {
      lectures: true,
      exercises: true,
      labs: true,
      exams: true,
      news: true,
    },
    setNotificationSettings: newNotificationSettingsOrSetterFn =>
      set(state => ({
        notificationSettings:
          typeof newNotificationSettingsOrSetterFn === "function"
            ? newNotificationSettingsOrSetterFn(state.notificationSettings)
            : newNotificationSettingsOrSetterFn,
      })),
  })
);
