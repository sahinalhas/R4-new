import * as repository from '../repository/students.repository.js';
import type { Student, AcademicRecord, Progress } from '../types/students.types.js';

export function normalizeStudentData(student: any): any {
  const normalized = { ...student };
  
  // ID normalization
  if (normalized.id && typeof normalized.id === 'string') {
    normalized.id = normalized.id.trim();
  }
  
  // Name handling - support both formats
  if (normalized.name && typeof normalized.name === 'string') {
    normalized.name = normalized.name.trim();
    if (normalized.name.length === 0) {
      normalized.name = undefined;
    }
  }
  
  if (!normalized.name && student.ad && student.soyad) {
    const trimmedAd = typeof student.ad === 'string' ? student.ad.trim() : '';
    const trimmedSoyad = typeof student.soyad === 'string' ? student.soyad.trim() : '';
    normalized.name = `${trimmedAd} ${trimmedSoyad}`.trim();
  }
  
  // Turkish to English field mapping
  if (student.sinif && !normalized.className) {
    normalized.className = student.sinif;
  }
  if (student.cinsiyet && !normalized.gender) {
    normalized.gender = student.cinsiyet;
  }
  if (student.eposta && !normalized.email) {
    normalized.email = student.eposta;
  }
  if (student.telefon && !normalized.phone) {
    normalized.phone = student.telefon;
  }
  if (student.adres && !normalized.address) {
    normalized.address = student.adres;
  }
  if (student.dogumTarihi && !normalized.birthDate) {
    normalized.birthDate = student.dogumTarihi;
  }
  if (student.veliTelefon && !normalized.parentContact) {
    normalized.parentContact = student.veliTelefon;
  }
  
  // Status field mapping
  if (student.durum && !normalized.status) {
    normalized.status = student.durum === 'aktif' ? 'active' : 
                       student.durum === 'pasif' ? 'inactive' : 
                       student.durum === 'mezun' ? 'graduated' : 'active';
  }
  
  // Enrollment date with fallback
  if (!normalized.enrollmentDate && !student.kayitTarihi) {
    normalized.enrollmentDate = new Date().toISOString().split('T')[0];
  } else if (student.kayitTarihi && !normalized.enrollmentDate) {
    normalized.enrollmentDate = student.kayitTarihi;
  }
  
  // Ensure required fields have defaults
  if (!normalized.status) {
    normalized.status = 'active';
  }
  
  return normalized;
}

export function validateStudent(student: any): { valid: boolean; error?: string } {
  if (!student || typeof student !== 'object') {
    return { valid: false, error: "Geçersiz öğrenci verisi" };
  }
  
  if (!student.id || typeof student.id !== 'string' || student.id.trim().length === 0) {
    return { valid: false, error: "Öğrenci ID zorunludur ve geçerli bir string olmalıdır" };
  }
  
  const hasValidName = student.name && typeof student.name === 'string' && student.name.trim().length > 0;
  const hasValidAd = student.ad && typeof student.ad === 'string' && student.ad.trim().length > 0;
  const hasValidSoyad = student.soyad && typeof student.soyad === 'string' && student.soyad.trim().length > 0;
  
  if (!hasValidName && !(hasValidAd && hasValidSoyad)) {
    return { valid: false, error: "Öğrenci adı (name veya ad+soyad) zorunludur" };
  }
  
  return { valid: true };
}

export function validateAcademic(academic: any): { valid: boolean; error?: string } {
  if (!academic || typeof academic !== 'object') {
    return { valid: false, error: "Geçersiz akademik kayıt verisi" };
  }
  
  if (!academic.studentId || !academic.semester || academic.year === undefined) {
    return { valid: false, error: "studentId, semester ve year alanları zorunludur" };
  }
  
  return { valid: true };
}

export function getAllStudents(): Student[] {
  return repository.loadStudents();
}

export function createOrUpdateStudent(student: any): void {
  const validation = validateStudent(student);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  
  const normalizedStudent = normalizeStudentData(student);
  repository.saveStudent(normalizedStudent);
}

export function bulkSaveStudents(students: any[]): void {
  if (!Array.isArray(students)) {
    throw new Error('Expected array of students');
  }
  
  const invalidIndices: number[] = [];
  for (let i = 0; i < students.length; i++) {
    const validation = validateStudent(students[i]);
    if (!validation.valid) {
      invalidIndices.push(i);
    }
  }
  
  if (invalidIndices.length > 0) {
    throw new Error(`Geçersiz öğrenci verileri (indeksler: ${invalidIndices.join(', ')})`);
  }
  
  const normalizedStudents = students.map(student => normalizeStudentData(student));
  repository.saveStudents(normalizedStudents);
}

export function removeStudent(id: string, confirmationName: string): { studentName: string } {
  const students = repository.loadStudents();
  const student = students.find(s => s.id === id);
  
  if (!student) {
    throw new Error("Öğrenci bulunamadı");
  }
  
  const expectedName = `${student.name}`.trim();
  const sanitizedConfirmationName = (confirmationName || '').trim();
  
  if (sanitizedConfirmationName !== expectedName) {
    throw new Error("Silme işlemini onaylamak için öğrencinin tam adını doğru yazmalısınız");
  }
  
  repository.deleteStudent(id);
  return { studentName: student.name };
}

export function getStudentAcademics(studentId: string): AcademicRecord[] {
  if (!studentId || typeof studentId !== 'string' || studentId.length > 50) {
    throw new Error("Geçersiz öğrenci ID");
  }
  
  return repository.getAcademicsByStudent(studentId);
}

export function createAcademic(academic: any): void {
  const validation = validateAcademic(academic);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  
  const sanitizedAcademic = {
    studentId: academic.studentId,
    semester: academic.semester,
    gpa: academic.gpa !== undefined && academic.gpa !== null ? Number(academic.gpa) : undefined,
    year: Number(academic.year),
    exams: academic.exams || [],
    notes: academic.notes || undefined
  };
  
  repository.addAcademic(sanitizedAcademic);
}

export function getStudentProgress(studentId: string): Progress[] {
  if (!studentId || typeof studentId !== 'string' || studentId.length > 50) {
    throw new Error("Geçersiz öğrenci ID");
  }
  
  repository.ensureProgressForStudent(studentId);
  return repository.getProgressByStudent(studentId);
}
