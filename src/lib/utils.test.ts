import { describe, expect, test } from "bun:test";

import type { Timetable, TimetableEvent } from "@/lib/api/client";
import { filterTimetable } from "@/lib/utils/timetable";

function makeEvent(
  overrides: Partial<TimetableEvent> & Pick<TimetableEvent, "id" | "name">
): TimetableEvent {
  return {
    department: "COMPUTER_SCIENCE",
    type: "LECTURE",
    year: "FIRST",
    directions: null,
    startDateTime: "2026-01-06T08:00:00",
    endDateTime: "2026-01-06T10:00:00",
    studyProgramIds: [1],
    classRoomIds: [1],
    teacherIds: [1],
    studyProgramNames: ["CS"],
    classRoomNames: ["A101"],
    teacherNames: ["Prof"],
    ...overrides,
  };
}

function makeTimetable(
  overrides: Partial<Record<keyof Timetable, TimetableEvent[]>> = {}
): Timetable {
  return {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
    ...overrides,
  };
}

describe("filterTimetable", () => {
  test("filters events by day of week", () => {
    const mondayEvent = makeEvent({ id: 1, name: "Monday lecture" });
    const wednesdayEvent = makeEvent({ id: 2, name: "Wednesday lecture" });

    const timetable = makeTimetable({
      monday: [mondayEvent],
      wednesday: [wednesdayEvent],
    });

    const filtered = filterTimetable(timetable, ({ day }) => day === 3);

    expect(filtered.monday).toEqual([]);
    expect(filtered.tuesday).toEqual([]);
    expect(filtered.wednesday).toEqual([wednesdayEvent]);
    expect(filtered.thursday).toEqual([]);
    expect(filtered.friday).toEqual([]);
    expect(filtered.saturday).toEqual([]);
    expect(filtered.sunday).toEqual([]);
  });

  test("passes the correct day index for each timetable column", () => {
    const days: number[] = [];

    filterTimetable(
      makeTimetable({
        monday: [makeEvent({ id: 1, name: "Mon" })],
        tuesday: [makeEvent({ id: 2, name: "Tue" })],
        wednesday: [makeEvent({ id: 3, name: "Wed" })],
        thursday: [makeEvent({ id: 4, name: "Thu" })],
        friday: [makeEvent({ id: 5, name: "Fri" })],
        saturday: [makeEvent({ id: 6, name: "Sat" })],
        sunday: [makeEvent({ id: 7, name: "Sun" })],
      }),
      ({ day }) => {
        days.push(day);
        return true;
      }
    );

    expect(days).toEqual([1, 2, 3, 4, 5, 6, 0]);
  });

  test("filters by event properties while preserving other days", () => {
    const firstYear = makeEvent({ id: 1, name: "Year 1", year: "FIRST" });
    const thirdYear = makeEvent({ id: 2, name: "Year 3", year: "THIRD" });

    const filtered = filterTimetable(
      makeTimetable({
        monday: [firstYear, thirdYear],
        friday: [thirdYear],
      }),
      ({ event }) => event.year === "FIRST"
    );

    expect(filtered.monday).toEqual([firstYear]);
    expect(filtered.friday).toEqual([]);
  });
});
