export default interface TimetableEvent {
  id: number;
  type: "lecture" | "exercise" | "labs";
  subject: string;
  date: Date;
  startTime: string;
  endTime: string;
  year: 1 | 2 | 3 | 4 | 5;
  department: {
    id: number;
    name: string;
  };
  classroom: {
    id: number;
    name: string;
  };
  teacher: {
    id: number;
    name: string;
  };
}
