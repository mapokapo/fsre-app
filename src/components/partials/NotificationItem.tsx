import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { THEME } from "@/lib/theme";
import Notification from "@/lib/types/Notification";
import { getDistanceTo } from "@/lib/utils";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar, Info, UserIcon, Zap } from "lucide-react-native";
import { useCallback } from "react";
import { View, ViewProps } from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";

export type NotificationItemProps = AnimatedProps<ViewProps> & {
  notification: Notification;
};

export default function NotificationItem({
  notification,
  ...props
}: NotificationItemProps) {
  const { colorScheme } = useColorScheme();
  const getIcon = useCallback(
    (iconCode: typeof notification.iconCode) => {
      switch (iconCode) {
        case "timetable":
          return Calendar;
        case "tech-news":
          return Zap;
        case "student":
          return UserIcon;
        default:
          return Info;
      }
    },
    [notification]
  );

  return (
    <Animated.View {...props}>
      <Button
        variant="ghost"
        className="mb-5 h-auto flex-row overflow-hidden rounded-2xl p-0 shadow-md">
        <LinearGradient
          colors={[
            THEME[colorScheme].cardGradient1,
            THEME[colorScheme].cardGradient2,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}>
          <View className="p-5">
            <View className="mb-3 flex-row flex-wrap items-center justify-between gap-3">
              <LinearGradient
                colors={[notification.gradientFrom, notification.gradientTo]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="h-10 w-10 items-center justify-center overflow-hidden rounded-full">
                <Icon
                  as={getIcon(notification.iconCode)}
                  size={22}
                />
              </LinearGradient>
              <Text className="mr-1 flex-1 text-base font-semibold">
                {notification.title}
              </Text>
              <View className="flex-row items-center">
                {notification.urgent && (
                  <View className="mr-1 mt-0.5 h-1.5 w-1.5 rounded-full bg-destructive" />
                )}
                <Text className="text-sm text-muted-foreground">
                  {getDistanceTo(notification.datetime)}
                </Text>
              </View>
            </View>
            <Text className="text-sm text-muted-foreground">
              {notification.message}
            </Text>
          </View>
        </LinearGradient>
      </Button>
    </Animated.View>
  );
}
