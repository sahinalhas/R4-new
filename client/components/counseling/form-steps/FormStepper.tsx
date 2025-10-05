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
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-muted rounded-full" style={{ zIndex: 0 }} />
        
        {/* Active line */}
        <div 
          className="absolute top-5 left-0 h-1 bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-700 ease-in-out shadow-sm" 
          style={{ 
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            zIndex: 1
          }} 
        />

        {steps.map((step, index) => {
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
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500",
                  "border-3 font-bold text-sm shadow-md",
                  isCompleted && "bg-gradient-to-br from-primary to-primary/80 border-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110 animate-in zoom-in-50 duration-300",
                  isCurrent && "bg-background border-primary text-primary ring-4 ring-primary/30 scale-115 shadow-xl",
                  !isCompleted && !isCurrent && "bg-muted/50 border-muted-foreground/30 text-muted-foreground hover:bg-muted",
                  isClickable && "hover:scale-105 cursor-pointer hover:shadow-lg",
                  !isClickable && "cursor-not-allowed opacity-70"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5 animate-in zoom-in-50 duration-200" />
                ) : (
                  <span className="text-base">{step.id}</span>
                )}
              </button>

              {/* Step label */}
              <div className="mt-4 text-center max-w-[120px]">
                <p className={cn(
                  "text-sm font-semibold transition-all duration-300",
                  (isCurrent || isCompleted) ? "text-foreground" : "text-muted-foreground",
                  isCurrent && "scale-105"
                )}>
                  {step.title}
                </p>
                <p className={cn(
                  "text-xs text-muted-foreground mt-1.5 hidden sm:block transition-opacity",
                  (isCurrent || isCompleted) ? "opacity-100" : "opacity-70"
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
