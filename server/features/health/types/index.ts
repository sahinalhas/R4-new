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
