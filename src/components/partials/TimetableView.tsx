import TimetableEventCard from "@/components/partials/TimetableEventCard";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Timetable } from "@/lib/api/client";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { THEME } from "@/lib/theme";
import { getTimetableEvents } from "@/lib/utils";
import { compareAsc } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ColorValue, ScrollView, View } from "react-native";

export type TimetableViewProps = {
  timetable: Timetable;
  gradients: [ColorValue, ColorValue][];
};

export default function TimetableView({
  timetable,
  gradients,
}: TimetableViewProps) {
  const { colorScheme } = useColorScheme();
  const { t } = useTranslation();

  const getWeekDayFromIndex = (index: number) => {
    const weekDays = [
      t("common.weekDays.monday"),
      t("common.weekDays.tuesday"),
      t("common.weekDays.wednesday"),
      t("common.weekDays.thursday"),
      t("common.weekDays.friday"),
      t("common.weekDays.saturday"),
      t("common.weekDays.sunday"),
    ];
    return weekDays[index] ?? "";
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerClassName="p-4 grow">
      {getTimetableEvents(timetable)
        .map(e => e.events)
        .flat().length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <LinearGradient
            colors={[
              THEME[colorScheme].cardGradient1,
              THEME[colorScheme].cardGradient2,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <Icon
              as={Calendar}
              className="text-muted-foreground"
              size={48}
            />
          </LinearGradient>
          <Text className="mt-4 text-xl font-bold text-muted-foreground">
            {t("timetable.noClasses.title")}
          </Text>
          <Text className="text-muted-foreground">
            {t("timetable.noClasses.description")}
          </Text>
        </View>
      ) : (
        getTimetableEvents(timetable).map(({ events, day }) => (
          <View
            key={day}
            className="mb-8">
            <View className="mb-4">
              <LinearGradient
                colors={[
                  THEME[colorScheme].fsreGradient1,
                  THEME[colorScheme].fsreGradient2,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="flex-row items-center justify-between overflow-hidden rounded-2xl px-4 py-3">
                <Text className="text-lg text-fsre-gradient-foreground">
                  {getWeekDayFromIndex(day)}
                </Text>
                <Text className="rounded-full bg-primary/80 px-4 py-2 font-semibold text-primary-foreground">
                  {events.length}
                </Text>
              </LinearGradient>
            </View>

            {events
              .sort((a, b) => compareAsc(a.startDateTime, b.endDateTime))
              .map(event => {
                return (
                  <TimetableEventCard
                    key={`${event.id}-${event.startDateTime}-${event.endDateTime}`}
                    event={event}
                    gradients={gradients}
                  />
                );
              })}
          </View>
        ))
      )}
    </ScrollView>
  );
}
