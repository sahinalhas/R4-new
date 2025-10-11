/**
 * Advanced AI Analysis API Client
 * Gelişmiş AI Analiz API İstemcisi
 */

import type {
  PsychologicalDepthAnalysis,
  PredictiveRiskTimeline,
  CounselorDailyPlan,
  StudentTimeline,
  ComparativeAnalysisReport
} from '../../../shared/types/advanced-ai-analysis.types.js';

const API_BASE = '/api/advanced-ai-analysis';

export interface ComprehensiveAnalysisResponse {
  psychological: PsychologicalDepthAnalysis;
  predictive: PredictiveRiskTimeline;
  timeline: StudentTimeline;
  generatedAt: string;
}

/**
 * Psikolojik derinlik analizi oluştur
 */
export async function generatePsychologicalAnalysis(studentId: string): Promise<PsychologicalDepthAnalysis> {
  const response = await fetch(`${API_BASE}/psychological/${studentId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    throw new Error('Psikolojik analiz oluşturulamadı');
  }

  const data = await response.json();
  return data.data;
}

/**
 * Öngörücü risk zaman çizelgesi oluştur
 */
export async function generatePredictiveTimeline(studentId: string): Promise<PredictiveRiskTimeline> {
  const response = await fetch(`${API_BASE}/predictive-timeline/${studentId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    throw new Error('Öngörücü zaman çizelgesi oluşturulamadı');
  }

  const data = await response.json();
  return data.data;
}

/**
 * Günlük eylem planı oluştur
 */
export async function generateDailyActionPlan(
  date?: string,
  counselorName?: string
): Promise<CounselorDailyPlan> {
  const response = await fetch(`${API_BASE}/daily-action-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date: date || new Date().toISOString().split('T')[0],
      counselorName
    })
  });

  if (!response.ok) {
    throw new Error('Günlük eylem planı oluşturulamadı');
  }

  const data = await response.json();
  return data.data;
}

/**
 * Bugünkü eylem planını al (hızlı erişim)
 */
export async function getTodayActionPlan(): Promise<CounselorDailyPlan> {
  const response = await fetch(`${API_BASE}/action-plan/today`);

  if (!response.ok) {
    throw new Error('Günlük plan alınamadı');
  }

  const data = await response.json();
  return data.data;
}

/**
 * Öğrenci zaman çizelgesi analizi oluştur
 */
export async function generateStudentTimeline(
  studentId: string,
  startDate?: string,
  endDate?: string
): Promise<StudentTimeline> {
  const response = await fetch(`${API_BASE}/student-timeline/${studentId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ startDate, endDate })
  });

  if (!response.ok) {
    throw new Error('Öğrenci zaman çizelgesi oluşturulamadı');
  }

  const data = await response.json();
  return data.data;
}

/**
 * Sınıf karşılaştırmalı analizi oluştur
 */
export async function generateClassComparison(classId: string): Promise<ComparativeAnalysisReport> {
  const response = await fetch(`${API_BASE}/comparative-class/${classId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    throw new Error('Sınıf analizi oluşturulamadı');
  }

  const data = await response.json();
  return data.data;
}

/**
 * Çoklu öğrenci karşılaştırmalı analizi oluştur
 */
export async function generateMultiStudentComparison(
  studentIds: string[]
): Promise<ComparativeAnalysisReport> {
  const response = await fetch(`${API_BASE}/comparative-students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentIds })
  });

  if (!response.ok) {
    throw new Error('Çoklu öğrenci analizi oluşturulamadı');
  }

  const data = await response.json();
  return data.data;
}

/**
 * Kapsamlı analiz (tüm analizleri birlikte)
 */
export async function generateComprehensiveAnalysis(
  studentId: string
): Promise<ComprehensiveAnalysisResponse> {
  const response = await fetch(`${API_BASE}/comprehensive/${studentId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    throw new Error('Kapsamlı analiz oluşturulamadı');
  }

  const data = await response.json();
  return data.data;
}
