import ErrorMessage from "@/components/ErrorMessage";
import TimetableFilterButtonList from "@/components/partials/TimetableFilterButtonList";
import TimetableView from "@/components/partials/TimetableView";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { $api } from "@/lib/api/client";
import { gradients } from "@/lib/const/gradients";
import { messaging } from "@/lib/firebase";
import { useTimetableSubscriptionStore } from "@/lib/state/timetableSubscriptionStore";
import { TimetableFilter } from "@/lib/types/TimetableFilter";
import { filterTimetable } from "@/lib/utils";
import { getToken } from "@react-native-firebase/messaging";
import { useNavigation } from "expo-router";
import { Filter } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Platform, View } from "react-native";

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
  { key: "MECHANICAL_ENGINEERING", name: "Strojarstvo" },
];

export default function TimetableScreen() {
  const [selectedDay, setSelectedDay] = useState(days[0] as TimetableFilter);
  const [selectedYear, setSelectedYear] = useState(years[0] as TimetableFilter);
  const [selectedDepartment, setSelectedDepartment] = useState(
    departments[0] as TimetableFilter
  );
  const [selectedDirection, setSelectedDirection] = useState<string | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);

  const { subscriptionKey, setSubscriptionKey } =
    useTimetableSubscriptionStore();
  const { mutateAsync: subscribeToTimetable } = $api.useMutation(
    "post",
    "/messaging/subscribe"
  );
  const { mutateAsync: unsubscribeFromTimetable } = $api.useMutation(
    "post",
    "/messaging/unsubscribe"
  );

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
          isoWeek: `2025-W24`,
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

  useEffect(() => {
    const main = async () => {
      const studyProgramId =
        selectedYear.key === "all" || selectedDepartment.key === "all"
          ? null
          : (timetableDatabase?.studyPrograms.find(
              program =>
                program.studyYear === selectedYear.key &&
                program.department === selectedDepartment.key &&
                program.direction === selectedDirection
            )?.id ?? null);

      // avoid unnecessary subscriptions
      if (subscriptionKey?.studyProgramId === studyProgramId) return;

      // if the user has not chosen a specific study program
      if (studyProgramId === null) {
        // avoid unsubscribing if not subscribed
        if (subscriptionKey === null) return;

        unsubscribeFromTimetable({
          body: {
            studyProgramId: subscriptionKey.studyProgramId,
            fcmToken: await getToken(messaging!),
          },
        });
        setSubscriptionKey(null);
      } else {
        // avoid resubscribing if already subscribed
        if (subscriptionKey?.studyProgramId === studyProgramId) return;

        // unsubscribe from previous study program if different
        if (
          subscriptionKey !== null &&
          subscriptionKey.studyProgramId !== studyProgramId
        ) {
          unsubscribeFromTimetable({
            body: {
              studyProgramId: subscriptionKey.studyProgramId,
              fcmToken: await getToken(messaging!),
            },
          });
        }

        subscribeToTimetable({
          body: {
            studyProgramId,
            fcmToken: await getToken(messaging!),
          },
        });
        setSubscriptionKey({
          department: selectedDepartment.key as
            | "COMPUTER_SCIENCE"
            | "ELECTRICAL_ENGINEERING"
            | "MECHANICAL_ENGINEERING",
          year: selectedYear.key as
            | "FIRST"
            | "SECOND"
            | "THIRD"
            | "FOURTH"
            | "FIFTH",
          studyProgramId,
        });
      }
    };
    if (Platform.OS !== "web") main();
  }, [
    selectedDepartment.key,
    selectedDirection,
    selectedYear.key,
    setSubscriptionKey,
    subscribeToTimetable,
    subscriptionKey,
    timetableDatabase?.studyPrograms,
    unsubscribeFromTimetable,
  ]);

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
            const directionMatch =
              selectedDirection === null ||
              (event.directions?.includes(selectedDirection) ?? false);

            return dayMatch && yearMatch && departmentMatch && directionMatch;
          }),
    [
      selectedDay,
      selectedYear,
      selectedDepartment,
      selectedDirection,
      timetable,
    ]
  );

  const directions = useMemo(
    () =>
      timetableDatabase !== undefined
        ? [
            ...new Set(
              timetableDatabase.studyPrograms
                .filter(
                  sp =>
                    sp.department === selectedDepartment.key &&
                    sp.studyYear === selectedYear.key
                )
                .map(sp => sp.direction)
                .filter(d => d !== null)
            ),
          ]
        : [],
    [selectedDepartment.key, selectedYear.key, timetableDatabase]
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

          {directions.length > 0 && (
            <Select
              onValueChange={newValue => {
                setSelectedDirection(newValue?.value ?? null);
              }}>
              <Text className="mb-1 ml-1 text-sm text-muted-foreground">
                Smjer
              </Text>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Odaberite smjer" />
              </SelectTrigger>
              <SelectContent>
                {directions.map(direction => (
                  <SelectItem
                    key={direction}
                    label={direction}
                    value={direction}>
                    {direction}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </View>
      )}

      <TimetableView
        timetable={filteredTimetable}
        gradients={gradients}
      />
    </View>
  );
}
