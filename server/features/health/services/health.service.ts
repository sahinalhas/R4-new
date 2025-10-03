import * as repository from '../repository/health.repository.js';
import { sanitizeString } from '../../../middleware/validation.js';
import type { HealthInfo } from '../types/index.js';

export function getHealthInfoByStudent(studentId: string): HealthInfo | null {
  const sanitizedId = sanitizeString(studentId);
  return repository.getHealthInfoByStudent(sanitizedId);
}

export function createOrUpdateHealthInfo(data: any): { success: boolean; id: string } {
  const studentId = sanitizeString(data.studentId);
  const existing = repository.checkExistingHealthInfo(studentId);
  
  if (existing) {
    const sanitizedUpdates: any = {};
    
    if (data.bloodType !== undefined) sanitizedUpdates.bloodType = data.bloodType ? sanitizeString(data.bloodType) : null;
    if (data.chronicDiseases !== undefined) sanitizedUpdates.chronicDiseases = data.chronicDiseases ? sanitizeString(data.chronicDiseases) : null;
    if (data.allergies !== undefined) sanitizedUpdates.allergies = data.allergies ? sanitizeString(data.allergies) : null;
    if (data.medications !== undefined) sanitizedUpdates.medications = data.medications ? sanitizeString(data.medications) : null;
    if (data.specialNeeds !== undefined) sanitizedUpdates.specialNeeds = data.specialNeeds ? sanitizeString(data.specialNeeds) : null;
    if (data.medicalHistory !== undefined) sanitizedUpdates.medicalHistory = data.medicalHistory ? sanitizeString(data.medicalHistory) : null;
    if (data.emergencyContact1Name !== undefined) sanitizedUpdates.emergencyContact1Name = data.emergencyContact1Name ? sanitizeString(data.emergencyContact1Name) : null;
    if (data.emergencyContact1Phone !== undefined) sanitizedUpdates.emergencyContact1Phone = data.emergencyContact1Phone ? sanitizeString(data.emergencyContact1Phone) : null;
    if (data.emergencyContact1Relation !== undefined) sanitizedUpdates.emergencyContact1Relation = data.emergencyContact1Relation ? sanitizeString(data.emergencyContact1Relation) : null;
    if (data.emergencyContact2Name !== undefined) sanitizedUpdates.emergencyContact2Name = data.emergencyContact2Name ? sanitizeString(data.emergencyContact2Name) : null;
    if (data.emergencyContact2Phone !== undefined) sanitizedUpdates.emergencyContact2Phone = data.emergencyContact2Phone ? sanitizeString(data.emergencyContact2Phone) : null;
    if (data.emergencyContact2Relation !== undefined) sanitizedUpdates.emergencyContact2Relation = data.emergencyContact2Relation ? sanitizeString(data.emergencyContact2Relation) : null;
    if (data.physicianName !== undefined) sanitizedUpdates.physicianName = data.physicianName ? sanitizeString(data.physicianName) : null;
    if (data.physicianPhone !== undefined) sanitizedUpdates.physicianPhone = data.physicianPhone ? sanitizeString(data.physicianPhone) : null;
    if (data.insuranceInfo !== undefined) sanitizedUpdates.insuranceInfo = data.insuranceInfo ? sanitizeString(data.insuranceInfo) : null;
    if (data.vaccinations !== undefined) sanitizedUpdates.vaccinations = data.vaccinations ? sanitizeString(data.vaccinations) : null;
    if (data.dietaryRestrictions !== undefined) sanitizedUpdates.dietaryRestrictions = data.dietaryRestrictions ? sanitizeString(data.dietaryRestrictions) : null;
    if (data.physicalLimitations !== undefined) sanitizedUpdates.physicalLimitations = data.physicalLimitations ? sanitizeString(data.physicalLimitations) : null;
    if (data.mentalHealthNotes !== undefined) sanitizedUpdates.mentalHealthNotes = data.mentalHealthNotes ? sanitizeString(data.mentalHealthNotes) : null;
    if (data.lastHealthCheckup !== undefined) sanitizedUpdates.lastHealthCheckup = data.lastHealthCheckup;
    if (data.notes !== undefined) sanitizedUpdates.notes = data.notes ? sanitizeString(data.notes) : null;
    
    repository.updateHealthInfo(studentId, sanitizedUpdates);
    return { success: true, id: (existing as any).id };
  } else {
    const healthInfo: HealthInfo = {
      id: data.id,
      studentId: studentId,
      bloodType: data.bloodType ? sanitizeString(data.bloodType) : undefined,
      chronicDiseases: data.chronicDiseases ? sanitizeString(data.chronicDiseases) : undefined,
      allergies: data.allergies ? sanitizeString(data.allergies) : undefined,
      medications: data.medications ? sanitizeString(data.medications) : undefined,
      specialNeeds: data.specialNeeds ? sanitizeString(data.specialNeeds) : undefined,
      medicalHistory: data.medicalHistory ? sanitizeString(data.medicalHistory) : undefined,
      emergencyContact1Name: data.emergencyContact1Name ? sanitizeString(data.emergencyContact1Name) : undefined,
      emergencyContact1Phone: data.emergencyContact1Phone ? sanitizeString(data.emergencyContact1Phone) : undefined,
      emergencyContact1Relation: data.emergencyContact1Relation ? sanitizeString(data.emergencyContact1Relation) : undefined,
      emergencyContact2Name: data.emergencyContact2Name ? sanitizeString(data.emergencyContact2Name) : undefined,
      emergencyContact2Phone: data.emergencyContact2Phone ? sanitizeString(data.emergencyContact2Phone) : undefined,
      emergencyContact2Relation: data.emergencyContact2Relation ? sanitizeString(data.emergencyContact2Relation) : undefined,
      physicianName: data.physicianName ? sanitizeString(data.physicianName) : undefined,
      physicianPhone: data.physicianPhone ? sanitizeString(data.physicianPhone) : undefined,
      insuranceInfo: data.insuranceInfo ? sanitizeString(data.insuranceInfo) : undefined,
      vaccinations: data.vaccinations ? sanitizeString(data.vaccinations) : undefined,
      dietaryRestrictions: data.dietaryRestrictions ? sanitizeString(data.dietaryRestrictions) : undefined,
      physicalLimitations: data.physicalLimitations ? sanitizeString(data.physicalLimitations) : undefined,
      mentalHealthNotes: data.mentalHealthNotes ? sanitizeString(data.mentalHealthNotes) : undefined,
      lastHealthCheckup: data.lastHealthCheckup,
      notes: data.notes ? sanitizeString(data.notes) : undefined
    };
    
    repository.insertHealthInfo(healthInfo);
    return { success: true, id: healthInfo.id };
  }
}

export function deleteHealthInfo(studentId: string): { success: boolean } {
  const sanitizedId = sanitizeString(studentId);
  repository.deleteHealthInfo(sanitizedId);
  return { success: true };
}
