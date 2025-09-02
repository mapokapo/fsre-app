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
import Department from "@/lib/types/Department";
import StudyYear from "@/lib/types/StudyYear";
import TimetableFilter from "@/lib/types/TimetableFilter";
import { filterTimetable } from "@/lib/utils";
import { getToken } from "@react-native-firebase/messaging";
import { useNavigation } from "expo-router";
import { Filter } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Platform, View } from "react-native";

export const days: TimetableFilter<"0" | "1" | "2" | "3" | "4" | "5" | "6">[] =
  [
    { value: null, label: "Sve" },
    { value: "1", label: "Ponedjeljak" },
    { value: "2", label: "Utorak" },
    { value: "3", label: "Srijeda" },
    { value: "4", label: "Četvrtak" },
    { value: "5", label: "Petak" },
    { value: "6", label: "Subota" },
    { value: "0", label: "Nedjelja" },
  ] as const;
export const years: TimetableFilter<StudyYear>[] = [
  { value: null, label: "Sve" },
  { value: "FIRST", label: "1. godina" },
  { value: "SECOND", label: "2. godina" },
  { value: "THIRD", label: "3. godina" },
  { value: "FOURTH", label: "4. godina" },
  { value: "FIFTH", label: "5. godina" },
];
export const departments: TimetableFilter<Department>[] = [
  { value: null, label: "Sve" },
  { value: "COMPUTER_SCIENCE", label: "Računarstvo" },
  { value: "ELECTRICAL_ENGINEERING", label: "Elektrotehnika" },
  { value: "MECHANICAL_ENGINEERING", label: "Strojarstvo" },
];

export default function TimetableScreen() {
  const [selectedDay, setSelectedDay] = useState(days[0]!);
  const [selectedYear, setSelectedYear] = useState(years[0]!);
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0]!);
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
              program.studyYear === selectedYear.value &&
              program.department === selectedDepartment.value
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
        selectedYear.value === null || selectedDepartment.value === null
          ? null
          : (timetableDatabase?.studyPrograms.find(
              program =>
                program.studyYear === selectedYear.value &&
                program.department === selectedDepartment.value &&
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
          department: selectedDepartment.value,
          year: selectedYear.value,
          studyProgramId,
        });
      }
    };
    if (Platform.OS !== "web") main();
  }, [
    selectedDepartment.value,
    selectedDirection,
    selectedYear.value,
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
              selectedDay.value === null || day === parseInt(selectedDay.value);
            const yearMatch =
              selectedYear.value === null || event.year === selectedYear.value;
            const departmentMatch =
              selectedDepartment.value === null ||
              event.department === selectedDepartment.value;
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
                    sp.department === selectedDepartment.value &&
                    sp.studyYear === selectedYear.value
                )
                .map(sp => sp.direction)
                .filter(d => d !== null)
            ),
          ]
        : [],
    [selectedDepartment.value, selectedYear.value, timetableDatabase]
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
