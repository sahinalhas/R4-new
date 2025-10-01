import { RequestHandler } from "express";
import { 
  loadStudents, 
  saveStudent, 
  saveStudents,
  deleteStudent,
  getAcademicsByStudent,
  addAcademic,
  getProgressByStudent,
  ensureProgressForStudent,
  getInterventionsByStudent,
  insertIntervention
} from "../lib/db-service.js";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/errors.js";
import { sanitizeString } from "../middleware/validation.js";

// Helper function to normalize student data from frontend to backend format
function normalizeStudentData(student: any): any {
  const normalized = { ...student };
  
  // Trim and canonicalize ID
  if (normalized.id && typeof normalized.id === 'string') {
    normalized.id = normalized.id.trim();
  }
  
  // Trim name if present; if whitespace-only, treat as absent
  if (normalized.name && typeof normalized.name === 'string') {
    normalized.name = normalized.name.trim();
    if (normalized.name.length === 0) {
      normalized.name = undefined;
    }
  }
  
  // Convert frontend format to backend if needed
  if (!normalized.name && student.ad && student.soyad) {
    const trimmedAd = typeof student.ad === 'string' ? student.ad.trim() : '';
    const trimmedSoyad = typeof student.soyad === 'string' ? student.soyad.trim() : '';
    normalized.name = `${trimmedAd} ${trimmedSoyad}`.trim();
  }
  
  // Map frontend fields to backend format
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
  
  // Ensure enrollmentDate exists
  if (!normalized.enrollmentDate) {
    normalized.enrollmentDate = new Date().toISOString().split('T')[0];
  }
  
  return normalized;
}

// GET /api/students - Tüm öğrencileri getir
export const getStudents: RequestHandler = (req, res) => {
  try {
    const students = loadStudents();
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: ERROR_MESSAGES.FAILED_TO_FETCH_STUDENTS });
  }
};

// POST /api/students - Öğrenci ekle veya güncelle
export const saveStudentHandler: RequestHandler = (req, res) => {
  try {
    const student = req.body;
    
    // Basic input validation
    if (!student || typeof student !== 'object') {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz öğrenci verisi" 
      });
    }
    
    // Validate ID is a non-empty string
    if (!student.id || typeof student.id !== 'string' || student.id.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: "Öğrenci ID zorunludur ve geçerli bir string olmalıdır" 
      });
    }
    
    // Check if name is valid (non-whitespace) or if ad+soyad are both valid
    const hasValidName = student.name && typeof student.name === 'string' && student.name.trim().length > 0;
    const hasValidAd = student.ad && typeof student.ad === 'string' && student.ad.trim().length > 0;
    const hasValidSoyad = student.soyad && typeof student.soyad === 'string' && student.soyad.trim().length > 0;
    
    // Accept either a valid name OR both valid ad and soyad
    if (!hasValidName && !(hasValidAd && hasValidSoyad)) {
      return res.status(400).json({ 
        success: false, 
        error: "Öğrenci adı (name veya ad+soyad) zorunludur" 
      });
    }
    
    // Normalize data from frontend to backend format
    const normalizedStudent = normalizeStudentData(student);
    
    saveStudent(normalizedStudent);
    res.json({ success: true, message: SUCCESS_MESSAGES.STUDENT_SAVED });
  } catch (error) {
    console.error('Error saving student:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ 
      success: false, 
      error: `${ERROR_MESSAGES.FAILED_TO_SAVE_STUDENT}: ${errorMessage}` 
    });
  }
};

// POST /api/students/bulk - Toplu öğrenci kaydetme
export const saveStudentsHandler: RequestHandler = (req, res) => {
  try {
    const students = req.body;
    if (!Array.isArray(students)) {
      return res.status(400).json({ error: ERROR_MESSAGES.EXPECTED_ARRAY_OF_STUDENTS });
    }
    
    // Validate each student before processing
    const invalidIndices: number[] = [];
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      
      if (!student || typeof student !== 'object') {
        invalidIndices.push(i);
        continue;
      }
      
      // Validate ID is a non-empty string
      if (!student.id || typeof student.id !== 'string' || student.id.trim().length === 0) {
        invalidIndices.push(i);
        continue;
      }
      
      // Check if name is valid (non-whitespace) or if ad+soyad are both valid
      const hasValidName = student.name && typeof student.name === 'string' && student.name.trim().length > 0;
      const hasValidAd = student.ad && typeof student.ad === 'string' && student.ad.trim().length > 0;
      const hasValidSoyad = student.soyad && typeof student.soyad === 'string' && student.soyad.trim().length > 0;
      
      // Accept either a valid name OR both valid ad and soyad
      if (!hasValidName && !(hasValidAd && hasValidSoyad)) {
        invalidIndices.push(i);
        continue;
      }
    }
    
    if (invalidIndices.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: `Geçersiz öğrenci verileri (indeksler: ${invalidIndices.join(', ')})` 
      });
    }
    
    // Normalize all students from frontend to backend format
    const normalizedStudents = students.map(student => normalizeStudentData(student));
    
    saveStudents(normalizedStudents);
    res.json({ success: true, message: `${students.length} ${SUCCESS_MESSAGES.STUDENTS_SAVED}` });
  } catch (error) {
    console.error('Error saving students:', error);
    res.status(500).json({ success: false, error: ERROR_MESSAGES.FAILED_TO_SAVE_STUDENTS });
  }
};

