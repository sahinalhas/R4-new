import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function FormProgress({ currentStep, totalSteps }: FormProgressProps) {
  const percentage = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Form İlerlemesi</span>
        <span className="font-medium text-primary">{Math.round(percentage)}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Adım {currentStep} / {totalSteps}</span>
        <span>{currentStep === totalSteps ? 'Tamamlanmaya hazır' : `${totalSteps - currentStep} adım kaldı`}</span>
      </div>
    </div>
  );
}
