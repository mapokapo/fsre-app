import TimetableDaySection from "@/components/partials/TimetableDaySection";
import { Accordion } from "@/components/ui/accordion";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Timetable } from "@/lib/api/client";
import { getTimetableEvents } from "@/lib/utils";
import { Calendar } from "lucide-react-native";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ColorValue, RefreshControl, ScrollView, View } from "react-native";

export type TimetableViewProps = {
  timetable: Timetable;
  isRefreshing: boolean;
  onRefresh: () => void;
  gradients: [ColorValue, ColorValue][];
};

export default function TimetableView({
  timetable,
  isRefreshing,
  onRefresh,
  gradients,
}: Readonly<TimetableViewProps>) {
  const { t } = useTranslation();

  const timetableDays = useMemo(
    () =>
      getTimetableEvents(timetable).filter(({ events }) => events.length > 0),
    [timetable]
  );

  const defaultExpandedDays = useMemo(
    () => timetableDays.map(({ day }) => String(day)),
    [timetableDays]
  );

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
      contentContainerClassName="p-4 grow"
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      }>
      {timetableDays.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Icon
            as={Calendar}
            className="text-muted-foreground"
            size={48}
          />
          <Text className="mt-4 text-xl font-bold text-muted-foreground">
            {t("timetable.noClasses.title")}
          </Text>
          <Text className="text-muted-foreground">
            {t("timetable.noClasses.description")}
          </Text>
        </View>
      ) : (
        <Accordion
          collapsible
          defaultValue={defaultExpandedDays}
          type="multiple">
          {timetableDays.map(({ events, day }) => (
            <TimetableDaySection
              key={day}
              dayLabel={getWeekDayFromIndex(day)}
              dayValue={String(day)}
              events={events}
              gradients={gradients}
            />
          ))}
        </Accordion>
      )}
    </ScrollView>
  );
}
