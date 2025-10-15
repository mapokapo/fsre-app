import Department from "@/lib/types/Department";
import StudyYear from "@/lib/types/StudyYear";

export default interface SubscriptionKey {
  direction: string | null;
  department: Department;
  year: StudyYear;
  studyProgramId: number;
}
