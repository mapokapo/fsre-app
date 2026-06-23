import { messaging } from "@/lib/firebase";
import {
  AuthorizationStatus,
  requestPermission,
} from "@react-native-firebase/messaging";
import { PermissionsAndroid, Platform } from "react-native";

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
