import { apiClient, createApiHandler } from "./api-client";

export interface HealthInfo {
  id?: string;
  studentId: string;
  bloodType?: string;
  allergies?: string;
  chronicDiseases?: string;
  currentMedications?: string;
  emergencyContact1Name?: string;
  emergencyContact1Phone?: string;
  emergencyContact1Relation?: string;
  emergencyContact2Name?: string;
  emergencyContact2Phone?: string;
  emergencyContact2Relation?: string;
  physicianName?: string;
  physicianPhone?: string;
  lastHealthCheckup?: string;
  vaccinations?: string;
  medicalHistory?: string;
  specialNeeds?: string;
  physicalLimitations?: string;
  dietaryRestrictions?: string;
  mentalHealthNotes?: string;
  notes?: string;
}

export async function getHealthInfoByStudent(studentId: string): Promise<HealthInfo | null> {
  return createApiHandler(
    () => apiClient.get<HealthInfo>(`/api/health/${studentId}`, { showErrorToast: false }),
    null,
    'Sağlık bilgileri yüklenirken hata oluştu'
  )();
}

export async function createOrUpdateHealthInfo(data: HealthInfo): Promise<{ success: boolean; id: string }> {
  return apiClient.post('/api/health', data, {
    showSuccessToast: true,
    successMessage: 'Sağlık bilgileri kaydedildi',
    errorMessage: 'Sağlık bilgileri kaydedilirken hata oluştu',
  });
}

export async function deleteHealthInfo(studentId: string): Promise<{ success: boolean }> {
  return apiClient.delete(`/api/health/${studentId}`, {
    showSuccessToast: true,
    successMessage: 'Sağlık bilgileri silindi',
    errorMessage: 'Sağlık bilgileri silinirken hata oluştu',
  });
}
