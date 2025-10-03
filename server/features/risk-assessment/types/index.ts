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
