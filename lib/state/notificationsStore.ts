import MockData from "@/lib/const/mockData";
import Notification from "@/lib/types/Notification";
import ReactStyleStateSetter from "@/lib/types/ReactStyleStateSetter";
import { create } from "zustand";

export interface NotificationStore {
  notifications: Notification[];
  addNotification: (newNotification: Notification) => void;
  removeNotification: (notificationId: number) => void;
  setNotifications: (
    newNotificationsOrSetterFn: ReactStyleStateSetter<Notification[]>
  ) => void;
}

export const useNotificationsStore = create<NotificationStore>(set => ({
  notifications: MockData.getNotifications(),
  addNotification: newNotification =>
    set(state => ({
      notifications: [...state.notifications, newNotification],
    })),
  removeNotification: notificationId =>
    set(state => ({
      notifications: state.notifications.filter(
        notification => notification.id !== notificationId
      ),
    })),
  setNotifications: newNotificationsOrSetterFn =>
    set(state => ({
      notifications:
        typeof newNotificationsOrSetterFn === "function"
          ? newNotificationsOrSetterFn(state.notifications)
          : newNotificationsOrSetterFn,
    })),
}));
