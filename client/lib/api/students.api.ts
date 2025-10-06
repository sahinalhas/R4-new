import type { Student, BackendStudent } from "../types/student.types";
import { backendToFrontend, frontendToBackend } from "../types/student.types";
import { apiClient } from "./api-client";
import { API_ERROR_MESSAGES } from "../constants/messages.constants";
import { toast } from "sonner";

let studentsCache: Student[] | null = null;

async function fetchStudentsFromAPI(): Promise<BackendStudent[]> {
  try {
    return await apiClient.get<BackendStudent[]>('/api/students', { showErrorToast: false });
  } catch (error) {
    console.error('Error fetching students from API:', error);
    return [];
  }
}

async function saveStudentsToAPI(students: BackendStudent[]): Promise<void> {
  return apiClient.post('/api/students/bulk', students, { showErrorToast: false });
}

export function loadStudents(): Student[] {
  if (studentsCache !== null) {
    return studentsCache;
  }
  
  loadStudentsAsync();
  
  studentsCache = [];
  return [];
}

export async function loadStudentsAsync(): Promise<void> {
  try {
    const backendStudents = await fetchStudentsFromAPI();
    const frontendStudents = backendStudents.map(backendToFrontend);
    studentsCache = frontendStudents;
    
    window.dispatchEvent(new CustomEvent('studentsUpdated'));
  } catch (error) {
    console.error('Failed to load students from API:', error);
    
    toast.error(API_ERROR_MESSAGES.STUDENT.LOAD_ERROR, {
      description: API_ERROR_MESSAGES.STUDENT.LOAD_ERROR_DESCRIPTION,
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
    
    toast.error(API_ERROR_MESSAGES.STUDENT.SAVE_ERROR, {
      description: API_ERROR_MESSAGES.STUDENT.SAVE_ERROR_DESCRIPTION,
      duration: 5000
    });
    
    throw error;
  }
}

export async function upsertStudent(stu: Student): Promise<void> {
  try {
    const backendStudent = frontendToBackend(stu);
    
    await apiClient.post('/api/students', backendStudent, { showErrorToast: false });
    
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
    
    toast.error(API_ERROR_MESSAGES.STUDENT.REFRESH_ERROR, {
      description: API_ERROR_MESSAGES.STUDENT.REFRESH_ERROR_DESCRIPTION,
      duration: 5000
    });
    
    throw error;
  }
}

export async function deleteStudent(id: string): Promise<void> {
  try {
    await apiClient.delete(`/api/students/${id}`, {
      showSuccessToast: true,
      successMessage: API_ERROR_MESSAGES.STUDENT.DELETE_SUCCESS,
      errorMessage: API_ERROR_MESSAGES.STUDENT.DELETE_ERROR,
    });
    
    if (studentsCache) {
      studentsCache = studentsCache.filter(s => s.id !== id);
      window.dispatchEvent(new CustomEvent('studentsUpdated'));
    }
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
}
