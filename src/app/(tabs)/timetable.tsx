import ErrorMessage from "@/components/ErrorMessage";
import TimetableFilterButtonList from "@/components/partials/TimetableFilterButtonList";
import TimetableFilterHeaderButton from "@/components/partials/TimetableFilterHeaderButton";
import TimetableNotificationsDialog from "@/components/partials/TimetableNotificationsDialog";
import TimetableSubscriptionStatusBanner from "@/components/partials/TimetableSubscriptionStatusBanner";
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
import { useNotificationOnboarding } from "@/lib/hooks/useNotificationOnboarding";
import { useNotificationPermissionStatus } from "@/lib/hooks/useNotificationPermissionStatus";
import { useTimetableSubscription } from "@/lib/hooks/useTimetableSubscription";
import { resolveStudyProgramId } from "@/lib/services/timetableSubscription";
import { useTimetableSubscriptionStore } from "@/lib/state/timetableSubscriptionStore";
import TimetableFilter from "@/lib/types/TimetableFilter";
import Department from "@/lib/types/Department";
import StudyYear from "@/lib/types/StudyYear";
import { filterTimetable } from "@/lib/utils";
import { addWeeks, format, parse, subWeeks } from "date-fns";
import { useNavigation } from "expo-router";
import { ChevronLeft, ChevronRight, Calendar, X } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  const {
    showDialog: showNotificationsDialog,
    isComplete: isNotificationOnboardingComplete,
    completeOnboarding,
  } = useNotificationOnboarding();
  const { permissionStatus, refreshPermissionStatus } =
    useNotificationPermissionStatus(isNotificationOnboardingComplete);

  const handleCompleteOnboarding = useCallback(async () => {
    await completeOnboarding();
    await refreshPermissionStatus();
  }, [completeOnboarding, refreshPermissionStatus]);
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

  const studyProgramId = useMemo(
    () =>
      resolveStudyProgramId(
        selectedYear.value,
        selectedDepartment.value,
        selectedDirection,
        timetableDatabase?.studyPrograms
      ),
    [
      selectedYear.value,
      selectedDepartment.value,
      selectedDirection,
      timetableDatabase?.studyPrograms,
    ]
  );

  useEffect(() => {
    if (
      selectedDirection !== null &&
      (directions.length === 0 || !directions.includes(selectedDirection))
    ) {
      setSelectedDirection(null);
    }
  }, [directions, selectedDirection]);

  const handleYearSelect = useCallback(
    (year: TimetableFilter<StudyYear>) => {
      setSelectedYear(year);
      if (year.value !== selectedYear.value) {
        setSelectedDirection(null);
      }
    },
    [selectedYear.value]
  );

  const handleDepartmentSelect = useCallback(
    (department: TimetableFilter<Department>) => {
      setSelectedDepartment(department);
      if (department.value !== selectedDepartment.value) {
        setSelectedDirection(null);
      }
    },
    [selectedDepartment.value]
  );

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
          studyProgram: studyProgramId ?? undefined,
        },
      },
    },
    {
      enabled: !!timetableDatabase && studyProgramId !== null,
    }
  );

  const navigation = useNavigation();

  const toggleFilters = useCallback(() => {
    setShowFilters(current => !current);
  }, []);

  useNavigationHeaderRight(navigation, TimetableFilterHeaderButton, {
    onPress: toggleFilters,
  });

  const { subscriptionStatus, retrySubscription } = useTimetableSubscription({
    selectedYear: selectedYear.value,
    selectedDepartment: selectedDepartment.value,
    selectedDirection,
    studyPrograms: timetableDatabase?.studyPrograms,
    subscribeToTimetable,
    unsubscribeFromTimetable,
    enabled: isNotificationOnboardingComplete,
    notificationsEnabled: permissionStatus === "granted",
  });

  const effectiveTimetable = studyProgramId === null ? undefined : timetable;

  const filteredTimetable = useMemo(
    () =>
      effectiveTimetable === undefined
        ? {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: [],
          }
        : filterTimetable(effectiveTimetable, ({ event, day }) => {
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
      effectiveTimetable,
    ]
  );

  const isWaitingForDirection =
    directions.length > 0 && selectedDirection === null;
  const isWaitingForTimetable =
    studyProgramId !== null &&
    (isTimetableLoading || effectiveTimetable === undefined);

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
      <>
        <TimetableNotificationsDialog
          isVisible={showNotificationsDialog}
          onContinue={handleCompleteOnboarding}
        />
        <ErrorMessage
          error={timetableError ?? timetableDatabaseError}
          onRetry={() => {
            refetchTimetableDatabase();
            refetchTimetable();
          }}
        />
      </>
    );
  }

  if (
    isWaitingForTimetable ||
    isTimetableDatabaseLoading ||
    !timetableDatabase
  ) {
    return (
      <>
        <TimetableNotificationsDialog
          isVisible={showNotificationsDialog}
          onContinue={handleCompleteOnboarding}
        />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator
            size={64}
            className="text-fsre-gradient-3"
          />
        </View>
      </>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <TimetableNotificationsDialog
        isVisible={showNotificationsDialog}
        onContinue={handleCompleteOnboarding}
      />
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
            onSelect={handleYearSelect}
          />

          <TimetableFilterButtonList
            label={t("timetable.filters.department")}
            filters={departments}
            selectedFilter={selectedDepartment}
            onSelect={handleDepartmentSelect}
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
      <TimetableSubscriptionStatusBanner
        subscriptionStatus={subscriptionStatus}
        permissionStatus={permissionStatus}
        onRetry={retrySubscription}
      />
      {isWaitingForDirection ? (
        <View className="flex-1 items-center justify-center p-4">
          <Icon
            as={Calendar}
            className="text-muted-foreground"
            size={48}
          />
          <Text className="mt-4 text-center text-xl font-bold text-muted-foreground">
            {t("timetable.filters.directionRequired")}
          </Text>
        </View>
      ) : (
        <TimetableView
          timetable={filteredTimetable}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
          gradients={gradients}
        />
      )}
    </View>
  );
}
