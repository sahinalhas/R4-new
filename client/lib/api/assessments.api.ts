import { apiClient, createApiHandler } from "./api-client";
import { API_ERROR_MESSAGES } from "../constants/messages.constants";
import type {
  AssessmentType,
  Assessment,
  AssessmentResult,
  MockExam,
  MockExamResult,
  SubjectGrade,
  TopicAssessment,
  PerformanceTask,
  PerformanceTaskResult,
  AssessmentAnalysis,
  AssessmentFilters,
} from "../../../shared/types/assessment.types";

// ============= ASSESSMENT TYPES =============

export async function getAssessmentTypes(): Promise<AssessmentType[]> {
  return createApiHandler(
    () => apiClient.get<AssessmentType[]>("/api/assessments/types", { showErrorToast: false }),
    [],
    "Değerlendirme türleri yüklenemedi"
  )();
}

export async function getAssessmentTypesByCategory(category: string): Promise<AssessmentType[]> {
  return createApiHandler(
    () => apiClient.get<AssessmentType[]>(`/api/assessments/types/category/${category}`, { showErrorToast: false }),
    [],
    "Değerlendirme türleri yüklenemedi"
  )();
}

// ============= ASSESSMENTS =============

export async function getAssessments(filters?: AssessmentFilters): Promise<Assessment[]> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }
  
  const queryString = params.toString();
  const endpoint = `/api/assessments${queryString ? `?${queryString}` : ''}`;
  
  return createApiHandler(
    () => apiClient.get<Assessment[]>(endpoint, { showErrorToast: false }),
    [],
    "Değerlendirmeler yüklenemedi"
  )();
}

export async function getAssessmentById(id: string): Promise<Assessment | null> {
  return createApiHandler(
    () => apiClient.get<Assessment>(`/api/assessments/${id}`, { showErrorToast: false }),
    null,
    "Değerlendirme bulunamadı"
  )();
}

export async function createAssessment(assessment: Omit<Assessment, 'id' | 'created_at' | 'updated_at'>): Promise<Assessment> {
  return apiClient.post<Assessment>('/api/assessments', assessment, {
    showSuccessToast: true,
    successMessage: "Değerlendirme oluşturuldu",
    errorMessage: "Değerlendirme oluşturulamadı",
  });
}

export async function updateAssessment(id: string, updates: Partial<Assessment>): Promise<Assessment> {
  return apiClient.put<Assessment>(`/api/assessments/${id}`, updates, {
    showSuccessToast: true,
    successMessage: "Değerlendirme güncellendi",
    errorMessage: "Değerlendirme güncellenemedi",
  });
}

export async function deleteAssessment(id: string): Promise<void> {
  return apiClient.delete(`/api/assessments/${id}`, {
    showSuccessToast: true,
    successMessage: "Değerlendirme silindi",
    errorMessage: "Değerlendirme silinemedi",
  });
}

// ============= ASSESSMENT RESULTS =============

export async function getAssessmentResults(assessmentId: string): Promise<AssessmentResult[]> {
  return createApiHandler(
    () => apiClient.get<AssessmentResult[]>(`/api/assessments/${assessmentId}/results`, { showErrorToast: false }),
    [],
    "Sonuçlar yüklenemedi"
  )();
}

export async function getStudentAssessmentResults(studentId: string, filters?: AssessmentFilters): Promise<AssessmentResult[]> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }
  
  const queryString = params.toString();
  const endpoint = `/api/assessments/student/${studentId}/results${queryString ? `?${queryString}` : ''}`;
  
  return createApiHandler(
    () => apiClient.get<AssessmentResult[]>(endpoint, { showErrorToast: false }),
    [],
    "Öğrenci sonuçları yüklenemedi"
  )();
}

export async function createAssessmentResult(result: Omit<AssessmentResult, 'id' | 'created_at' | 'updated_at'>): Promise<AssessmentResult> {
  return apiClient.post<AssessmentResult>('/api/assessments/results', result, {
    showSuccessToast: true,
    successMessage: "Sonuç kaydedildi",
    errorMessage: "Sonuç kaydedilemedi",
  });
}

export async function updateAssessmentResult(id: string, updates: Partial<AssessmentResult>): Promise<void> {
  return apiClient.put(`/api/assessments/results/${id}`, updates, {
    showSuccessToast: true,
    successMessage: "Sonuç güncellendi",
    errorMessage: "Sonuç güncellenemedi",
  });
}

export async function deleteAssessmentResult(id: string): Promise<void> {
  return apiClient.delete(`/api/assessments/results/${id}`, {
    showSuccessToast: true,
    successMessage: "Sonuç silindi",
    errorMessage: "Sonuç silinemedi",
  });
}

