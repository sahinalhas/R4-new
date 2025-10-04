import type { RiskFactors, HealthInfo, SpecialEducation } from "@shared/types";
import type { BehaviorIncident, ExamResult } from "../types/academic.types";
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

export async function getSpecialEducationByStudent(studentId: string): Promise<SpecialEducation[]> {
  return createApiHandler(
    () => apiClient.get<SpecialEducation[]>(`/api/special-education/${studentId}`, { showErrorToast: false }),
    [],
    API_ERROR_MESSAGES.SPECIAL_EDUCATION.LOAD_ERROR
  )();
}

export async function addSpecialEducation(record: SpecialEducation): Promise<void> {
  return apiClient.post('/api/special-education', record, {
    showSuccessToast: true,
    successMessage: API_ERROR_MESSAGES.SPECIAL_EDUCATION.ADD_SUCCESS,
    errorMessage: API_ERROR_MESSAGES.SPECIAL_EDUCATION.ADD_ERROR,
  });
}

export async function updateSpecialEducation(id: string, updates: Partial<SpecialEducation>): Promise<void> {
  return apiClient.put(`/api/special-education/${id}`, updates, {
    showSuccessToast: true,
    successMessage: API_ERROR_MESSAGES.SPECIAL_EDUCATION.UPDATE_SUCCESS,
    errorMessage: API_ERROR_MESSAGES.SPECIAL_EDUCATION.UPDATE_ERROR,
  });
}

export async function getRiskFactorsByStudent(studentId: string): Promise<RiskFactors[]> {
  return createApiHandler(
    () => apiClient.get<RiskFactors[]>(`/api/risk-factors/${studentId}`, { showErrorToast: false }),
    [],
    API_ERROR_MESSAGES.RISK_FACTORS.LOAD_ERROR
  )();
}

export async function getLatestRiskFactors(studentId: string): Promise<RiskFactors | null> {
  return createApiHandler(
    () => apiClient.get<RiskFactors>(`/api/risk-factors/${studentId}/latest`, { showErrorToast: false }),
    null
  )();
}

export async function addRiskFactors(risk: RiskFactors): Promise<void> {
  return apiClient.post('/api/risk-factors', risk, {
    showSuccessToast: true,
    successMessage: API_ERROR_MESSAGES.RISK_FACTORS.ADD_SUCCESS,
    errorMessage: API_ERROR_MESSAGES.RISK_FACTORS.ADD_ERROR,
  });
}

export async function updateRiskFactors(id: string, updates: Partial<RiskFactors>): Promise<void> {
  return apiClient.put(`/api/risk-factors/${id}`, updates, {
    showSuccessToast: true,
    successMessage: API_ERROR_MESSAGES.RISK_FACTORS.UPDATE_SUCCESS,
    errorMessage: API_ERROR_MESSAGES.RISK_FACTORS.UPDATE_ERROR,
  });
}

export async function getBehaviorIncidentsByStudent(studentId: string): Promise<BehaviorIncident[]> {
  return createApiHandler(
    () => apiClient.get<BehaviorIncident[]>(`/api/behavior/${studentId}`, { showErrorToast: false }),
    [],
    API_ERROR_MESSAGES.BEHAVIOR.LOAD_ERROR
  )();
}

export async function addBehaviorIncident(incident: BehaviorIncident): Promise<void> {
  return apiClient.post('/api/behavior', incident, {
    showSuccessToast: true,
    successMessage: API_ERROR_MESSAGES.BEHAVIOR.ADD_SUCCESS,
    errorMessage: API_ERROR_MESSAGES.BEHAVIOR.ADD_ERROR,
  });
}

export async function updateBehaviorIncident(id: string, updates: Partial<BehaviorIncident>): Promise<void> {
  return apiClient.put(`/api/behavior/${id}`, updates, {
    showSuccessToast: true,
    successMessage: API_ERROR_MESSAGES.BEHAVIOR.UPDATE_SUCCESS,
    errorMessage: API_ERROR_MESSAGES.BEHAVIOR.UPDATE_ERROR,
  });
}

export async function getExamResultsByStudent(studentId: string): Promise<ExamResult[]> {
  return createApiHandler(
    () => apiClient.get<ExamResult[]>(`/api/exams/${studentId}`, { showErrorToast: false }),
    [],
    API_ERROR_MESSAGES.EXAM.LOAD_ERROR
  )();
}

export async function getExamResultsByType(studentId: string, examType: string): Promise<ExamResult[]> {
  return createApiHandler(
    () => apiClient.get<ExamResult[]>(`/api/exams/${studentId}/type/${examType}`, { showErrorToast: false }),
    []
  )();
}

export async function addExamResult(result: ExamResult): Promise<void> {
  return apiClient.post('/api/exams', result, {
    showSuccessToast: true,
    successMessage: API_ERROR_MESSAGES.EXAM.ADD_SUCCESS,
    errorMessage: API_ERROR_MESSAGES.EXAM.ADD_ERROR,
  });
}

export async function updateExamResult(id: string, updates: Partial<ExamResult>): Promise<void> {
  return apiClient.put(`/api/exams/${id}`, updates, {
    showSuccessToast: true,
    successMessage: API_ERROR_MESSAGES.EXAM.UPDATE_SUCCESS,
    errorMessage: API_ERROR_MESSAGES.EXAM.UPDATE_ERROR,
  });
}
