import ErrorMessage from "@/components/ErrorMessage";
import TimetableFilterButtonList from "@/components/partials/TimetableFilterButtonList";
import TimetableFilterHeaderButton from "@/components/partials/TimetableFilterHeaderButton";
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
import {
  days,
  departments,
  getDefaultFilter,
  years,
} from "@/lib/const/timetableFilters";
import { useNavigationHeaderRight } from "@/lib/hooks/useNavigationHeaderRight";
import { useTimetableSubscription } from "@/lib/hooks/useTimetableSubscription";
import { useTimetableSubscriptionStore } from "@/lib/state/timetableSubscriptionStore";
import { filterTimetable } from "@/lib/utils";
import { addWeeks, format, parse, subWeeks } from "date-fns";
import { useNavigation } from "expo-router";
import { ChevronLeft, ChevronRight, X } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";

export default function TimetableScreen() {
  const [currentIsoWeek, setCurrentIsoWeek] = useState(() =>
    format(new Date(), "RRRR-'W'II")
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { subscriptionKey } = useTimetableSubscriptionStore();

  const [selectedDay, setSelectedDay] = useState(() => getDefaultFilter(days));
  const [selectedYear, setSelectedYear] = useState(
    () =>
      years.find(y => y.value === subscriptionKey?.year) ??
      getDefaultFilter(years)
  );
  const [selectedDepartment, setSelectedDepartment] = useState(
    () =>
      departments.find(d => d.value === subscriptionKey?.department) ??
      getDefaultFilter(departments)
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

  const toggleFilters = useCallback(() => {
    setShowFilters(current => !current);
  }, []);

  useNavigationHeaderRight(navigation, TimetableFilterHeaderButton, {
    onPress: toggleFilters,
  });

  useTimetableSubscription({
    selectedYear: selectedYear.value,
    selectedDepartment: selectedDepartment.value,
    selectedDirection,
    studyPrograms: timetableDatabase?.studyPrograms,
    subscribeToTimetable,
    unsubscribeFromTimetable,
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
              selectedDay.value === null ||
              day === Number.parseInt(selectedDay.value, 10);
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
      timetableDatabase === undefined
        ? []
        : [
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
          ],
    [selectedDepartment.value, selectedYear.value, timetableDatabase]
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchTimetableDatabase(), refetchTimetable()]);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchTimetable, refetchTimetableDatabase]);

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
            const current = parse(currentIsoWeek, "RRRR-'W'II", new Date());
            setCurrentIsoWeek(format(subWeeks(current, 1), "RRRR-'W'II"));
          }}>
          <Icon
            as={ChevronLeft}
            size={20}
          />
        </Button>
        <View className="flex-row items-center">
          <Text className="text-lg font-semibold">
            {currentIsoWeek === format(new Date(), "RRRR-'W'II")
              ? t("timetable.filters.currentWeek")
              : t("timetable.filters.week", {
                  week: currentIsoWeek.split("-W")[1],
                })}
          </Text>
          {currentIsoWeek !== format(new Date(), "RRRR-'W'II") && (
            <Button
              size="icon"
              variant="ghost"
              onPress={() => {
                setCurrentIsoWeek(format(new Date(), "RRRR-'W'II"));
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
            const current = parse(currentIsoWeek, "RRRR-'W'II", new Date());
            setCurrentIsoWeek(format(addWeeks(current, 1), "RRRR-'W'II"));
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
        onRefresh={handleRefresh}
        gradients={gradients}
      />
    </View>
  );
}
