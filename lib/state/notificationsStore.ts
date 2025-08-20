import Notification from "@/lib/types/Notification";
import ReactStyleStateSetter from "@/lib/types/ReactStyleStateSetter";
import { addDays, addHours } from "date-fns";
import { create } from "zustand";

const now = new Date();

const notifications: Notification[] = [
  {
    id: 1,
    title: "Prijava za ispitni rok",
    message: "Prijava za zimski ispitni rok otvorena do 15. siječnja",
    datetime: addHours(now, 2),
    urgent: true,
    iconCode: "timetable",
    gradientFrom: "#FF6B6B",
    gradientTo: "#FF8E8E",
  },
  {
    id: 2,
    title: "AI & Machine Learning radionica",
    message: "Besplatna radionica za studente u laboratoriju L-3",
    datetime: addDays(now, 1),
    urgent: false,
    iconCode: "tech-news",
    gradientFrom: "#4ECDC4",
    gradientTo: "#44A08D",
  },
  {
    id: 3,
    title: "Novi laboratorijski termini",
    message: "Dodani su novi termini za laboratorijske vježbe",
    datetime: addDays(now, 3),
    urgent: false,
    iconCode: "student",
    gradientFrom: "#A8E6CF",
    gradientTo: "#7FCDCD",
  },
];

export interface NotificationStore {
  notifications: Notification[];
  addNotification: (newNotification: Notification) => void;
  removeNotification: (notificationId: number) => void;
  setNotifications: (
    newNotificationsOrSetterFn: ReactStyleStateSetter<Notification[]>
  ) => void;
}

export const useNotificationsStore = create<NotificationStore>(set => ({
  notifications,
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
