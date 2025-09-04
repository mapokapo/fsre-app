import Department from "@/lib/types/Department";
import StudyYear from "@/lib/types/StudyYear";

export default interface Profile {
  name: string;
  indexNumber: string;
  year: StudyYear;
  department: Department;
  email: string;
}
