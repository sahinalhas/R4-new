import WeeklySchedule from "@/pages/components/WeeklySchedule";
import TopicPlanner from "@/pages/components/TopicPlanner";

interface CalismaProgramiSectionProps {
  studentId: string;
}

export default function CalismaProgramiSection({ studentId }: CalismaProgramiSectionProps) {
  return (
    <div className="grid gap-4">
      <WeeklySchedule sid={studentId} />
      <TopicPlanner sid={studentId} />
    </div>
  );
}
