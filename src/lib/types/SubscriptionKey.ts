import Department from "@/lib/types/Department";
import StudyYear from "@/lib/types/StudyYear";

export default interface SubscriptionKey {
  direction: string | null;
  department: Department;
  year: StudyYear;
  studyProgramId: number;
  /** FCM token and time zone the backend subscription was made with (absent in older app versions). */
  fcmToken?: string;
  timeZone?: string;
}
