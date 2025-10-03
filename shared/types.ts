/**
 * Shared types between client and server
 * These types represent the common data structures used across the application
 */

/**
 * Health information for students
 */
export interface HealthInfo {
  id: string;
  studentId: string;
  bloodType?: string;
  chronicDiseases?: string;
  allergies?: string;
  medications?: string;
  specialNeeds?: string;
  medicalHistory?: string;
  emergencyContact1Name?: string;
  emergencyContact1Phone?: string;
  emergencyContact1Relation?: string;
  emergencyContact2Name?: string;
  emergencyContact2Phone?: string;
  emergencyContact2Relation?: string;
  physicianName?: string;
  physicianPhone?: string;
  insuranceInfo?: string;
  vaccinations?: string;
  dietaryRestrictions?: string;
  physicalLimitations?: string;
  mentalHealthNotes?: string;
  lastHealthCheckup?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Risk assessment factors for students
 */
export interface RiskFactors {
  id: string;
  studentId: string;
  assessmentDate: string;
  academicRiskLevel?: string;
  behavioralRiskLevel?: string;
  attendanceRiskLevel?: string;
  socialEmotionalRiskLevel?: string;
  dropoutRisk?: string;
  academicFactors?: string;
  behavioralFactors?: string;
  attendanceFactors?: string;
  socialFactors?: string;
  familyFactors?: string;
  protectiveFactors?: string;
  interventionsNeeded?: string;
  alertsGenerated?: string;
  followUpActions?: string;
  assignedCounselor?: string;
  parentNotified?: boolean;
  parentNotificationDate?: string;
  overallRiskScore?: number;
  status?: string;
  nextAssessmentDate?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Special education information for students
 */
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
