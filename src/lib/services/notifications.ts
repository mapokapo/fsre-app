import appI18n from "@/lib/i18n";
import type { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import {
  getInitialNotification,
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";
import type { Href } from "expo-router";
import { router } from "expo-router";
import { Alert, Platform } from "react-native";

type NotificationData = Record<string, string | object>;

function getNotificationData(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage
): NotificationData | undefined {
  const { data } = remoteMessage;
  if (!data) {
    return undefined;
  }

  return data;
}

export function resolveNotificationRoute(
  data: NotificationData | undefined
): Href {
  const screen =
    typeof data?.screen === "string" ? data.screen.toLowerCase() : "";

  switch (screen) {
    case "home":
      return "/";
    case "chatbot":
      return "/chatbot";
    case "timetable":
    case "schedule":
      return "/timetable";
    default:
      return "/timetable";
  }
}

export function handleNotificationOpen(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage
) {
  router.push(resolveNotificationRoute(getNotificationData(remoteMessage)));
}

function handleForegroundMessage(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage
) {
  const title = remoteMessage.notification?.title;
  const body = remoteMessage.notification?.body;

  if (!title && !body) {
    return;
  }

  Alert.alert(
    title ?? appI18n.t("notifications.permission.title"),
    body ?? "",
    [
      {
        text: appI18n.t("notifications.foreground.dismiss"),
        style: "cancel",
      },
      {
        text: appI18n.t("notifications.foreground.view"),
        onPress: () => {
          handleNotificationOpen(remoteMessage);
        },
      },
    ]
  );
}

export async function backgroundNotificationHandler(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage
) {
  console.log(
    "Background notification received:",
    remoteMessage.messageId ?? "unknown"
  );
}

export function registerBackgroundNotificationHandler() {
  if (Platform.OS === "web") {
    return;
  }

  setBackgroundMessageHandler(getMessaging(), backgroundNotificationHandler);
}

export function registerNotificationHandlers(): () => void {
  if (Platform.OS === "web") {
    return () => {};
  }

  const firebaseMessaging = getMessaging();
  const unsubscribeOnMessage = onMessage(
    firebaseMessaging,
    handleForegroundMessage
  );
  const unsubscribeOnOpen = onNotificationOpenedApp(
    firebaseMessaging,
    handleNotificationOpen
  );

  void getInitialNotification(firebaseMessaging).then(remoteMessage => {
    if (!remoteMessage) {
      return;
    }

    setTimeout(() => {
      handleNotificationOpen(remoteMessage);
    }, 250);
  });

  return () => {
    unsubscribeOnMessage();
    unsubscribeOnOpen();
  };
}
