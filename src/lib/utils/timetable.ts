import { Day } from "date-fns";

import { Timetable, TimetableEvent } from "@/lib/api/client";

export function filterTimetable(
  timetable: Timetable,
  predicate: (item: { event: TimetableEvent; day: Day }) => boolean
): Timetable {
  return {
    monday: timetable.monday.filter(event => predicate({ event, day: 1 })),
    tuesday: timetable.tuesday.filter(event => predicate({ event, day: 2 })),
    wednesday: timetable.wednesday.filter(event =>
      predicate({ event, day: 3 })
    ),
    thursday: timetable.thursday.filter(event => predicate({ event, day: 4 })),
    friday: timetable.friday.filter(event => predicate({ event, day: 5 })),
    saturday: timetable.saturday.filter(event => predicate({ event, day: 6 })),
    sunday: timetable.sunday.filter(event => predicate({ event, day: 0 })),
  };
}

export function getTimetableEvents(
  timetable: Timetable
): { day: number; events: TimetableEvent[] }[] {
  return [
    { day: 0, events: timetable.monday },
    { day: 1, events: timetable.tuesday },
    { day: 2, events: timetable.wednesday },
    { day: 3, events: timetable.thursday },
    { day: 4, events: timetable.friday },
    { day: 5, events: timetable.saturday },
    { day: 6, events: timetable.sunday },
  ];
}
