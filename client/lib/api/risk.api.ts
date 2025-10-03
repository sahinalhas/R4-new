import { toast } from "sonner";
import type { RiskFactors } from "../types/risk.types";
import type {
  HealthInfo,
  SpecialEducation,
  BehaviorIncident,
  ExamResult
} from "../types/academic.types";

export async function getHealthInfoByStudent(studentId: string): Promise<HealthInfo | null> {
  try {
    const response = await fetch(`/api/health/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch health info');
    return await response.json();
  } catch (error) {
    console.error('Error loading health info:', error);
    toast.error('Sağlık bilgileri yüklenirken hata oluştu');
    return null;
  }
}

export async function saveHealthInfo(healthInfo: HealthInfo): Promise<void> {
  try {
    const response = await fetch('/api/health', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(healthInfo)
    });
    if (!response.ok) throw new Error('Failed to save health info');
    toast.success('Sağlık bilgileri kaydedildi');
  } catch (error) {
    console.error('Error saving health info:', error);
    toast.error('Sağlık bilgileri kaydedilemedi');
    throw error;
  }
}

export async function getSpecialEducationByStudent(studentId: string): Promise<SpecialEducation[]> {
  try {
    const response = await fetch(`/api/special-education/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch special education records');
    return await response.json();
  } catch (error) {
    console.error('Error loading special education records:', error);
    toast.error('Özel eğitim kayıtları yüklenirken hata oluştu');
    return [];
  }
}

export async function addSpecialEducation(record: SpecialEducation): Promise<void> {
  try {
    const response = await fetch('/api/special-education', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    if (!response.ok) throw new Error('Failed to add special education record');
    toast.success('Özel eğitim kaydı eklendi');
  } catch (error) {
    console.error('Error adding special education record:', error);
    toast.error('Özel eğitim kaydı eklenemedi');
    throw error;
  }
}

export async function updateSpecialEducation(id: string, updates: Partial<SpecialEducation>): Promise<void> {
  try {
    const response = await fetch(`/api/special-education/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update special education record');
    toast.success('Özel eğitim kaydı güncellendi');
  } catch (error) {
    console.error('Error updating special education record:', error);
    toast.error('Özel eğitim kaydı güncellenemedi');
    throw error;
  }
}

export async function getRiskFactorsByStudent(studentId: string): Promise<RiskFactors[]> {
  try {
    const response = await fetch(`/api/risk-factors/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch risk factors');
    return await response.json();
  } catch (error) {
    console.error('Error loading risk factors:', error);
    toast.error('Risk faktörleri yüklenirken hata oluştu');
    return [];
  }
}

export async function getLatestRiskFactors(studentId: string): Promise<RiskFactors | null> {
  try {
    const response = await fetch(`/api/risk-factors/${studentId}/latest`);
    if (!response.ok) throw new Error('Failed to fetch latest risk factors');
    return await response.json();
  } catch (error) {
    console.error('Error loading latest risk factors:', error);
    return null;
  }
}

export async function addRiskFactors(risk: RiskFactors): Promise<void> {
  try {
    const response = await fetch('/api/risk-factors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(risk)
    });
    if (!response.ok) throw new Error('Failed to add risk factors');
    toast.success('Risk faktörleri kaydedildi');
  } catch (error) {
    console.error('Error adding risk factors:', error);
    toast.error('Risk faktörleri kaydedilemedi');
    throw error;
  }
}

export async function updateRiskFactors(id: string, updates: Partial<RiskFactors>): Promise<void> {
  try {
    const response = await fetch(`/api/risk-factors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update risk factors');
    toast.success('Risk faktörleri güncellendi');
  } catch (error) {
    console.error('Error updating risk factors:', error);
    toast.error('Risk faktörleri güncellenemedi');
    throw error;
  }
}

export async function getBehaviorIncidentsByStudent(studentId: string): Promise<BehaviorIncident[]> {
  try {
    const response = await fetch(`/api/behavior/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch behavior incidents');
    return await response.json();
  } catch (error) {
    console.error('Error loading behavior incidents:', error);
    toast.error('Davranış kayıtları yüklenirken hata oluştu');
    return [];
  }
}

export async function addBehaviorIncident(incident: BehaviorIncident): Promise<void> {
  try {
    const response = await fetch('/api/behavior', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incident)
    });
    if (!response.ok) throw new Error('Failed to add behavior incident');
    toast.success('Davranış kaydı eklendi');
  } catch (error) {
    console.error('Error adding behavior incident:', error);
    toast.error('Davranış kaydı eklenemedi');
    throw error;
  }
}

export async function updateBehaviorIncident(id: string, updates: Partial<BehaviorIncident>): Promise<void> {
  try {
    const response = await fetch(`/api/behavior/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update behavior incident');
    toast.success('Davranış kaydı güncellendi');
  } catch (error) {
    console.error('Error updating behavior incident:', error);
    toast.error('Davranış kaydı güncellenemedi');
    throw error;
  }
}

export async function getExamResultsByStudent(studentId: string): Promise<ExamResult[]> {
  try {
    const response = await fetch(`/api/exams/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch exam results');
    return await response.json();
  } catch (error) {
    console.error('Error loading exam results:', error);
    toast.error('Sınav sonuçları yüklenirken hata oluştu');
    return [];
  }
}

export async function getExamResultsByType(studentId: string, examType: string): Promise<ExamResult[]> {
  try {
    const response = await fetch(`/api/exams/${studentId}/type/${examType}`);
    if (!response.ok) throw new Error('Failed to fetch exam results by type');
    return await response.json();
  } catch (error) {
    console.error('Error loading exam results by type:', error);
    return [];
  }
}

export async function addExamResult(result: ExamResult): Promise<void> {
  try {
    const response = await fetch('/api/exams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    });
    if (!response.ok) throw new Error('Failed to add exam result');
    toast.success('Sınav sonucu eklendi');
  } catch (error) {
    console.error('Error adding exam result:', error);
    toast.error('Sınav sonucu eklenemedi');
    throw error;
  }
}

export async function updateExamResult(id: string, updates: Partial<ExamResult>): Promise<void> {
  try {
    const response = await fetch(`/api/exams/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update exam result');
    toast.success('Sınav sonucu güncellendi');
  } catch (error) {
    console.error('Error updating exam result:', error);
    toast.error('Sınav sonucu güncellenemedi');
    throw error;
  }
}
