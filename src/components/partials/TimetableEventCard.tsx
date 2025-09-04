import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { TimetableEvent } from "@/lib/api/client";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { THEME } from "@/lib/theme";
import { studyYearToInt } from "@/lib/utils";
import { formatDate } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import {
  BookOpen,
  Calendar,
  Clock,
  LucideIcon,
  MapPin,
  NotebookPen,
  User,
  Users,
  Zap,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ColorValue, View } from "react-native";

export type TimetableEventCardProps = {
  event: TimetableEvent;
  gradients: [ColorValue, ColorValue][];
};

const getIndexByType = (event: TimetableEvent) => {
  switch (event.type) {
    case "LECTURE":
      return 0;
    case "EXERCISE":
      return 1;
    case "LABS":
      return 2;
    case "LECTURE_AND_EXERCISE":
      return 3;
    default:
      return 4;
  }
};

const getIconByType = (event: TimetableEvent): LucideIcon => {
  switch (event.type) {
    case "LECTURE":
      return BookOpen;
    case "EXERCISE":
      return Users;
    case "LECTURE_AND_EXERCISE":
      return NotebookPen;
    case "LABS":
      return Zap;
    default:
      return Calendar;
  }
};

export default function TimetableEventCard({
  event,
  gradients,
}: TimetableEventCardProps) {
  const { colorScheme } = useColorScheme();
  const { t } = useTranslation();

  const getGradientByType = (
    event: TimetableEvent
  ): [ColorValue, ColorValue] => {
    const index = getIndexByType(event) % gradients.length;
    return gradients[index] as [ColorValue, ColorValue];
  };

  return (
    <Button
      variant="ghost"
      className="mb-4 h-auto justify-stretch overflow-hidden rounded-2xl p-0 shadow-md web:!h-auto">
      <LinearGradient
        colors={[
          THEME[colorScheme].cardGradient1,
          THEME[colorScheme].cardGradient2,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full p-5">
        <View className="mb-4 flex-row items-center gap-2">
          <LinearGradient
            colors={getGradientByType(event)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="h-12 w-12 items-center justify-center overflow-hidden rounded-full">
            <Icon
              as={getIconByType(event)}
              className="text-fsre-gradient-foreground"
              size={24}
            />
          </LinearGradient>

          <View className="flex-1">
            <Text>{event.name}</Text>
            <View className="flex-row flex-wrap items-center gap-1">
              <Text className="text-sm text-muted-foreground">
                {t("common.studyYear", {
                  count: studyYearToInt(event.year),
                })}
              </Text>
              <View className="mx-1 h-1 w-1 rounded-full bg-muted-foreground" />
              <Text className="text-sm text-muted-foreground">
                {t(`common.departmentEnum.${event.department}`)}
              </Text>
            </View>
          </View>
        </View>

        <View className="gap-4 border-t border-border pt-4">
          <View className="flex-row items-center">
            <View className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
              <Icon as={Clock} />
            </View>
            <Text className="text-sm text-muted-foreground">
              {formatDate(event.startDateTime, "HH:mm")} -{" "}
              {formatDate(event.endDateTime, "HH:mm")}
            </Text>
          </View>
          <View className="flex-row items-center">
            <View className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
              <Icon as={MapPin} />
            </View>
            <Text className="text-sm text-muted-foreground">
              {event.classRoomNames[0]}
            </Text>
          </View>
          <View className="flex-row items-center">
            <View className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
              <Icon as={User} />
            </View>
            <Text className="text-sm text-muted-foreground">
              {event.teacherNames[0]}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Button>
  );
}
