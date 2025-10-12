import { Check, Sparkles } from "lucide-react";
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
    <div className="w-full space-y-3 p-5 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 animate-in fade-in-50 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-primary/80">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-base text-foreground">Form İlerlemesi</span>
        </div>
        <span className={cn(
          "font-bold text-2xl transition-colors",
          isComplete ? "text-green-600 dark:text-green-400 animate-pulse" : "text-primary"
        )}>
          {Math.round(percentage)}%
        </span>
      </div>
      <Progress value={percentage} className="h-3" />
      <div className="flex items-center justify-between text-sm pt-1">
        <span className="font-semibold text-muted-foreground">
          Adım {currentStep} / {totalSteps}
        </span>
        <span className={cn(
          "font-semibold transition-colors flex items-center gap-1.5",
          isComplete ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
        )}>
          {isComplete ? (
            <>
              <Check className="h-4 w-4" />
              Tamamlanabilir
            </>
          ) : (
            `${totalSteps - currentStep} adım kaldı`
          )}
        </span>
      </div>
    </div>
  );
}
