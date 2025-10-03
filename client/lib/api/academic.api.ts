import { toast } from "sonner";
import type { AcademicRecord } from "../types/academic.types";
import type { Intervention } from "../types/common.types";

export async function loadAcademics(studentId: string): Promise<AcademicRecord[]> {
  try {
    const response = await fetch(`/api/students/${studentId}/academics`);
    if (!response.ok) {
      throw new Error('Failed to fetch academic records');
    }
    const records = await response.json();
    
    return records.map((record: any): AcademicRecord => ({
      id: record.id?.toString() || crypto.randomUUID(),
      studentId: record.studentId,
      term: `${record.year}/${record.semester}`,
      gpa: record.gpa,
      notes: record.notes
    }));
  } catch (error) {
    console.error('Error fetching academic records:', error);
    toast.error('Akademik kayıtlar yüklenirken hata oluştu');
    return [];
  }
}

export function saveAcademics(list: AcademicRecord[]) {
  console.warn('saveAcademics is deprecated. Use addAcademic for individual records.');
}

export async function getAcademicsByStudent(studentId: string): Promise<AcademicRecord[]> {
  return loadAcademics(studentId);
}

export async function addAcademic(a: AcademicRecord): Promise<void> {
  try {
    const termParts = a.term.split('/');
    const yearPart = termParts[0];
    const semester = termParts[1] || yearPart.split('-')[1] || '1';
    
    const year = parseInt(yearPart.split('-')[0]);
    
    const backendRecord = {
      studentId: a.studentId,
      semester: semester,
      year: year,
      gpa: a.gpa,
      exams: [],
      notes: a.notes
    };
    
    const response = await fetch('/api/students/academics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendRecord)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save academic record');
    }
    
    toast.success('Akademik kayıt eklendi');
  } catch (error) {
    console.error('Error saving academic record:', error);
    toast.error('Akademik kayıt eklenemedi');
    throw error;
  }
}

export async function loadInterventions(): Promise<Intervention[]> {
  console.warn('loadInterventions is deprecated. Use getInterventionsByStudent instead.');
  return [];
}

export async function saveInterventions(list: Intervention[]): Promise<void> {
  console.warn('saveInterventions is deprecated. Use addIntervention for individual records.');
}

export async function getInterventionsByStudent(studentId: string): Promise<Intervention[]> {
  try {
    const response = await fetch(`/api/students/${studentId}/interventions`);
    if (!response.ok) {
      throw new Error('Failed to fetch student interventions');
    }
    const interventions = await response.json();
    return Array.isArray(interventions) ? interventions : [];
  } catch (error) {
    console.error('Error fetching student interventions:', error);
    toast.error('Müdahale kayıtları yüklenirken hata oluştu');
    return [];
  }
}

export async function addIntervention(i: Intervention): Promise<void> {
  try {
    const response = await fetch('/api/students/interventions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(i)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save intervention record');
    }
    
    toast.success('Müdahale kaydı eklendi');
  } catch (error) {
    console.error('Error saving intervention record:', error);
    toast.error('Müdahale kaydı eklenemedi');
    throw error;
  }
}