// ============= MOCK EXAMS =============

export async function getMockExamById(id: string): Promise<MockExam | null> {
  return createApiHandler(
    () => apiClient.get<MockExam>(`/api/assessments/mock-exams/${id}`, { showErrorToast: false }),
    null,
    "Deneme sınavı bulunamadı"
  )();
}

export async function getMockExamResults(mockExamId: string): Promise<MockExamResult[]> {
  return createApiHandler(
    () => apiClient.get<MockExamResult[]>(`/api/assessments/mock-exams/${mockExamId}/results`, { showErrorToast: false }),
    [],
    "Deneme sınav sonuçları yüklenemedi"
  )();
}

export async function getStudentMockExamResults(studentId: string, examType?: string): Promise<MockExamResult[]> {
  const endpoint = examType
    ? `/api/assessments/student/${studentId}/mock-exams?examType=${examType}`
    : `/api/assessments/student/${studentId}/mock-exams`;
  
  return createApiHandler(
    () => apiClient.get<MockExamResult[]>(endpoint, { showErrorToast: false }),
    [],
    "Deneme sınav sonuçları yüklenemedi"
  )();
}

export async function createMockExamWithResults(data: {
  assessment: Omit<Assessment, 'id' | 'created_at' | 'updated_at'>;
  mockExam: Omit<MockExam, 'id' | 'assessmentId' | 'created_at' | 'updated_at'>;
  results: Array<{
    studentId: string;
    sectionResults: any[];
    topicResults?: any[];
    timeSpent?: number;
    targetNet?: number;
  }>;
}): Promise<{ assessmentId: string; mockExamId: string }> {
  return apiClient.post('/api/assessments/mock-exams/bulk', data, {
    showSuccessToast: true,
    successMessage: "Deneme sınavı ve sonuçlar kaydedildi",
    errorMessage: "Deneme sınavı kaydedilemedi",
  });
}

// ============= SUBJECT GRADES =============

export async function getSubjectGrades(studentId: string, filters?: { subjectId?: string; semester?: string; academicYear?: string }): Promise<SubjectGrade[]> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }
  
  const queryString = params.toString();
  const endpoint = `/api/assessments/student/${studentId}/subject-grades${queryString ? `?${queryString}` : ''}`;
  
  return createApiHandler(
    () => apiClient.get<SubjectGrade[]>(endpoint, { showErrorToast: false }),
    [],
    "Ders notları yüklenemedi"
  )();
}

export async function createSubjectGrade(grade: Omit<SubjectGrade, 'id' | 'created_at' | 'updated_at'>): Promise<SubjectGrade> {
  return apiClient.post<SubjectGrade>('/api/assessments/subject-grades', grade, {
    showSuccessToast: true,
    successMessage: "Ders notu kaydedildi",
    errorMessage: "Ders notu kaydedilemedi",
  });
}

export async function updateSubjectGrade(id: string, updates: Partial<SubjectGrade>): Promise<void> {
  return apiClient.put(`/api/assessments/subject-grades/${id}`, updates, {
    showSuccessToast: true,
    successMessage: "Ders notu güncellendi",
    errorMessage: "Ders notu güncellenemedi",
  });
}

export async function bulkCreateSubjectGrades(grades: Array<Omit<SubjectGrade, 'id' | 'created_at' | 'updated_at'>>): Promise<void> {
  return apiClient.post('/api/assessments/subject-grades/bulk', { grades }, {
    showSuccessToast: true,
    successMessage: "Ders notları kaydedildi",
    errorMessage: "Ders notları kaydedilemedi",
  });
}

// ============= TOPIC ASSESSMENTS =============

export async function getTopicAssessments(studentId: string, filters?: { topicId?: string; assessmentId?: string }): Promise<TopicAssessment[]> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }
  
  const queryString = params.toString();
  const endpoint = `/api/assessments/student/${studentId}/topic-assessments${queryString ? `?${queryString}` : ''}`;
  
  return createApiHandler(
    () => apiClient.get<TopicAssessment[]>(endpoint, { showErrorToast: false }),
    [],
    "Konu değerlendirmeleri yüklenemedi"
  )();
}

export async function createTopicAssessment(assessment: Omit<TopicAssessment, 'id' | 'created_at' | 'updated_at'>): Promise<TopicAssessment> {
  return apiClient.post<TopicAssessment>('/api/assessments/topic-assessments', assessment, {
    showSuccessToast: true,
    successMessage: "Konu değerlendirmesi kaydedildi",
    errorMessage: "Konu değerlendirmesi kaydedilemedi",
  });
}

// ============= PERFORMANCE TASKS =============

