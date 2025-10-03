import { SurveyQuestionType } from "@/lib/survey-types";

export interface SurveyQuestion {
  questionText: string;
  questionType: SurveyQuestionType;
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
  };
}

export function createEmptyQuestion(type: SurveyQuestionType): SurveyQuestion {
  return {
    questionText: "",
    questionType: type,
    required: false,
    options: type === "MULTIPLE_CHOICE" || type === "DROPDOWN" ? [""] : undefined,
    validation: {},
  };
}

export function addOptionToQuestion(options: string[] | undefined): string[] {
  const currentOptions = options || [];
  return [...currentOptions, ""];
}

export function removeOptionFromQuestion(options: string[] | undefined, optionIndex: number): string[] {
  const currentOptions = options || [];
  return currentOptions.filter((_, i) => i !== optionIndex);
}

export function updateOptionInQuestion(
  options: string[] | undefined,
  optionIndex: number,
  value: string
): string[] {
  const currentOptions = options || [];
  const newOptions = [...currentOptions];
  newOptions[optionIndex] = value;
  return newOptions;
}
