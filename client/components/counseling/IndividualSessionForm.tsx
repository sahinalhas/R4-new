import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

import type { IndividualSessionFormValues, Student, CounselingTopic } from "./types";
import FormStepper, { Step } from "./form-steps/FormStepper";
import FormProgress from "./form-widgets/FormProgress";
import ParticipantStep from "./form-steps/ParticipantStep";
import SessionDetailsStep from "./form-steps/SessionDetailsStep";
import NotesStep from "./form-steps/NotesStep";

interface IndividualSessionFormProps {
  form: UseFormReturn<IndividualSessionFormValues>;
  students: Student[];
  topics: CounselingTopic[];
  onSubmit: (data: IndividualSessionFormValues) => void;
  onCancel: () => void;
  isPending: boolean;
}

const STEPS: Step[] = [
  { id: 1, title: "Katılımcılar", description: "Öğrenci & Konu" },
  { id: 2, title: "Detaylar", description: "Tarih & Yer" },
  { id: 3, title: "Notlar", description: "Özet" },
];

export default function IndividualSessionForm({
  form,
  students,
  topics,
  onSubmit,
  onCancel,
  isPending,
}: IndividualSessionFormProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof IndividualSessionFormValues)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ['studentId', 'topic', 'participantType'];
        break;
      case 2:
        fieldsToValidate = ['sessionDate', 'sessionTime', 'sessionMode', 'sessionLocation'];
        break;
      case 3:
        break;
      default:
        return true;
    }

    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    if (stepId < currentStep) {
      setCurrentStep(stepId);
    }
  };

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Progress Bar */}
        <FormProgress currentStep={currentStep} totalSteps={STEPS.length} />

        {/* Stepper */}
        <FormStepper 
          steps={STEPS} 
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

        {/* Step Content */}
        <div className="min-h-[400px]">
          {currentStep === 1 && (
            <ParticipantStep
              form={form}
              students={students}
              topics={topics}
              sessionType="individual"
            />
          )}

          {currentStep === 2 && (
            <SessionDetailsStep form={form} />
          )}

          {currentStep === 3 && (
            <NotesStep
              form={form}
              sessionType="individual"
              students={students}
            />
          )}
        </div>

        {/* Navigation */}
        <DialogFooter className="gap-2 sm:gap-0">
          <div className="flex w-full justify-between gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={currentStep === 1 ? onCancel : handlePrevious}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {currentStep === 1 ? 'İptal' : 'Geri'}
            </Button>

            {currentStep < STEPS.length ? (
              <Button 
                type="button"
                onClick={handleNext}
              >
                İleri
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={isPending}
                className="min-w-[160px]"
              >
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Görüşmeyi Başlat
              </Button>
            )}
          </div>
        </DialogFooter>
      </form>
    </Form>
  );
}
