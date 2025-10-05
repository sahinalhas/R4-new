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
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted" style={{ zIndex: 0 }} />
        
        {/* Active line */}
        <div 
          className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500 ease-in-out" 
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
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  "border-2 font-semibold text-sm",
                  isCompleted && "bg-primary border-primary text-primary-foreground shadow-lg scale-110",
                  isCurrent && "bg-background border-primary text-primary ring-4 ring-primary/20 scale-110",
                  !isCompleted && !isCurrent && "bg-muted border-muted-foreground/30 text-muted-foreground",
                  isClickable && "hover:scale-105 cursor-pointer",
                  !isClickable && "cursor-not-allowed"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{step.id}</span>
                )}
              </button>

              {/* Step label */}
              <div className="mt-3 text-center max-w-[120px]">
                <p className={cn(
                  "text-sm font-medium transition-colors",
                  (isCurrent || isCompleted) ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
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