export async function getPerformanceTask(id: string): Promise<PerformanceTask | null> {
  return createApiHandler(
    () => apiClient.get<PerformanceTask>(`/api/assessments/performance-tasks/${id}`, { showErrorToast: false }),
    null,
    "Performans görevi bulunamadı"
  )();
}

export async function getStudentPerformanceTasks(studentId: string): Promise<PerformanceTaskResult[]> {
  return createApiHandler(
    () => apiClient.get<PerformanceTaskResult[]>(`/api/assessments/student/${studentId}/performance-tasks`, { showErrorToast: false }),
    [],
    "Performans görevleri yüklenemedi"
  )();
}

export async function createPerformanceTaskWithResults(data: {
  assessment: Omit<Assessment, 'id' | 'created_at' | 'updated_at'>;
  performanceTask: Omit<PerformanceTask, 'id' | 'assessmentId' | 'created_at' | 'updated_at'>;
  results: Array<Omit<PerformanceTaskResult, 'id' | 'performanceTaskId' | 'assessmentResultId' | 'created_at' | 'updated_at'>>;
}): Promise<{ assessmentId: string; performanceTaskId: string }> {
  return apiClient.post('/api/assessments/performance-tasks/bulk', data, {
    showSuccessToast: true,
    successMessage: "Performans görevi ve sonuçlar kaydedildi",
    errorMessage: "Performans görevi kaydedilemedi",
  });
}

// ============= ASSESSMENT ANALYSES =============

export async function getAssessmentAnalyses(studentId: string): Promise<AssessmentAnalysis[]> {
  return createApiHandler(
    () => apiClient.get<AssessmentAnalysis[]>(`/api/assessments/student/${studentId}/analyses`, { showErrorToast: false }),
    [],
    "Analizler yüklenemedi"
  )();
}

export async function createAssessmentAnalysis(analysis: Omit<AssessmentAnalysis, 'id' | 'created_at' | 'updated_at'>): Promise<AssessmentAnalysis> {
  return apiClient.post<AssessmentAnalysis>('/api/assessments/analyses', analysis, {
    showSuccessToast: false,
  });
}

// ============= BULK UPLOAD =============

export async function uploadAssessmentExcel(file: File, assessmentTypeId: string): Promise<{
  success: boolean;
  message: string;
  imported: number;
  errors: string[];
}> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('assessmentTypeId', assessmentTypeId);
  
  const response = await fetch('/api/assessments/upload/excel', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Dosya yüklenemedi');
  }
  
  return response.json();
}

export async function uploadMockExamExcel(file: File, examType: string): Promise<{
  success: boolean;
  assessmentId: string;
  mockExamId: string;
  processedCount: number;
}> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('examType', examType);
  
  const response = await fetch('/api/assessments/bulk-upload/mock-exam', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Dosya yüklenemedi');
  }
  
  return response.json();
}

export async function downloadMockExamTemplate(examType: string): Promise<void> {
  const response = await fetch(`/api/assessments/templates/mock-exam/${examType}`);
  
  if (!response.ok) {
    throw new Error('Template indirilemedi');
  }
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `deneme-sinav-${examType}-sablonu.xlsx`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// ============= ANALYTICS =============

export async function getStudentAssessmentSummary(studentId: string): Promise<{
  totalAssessments: number;
  averageScore: number;
  trend: 'improving' | 'declining' | 'stable';
  weakTopics: Array<{ topicId: string; topicName: string; score: number }>;
  strongTopics: Array<{ topicId: string; topicName: string; score: number }>;
  recentPerformance: Array<{ date: string; score: number; assessmentTitle: string }>;
}> {
  try {
    const result = await apiClient.get<{
      totalAssessments: number;
      averageScore: number;
      trend: 'improving' | 'declining' | 'stable';
      weakTopics: Array<{ topicId: string; topicName: string; score: number }>;
      strongTopics: Array<{ topicId: string; topicName: string; score: number }>;
      recentPerformance: Array<{ date: string; score: number; assessmentTitle: string }>;
    }>(`/api/assessments/student/${studentId}/summary`, { showErrorToast: false });
    return result;
  } catch {
    return {
      totalAssessments: 0,
      averageScore: 0,
      trend: 'stable' as const,
      weakTopics: [],
      strongTopics: [],
      recentPerformance: [],
    };
  }
}

// ============= EXPORT =============

export async function exportAssessmentResults(assessmentId: string, format: 'excel' | 'pdf' = 'excel'): Promise<Blob> {
  const response = await fetch(`/api/assessments/${assessmentId}/export?format=${format}`);
  
  if (!response.ok) {
    throw new Error('Dışa aktarma başarısız');
  }
  
  return response.blob();
}
