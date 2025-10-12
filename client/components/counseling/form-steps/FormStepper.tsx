import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  id: number;
  title: string;
  description: string;
}

interface FormStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
}

export default function FormStepper({ steps, currentStep, onStepClick }: FormStepperProps) {
  const getStepColor = (stepId: number) => {
    if (stepId === 1) return "from-blue-500 to-purple-600";
    if (stepId === 2) return "from-emerald-500 to-orange-500";
    return "from-primary to-primary/80";
  };

  const getStepBorderColor = (stepId: number, isCompleted: boolean, isCurrent: boolean) => {
    if (stepId === 1) {
      if (isCompleted) return "border-blue-500 bg-gradient-to-br from-blue-500 to-purple-600";
      if (isCurrent) return "border-blue-500 ring-blue-500/30";
    }
    if (stepId === 2) {
      if (isCompleted) return "border-emerald-500 bg-gradient-to-br from-emerald-500 to-orange-500";
      if (isCurrent) return "border-emerald-500 ring-emerald-500/30";
    }
    return "";
  };

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute top-6 left-0 right-0 h-1.5 bg-muted rounded-full" style={{ zIndex: 0 }} />
        
        {/* Active line */}
        <div 
          className={cn(
            "absolute top-6 left-0 h-1.5 rounded-full transition-all duration-700 ease-in-out",
            currentStep === 1 && "bg-gradient-to-r from-blue-500 to-purple-600",
            currentStep === 2 && "bg-gradient-to-r from-emerald-500 to-orange-500"
          )}
          style={{ 
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            zIndex: 1
          }} 
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isClickable = onStepClick && (isCompleted || isCurrent);

          return (
            <div 
              key={step.id} 
              className="flex flex-col items-center relative"
              style={{ zIndex: 2 }}
            >
              {/* Step circle */}
              <button
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500",
                  "border-4 font-bold text-base shadow-lg",
                  getStepBorderColor(step.id, isCompleted, isCurrent),
                  isCompleted && "text-white shadow-xl scale-110",
                  isCurrent && "bg-background text-foreground ring-4 scale-115 shadow-2xl",
                  !isCompleted && !isCurrent && "bg-muted/50 border-muted-foreground/30 text-muted-foreground",
                  isClickable && "hover:scale-105 cursor-pointer",
                  !isClickable && "cursor-not-allowed opacity-70"
                )}
              >
                {isCompleted ? (
                  <Check className="h-6 w-6 animate-in zoom-in-50 duration-200" />
                ) : (
                  <span className="text-lg">{step.id}</span>
                )}
              </button>

              {/* Step label */}
              <div className="mt-3 text-center max-w-[140px]">
                <p className={cn(
                  "text-base font-bold transition-all duration-300",
                  step.id === 1 && (isCurrent || isCompleted) && "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
                  step.id === 2 && (isCurrent || isCompleted) && "bg-gradient-to-r from-emerald-600 to-orange-600 bg-clip-text text-transparent",
                  !isCurrent && !isCompleted && "text-muted-foreground"
                )}>
                  {step.title}
                </p>
                <p className={cn(
                  "text-xs text-muted-foreground mt-1",
                  (isCurrent || isCompleted) ? "opacity-100" : "opacity-60"
                )}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
