import * as repository from '../repository/health.repository.js';
import { sanitizeString } from '../../../middleware/validation.js';
import type { HealthInfo } from '../../../../shared/types.js';

const STRING_FIELDS = [
  'bloodType',
  'chronicDiseases',
  'allergies',
  'medications',
  'specialNeeds',
  'medicalHistory',
  'emergencyContact1Name',
  'emergencyContact1Phone',
  'emergencyContact1Relation',
  'emergencyContact2Name',
  'emergencyContact2Phone',
  'emergencyContact2Relation',
  'physicianName',
  'physicianPhone',
  'insuranceInfo',
  'vaccinations',
  'dietaryRestrictions',
  'physicalLimitations',
  'mentalHealthNotes',
  'notes'
] as const;

const DATE_FIELDS = ['lastHealthCheckup'] as const;

function sanitizeHealthField(value: any): string | null | undefined {
  if (value === undefined) return undefined;
  if (!value) return null;
  return sanitizeString(value);
}

function sanitizeHealthData(data: any, isUpdate: boolean = false): any {
  const sanitized: any = {};

  for (const field of STRING_FIELDS) {
    if (field in data) {
      const value = sanitizeHealthField(data[field]);
      sanitized[field] = isUpdate && value === undefined ? undefined : value;
    }
  }

  for (const field of DATE_FIELDS) {
    if (field in data) {
      sanitized[field] = data[field];
    }
  }

  return sanitized;
}

export function getHealthInfoByStudent(studentId: string): HealthInfo | null {
  const sanitizedId = sanitizeString(studentId);
  return repository.getHealthInfoByStudent(sanitizedId);
}

export function createOrUpdateHealthInfo(data: any): { success: boolean; id: string } {
  const studentId = sanitizeString(data.studentId);
  const existing = repository.checkExistingHealthInfo(studentId);
  
  if (existing) {
    const sanitizedUpdates = sanitizeHealthData(data, true);
    repository.updateHealthInfo(studentId, sanitizedUpdates);
    return { success: true, id: (existing as any).id };
  } else {
    const sanitizedData = sanitizeHealthData(data, false);
    const healthInfo: HealthInfo = {
      id: data.id,
      studentId: studentId,
      ...sanitizedData
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
