import ErrorMessage from "@/components/ErrorMessage";
import TimetableFilterButtonList from "@/components/partials/TimetableFilterButtonList";
import TimetableView from "@/components/partials/TimetableView";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { $api } from "@/lib/api/client";
import { gradients } from "@/lib/const/gradients";
import { TimetableFilter } from "@/lib/types/TimetableFilter";
import { filterTimetable } from "@/lib/utils";
import { getWeek, getYear } from "date-fns";
import { useNavigation } from "expo-router";
import { Filter } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";

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

export default function TimetableScreen() {
  const [selectedDay, setSelectedDay] = useState(days[0] as TimetableFilter);
  const [selectedYear, setSelectedYear] = useState(years[0] as TimetableFilter);
  const [selectedDepartment, setSelectedDepartment] = useState(
    departments[0] as TimetableFilter
  );
  const [showFilters, setShowFilters] = useState(false);
  const {
    data: timetableDatabase,
    error: timetableDatabaseError,
    isLoading: isTimetableDatabaseLoading,
  } = $api.useQuery("get", "/timetable-database");
  const {
    data: timetable,
    error: timetableError,
    isLoading: isTimetableLoading,
  } = $api.useQuery(
    "get",
    "/timetable",
    {
      params: {
        query: {
          isoWeek: `${getYear(new Date())}-W${getWeek(new Date())}`,
          studyProgram: timetableDatabase?.studyPrograms.find(
            program =>
              program.studyYear === selectedYear.key &&
              program.department === selectedDepartment.key
          )?.id,
        },
      },
    },
    {
      enabled: !!timetableDatabase,
    }
  );

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

  if (timetableError || timetableDatabaseError) {
    return <ErrorMessage error={timetableError ?? timetableDatabaseError} />;
  }

  if (
    isTimetableLoading ||
    !timetable ||
    isTimetableDatabaseLoading ||
    !timetableDatabase
  ) {
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
            selectedFilter={selectedDay}
            onSelect={setSelectedDay}
          />

          <TimetableFilterButtonList
            label="Godina"
            filters={years}
            selectedFilter={selectedYear}
            onSelect={setSelectedYear}
          />

          <TimetableFilterButtonList
            label="Studij"
            filters={departments}
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
