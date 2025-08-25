import TimetableEvent from "@/lib/types/TimetableEvent";
import { Day } from "date-fns";

export default class Timetable {
  constructor(
    public monday: TimetableEvent[],
    public tuesday: TimetableEvent[],
    public wednesday: TimetableEvent[],
    public thursday: TimetableEvent[],
    public friday: TimetableEvent[],
    public saturday: TimetableEvent[],
    public sunday: TimetableEvent[]
  ) {}

  filter(
    predicate: ({ event, day }: { event: TimetableEvent; day: Day }) => boolean
  ): Timetable {
    return new Timetable(
      this.monday.filter(event => predicate({ event, day: 1 })),
      this.tuesday.filter(event => predicate({ event, day: 2 })),
      this.wednesday.filter(event => predicate({ event, day: 3 })),
      this.thursday.filter(event => predicate({ event, day: 4 })),
      this.friday.filter(event => predicate({ event, day: 5 })),
      this.saturday.filter(event => predicate({ event, day: 6 })),
      this.sunday.filter(event => predicate({ event, day: 0 }))
    );
  }

  entries(): { day: Day; events: TimetableEvent[] }[] {
    return [
      { day: 1, events: this.monday },
      { day: 2, events: this.tuesday },
      { day: 3, events: this.wednesday },
      { day: 4, events: this.thursday },
      { day: 5, events: this.friday },
      { day: 6, events: this.saturday },
      { day: 0, events: this.sunday },
    ];
  }

  getEvents(): TimetableEvent[] {
    return [
      ...this.monday,
      ...this.tuesday,
      ...this.wednesday,
      ...this.thursday,
      ...this.friday,
      ...this.saturday,
      ...this.sunday,
    ];
  }
}
