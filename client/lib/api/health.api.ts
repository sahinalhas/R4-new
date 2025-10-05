import type { HealthInfo } from "@shared/types";
import { apiClient, createApiHandler } from "./api-client";
import { API_ERROR_MESSAGES } from "../constants/messages.constants";

export async function getHealthInfoByStudent(studentId: string): Promise<HealthInfo | null> {
  return createApiHandler(
    () => apiClient.get<HealthInfo>(`/api/health/${studentId}`, { showErrorToast: false }),
    null,
    API_ERROR_MESSAGES.HEALTH_INFO.LOAD_ERROR
  )();
}

export async function saveHealthInfo(healthInfo: HealthInfo): Promise<void> {
  return apiClient.post('/api/health', healthInfo, {
    showSuccessToast: true,
    successMessage: API_ERROR_MESSAGES.HEALTH_INFO.SAVE_SUCCESS,
    errorMessage: API_ERROR_MESSAGES.HEALTH_INFO.SAVE_ERROR,
  });
}
