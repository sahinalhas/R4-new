import { AcademicGoal } from "@/lib/storage";

interface HedeflerPlanlamaSectionProps {
  studentId: string;
  academicGoals: AcademicGoal[];
  onUpdate: () => void;
}

export default function HedeflerPlanlamaSection({ 
  studentId, 
  academicGoals, 
  onUpdate 
}: HedeflerPlanlamaSectionProps) {
  return null;
}
