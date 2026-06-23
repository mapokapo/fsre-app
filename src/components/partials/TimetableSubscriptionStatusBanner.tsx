import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import type { TimetableSubscriptionStatus } from "@/lib/hooks/useTimetableSubscription";
import { cn } from "@/lib/utils";
import { Bell, BellOff } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";

export type TimetableSubscriptionStatusBannerProps = {
  status: TimetableSubscriptionStatus;
  onRetry?: () => void;
};

export default function TimetableSubscriptionStatusBanner({
  status,
  onRetry,
}: Readonly<TimetableSubscriptionStatusBannerProps>) {
  const { t } = useTranslation();

  if (status === "idle") {
    return null;
  }

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
