import {
  getNotificationPermissionStatus,
  type NotificationPermissionStatus,
} from "@/lib/services/notificationPermission";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";

export function useNotificationPermissionStatus(enabled = true) {
  const [permissionStatus, setPermissionStatus] =
    useState<NotificationPermissionStatus>("unsupported");

  const refreshPermissionStatus = useCallback(() => {
    if (!enabled) {
      setPermissionStatus("unsupported");
      return;
    }

    getNotificationPermissionStatus().then(setPermissionStatus);
  }, [enabled]);

  useFocusEffect(
    useCallback(() => {
      refreshPermissionStatus();
    }, [refreshPermissionStatus])
  );

  return { permissionStatus, refreshPermissionStatus };
}
