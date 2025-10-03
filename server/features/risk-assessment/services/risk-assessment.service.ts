import * as repository from '../repository/risk-assessment.repository.js';
import { sanitizeString } from '../../../middleware/validation.js';
import type { RiskFactors } from '../types/index.js';

export function getRiskFactorsByStudent(studentId: string): RiskFactors[] {
  const sanitizedId = sanitizeString(studentId);
  return repository.getRiskFactorsByStudent(sanitizedId);
}

export function getLatestRiskFactorsByStudent(studentId: string): RiskFactors | null {
  const sanitizedId = sanitizeString(studentId);
  return repository.getLatestRiskFactorsByStudent(sanitizedId);
}

export function getAllHighRiskStudents(): any[] {
  return repository.getAllHighRiskStudents();
}

export function createRiskFactors(data: any): { success: boolean; id: string } {
  const record: RiskFactors = {
    id: data.id,
    studentId: sanitizeString(data.studentId),
    assessmentDate: data.assessmentDate,
    academicRiskLevel: data.academicRiskLevel ? sanitizeString(data.academicRiskLevel) : undefined,
    behavioralRiskLevel: data.behavioralRiskLevel ? sanitizeString(data.behavioralRiskLevel) : undefined,
    attendanceRiskLevel: data.attendanceRiskLevel ? sanitizeString(data.attendanceRiskLevel) : undefined,
    socialEmotionalRiskLevel: data.socialEmotionalRiskLevel ? sanitizeString(data.socialEmotionalRiskLevel) : undefined,
    dropoutRisk: data.dropoutRisk ? sanitizeString(data.dropoutRisk) : undefined,
    academicFactors: data.academicFactors ? sanitizeString(data.academicFactors) : undefined,
    behavioralFactors: data.behavioralFactors ? sanitizeString(data.behavioralFactors) : undefined,
    attendanceFactors: data.attendanceFactors ? sanitizeString(data.attendanceFactors) : undefined,
    socialFactors: data.socialFactors ? sanitizeString(data.socialFactors) : undefined,
    familyFactors: data.familyFactors ? sanitizeString(data.familyFactors) : undefined,
    protectiveFactors: data.protectiveFactors ? sanitizeString(data.protectiveFactors) : undefined,
    interventionsNeeded: data.interventionsNeeded ? sanitizeString(data.interventionsNeeded) : undefined,
    alertsGenerated: data.alertsGenerated ? sanitizeString(data.alertsGenerated) : undefined,
    followUpActions: data.followUpActions ? sanitizeString(data.followUpActions) : undefined,
    assignedCounselor: data.assignedCounselor ? sanitizeString(data.assignedCounselor) : undefined,
    parentNotified: data.parentNotified,
    parentNotificationDate: data.parentNotificationDate,
    overallRiskScore: data.overallRiskScore,
    status: data.status ? sanitizeString(data.status) : 'DEVAM_EDEN',
    nextAssessmentDate: data.nextAssessmentDate,
    notes: data.notes ? sanitizeString(data.notes) : undefined
  };
  
  repository.insertRiskFactors(record);
  return { success: true, id: record.id };
}

export function updateRiskFactors(id: string, updates: any): { success: boolean } {
  const sanitizedUpdates: any = {};
  
  if (updates.assessmentDate) sanitizedUpdates.assessmentDate = updates.assessmentDate;
  if (updates.academicRiskLevel) sanitizedUpdates.academicRiskLevel = sanitizeString(updates.academicRiskLevel);
  if (updates.behavioralRiskLevel) sanitizedUpdates.behavioralRiskLevel = sanitizeString(updates.behavioralRiskLevel);
  if (updates.attendanceRiskLevel) sanitizedUpdates.attendanceRiskLevel = sanitizeString(updates.attendanceRiskLevel);
  if (updates.socialEmotionalRiskLevel) sanitizedUpdates.socialEmotionalRiskLevel = sanitizeString(updates.socialEmotionalRiskLevel);
  if (updates.dropoutRisk) sanitizedUpdates.dropoutRisk = sanitizeString(updates.dropoutRisk);
  if (updates.academicFactors) sanitizedUpdates.academicFactors = sanitizeString(updates.academicFactors);
  if (updates.behavioralFactors) sanitizedUpdates.behavioralFactors = sanitizeString(updates.behavioralFactors);
  if (updates.attendanceFactors) sanitizedUpdates.attendanceFactors = sanitizeString(updates.attendanceFactors);
  if (updates.socialFactors) sanitizedUpdates.socialFactors = sanitizeString(updates.socialFactors);
  if (updates.familyFactors) sanitizedUpdates.familyFactors = sanitizeString(updates.familyFactors);
  if (updates.protectiveFactors) sanitizedUpdates.protectiveFactors = sanitizeString(updates.protectiveFactors);
  if (updates.interventionsNeeded) sanitizedUpdates.interventionsNeeded = sanitizeString(updates.interventionsNeeded);
  if (updates.alertsGenerated) sanitizedUpdates.alertsGenerated = sanitizeString(updates.alertsGenerated);
  if (updates.followUpActions) sanitizedUpdates.followUpActions = sanitizeString(updates.followUpActions);
  if (updates.assignedCounselor) sanitizedUpdates.assignedCounselor = sanitizeString(updates.assignedCounselor);
  if (updates.parentNotified !== undefined) sanitizedUpdates.parentNotified = updates.parentNotified ? 1 : 0;
  if (updates.parentNotificationDate) sanitizedUpdates.parentNotificationDate = updates.parentNotificationDate;
  if (updates.overallRiskScore !== undefined) sanitizedUpdates.overallRiskScore = updates.overallRiskScore;
  if (updates.status) sanitizedUpdates.status = sanitizeString(updates.status);
  if (updates.nextAssessmentDate) sanitizedUpdates.nextAssessmentDate = updates.nextAssessmentDate;
  if (updates.notes) sanitizedUpdates.notes = sanitizeString(updates.notes);
  
  repository.updateRiskFactors(id, sanitizedUpdates);
  return { success: true };
}

export function deleteRiskFactors(id: string): { success: boolean } {
  repository.deleteRiskFactors(id);
  return { success: true };
}
