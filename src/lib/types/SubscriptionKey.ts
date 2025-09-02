import Department from "@/lib/types/Department";
import StudyYear from "@/lib/types/StudyYear";

export default interface SubscriptionKey {
  department: Department;
  year: StudyYear;
  studyProgramId: number;
}
