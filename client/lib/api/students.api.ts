import { toast } from "sonner";
import type { Student, BackendStudent } from "../types/student.types";
import { backendToFrontend, frontendToBackend } from "../types/student.types";

let studentsCache: Student[] | null = null;

async function fetchStudentsFromAPI(): Promise<BackendStudent[]> {
  try {
    const response = await fetch('/api/students');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch students: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching students from API:', error);
    return [];
  }
}

async function saveStudentsToAPI(students: BackendStudent[]): Promise<void> {
  try {
    const response = await fetch('/api/students/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(students)
    });
    if (!response.ok) throw new Error('Failed to save students');
  } catch (error) {
    console.error('Error saving students to API:', error);
    throw error;
  }
}

export function loadStudents(): Student[] {
  if (studentsCache !== null) {
    return studentsCache;
  }
  
  loadStudentsAsync();
  
  studentsCache = [];
  return [];
}

async function loadStudentsAsync(): Promise<void> {
  try {
    const backendStudents = await fetchStudentsFromAPI();
    const frontendStudents = backendStudents.map(backendToFrontend);
    studentsCache = frontendStudents;
    
    window.dispatchEvent(new CustomEvent('studentsUpdated'));
  } catch (error) {
    console.error('Failed to load students from API:', error);
    
    toast.error('Öğrenci verileri yüklenirken hata oluştu', {
      description: 'Lütfen internet bağlantınızı kontrol edip tekrar deneyin.',
      duration: 5000
    });
    
    if (!studentsCache || studentsCache.length === 0) {
      studentsCache = [];
      window.dispatchEvent(new CustomEvent('studentsUpdated'));
    }
  }
}

export function saveStudents(list: Student[]) {
  studentsCache = list;
  
  saveStudentsAsync(list).catch(error => {
    console.error('Failed to save students to API:', error);
  });
}

async function saveStudentsAsync(students: Student[]): Promise<void> {
  try {
    const backendStudents = students.map(frontendToBackend);
    await saveStudentsToAPI(backendStudents);
  } catch (error) {
    console.error('Error saving students to API:', error);
    
    toast.error('Öğrenci verileri kaydedilirken hata oluştu', {
      description: 'Verileriniz kaydedilemedi. Lütfen tekrar deneyin.',
      duration: 5000
    });
    
    throw error;
  }
}

export async function upsertStudent(stu: Student): Promise<void> {
  try {
    const backendStudent = frontendToBackend(stu);
    
    const response = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendStudent)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }
    
    const list = studentsCache || [];
    const idx = list.findIndex((s) => s.id === stu.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...stu };
    } else {
      list.unshift(stu);
    }
    studentsCache = list;
    
    window.dispatchEvent(new CustomEvent('studentsUpdated'));
    
  } catch (error) {
    console.error('Error saving student:', error);
    throw error;
  }
}

export async function refreshStudentsFromAPI(): Promise<Student[]> {
  try {
    const backendStudents = await fetchStudentsFromAPI();
    const frontendStudents = backendStudents.map(backendToFrontend);
    studentsCache = frontendStudents;
    
    return frontendStudents;
  } catch (error) {
    console.error('Failed to refresh students from API:', error);
    
    toast.error('Öğrenci verileri güncellenirken hata oluştu', {
      description: 'Sunucuya erişilemiyor. Lütfen daha sonra tekrar deneyin.',
      duration: 5000
    });
    
    throw error;
  }
}

export async function deleteStudent(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/students/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete student');
    }
    
    if (studentsCache) {
      studentsCache = studentsCache.filter(s => s.id !== id);
      window.dispatchEvent(new CustomEvent('studentsUpdated'));
    }
    
    toast.success('Öğrenci silindi');
  } catch (error) {
    console.error('Error deleting student:', error);
    toast.error('Öğrenci silinemedi');
    throw error;
  }
}