// GET /api/students/:id/academics - Öğrencinin akademik kayıtları
export const getStudentAcademics: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    
    // Input validation and sanitization
    if (!id || typeof id !== 'string' || id.length > 50) {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz öğrenci ID" 
      });
    }
    
    const sanitizedId = sanitizeString(id);
    const academics = getAcademicsByStudent(sanitizedId);
    res.json(academics);
  } catch (error) {
    console.error('Error fetching student academics:', error);
    res.status(500).json({ success: false, error: ERROR_MESSAGES.FAILED_TO_FETCH_ACADEMICS });
  }
};

// POST /api/students/academics - Akademik kayıt ekle
export const addStudentAcademic: RequestHandler = (req, res) => {
  try {
    const academic = req.body;
    
    // Input validation
    if (!academic || typeof academic !== 'object') {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz akademik kayıt verisi" 
      });
    }
    
    if (!academic.studentId || !academic.semester || academic.year === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: "studentId, semester ve year alanları zorunludur" 
      });
    }
    
    // Sanitize inputs
    const sanitizedAcademic = {
      studentId: sanitizeString(academic.studentId),
      semester: sanitizeString(academic.semester),
      gpa: academic.gpa !== undefined && academic.gpa !== null ? Number(academic.gpa) : undefined,
      year: Number(academic.year),
      exams: academic.exams || [],
      notes: academic.notes ? sanitizeString(academic.notes) : undefined
    };
    
    addAcademic(sanitizedAcademic);
    res.json({ success: true, message: "Akademik kayıt eklendi" });
  } catch (error) {
    console.error('Error adding academic record:', error);
    res.status(500).json({ success: false, error: "Akademik kayıt eklenirken hata oluştu" });
  }
};

// GET /api/students/:id/progress - Öğrencinin çalışma ilerlemesi  
export const getStudentProgress: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    
    // Input validation and sanitization
    if (!id || typeof id !== 'string' || id.length > 50) {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz öğrenci ID" 
      });
    }
    
    const sanitizedId = sanitizeString(id);
    ensureProgressForStudent(sanitizedId); // Progress verisi yoksa oluştur
    const progress = getProgressByStudent(sanitizedId);
    res.json(progress);
  } catch (error) {
    console.error('Error fetching student progress:', error);
    res.status(500).json({ success: false, error: ERROR_MESSAGES.FAILED_TO_FETCH_STUDENT_PROGRESS });
  }
};

// DELETE /api/students/:id - Öğrenci sil
export const deleteStudentHandler: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { confirmationName } = req.body;
    
    // Güvenlik kontrolü: öğrenci var mı?
    const students = loadStudents();
    const student = students.find(s => s.id === id);
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        error: "Öğrenci bulunamadı" 
      });
    }
    
    // Güvenlik kontrolü: adı doğru yazılmış mı?
    const expectedName = `${student.name}`.trim();
    const sanitizedConfirmationName = sanitizeString(confirmationName || '').trim();
    
    if (sanitizedConfirmationName !== expectedName) {
      return res.status(400).json({ 
        success: false, 
        error: "Silme işlemini onaylamak için öğrencinin tam adını doğru yazmalısınız" 
      });
    }
    
    // Güvenli silme işlemi
    deleteStudent(id);
    
    res.json({ 
      success: true, 
      message: `${student.name} başarıyla silindi` 
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ 
      success: false, 
      error: "Öğrenci silinirken hata oluştu" 
    });
  }
};

// GET /api/students/:id/interventions - Öğrencinin müdahale kayıtları
export const getStudentInterventions: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    
    // Input validation and sanitization
    if (!id || typeof id !== 'string' || id.length > 50) {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz öğrenci ID" 
      });
    }
    
    const sanitizedId = sanitizeString(id);
    const interventions = getInterventionsByStudent(sanitizedId);
    res.json(interventions);
  } catch (error) {
    console.error('Error fetching student interventions:', error);
    res.status(500).json({ success: false, error: "Müdahale kayıtları getirilirken hata oluştu" });
  }
};

// POST /api/students/interventions - Müdahale kaydı ekle
export const addStudentIntervention: RequestHandler = (req, res) => {
  try {
    const intervention = req.body;
    
    // Input validation
    if (!intervention || typeof intervention !== 'object') {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz müdahale kaydı verisi" 
      });
    }
    
    if (!intervention.id || !intervention.studentId || !intervention.date || !intervention.title || !intervention.status) {
      return res.status(400).json({ 
        success: false, 
        error: "id, studentId, date, title ve status alanları zorunludur" 
      });
    }
    
    // Validate status
    const validStatuses = ['Planlandı', 'Devam', 'Tamamlandı'];
    if (!validStatuses.includes(intervention.status)) {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz durum. Geçerli değerler: Planlandı, Devam, Tamamlandı" 
      });
    }
    
    // Sanitize inputs
    const sanitizedId = sanitizeString(intervention.id);
    const sanitizedStudentId = sanitizeString(intervention.studentId);
    const sanitizedDate = sanitizeString(intervention.date);
    const sanitizedTitle = sanitizeString(intervention.title);
    const sanitizedStatus = sanitizeString(intervention.status);
    
    insertIntervention(sanitizedId, sanitizedStudentId, sanitizedDate, sanitizedTitle, sanitizedStatus);
    res.json({ success: true, message: "Müdahale kaydı eklendi" });
  } catch (error) {
    console.error('Error adding intervention record:', error);
    res.status(500).json({ success: false, error: "Müdahale kaydı eklenirken hata oluştu" });
  }
};