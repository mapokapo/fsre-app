import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import type { TimetableSubscriptionStatus } from "@/lib/hooks/useTimetableSubscription";
import type { NotificationPermissionStatus } from "@/lib/services/notificationPermission";
import { cn } from "@/lib/utils";
import { Bell, BellOff } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";

export type TimetableSubscriptionStatusBannerProps = {
  subscriptionStatus: TimetableSubscriptionStatus;
  permissionStatus: NotificationPermissionStatus;
  onRetry?: () => void;
};

type BannerDisplay =
  | { kind: "hidden" }
  | { kind: "permission_unavailable" }
  | {
      kind: "permission_blocked";
      messageKey: string;
      showSettingsHint: boolean;
    }
  | { kind: "subscription"; status: TimetableSubscriptionStatus };

function resolveBannerDisplay(
  subscriptionStatus: TimetableSubscriptionStatus,
  permissionStatus: NotificationPermissionStatus
): BannerDisplay {
  if (permissionStatus === "unsupported") {
    return subscriptionStatus === "idle"
      ? { kind: "hidden" }
      : { kind: "permission_unavailable" };
  }

  if (permissionStatus === "denied") {
    return {
      kind: "permission_blocked",
      messageKey: "timetable.subscription.permissionDenied",
      showSettingsHint: true,
    };
  }

  if (permissionStatus === "not_determined") {
    return {
      kind: "permission_blocked",
      messageKey: "timetable.subscription.permissionNotSet",
      showSettingsHint: true,
    };
  }

  if (subscriptionStatus === "idle") {
    return { kind: "hidden" };
  }

  return { kind: "subscription", status: subscriptionStatus };
}

export default function TimetableSubscriptionStatusBanner({
  subscriptionStatus,
  permissionStatus,
  onRetry,
}: Readonly<TimetableSubscriptionStatusBannerProps>) {
  const { t } = useTranslation();
  const display = resolveBannerDisplay(subscriptionStatus, permissionStatus);

  if (display.kind === "hidden") {
    return null;
  }

  if (display.kind === "permission_unavailable") {
    return (
      <View className="mx-5 mb-2 flex-row items-start gap-3 rounded-xl bg-muted/60 px-4 py-3">
        <Icon
          as={BellOff}
          size={18}
          className="mt-0.5 text-muted-foreground"
        />
        <Text className="flex-1 text-sm text-muted-foreground">
          {t("timetable.subscription.permissionUnavailable")}
        </Text>
      </View>
    );
  }

  if (display.kind === "permission_blocked") {
    return (
      <View className="mx-5 mb-2 flex-row items-start gap-3 rounded-xl bg-destructive/15 px-4 py-3">
        <Icon
          as={BellOff}
          size={18}
          className="mt-0.5 text-destructive"
        />
        <View className="flex-1 gap-1">
          <Text className="text-sm text-destructive">
            {t(display.messageKey)}
          </Text>
          {display.showSettingsHint && (
            <Text className="text-sm text-muted-foreground">
              {t("timetable.subscription.permissionSettingsHint")}
            </Text>
          )}
        </View>
      </View>
    );
  }

  const { status } = display;
  const isFailed = status === "failed";
  const isSubscribed = status === "subscribed";
  const isSubscribing = status === "subscribing";

  return (
    <View
      className={cn(
        "mx-5 mb-2 flex-row items-center gap-3 rounded-xl px-4 py-3",
        isFailed && "bg-destructive/15",
        isSubscribed && "bg-fsre-gradient-3/10",
        !isFailed && !isSubscribed && "bg-muted/60"
      )}>
      {isSubscribing ? (
        <ActivityIndicator size="small" />
      ) : (
        <Icon
          as={status === "incomplete" ? BellOff : Bell}
          size={18}
          className={cn(
            isFailed && "text-destructive",
            isSubscribed && "text-fsre-gradient-3",
            !isFailed && !isSubscribed && "text-muted-foreground"
          )}
        />
      )}
      <Text
        className={cn(
          "flex-1 text-sm",
          isFailed && "text-destructive",
          isSubscribed && "text-foreground",
          !isFailed && !isSubscribed && "text-muted-foreground"
        )}>
        {t(`timetable.subscription.${status}`)}
      </Text>
      {isFailed && onRetry && (
        <Button
          variant="outline"
          size="sm"
          onPress={onRetry}>
          <Text>{t("timetable.subscription.retry")}</Text>
        </Button>
      )}
    </View>
  );
}
