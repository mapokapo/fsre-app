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
import { days, departments, years } from "@/lib/const/timetableFilters";
import { messaging } from "@/lib/firebase";
import { useTimetableSubscriptionStore } from "@/lib/state/timetableSubscriptionStore";
import { filterTimetable } from "@/lib/utils";
import { getToken } from "@react-native-firebase/messaging";
import { getWeek, getYear, parse } from "date-fns";
import { useNavigation } from "expo-router";
import { ChevronLeft, ChevronRight, Filter, X } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Platform, View } from "react-native";

export default function TimetableScreen() {
  const [currentIsoWeek, setCurrentIsoWeek] = useState(
    `${getYear(new Date())}-W${getWeek(new Date())}`
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { subscriptionKey, setSubscriptionKey } =
    useTimetableSubscriptionStore();

  const [selectedDay, setSelectedDay] = useState(days[0]!);
  const [selectedYear, setSelectedYear] = useState(
    years.find(y => y.value === subscriptionKey?.year) ?? years[0]!
  );
  const [selectedDepartment, setSelectedDepartment] = useState(
    departments.find(d => d.value === subscriptionKey?.department) ??
      departments[0]!
  );
  const [selectedDirection, setSelectedDirection] = useState<string | null>(
    subscriptionKey?.direction ?? null
  );
  const [showFilters, setShowFilters] = useState(false);

  const { t } = useTranslation();
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
    refetch: refetchTimetableDatabase,
  } = $api.useQuery("get", "/timetable-database");
  const {
    data: timetable,
    error: timetableError,
    isLoading: isTimetableLoading,
    refetch: refetchTimetable,
  } = $api.useQuery(
    "get",
    "/timetable",
    {
      params: {
        query: {
          isoWeek: currentIsoWeek,
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
  }, [navigation, showFilters]);

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
          direction: selectedDirection,
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
    return (
      <ErrorMessage
        error={timetableError ?? timetableDatabaseError}
        onRetry={() => {
          refetchTimetableDatabase();
          refetchTimetable();
        }}
      />
    );
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
            label={t("timetable.filters.day")}
            filters={days}
            selectedFilter={selectedDay}
            onSelect={setSelectedDay}
          />

          <TimetableFilterButtonList
            label={t("timetable.filters.studyYear")}
            filters={years}
            selectedFilter={selectedYear}
            onSelect={setSelectedYear}
          />

          <TimetableFilterButtonList
            label={t("timetable.filters.department")}
            filters={departments}
            selectedFilter={selectedDepartment}
            onSelect={setSelectedDepartment}
          />

          {directions.length > 0 && (
            <Select
              value={
                selectedDirection
                  ? { label: selectedDirection, value: selectedDirection }
                  : undefined
              }
              onValueChange={newValue => {
                setSelectedDirection(newValue?.value ?? null);
              }}>
              <Text className="mb-1 ml-1 text-sm text-muted-foreground">
                {t("timetable.filters.direction")}
              </Text>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={t("timetable.filters.chooseDirection")}
                />
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
      <View className="flex-row items-center justify-between px-5 py-3">
        <Button
          className="rounded-xl p-4"
          variant="outline"
          onPress={() => {
            const current = parse(currentIsoWeek, "R-'W'I", new Date());
            const previous = new Date(current);
            previous.setDate(current.getDate() - 7);
            setCurrentIsoWeek(`${getYear(previous)}-W${getWeek(previous)}`);
          }}>
          <Icon
            as={ChevronLeft}
            size={20}
          />
        </Button>
        <View className="flex-row items-center">
          <Text className="text-lg font-semibold">
            {currentIsoWeek === `${getYear(new Date())}-W${getWeek(new Date())}`
              ? t("timetable.filters.currentWeek")
              : t("timetable.filters.week", {
                  week: currentIsoWeek.split("-W")[1],
                })}
          </Text>
          {currentIsoWeek !==
            `${getYear(new Date())}-W${getWeek(new Date())}` && (
            <Button
              size="icon"
              variant="ghost"
              onPress={() => {
                setCurrentIsoWeek(
                  `${getYear(new Date())}-W${getWeek(new Date())}`
                );
              }}>
              <Icon
                as={X}
                size={16}
              />
            </Button>
          )}
        </View>
        <Button
          className="rounded-xl p-4"
          variant="outline"
          onPress={() => {
            const current = parse(currentIsoWeek, "R-'W'I", new Date());
            const next = new Date(current);
            next.setDate(current.getDate() + 7);
            setCurrentIsoWeek(`${getYear(next)}-W${getWeek(next)}`);
          }}>
          <Icon
            as={ChevronRight}
            size={20}
          />
        </Button>
      </View>
      <TimetableView
        timetable={filteredTimetable}
        isRefreshing={isRefreshing}
        onRefresh={() => {
          setIsRefreshing(true);

          Promise.all([refetchTimetableDatabase(), refetchTimetable()]).then(
            () => {
              setIsRefreshing(false);
            }
          );
        }}
        gradients={gradients}
      />
    </View>
  );
}
