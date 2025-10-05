import { Check, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function FormProgress({ currentStep, totalSteps }: FormProgressProps) {
  const percentage = (currentStep / totalSteps) * 100;
  const isComplete = currentStep === totalSteps;
  
  return (
    <div className="w-full space-y-3 p-4 rounded-xl bg-gradient-to-br from-muted/30 to-muted/10 border border-muted animate-in fade-in-50 duration-500">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">Form İlerlemesi</span>
        </div>
        <span className={cn(
          "font-bold text-lg transition-colors",
          isComplete ? "text-green-600 dark:text-green-400" : "text-primary"
        )}>
          {Math.round(percentage)}%
        </span>
      </div>
      <Progress value={percentage} className="h-2.5" />
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-muted-foreground">
          Adım {currentStep} / {totalSteps}
        </span>
        <span className={cn(
          "font-medium transition-colors",
          isComplete ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
        )}>
          {isComplete ? (
            <span className="flex items-center gap-1">
              <Check className="h-3 w-3" />
              Tamamlanmaya hazır
            </span>
          ) : (
            `${totalSteps - currentStep} adım kaldı`
          )}
        </span>
      </div>
    </div>
  );
}
