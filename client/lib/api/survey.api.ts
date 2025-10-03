import { toast } from "sonner";
import type { SurveyResult } from "../types/common.types";

function extractScoreFromResponse(responseData: any): number | undefined {
  if (!responseData) return undefined;
  
  const values = Object.values(responseData).filter(v => 
    typeof v === 'string' && !isNaN(Number(v))
  ).map(v => Number(v));
  
  if (values.length > 0) {
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }
  
  return undefined;
}

export async function loadSurveyResults(): Promise<SurveyResult[]> {
  try {
    const response = await fetch('/api/survey-responses');
    if (!response.ok) {
      throw new Error('Failed to fetch survey results');
    }
    const responses = await response.json();
    
    return responses.map((resp: any): SurveyResult => ({
      id: resp.id || 'legacy-' + Date.now(),
      studentId: resp.studentId || resp.studentInfo?.name || 'unknown',
      title: `Anket Sonucu - ${resp.distributionId}`,
      score: extractScoreFromResponse(resp.responseData),
      date: resp.created_at || new Date().toISOString(),
      details: JSON.stringify(resp.responseData)
    }));
  } catch (error) {
    console.error('Error fetching survey results:', error);
    toast.error('Anket sonuçları yüklenirken hata oluştu');
    return [];
  }
}

export async function getSurveyResultsByStudent(studentId: string): Promise<SurveyResult[]> {
  try {
    const response = await fetch(`/api/survey-responses?studentId=${encodeURIComponent(studentId)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch student survey results');
    }
    const responses = await response.json();
    
    return responses.map((resp: any): SurveyResult => ({
      id: resp.id || 'legacy-' + Date.now(),
      studentId: resp.studentId || resp.studentInfo?.name || studentId,
      title: `Anket Sonucu - ${resp.distributionId}`,
      score: extractScoreFromResponse(resp.responseData),
      date: resp.created_at || new Date().toISOString(),
      details: JSON.stringify(resp.responseData)
    }));
  } catch (error) {
    console.error('Error fetching student survey results:', error);
    toast.error('Öğrenci anket sonuçları yüklenirken hata oluştu');
    return [];
  }
}

export async function addSurveyResult(r: SurveyResult): Promise<void> {
  try {
    const surveyResponse = {
      distributionId: 'legacy-distribution',
      studentId: r.studentId,
      studentInfo: {
        name: r.studentId,
        class: 'N/A',
        number: '0'
      },
      responseData: r.details ? JSON.parse(r.details) : { score: r.score, title: r.title },
      submissionType: 'MANUAL_ENTRY',
      isComplete: true,
      submittedAt: r.date
    };
    
    const response = await fetch('/api/survey-responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(surveyResponse)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save survey result');
    }
    
    toast.success('Anket sonucu kaydedildi');
  } catch (error) {
    console.error('Error saving survey result:', error);
    toast.error('Anket sonucu kaydedilemedi');
    throw error;
  }
}
