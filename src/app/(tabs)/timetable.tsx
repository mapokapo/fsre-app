import TimetableFilterButtonList from "@/components/partials/TimetableFilterButtonList";
import TimetableView from "@/components/partials/TimetableView";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { $api } from "@/lib/api/client";
import { TimetableFilter } from "@/lib/types/TimetableFilter";
import { filterTimetable } from "@/lib/utils";
import { useNavigation } from "expo-router";
import { Filter } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ColorValue, View } from "react-native";

export const days: TimetableFilter[] = [
  { key: "all", name: "Sve" },
  { key: "1", name: "Ponedjeljak" },
  { key: "2", name: "Utorak" },
  { key: "3", name: "Srijeda" },
  { key: "4", name: "Četvrtak" },
  { key: "5", name: "Petak" },
  { key: "6", name: "Subota" },
  { key: "0", name: "Nedjelja" },
] as const;
export const years: TimetableFilter[] = [
  { key: "all", name: "Sve" },
  { key: "FIRST", name: "1. godina" },
  { key: "SECOND", name: "2. godina" },
  { key: "THIRD", name: "3. godina" },
  { key: "FOURTH", name: "4. godina" },
  { key: "FIFTH", name: "5. godina" },
];
export const departments: TimetableFilter[] = [
  { key: "all", name: "Sve" },
  { key: "COMPUTER_SCIENCE", name: "Računarstvo" },
  { key: "ELECTRICAL_ENGINEERING", name: "Elektrotehnika" },
  { key: "MECHANICAL_ENGINEERING", name: "Mašinstvo" },
];

const gradients: [ColorValue, ColorValue][] = [
  ["#0A4977", "#1E5A8A"],
  ["#667eea", "#764ba2"],
  ["#4facfe", "#00f2fe"],
  ["#43e97b", "#38f9d7"],
  ["#f093fb", "#f5576c"],
  ["#f093fb", "#f5576c"],
];

export default function TimetableScreen() {
  const [selectedDay, setSelectedDay] = useState(days[0] as TimetableFilter);
  const [selectedYear, setSelectedYear] = useState(years[0] as TimetableFilter);
  const [selectedDepartment, setSelectedDepartment] = useState(
    departments[0] as TimetableFilter
  );
  const [showFilters, setShowFilters] = useState(false);
  const {
    data: timetable,
    error,
    isLoading,
  } = $api.useQuery("get", "/timetable", {
    params: {
      query: {
        isoWeek: `2025-W24`,
        studyProgram: -55,
      },
    },
  });

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          className="rounded-full bg-white/20 p-6"
          size="icon"
          onPress={() => setShowFilters(!showFilters)}>
          <Icon
            as={Filter}
            className="text-fsre-gradient-foreground"
            size={24}
          />
        </Button>
      ),
    });
  });

  const filteredTimetable = useMemo(
    () =>
      timetable === undefined
        ? {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: [],
          }
        : filterTimetable(timetable, ({ event, day }) => {
            const dayMatch =
              selectedDay.key === "all" || day === parseInt(selectedDay.key);
            const yearMatch =
              selectedYear.key === "all" || event.year === selectedYear.key;
            const departmentMatch =
              selectedDepartment.key === "all" ||
              event.department === selectedDepartment.key;

            return dayMatch && yearMatch && departmentMatch;
          }),
    [selectedDay, selectedYear, selectedDepartment, timetable]
  );

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <View className="rounded-lg bg-destructive/30 p-4">
          <Text className="text-center text-xl font-bold">Error</Text>
          <Text className="text-center">{error.message}</Text>
        </View>
      </View>
    );
  }

  if (isLoading || !timetable) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator
          size={64}
          className="text-fsre-gradient-3"
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {showFilters && (
        <View className="gap-4 p-5">
          <TimetableFilterButtonList
            label="Dan"
            filters={days}
            gradients={gradients}
            selectedFilter={selectedDay}
            onSelect={setSelectedDay}
          />

          <TimetableFilterButtonList
            label="Godina"
            filters={years}
            gradients={gradients}
            selectedFilter={selectedYear}
            onSelect={setSelectedYear}
          />

          <TimetableFilterButtonList
            label="Studij"
            filters={departments}
            gradients={gradients}
            selectedFilter={selectedDepartment}
            onSelect={setSelectedDepartment}
          />
        </View>
      )}

      <TimetableView
        timetable={filteredTimetable}
        gradients={gradients}
      />
    </View>
  );
}
