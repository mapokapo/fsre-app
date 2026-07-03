import { messaging } from "@/lib/firebase";
import {
  AuthorizationStatus,
  hasPermission,
  requestPermission,
} from "@react-native-firebase/messaging";
import { Linking, PermissionsAndroid, Platform } from "react-native";

export type NotificationPermissionStatus =
  "granted" | "denied" | "not_determined" | "unsupported";

export async function getNotificationPermissionStatus(): Promise<NotificationPermissionStatus> {
  if (!messaging || Platform.OS === "web") {
    return "unsupported";
  }

  if (Platform.OS === "android") {
    if (Platform.Version < 33) {
      return "granted";
    }

    const isGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    return isGranted ? "granted" : "denied";
  }

  const status = await hasPermission(messaging);

  if (
    status === AuthorizationStatus.AUTHORIZED ||
    status === AuthorizationStatus.PROVISIONAL
  ) {
    return "granted";
  }

  if (status === AuthorizationStatus.DENIED) {
    return "denied";
  }

  return "not_determined";
}

export async function openNotificationSettings(): Promise<void> {
  if (Platform.OS === "web") {
    return;
  }

  await Linking.openSettings();
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!messaging || Platform.OS === "web") return false;

  if (Platform.OS === "ios") {
    const status = await requestPermission(messaging);
    return status === AuthorizationStatus.AUTHORIZED;
  }

  if (Platform.OS === "android") {
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    return status === PermissionsAndroid.RESULTS.GRANTED;
  }

  return false;
}
