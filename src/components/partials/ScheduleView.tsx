import { days } from "@/app/(tabs)/schedule";
import TimetableEventCard from "@/components/partials/TimetableEventCard";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { THEME } from "@/lib/theme";
import Timetable from "@/lib/types/Timetable";
import { compareAsc } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar } from "lucide-react-native";
import { ColorValue, ScrollView, View } from "react-native";

export type ScheduleViewProps = {
  timetable: Timetable;
  gradients: [ColorValue, ColorValue][];
};

export default function ScheduleView({
  timetable,
  gradients,
}: ScheduleViewProps) {
  const { colorScheme } = useColorScheme();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerClassName="p-4 grow">
      {Object.keys(timetable).length === 0 ? (
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
            Nema rasporeda
          </Text>
          <Text className="text-muted-foreground">
            Nema rasporeda za odabrane filtere
          </Text>
        </View>
      ) : (
        timetable.entries().map(({ events, day }) => (
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
                <Text className="text-lg">
                  {days.find(d => parseInt(d.key) === day)?.name}
                </Text>
                <Text className="rounded-full bg-primary/80 px-4 py-2 font-semibold text-primary-foreground">
                  {events.length}
                </Text>
              </LinearGradient>
            </View>

            {events
              .sort((a, b) => compareAsc(a.date, b.date))
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map(event => {
                return (
                  <TimetableEventCard
                    key={event.id}
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
