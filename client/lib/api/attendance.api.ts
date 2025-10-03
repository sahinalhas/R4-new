import { toast } from "sonner";
import type { AttendanceRecord } from "../types/attendance.types";

export async function loadAttendance(): Promise<AttendanceRecord[]> {
  try {
    const response = await fetch('/api/attendance');
    if (!response.ok) {
      throw new Error('Failed to fetch attendance records');
    }
    const records = await response.json();
    return Array.isArray(records) ? records : [];
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    toast.error('Devam kayıtları yüklenirken hata oluştu');
    return [];
  }
}

export async function saveAttendance(list: AttendanceRecord[]): Promise<void> {
  console.warn('saveAttendance is deprecated. Use addAttendance for individual records.');
}

export async function getAttendanceByStudent(studentId: string): Promise<AttendanceRecord[]> {
  try {
    const response = await fetch(`/api/attendance/${studentId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch student attendance');
    }
    const records = await response.json();
    return Array.isArray(records) ? records : [];
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    toast.error('Öğrenci devam kayıtları yüklenirken hata oluştu');
    return [];
  }
}

export async function addAttendance(a: AttendanceRecord): Promise<void> {
  try {
    const response = await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(a)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save attendance record');
    }
    
    toast.success('Devam kaydı eklendi');
  } catch (error) {
    console.error('Error saving attendance record:', error);
    toast.error('Devam kaydı eklenemedi');
    throw error;
  }
}
