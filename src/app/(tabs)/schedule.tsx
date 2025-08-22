import { HeaderButton } from "@/components/header";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import {
  BookOpen,
  Calendar,
  Clock,
  Filter,
  LucideIcon,
  MapPin,
  User,
  Users,
  Zap,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ColorValue,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ScheduleItem {
  id: number;
  subject: string;
  type: "predavanje" | "vježba" | "laboratorij";
  time: string;
  room: string;
  professor: string;
  day: string;
  year: number;
  department: "R" | "S" | "E";
}

const scheduleData: ScheduleItem[] = [
  {
    id: 1,
    subject: "Matematika 2",
    type: "predavanje",
    time: "08:00 - 10:00",
    room: "A-101",
    professor: "Prof. dr. Ana Marić",
    day: "Ponedjeljak",
    year: 1,
    department: "R",
  },
  {
    id: 2,
    subject: "Programiranje 1",
    type: "vježba",
    time: "10:15 - 12:00",
    room: "L-2",
    professor: "Asst. Marko Petrović",
    day: "Ponedjeljak",
    year: 1,
    department: "R",
  },
  {
    id: 3,
    subject: "Fizika",
    type: "laboratorij",
    time: "14:00 - 16:00",
    room: "L-5",
    professor: "Prof. dr. Petra Nikolić",
    day: "Ponedjeljak",
    year: 1,
    department: "S",
  },
  {
    id: 4,
    subject: "Strukture podataka",
    type: "predavanje",
    time: "08:00 - 10:00",
    room: "A-203",
    professor: "Prof. dr. Milan Jovanović",
    day: "Utorak",
    year: 2,
    department: "R",
  },
  {
    id: 5,
    subject: "Baze podataka",
    type: "vježba",
    time: "12:15 - 14:00",
    room: "L-1",
    professor: "Asst. Jovana Stanić",
    day: "Utorak",
    year: 2,
    department: "R",
  },
  {
    id: 6,
    subject: "Elektrotehnika osnove",
    type: "predavanje",
    time: "10:15 - 12:00",
    room: "A-102",
    professor: "Prof. dr. Stefan Popović",
    day: "Srijeda",
    year: 1,
    department: "E",
  },
];

const days = ["Sve", "Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"];
const years = [0, 1, 2, 3, 4];
const departments: {
  key: string;
  name: string;
  gradient: [ColorValue, ColorValue, ...ColorValue[]];
}[] = [
  { key: "all", name: "Sve", gradient: ["#667eea", "#764ba2"] },
  { key: "R", name: "Računarstvo", gradient: ["#4facfe", "#00f2fe"] },
  { key: "S", name: "Strojarstvo", gradient: ["#43e97b", "#38f9d7"] },
  { key: "E", name: "Elektrotehnika", gradient: ["#f093fb", "#f5576c"] },
];

export default function ScheduleScreen() {
  const [selectedDay, setSelectedDay] = useState("Sve");
  const [selectedYear, setSelectedYear] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const navigation = useNavigation();

  const getTypeConfig = (
    type: string
  ): {
    gradient: [ColorValue, ColorValue, ...ColorValue[]];
    icon: LucideIcon;
    label: string;
    name: string;
  } => {
    switch (type) {
      case "predavanje":
        return {
          gradient: ["#0A4977", "#1E5A8A"],
          icon: BookOpen,
          label: "P",
          name: "Predavanje",
        };
      case "vježba":
        return {
          gradient: ["#059669", "#10B981"],
          icon: Users,
          label: "V",
          name: "Vježba",
        };
      case "laboratorij":
        return {
          gradient: ["#DC2626", "#EF4444"],
          icon: Zap,
          label: "L",
          name: "Laboratorij",
        };
      default:
        return {
          gradient: ["#6B7280", "#9CA3AF"],
          icon: BookOpen,
          label: "X",
          name: "Nepoznato",
        };
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton onPress={() => setShowFilters(!showFilters)}>
          <View
            style={[
              styles.filterButton,
              showFilters && styles.filterButtonActive,
            ]}>
            <Filter
              color="#ffffff"
              size={20}
              strokeWidth={2.5}
            />
          </View>
        </HeaderButton>
      ),
    });
  });

  const filteredSchedule = scheduleData.filter(item => {
    const dayMatch = selectedDay === "Sve" || item.day === selectedDay;
    const yearMatch = selectedYear === 0 || item.year === selectedYear;
    const departmentMatch =
      selectedDepartment === "all" || item.department === selectedDepartment;

    return dayMatch && yearMatch && departmentMatch;
  });

  const groupedSchedule = filteredSchedule.reduce(
    (acc, item) => {
      if (!acc[item.day]) {
        acc[item.day] = [];
      }
      acc[item.day].push(item);
      return acc;
    },
    {} as { [key: string]: ScheduleItem[] }
  );

  return (
    <View style={styles.container}>
      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <LinearGradient
            colors={["rgba(255, 255, 255, 0.95)", "rgba(248, 250, 252, 0.95)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.filtersGradient}>
            {/* Department Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Smjer:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScroll}>
                {departments.map(dept => (
                  <TouchableOpacity
                    key={dept.key}
                    style={styles.filterChipContainer}
                    onPress={() => setSelectedDepartment(dept.key)}>
                    <LinearGradient
                      colors={
                        selectedDepartment === dept.key
                          ? dept.gradient
                          : ["#F1F5F9", "#E2E8F0"]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.filterChip}>
                      <Text
                        style={[
                          styles.filterChipText,
                          selectedDepartment === dept.key &&
                            styles.filterChipTextActive,
                        ]}>
                        {dept.name}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Year Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Godina:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScroll}>
                {years.map(year => (
                  <TouchableOpacity
                    key={year}
                    style={styles.filterChipContainer}
                    onPress={() => setSelectedYear(year)}>
                    <LinearGradient
                      colors={
                        selectedYear === year
                          ? ["#0A4977", "#1E5A8A"]
                          : ["#F1F5F9", "#E2E8F0"]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.filterChip}>
                      <Text
                        style={[
                          styles.filterChipText,
                          selectedYear === year && styles.filterChipTextActive,
                        ]}>
                        {year === 0 ? "Sve" : `${year}. godina`}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Day Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Dan:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScroll}>
                {days.map(day => (
                  <TouchableOpacity
                    key={day}
                    style={styles.filterChipContainer}
                    onPress={() => setSelectedDay(day)}>
                    <LinearGradient
                      colors={
                        selectedDay === day
                          ? ["#059669", "#10B981"]
                          : ["#F1F5F9", "#E2E8F0"]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.filterChip}>
                      <Text
                        style={[
                          styles.filterChipText,
                          selectedDay === day && styles.filterChipTextActive,
                        ]}>
                        {day}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </LinearGradient>
        </View>
      )}

      {/* Schedule List */}
      <ScrollView
        style={styles.scheduleContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scheduleContent}>
        {Object.keys(groupedSchedule).length === 0 ? (
          <View style={styles.emptyState}>
            <LinearGradient
              colors={["#F1F5F9", "#E2E8F0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.emptyStateIcon}>
              <Calendar
                color="#94A3B8"
                size={48}
                strokeWidth={1.5}
              />
            </LinearGradient>
            <Text style={styles.emptyStateTitle}>Nema rasporeda</Text>
            <Text style={styles.emptyStateText}>
              Nema rasporeda za odabrane filtere
            </Text>
          </View>
        ) : (
          Object.entries(groupedSchedule).map(([day, items]) => (
            <View
              key={day}
              style={styles.daySection}>
              <View style={styles.dayHeader}>
                <LinearGradient
                  colors={["#0A4977", "#1E5A8A"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.dayTitleGradient}>
                  <Text style={styles.dayTitle}>{day}</Text>
                  <Text style={styles.dayCount}>{items.length}</Text>
                </LinearGradient>
              </View>

              {items
                .sort((a, b) => a.time.localeCompare(b.time))
                .map(item => {
                  const typeConfig = getTypeConfig(item.type);
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.scheduleCard}>
                      <LinearGradient
                        colors={[
                          "rgba(255, 255, 255, 0.9)",
                          "rgba(248, 250, 252, 0.9)",
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={styles.scheduleCardGradient}>
                        <View style={styles.scheduleHeader}>
                          <LinearGradient
                            colors={typeConfig.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.typeIndicator}>
                            <typeConfig.icon
                              color="#ffffff"
                              size={18}
                              strokeWidth={2.5}
                            />
                          </LinearGradient>

                          <View style={styles.subjectInfo}>
                            <Text style={styles.subjectName}>
                              {item.subject}
                            </Text>
                            <View style={styles.subjectMeta}>
                              <Text style={styles.typeLabel}>
                                {typeConfig.name}
                              </Text>
                              <View style={styles.metaDot} />
                              <Text style={styles.yearInfo}>
                                {item.year}. godina
                              </Text>
                              <View style={styles.metaDot} />
                              <Text style={styles.departmentInfo}>
                                {
                                  departments.find(
                                    d => d.key === item.department
                                  )?.name
                                }
                              </Text>
                            </View>
                          </View>
                        </View>

                        <View style={styles.scheduleDetails}>
                          <View style={styles.detailRow}>
                            <View style={styles.detailIcon}>
                              <Clock
                                color="#64748B"
                                size={16}
                                strokeWidth={2.5}
                              />
                            </View>
                            <Text style={styles.detailText}>{item.time}</Text>
                          </View>
                          <View style={styles.detailRow}>
                            <View style={styles.detailIcon}>
                              <MapPin
                                color="#64748B"
                                size={16}
                                strokeWidth={2.5}
                              />
                            </View>
                            <Text style={styles.detailText}>{item.room}</Text>
                          </View>
                          <View style={styles.detailRow}>
                            <View style={styles.detailIcon}>
                              <User
                                color="#64748B"
                                size={16}
                                strokeWidth={2.5}
                              />
                            </View>
                            <Text style={styles.detailText}>
                              {item.professor}
                            </Text>
                          </View>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                })}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#ffffff",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "rgba(255, 255, 255, 0.8)",
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  filtersContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  filtersGradient: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontFamily: "Inter-Bold",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  filterScroll: {
    flexDirection: "row",
  },
  filterChipContainer: {
    marginRight: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  filterChipText: {
    fontSize: 12,
    fontFamily: "Inter-SemiBold",
    color: "#64748B",
  },
  filterChipTextActive: {
    color: "#ffffff",
  },
  scheduleContainer: {
    flex: 1,
  },
  scheduleContent: {
    padding: 20,
    paddingBottom: 120,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyStateIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#64748B",
    textAlign: "center",
    maxWidth: 200,
  },
  daySection: {
    marginBottom: 32,
  },
  dayHeader: {
    marginBottom: 16,
  },
  dayTitleGradient: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
  },
  dayTitle: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: "#ffffff",
  },
  dayCount: {
    fontSize: 12,
    fontFamily: "Inter-SemiBold",
    color: "rgba(255, 255, 255, 0.8)",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scheduleCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "0px 4px 12px rgba(10, 73, 119, 0.1)",
    elevation: 6,
  },
  scheduleCardGradient: {
    padding: 20,
  },
  scheduleHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  typeIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  subjectMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  typeLabel: {
    fontSize: 12,
    fontFamily: "Inter-SemiBold",
    color: "#0A4977",
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#CBD5E1",
    marginHorizontal: 6,
  },
  yearInfo: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
    color: "#64748B",
  },
  departmentInfo: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
    color: "#64748B",
  },
  scheduleDetails: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 16,
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#1A1A1A",
    flex: 1,
  },
});
