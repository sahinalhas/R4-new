export interface SpecialEducation {
  id: string;
  studentId: string;
  hasIEP?: boolean;
  iepStartDate?: string;
  iepEndDate?: string;
  iepGoals?: string;
  diagnosis?: string;
  ramReportDate?: string;
  ramReportSummary?: string;
  supportServices?: string;
  accommodations?: string;
  modifications?: string;
  progressNotes?: string;
  evaluationSchedule?: string;
  specialistContacts?: string;
  parentInvolvement?: string;
  transitionPlan?: string;
  assistiveTechnology?: string;
  behavioralSupport?: string;
  status?: string;
  nextReviewDate?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}
