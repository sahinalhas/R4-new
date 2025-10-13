/**
 * Career Guidance API Client
 * Kariyer Rehberliği API İstemcisi
 */

import type {
  CareerProfile,
  CareerAnalysisResult,
  CareerRoadmap,
  CareerCategory
} from '../../../shared/types/career-guidance.types';
import { apiClient, createApiHandler } from './api-client';

export interface GetCareersParams {
  category?: CareerCategory;
  search?: string;
}

export interface AnalyzeCareerMatchParams {
  studentId: string;
  careerId?: string;
}

export interface GenerateRoadmapParams {
  studentId: string;
  careerId: string;
  customGoals?: string[];
}

export async function getAllCareers(params?: GetCareersParams): Promise<CareerProfile[]> {
  return createApiHandler(
    async () => {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append('category', params.category);
      if (params?.search) queryParams.append('search', params.search);
      
      const url = `/api/career-guidance/careers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<{ success: boolean; data: CareerProfile[]; count: number }>(url, { 
        showErrorToast: false 
      });
      
      return response.data || [];
    },
    [],
    'Kariyer profilleri yüklenirken hata oluştu'
  )();
}

export async function getCareerById(careerId: string): Promise<CareerProfile | null> {
  return createApiHandler(
    async () => {
      const response = await apiClient.get<{ success: boolean; data: CareerProfile }>(
        `/api/career-guidance/careers/${careerId}`,
        { showErrorToast: false }
      );
      return response.data || null;
    },
    null,
    'Kariyer profili yüklenirken hata oluştu'
  )();
}

export async function searchCareers(searchTerm: string): Promise<CareerProfile[]> {
  return getAllCareers({ search: searchTerm });
}

export async function getCareersByCategory(category: CareerCategory): Promise<CareerProfile[]> {
  return getAllCareers({ category });
}

export async function analyzeCareerMatch(params: AnalyzeCareerMatchParams): Promise<CareerAnalysisResult> {
  return createApiHandler(
    async () => {
      const response = await apiClient.post<{ success: boolean; data: CareerAnalysisResult }>(
        '/api/career-guidance/analyze',
        {
          studentId: params.studentId,
          careerId: params.careerId
        },
        {
          showErrorToast: true,
          errorMessage: 'Kariyer analizi yapılırken hata oluştu'
        }
      );
      
      return response.data;
    },
    {} as CareerAnalysisResult,
    'Kariyer analizi yapılırken hata oluştu'
  )();
}

export async function generateCareerRoadmap(params: GenerateRoadmapParams): Promise<CareerRoadmap> {
  return createApiHandler(
    async () => {
      const response = await apiClient.post<{ success: boolean; data: CareerRoadmap }>(
        '/api/career-guidance/roadmap',
        {
          studentId: params.studentId,
          careerId: params.careerId,
          customGoals: params.customGoals
        },
        {
          showSuccessToast: true,
          successMessage: 'Kariyer yol haritası oluşturuldu!',
          showErrorToast: true,
          errorMessage: 'Kariyer yol haritası oluşturulurken hata oluştu'
        }
      );
      
      return response.data;
    },
    {} as CareerRoadmap,
    'Kariyer yol haritası oluşturulurken hata oluştu'
  )();
}

export async function getStudentRoadmap(studentId: string): Promise<CareerRoadmap | null> {
  return createApiHandler(
    async () => {
      const response = await apiClient.get<{ success: boolean; data: CareerRoadmap | null }>(
        `/api/career-guidance/roadmap/${studentId}`,
        { showErrorToast: false }
      );
      
      return response.data || null;
    },
    null,
    'Kariyer yol haritası yüklenirken hata oluştu'
  )();
}

export async function getStudentAnalysisHistory(studentId: string, limit: number = 5): Promise<CareerAnalysisResult[]> {
  return createApiHandler(
    async () => {
      const response = await apiClient.get<{ success: boolean; data: CareerAnalysisResult[] }>(
        `/api/career-guidance/analysis/${studentId}?limit=${limit}`,
        { showErrorToast: false }
      );
      
      return response.data || [];
    },
    [],
    'Kariyer analiz geçmişi yüklenirken hata oluştu'
  )();
}

export async function setStudentCareerTarget(studentId: string, careerId: string, notes?: string): Promise<void> {
  return apiClient.post(
    '/api/career-guidance/target',
    { studentId, careerId, notes },
    {
      showSuccessToast: true,
      successMessage: 'Kariyer hedefi belirlendi',
      errorMessage: 'Kariyer hedefi belirlenirken hata oluştu'
    }
  );
}
