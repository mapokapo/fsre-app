import { storage } from "@/lib/const/storage";
import { requestNotificationPermission } from "@/lib/services/notificationPermission";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

const NOTIFICATION_ONBOARDING_KEY = "notification-onboarding-complete";

function getIsOnboardingComplete(): boolean {
  return storage.getBoolean(NOTIFICATION_ONBOARDING_KEY) ?? false;
}

export function useNotificationOnboarding() {
  const [isComplete, setIsComplete] = useState(getIsOnboardingComplete);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web" && !isComplete) {
      setShowDialog(true);
    }
  }, [isComplete]);

  const completeOnboarding = useCallback(async () => {
    if (getIsOnboardingComplete()) {
      setShowDialog(false);
      return;
    }

    await requestNotificationPermission();
    storage.set(NOTIFICATION_ONBOARDING_KEY, true);
    setIsComplete(true);
    setShowDialog(false);
  }, []);

  return {
    showDialog,
    isComplete,
    completeOnboarding,
  };
}
