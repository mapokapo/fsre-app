import appI18n from "@/lib/i18n";
import { refreshTimetableSubscription } from "@/lib/services/timetableSubscription";
import { useTimetableChangeStore } from "@/lib/state/timetableChangeStore";
import { useTimetableSubscriptionStore } from "@/lib/state/timetableSubscriptionStore";
import type { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import {
  getInitialNotification,
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";
import type { Href } from "expo-router";
import { router } from "expo-router";
import { Alert, AppState, Platform } from "react-native";

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

/** Keeps the text of timetable notifications available to the chatbot. */
function rememberChange(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
  const data = getNotificationData(remoteMessage);
  const { subscriptionKey } = useTimetableSubscriptionStore.getState();
  const text = [
    remoteMessage.notification?.title,
    remoteMessage.notification?.body,
  ]
    .filter(Boolean)
    .join(" - ");

  if (
    subscriptionKey === null ||
    text === "" ||
    resolveNotificationRoute(data) !== "/timetable"
  ) {
    return;
  }

  useTimetableChangeStore.getState().recordChange({
    receivedAt: Date.now(),
    text,
    studyProgramId: subscriptionKey.studyProgramId,
  });
}

export function handleNotificationOpen(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage
) {
  rememberChange(remoteMessage);
  router.push(resolveNotificationRoute(getNotificationData(remoteMessage)));
}

/** The backend sends one message per timetable change; a burst of them is shown as one alert. */
const FOREGROUND_BATCH_MS = 1500;
let pendingForegroundMessages: FirebaseMessagingTypes.RemoteMessage[] = [];
let foregroundAlertTimer: ReturnType<typeof setTimeout> | null = null;

function showForegroundAlert() {
  const messages = pendingForegroundMessages;
  pendingForegroundMessages = [];
  foregroundAlertTimer = null;

  const [first] = messages;
  if (first === undefined) {
    return;
  }

  const single = messages.length === 1;
  const title = single
    ? (first.notification?.title ?? appI18n.t("notifications.permission.title"))
    : appI18n.t("notifications.foreground.multipleTitle", {
        count: messages.length,
      });
  const body = single
    ? (first.notification?.body ?? "")
    : messages
        .map(({ notification }) =>
          [notification?.title, notification?.body].filter(Boolean).join("\n")
        )
        .join("\n\n");

  Alert.alert(title, body, [
    {
      text: appI18n.t("notifications.foreground.dismiss"),
      style: "cancel",
    },
    {
      text: appI18n.t("notifications.foreground.view"),
      onPress: () => {
        router.push(resolveNotificationRoute(getNotificationData(first)));
      },
    },
  ]);
}

function handleForegroundMessage(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage
) {
  const title = remoteMessage.notification?.title;
  const body = remoteMessage.notification?.body;

  if (!title && !body) {
    return;
  }

  rememberChange(remoteMessage);

  pendingForegroundMessages.push(remoteMessage);
  foregroundAlertTimer ??= setTimeout(showForegroundAlert, FOREGROUND_BATCH_MS);
}

export async function backgroundNotificationHandler(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage
) {
  rememberChange(remoteMessage);
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

  // The token can rotate and the device can change time zones (also while the app is closed);
  // failures are retried on the next start, foreground or token refresh.
  const refreshSubscription = (token?: string) => {
    if (useTimetableSubscriptionStore.getState().subscriptionKey === null) {
      return;
    }
    void (
      token === undefined ? getToken(firebaseMessaging) : Promise.resolve(token)
    )
      .then(refreshTimetableSubscription)
      .catch(() => {});
  };
  refreshSubscription();
  const unsubscribeOnTokenRefresh = onTokenRefresh(
    firebaseMessaging,
    refreshSubscription
  );
  const appStateSubscription = AppState.addEventListener("change", state => {
    if (state === "active") refreshSubscription();
  });

  return () => {
    unsubscribeOnMessage();
    unsubscribeOnOpen();
    unsubscribeOnTokenRefresh();
    appStateSubscription.remove();
  };
}
