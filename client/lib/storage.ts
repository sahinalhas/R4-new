import { toast } from "sonner";

// Backend Student interface
export interface BackendStudent {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  className?: string;
  enrollmentDate: string;
  status?: 'active' | 'inactive' | 'graduated';
  avatar?: string;
  parentContact?: string;
  notes?: string;
  gender?: 'K' | 'E';
}

// Frontend Student type (legacy)
export type Student = {
  id: string;
  ad: string;
  soyad: string;
  sinif: string;
  cinsiyet: "K" | "E";
  risk?: "Düşük" | "Orta" | "Yüksek";
  telefon?: string;
  eposta?: string;
  adres?: string;
  veliAdi?: string;
  veliTelefon?: string;
  etiketler?: string[];
  dogumTarihi?: string; // ISO date
  okulNo?: string;
  il?: string;
  ilce?: string;
  rehberOgretmen?: string;
  acilKisi?: string;
  acilTelefon?: string;
  ilgiAlanlari?: string[];
  saglikNotu?: string;
  kanGrubu?: string;
};

export type MeetingNote = {
  id: string;
  studentId: string;
  date: string; // ISO
  type: "Bireysel" | "Grup" | "Veli";
  note: string;
  plan?: string;
};

export type StudentDoc = {
  id: string;
  studentId: string;
  name: string;
  type: string;
  createdAt: string; // ISO
  dataUrl: string; // base64 url
};

export type SurveyResult = {
  id: string;
  studentId: string;
  title: string;
  score?: number;
  date: string; // ISO
  details?: string;
};

export type AttendanceRecord = {
  id: string;
  studentId: string;
  date: string; // ISO date
  status: "Devamsız" | "Geç" | "Var";
  reason?: string;
};

export type AcademicRecord = {
  id: string;
  studentId: string;
  term: string; // e.g. 2024-2025/1
  gpa?: number;
  notes?: string;
};

export type Intervention = {
  id: string;
  studentId: string;
  date: string; // ISO
  title: string;
  status: "Planlandı" | "Devam" | "Tamamlandı";
};

// New comprehensive student tracking types
export type HealthInfo = {
  id: string;
  studentId: string;
  bloodType?: string;
  chronicDiseases?: string;
  allergies?: string;
  medications?: string;
  specialNeeds?: string;
  medicalHistory?: string;
  emergencyContact1Name?: string;
  emergencyContact1Phone?: string;
  emergencyContact1Relation?: string;
  emergencyContact2Name?: string;
  emergencyContact2Phone?: string;
  emergencyContact2Relation?: string;
  physicianName?: string;
  physicianPhone?: string;
  insuranceInfo?: string;
  vaccinations?: string;
  dietaryRestrictions?: string;
  physicalLimitations?: string;
  mentalHealthNotes?: string;
  lastHealthCheckup?: string;
  notes?: string;
};

export type SpecialEducation = {
  id: string;
  studentId: string;
  hasIEP: boolean;
  iepStartDate?: string;
  iepEndDate?: string;
  iepGoals?: string;
  diagnosis?: string;
  ramReportDate?: string;
  ramReportSummary?: string;
  supportServices?: string;
  accommodations?: string;
  modifications?: string;
  progressNotes?: string;
  evaluationSchedule?: string;
  specialistContacts?: string;
  parentInvolvement?: string;
  transitionPlan?: string;
  assistiveTechnology?: string;
  behavioralSupport?: string;
  status: string;
  nextReviewDate?: string;
  notes?: string;
};

export type RiskFactors = {
  id: string;
  studentId: string;
  assessmentDate: string;
  academicRiskLevel: string;
  behavioralRiskLevel: string;
  attendanceRiskLevel: string;
  socialEmotionalRiskLevel: string;
  dropoutRisk?: number;
  academicFactors?: string;
  behavioralFactors?: string;
  attendanceFactors?: string;
  socialFactors?: string;
  familyFactors?: string;
  protectiveFactors?: string;
  interventionsNeeded?: string;
  alertsGenerated?: string;
  followUpActions?: string;
  assignedCounselor?: string;
  parentNotified: boolean;
  parentNotificationDate?: string;
  overallRiskScore?: number;
  status: string;
  nextAssessmentDate?: string;
  notes?: string;
};

export type BehaviorIncident = {
  id: string;
  studentId: string;
  incidentDate: string;
  incidentTime: string;
  location: string;
  behaviorType: string;
  behaviorCategory: string;
  description: string;
  antecedent?: string;
  consequence?: string;
  duration?: number;
  intensity?: string;
  frequency?: string;
  witnessedBy?: string;
  othersInvolved?: string;
  interventionUsed?: string;
  interventionEffectiveness?: string;
  parentNotified: boolean;
  parentNotificationMethod?: string;
  parentResponse?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  followUpNotes?: string;
  adminNotified: boolean;
  consequenceGiven?: string;
  supportProvided?: string;
  triggerAnalysis?: string;
  patternNotes?: string;
  positiveAlternative?: string;
  status: string;
  recordedBy: string;
  notes?: string;
};

export type ExamResult = {
  id: string;
  studentId: string;
  examType: string;
  examName: string;
  examDate: string;
  examProvider?: string;
  totalScore?: number;
  percentileRank?: number;
  turkishScore?: number;
  mathScore?: number;
  scienceScore?: number;
  socialScore?: number;
  foreignLanguageScore?: number;
  turkishNet?: number;
  mathNet?: number;
  scienceNet?: number;
  socialNet?: number;
  foreignLanguageNet?: number;
  totalNet?: number;
  correctAnswers?: number;
  wrongAnswers?: number;
  emptyAnswers?: number;
  totalQuestions?: number;
  subjectBreakdown?: any;
  topicAnalysis?: any;
  strengthAreas?: string[];
  weaknessAreas?: string[];
  improvementSuggestions?: string;
  comparedToGoal?: string;
  comparedToPrevious?: string;
  comparedToClassAverage?: number;
  schoolRank?: number;
  classRank?: number;
  isOfficial: boolean;
  certificateUrl?: string;
  answerKeyUrl?: string;
  detailedReportUrl?: string;
  goalsMet: boolean;
  parentNotified: boolean;
  counselorNotes?: string;
  actionPlan?: string;
  notes?: string;
};

// localStorage keys removed - all data now stored in SQLite via API

// API Functions
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

// Conversion functions
function backendToFrontend(backend: BackendStudent): Student {
  const nameParts = backend.name.split(' ');
  const ad = nameParts[0] || '';
  const soyad = nameParts.slice(1).join(' ') || '';
  
  return {
    id: backend.id,
    ad,
    soyad,
    sinif: backend.className || '',
    cinsiyet: backend.gender || 'K', // Use actual gender from database
    telefon: backend.phone,
    eposta: backend.email,
    adres: backend.address,
    dogumTarihi: backend.birthDate,
    veliTelefon: backend.parentContact
  };
}

// Overloaded function signatures
function frontendToBackend(frontend: Student): BackendStudent;
function frontendToBackend(frontend: Student, original: BackendStudent): BackendStudent;
function frontendToBackend(frontend: Student, original?: BackendStudent): BackendStudent {
  return {
    id: frontend.id,
    name: `${frontend.ad} ${frontend.soyad}`.trim(),
    email: frontend.eposta || original?.email,
    phone: frontend.telefon || original?.phone,
    address: frontend.adres || original?.address,
    className: frontend.sinif || original?.className,
    enrollmentDate: original?.enrollmentDate || new Date().toISOString().split('T')[0],
    status: original?.status || 'active' as const,
    parentContact: frontend.veliTelefon || original?.parentContact,
    birthDate: frontend.dogumTarihi || original?.birthDate,
    avatar: original?.avatar,
    notes: original?.notes,
    gender: frontend.cinsiyet || original?.gender || 'K'
  };
}

export function loadStudents(): Student[] {
  // Return cached data if available (synchronous)
  if (studentsCache !== null) {
    return studentsCache;
  }
  
  // Load from API asynchronously and update cache
  loadStudentsAsync();
  
  // Return empty array initially, will be updated when API responds
  studentsCache = [];
  return [];
}

// Async function to load from API and update cache
async function loadStudentsAsync(): Promise<void> {
  try {
    const backendStudents = await fetchStudentsFromAPI();
    const frontendStudents = backendStudents.map(backendToFrontend);
    studentsCache = frontendStudents;
    
    // Remove localStorage caching to avoid storing PII in browser
    // API is the single source of truth for student data
    
    // Trigger a re-render if needed (this is a simple approach)
    window.dispatchEvent(new CustomEvent('studentsUpdated'));
  } catch (error) {
    console.error('Failed to load students from API:', error);
    
    // Show user-friendly error message
    toast.error('Öğrenci verileri yüklenirken hata oluştu', {
      description: 'Lütfen internet bağlantınızı kontrol edip tekrar deneyin.',
      duration: 5000
    });
    
    // Keep empty cache on error - don't show fake data in production
    if (!studentsCache || studentsCache.length === 0) {
      studentsCache = [];
      window.dispatchEvent(new CustomEvent('studentsUpdated'));
    }
  }
}

export function saveStudents(list: Student[]) {
  // Update cache
  studentsCache = list;
  
  // Remove localStorage backup to avoid storing PII in browser
  // API is the single source of truth for student data
  
  // Save to API asynchronously
  saveStudentsAsync(list).catch(error => {
    console.error('Failed to save students to API:', error);
  });
}

// Async function to save to API
async function saveStudentsAsync(students: Student[]): Promise<void> {
  try {
    const backendStudents = students.map(frontendToBackend);
    await saveStudentsToAPI(backendStudents);
    
    // Don't show automatic success toast to avoid duplicates
  } catch (error) {
    console.error('Error saving students to API:', error);
    
    // Show user-friendly error message
    toast.error('Öğrenci verileri kaydedilirken hata oluştu', {
      description: 'Verileriniz kaydedilemedi. Lütfen tekrar deneyin.',
      duration: 5000
    });
    
    throw error;
  }
}

// Tekil öğrenci kaydetme fonksiyonu (GÜVENLİ)
export async function upsertStudent(stu: Student): Promise<void> {
  try {
    // Backend formatına çevir
    const backendStudent = frontendToBackend(stu);
    
    // API'ye tek öğrenci kaydet
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
    
    // Başarılı olduysa cache'i güncelle
    const list = studentsCache || [];
    const idx = list.findIndex((s) => s.id === stu.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...stu };
    } else {
      list.unshift(stu);
    }
    studentsCache = list;
    
    // UI'yi güncelle
    window.dispatchEvent(new CustomEvent('studentsUpdated'));
    
  } catch (error) {
    console.error('Error saving student:', error);
    throw error;
  }
}

// Force reload from API
export async function refreshStudentsFromAPI(): Promise<Student[]> {
  try {
    const backendStudents = await fetchStudentsFromAPI();
    const frontendStudents = backendStudents.map(backendToFrontend);
    studentsCache = frontendStudents;
    // API is the single source of truth - no localStorage caching needed
    
    // Don't show success toast from refreshStudentsFromAPI as it may be called internally
    return frontendStudents;
  } catch (error) {
    console.error('Failed to refresh students from API:', error);
    
    // Show user-friendly error message
    toast.error('Öğrenci verileri güncellenirken hata oluştu', {
      description: 'Sunucuya erişilemiyor. Lütfen daha sonra tekrar deneyin.',
      duration: 5000
    });
    
    throw error;
  }
}

export async function getNotesByStudent(studentId: string): Promise<MeetingNote[]> {
  try {
    const response = await fetch(`/api/meeting-notes/${studentId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch meeting notes: ${response.status}`);
    }
    const notes = await response.json();
    return Array.isArray(notes) ? notes : [];
  } catch (error) {
    console.error('Error fetching meeting notes:', error);
    toast.error('Görüşme notları yüklenirken hata oluştu');
    return [];
  }
}

export async function addNote(note: MeetingNote): Promise<void> {
  try {
    const response = await fetch('/api/meeting-notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save meeting note');
    }
    
    toast.success('Görüşme notu kaydedildi');
  } catch (error) {
    console.error('Error saving meeting note:', error);
    toast.error('Görüşme notu kaydedilemedi');
    throw error;
  }
}

export async function updateNote(id: string, note: Partial<MeetingNote>): Promise<void> {
  try {
    const response = await fetch(`/api/meeting-notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update meeting note');
    }
    
    toast.success('Görüşme notu güncellendi');
  } catch (error) {
    console.error('Error updating meeting note:', error);
    toast.error('Görüşme notu güncellenemedi');
    throw error;
  }
}

export async function deleteNote(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/meeting-notes/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete meeting note');
    }
    
    toast.success('Görüşme notu silindi');
  } catch (error) {
    console.error('Error deleting meeting note:', error);
    toast.error('Görüşme notu silinemedi');
    throw error;
  }
}

export async function getDocsByStudent(studentId: string): Promise<StudentDoc[]> {
  try {
    const response = await fetch(`/api/documents/${studentId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch documents: ${response.status}`);
    }
    const docs = await response.json();
    return Array.isArray(docs) ? docs : [];
  } catch (error) {
    console.error('Error fetching documents:', error);
    toast.error('Dokümanlar yüklenirken hata oluştu');
    return [];
  }
}

export async function addDoc(doc: StudentDoc): Promise<void> {
  try {
    const response = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save document');
    }
    
    toast.success('Doküman kaydedildi');
  } catch (error) {
    console.error('Error saving document:', error);
    toast.error('Doküman kaydedilemedi');
    throw error;
  }
}

export async function removeDoc(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/documents/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete document');
    }
    
    toast.success('Doküman silindi');
  } catch (error) {
    console.error('Error deleting document:', error);
    toast.error('Doküman silinemedi');
    throw error;
  }
}

export async function loadSurveyResults(): Promise<SurveyResult[]> {
  try {
    const response = await fetch('/api/survey-responses');
    if (!response.ok) {
      throw new Error('Failed to fetch survey results');
    }
    const responses = await response.json();
    
    // Convert database format to legacy SurveyResult format for backward compatibility
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

// Helper function to extract numeric score from response data
function extractScoreFromResponse(responseData: any): number | undefined {
  if (!responseData) return undefined;
  
  // Look for numeric fields that might represent scores
  const values = Object.values(responseData).filter(v => 
    typeof v === 'string' && !isNaN(Number(v))
  ).map(v => Number(v));
  
  if (values.length > 0) {
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }
  
  return undefined;
}

export async function saveSurveyResults(list: SurveyResult[]): Promise<void> {
  // This function is now deprecated - use createSurveyResponse instead
  console.warn('saveSurveyResults is deprecated. Use survey API endpoints directly.');
}

export async function getSurveyResultsByStudent(studentId: string): Promise<SurveyResult[]> {
  try {
    const response = await fetch(`/api/survey-responses?studentId=${encodeURIComponent(studentId)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch student survey results');
    }
    const responses = await response.json();
    
    // Convert database format to legacy SurveyResult format
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
  // Convert legacy SurveyResult to new survey response format
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

export async function loadAcademics(studentId: string): Promise<AcademicRecord[]> {
  try {
    const response = await fetch(`/api/students/${studentId}/academics`);
    if (!response.ok) {
      throw new Error('Failed to fetch academic records');
    }
    const records = await response.json();
    
    // Convert backend format (semester, year) to frontend format (term)
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
    // Parse term to year and semester
    // Support formats: "2024/1", "2024-Güz", "2024-2025/1"
    const termParts = a.term.split('/');
    const yearPart = termParts[0];
    const semester = termParts[1] || yearPart.split('-')[1] || '1';
    
    // Extract first year from formats like "2024" or "2024-2025"
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

export type StudySubject = {
  id: string;
  name: string;
  code?: string;
  description?: string;
  color?: string;
  category?: "LGS" | "YKS" | "TYT" | "AYT" | "YDT";
};
export type StudyTopic = {
  id: string;
  subjectId: string;
  name: string;
  avgMinutes: number;
  order?: number;
};
export type StudyAssignment = {
  id: string;
  studentId: string;
  topicId: string;
  targetPerWeek?: number;
};
export type StudySession = {
  id: string;
  studentId: string;
  topicId: string;
  date: string;
  minutes: number;
};

// Subjects cache
let subjectsCache: StudySubject[] | null = null;

export function loadSubjects(): StudySubject[] {
  // Return cached data if available
  if (subjectsCache !== null) {
    return subjectsCache;
  }
  
  // Load from API asynchronously
  loadSubjectsAsync();
  
  // Return empty array initially
  subjectsCache = [];
  return [];
}

export async function loadSubjectsAsync(): Promise<StudySubject[]> {
  try {
    const response = await fetch('/api/subjects');
    if (!response.ok) {
      throw new Error('Failed to fetch subjects');
    }
    const json = await response.json();
    const subjects = Array.isArray(json) ? json : (Array.isArray(json?.data) ? json.data : []);
    subjectsCache = subjects;
    window.dispatchEvent(new CustomEvent('subjectsUpdated'));
    return subjects;
  } catch (error) {
    console.error('Error fetching subjects:', error);
    toast.error('Dersler yüklenirken hata oluştu');
    if (!subjectsCache || subjectsCache.length === 0) {
      subjectsCache = [];
      window.dispatchEvent(new CustomEvent('subjectsUpdated'));
    }
    return subjectsCache || [];
  }
}

export async function saveSubjects(v: StudySubject[]): Promise<void> {
  try {
    const response = await fetch('/api/subjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(v)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save subjects');
    }
    
    // Update cache and notify listeners
    subjectsCache = v;
    window.dispatchEvent(new CustomEvent('subjectsUpdated'));
    
    toast.success('Dersler kaydedildi');
  } catch (error) {
    console.error('Error saving subjects:', error);
    toast.error('Dersler kaydedilemedi');
    throw error;
  }
}

export async function addSubject(s: StudySubject): Promise<void> {
  const list = loadSubjects();
  list.unshift(s);
  await saveSubjects(list);
  // Refresh from API to ensure consistency
  await loadSubjectsAsync();
}

export async function updateSubject(id: string, patch: Partial<StudySubject>): Promise<void> {
  const list = loadSubjects();
  const i = list.findIndex((x) => x.id === id);
  if (i >= 0) {
    list[i] = { ...list[i], ...patch, id: list[i].id };
    await saveSubjects(list);
    await loadSubjectsAsync();
  }
}
export async function removeSubject(id: string): Promise<void> {
  const list = loadSubjects();
  const filtered = list.filter((s) => s.id !== id);
  await saveSubjects(filtered);
  await loadSubjectsAsync();
}

// Topics cache
let topicsCache: StudyTopic[] | null = null;

export function loadTopics(): StudyTopic[] {
  // Return cached data if available
  if (topicsCache !== null) {
    return topicsCache;
  }
  
  // Load from API asynchronously
  loadTopicsAsync();
  
  // Return empty array initially
  topicsCache = [];
  return [];
}

export async function loadTopicsAsync(): Promise<StudyTopic[]> {
  try {
    const response = await fetch('/api/topics');
    if (!response.ok) {
      throw new Error('Failed to fetch topics');
    }
    const json = await response.json();
    const topics = Array.isArray(json) ? json : (Array.isArray(json?.data) ? json.data : []);
    topicsCache = topics;
    window.dispatchEvent(new CustomEvent('topicsUpdated'));
    return topics;
  } catch (error) {
    console.error('Error fetching topics:', error);
    toast.error('Konular yüklenirken hata oluştu');
    if (!topicsCache || topicsCache.length === 0) {
      topicsCache = [];
      window.dispatchEvent(new CustomEvent('topicsUpdated'));
    }
    return topicsCache || [];
  }
}

export async function saveTopics(v: StudyTopic[]): Promise<void> {
  try {
    const response = await fetch('/api/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(v)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save topics');
    }
    
    // Update cache and notify listeners
    topicsCache = v;
    window.dispatchEvent(new CustomEvent('topicsUpdated'));
    
    toast.success('Konular kaydedildi');
  } catch (error) {
    console.error('Error saving topics:', error);
    toast.error('Konular kaydedilemedi');
    throw error;
  }
}

export async function addTopic(t: StudyTopic): Promise<void> {
  const list = loadTopics();
  list.unshift(t);
  await saveTopics(list);
  // Refresh from API to ensure consistency
  await loadTopicsAsync();
}

export async function updateTopic(id: string, patch: Partial<StudyTopic>): Promise<void> {
  const list = loadTopics();
  const i = list.findIndex((x) => x.id === id);
  if (i >= 0) {
    list[i] = {
      ...list[i],
      ...patch,
      id: list[i].id,
      subjectId: list[i].subjectId,
    };
    await saveTopics(list);
    await loadTopicsAsync();
  }
}

export async function removeTopic(id: string): Promise<void> {
  const list = loadTopics();
  const filtered = list.filter((t) => t.id !== id);
  await saveTopics(filtered);
  await loadTopicsAsync();
}
export function getTopicsBySubject(subjectId: string): StudyTopic[] {
  const topics = loadTopics();
  return topics.filter((t) => t.subjectId === subjectId);
}

export async function removeTopicsBySubject(subjectId: string): Promise<void> {
  const list = loadTopics();
  const filtered = list.filter((t) => t.subjectId !== subjectId);
  await saveTopics(filtered);
  await loadTopicsAsync();
}

// Assignments cache
let assignmentsCache: Map<string, StudyAssignment[]> = new Map();

export function loadAssignments(): StudyAssignment[] {
  // This function is deprecated - use getAssignmentsByStudent instead
  return [];
}

export function saveAssignments(v: StudyAssignment[]) {
  // This function is deprecated - use API directly
  console.warn('saveAssignments is deprecated');
}
export function getAssignmentsByStudent(studentId: string) {
  return loadAssignments().filter((a) => a.studentId === studentId);
}
export function addAssignment(a: StudyAssignment) {
  const list = loadAssignments();
  list.unshift(a);
  saveAssignments(list);
}
export function removeAssignment(id: string) {
  const list = loadAssignments().filter((a) => a.id !== id);
  saveAssignments(list);
}

export type WeeklySlot = {
  id: string;
  studentId: string;
  day: 1 | 2 | 3 | 4 | 5 | 6 | 7; // 1=Pzt ... 7=Paz
  start: string; // HH:MM
  end: string; // HH:MM
  subjectId: string;
};

export type TopicProgress = {
  id: string;
  studentId: string;
  topicId: string;
  completed: number; // minutes
  remaining: number; // minutes
  completedFlag?: boolean; // explicit completion toggle
};

// WeeklySlots cache
let weeklySlotsCache: WeeklySlot[] | null = null;

export function loadWeeklySlots(): WeeklySlot[] {
  // Return cached data if available
  if (weeklySlotsCache !== null) {
    return weeklySlotsCache;
  }
  
  // Load from API asynchronously
  loadWeeklySlotsAsync();
  
  // Return empty array initially
  weeklySlotsCache = [];
  return [];
}

async function loadWeeklySlotsAsync(): Promise<void> {
  try {
    const response = await fetch('/api/weekly-slots');
    if (!response.ok) {
      throw new Error('Failed to fetch weekly slots');
    }
    const json = await response.json();
    const slots = Array.isArray(json) ? json : (Array.isArray(json?.data) ? json.data : []);
    weeklySlotsCache = slots;
    window.dispatchEvent(new CustomEvent('weeklySlotsUpdated'));
  } catch (error) {
    console.error('Error fetching weekly slots:', error);
    toast.error('Haftalık program yüklenirken hata oluştu');
    if (!weeklySlotsCache || weeklySlotsCache.length === 0) {
      weeklySlotsCache = [];
      window.dispatchEvent(new CustomEvent('weeklySlotsUpdated'));
    }
  }
}

export async function saveWeeklySlots(v: WeeklySlot[]): Promise<void> {
  try {
    const response = await fetch('/api/weekly-slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(v)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save weekly slots');
    }
    
    weeklySlotsCache = v;
    window.dispatchEvent(new CustomEvent('weeklySlotsUpdated'));
    toast.success('Haftalık program kaydedildi');
  } catch (error) {
    console.error('Error saving weekly slots:', error);
    toast.error('Haftalık program kaydedilemedi');
    throw error;
  }
}
export function getWeeklySlotsByStudent(studentId: string) {
  return loadWeeklySlots().filter((w) => w.studentId === studentId);
}
export async function addWeeklySlot(w: WeeklySlot): Promise<void> {
  try {
    const response = await fetch('/api/weekly-slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(w)
    });
    
    if (!response.ok) {
      throw new Error('Failed to add weekly slot');
    }
    
    const list = loadWeeklySlots();
    list.push(w);
    weeklySlotsCache = list;
    window.dispatchEvent(new CustomEvent('weeklySlotsUpdated'));
  } catch (error) {
    console.error('Error adding weekly slot:', error);
    toast.error('Haftalık program eklenemedi');
    throw error;
  }
}
export async function removeWeeklySlot(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/weekly-slots/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete weekly slot');
    }
    
    const list = loadWeeklySlots().filter((w) => w.id !== id);
    weeklySlotsCache = list;
    window.dispatchEvent(new CustomEvent('weeklySlotsUpdated'));
  } catch (error) {
    console.error('Error deleting weekly slot:', error);
    toast.error('Haftalık program silinemedi');
    throw error;
  }
}
export async function updateWeeklySlot(id: string, patch: Partial<WeeklySlot>): Promise<void> {
  try {
    const response = await fetch(`/api/weekly-slots/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update weekly slot');
    }
    
    const list = loadWeeklySlots();
    const i = list.findIndex((w) => w.id === id);
    if (i >= 0) {
      list[i] = {
        ...list[i],
        ...patch,
        id: list[i].id,
        studentId: list[i].studentId,
        subjectId: list[i].subjectId,
      };
      weeklySlotsCache = list;
      window.dispatchEvent(new CustomEvent('weeklySlotsUpdated'));
    }
  } catch (error) {
    console.error('Error updating weekly slot:', error);
    toast.error('Haftalık program güncellenemedi');
    throw error;
  }
}

// Progress cache
let progressCache: TopicProgress[] | null = null;

export function loadProgress(): TopicProgress[] {
  // Return cached data if available
  if (progressCache !== null) {
    return progressCache;
  }
  
  // Load from API asynchronously
  loadProgressAsync();
  
  // Return empty array initially
  progressCache = [];
  return [];
}

async function loadProgressAsync(): Promise<void> {
  try {
    const response = await fetch('/api/progress');
    if (!response.ok) {
      throw new Error('Failed to fetch progress');
    }
    const json = await response.json();
    const progress = Array.isArray(json) ? json : (Array.isArray(json?.data) ? json.data : []);
    progressCache = progress;
    window.dispatchEvent(new CustomEvent('progressUpdated'));
  } catch (error) {
    console.error('Error fetching progress:', error);
    toast.error('İlerleme durumu yüklenirken hata oluştu');
    if (!progressCache || progressCache.length === 0) {
      progressCache = [];
      window.dispatchEvent(new CustomEvent('progressUpdated'));
    }
  }
}

export async function saveProgress(v: TopicProgress[]): Promise<void> {
  try {
    const response = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(v)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save progress');
    }
    
    progressCache = v;
    window.dispatchEvent(new CustomEvent('progressUpdated'));
    toast.success('İlerleme durumu kaydedildi');
  } catch (error) {
    console.error('Error saving progress:', error);
    toast.error('İlerleme durumu kaydedilemedi');
    throw error;
  }
}
export function getProgressByStudent(studentId: string) {
  return loadProgress().filter((p) => p.studentId === studentId);
}
export async function ensureProgressForStudent(studentId: string) {
  const topics = loadTopics();
  const list = loadProgress();
  let changed = false;
  for (const t of topics) {
    const exists = list.find(
      (p) => p.studentId === studentId && p.topicId === t.id,
    );
    if (!exists) {
      list.push({
        id: crypto.randomUUID(),
        studentId,
        topicId: t.id,
        completed: 0,
        remaining: t.avgMinutes,
        completedFlag: false,
      });
      changed = true;
    }
  }
  if (changed) await saveProgress(list);
}
export async function resetTopicProgress(studentId: string, topicId: string) {
  const list = loadProgress();
  const p = list.find(
    (x) => x.studentId === studentId && x.topicId === topicId,
  );
  const topics = loadTopics();
  const t = topics.find((tt) => tt.id === topicId);
  if (p && t) {
    p.completed = 0;
    p.remaining = t.avgMinutes;
    p.completedFlag = false;
    await saveProgress(list);
  }
}
export async function updateProgress(
  studentId: string,
  topicId: string,
  minutes: number,
) {
  const list = loadProgress();
  const p = list.find(
    (x) => x.studentId === studentId && x.topicId === topicId,
  );
  const topics = loadTopics();
  const t = topics.find((tt) => tt.id === topicId);
  if (!p || !t) return;
  p.completed += minutes;
  p.remaining = Math.max(0, t.avgMinutes - p.completed);
  p.completedFlag = p.remaining === 0 ? true : p.completedFlag;
  await saveProgress(list);
}
export async function setCompletedFlag(
  studentId: string,
  topicId: string,
  done: boolean,
) {
  const list = loadProgress();
  const p = list.find(
    (x) => x.studentId === studentId && x.topicId === topicId,
  );
  const topics = loadTopics();
  const t = topics.find((tt) => tt.id === topicId);
  if (!p || !t) return;
  p.completedFlag = done;
  if (done) {
    p.completed = t.avgMinutes;
    p.remaining = 0;
  }
  await saveProgress(list);
}

export type PlannedEntry = {
  date: string; // YYYY-MM-DD
  start: string; // HH:MM
  end: string; // HH:MM
  subjectId: string;
  topicId: string;
  allocated: number; // minutes
  remainingAfter: number; // minutes after allocation
};

function minutesBetween(start: string, end: string) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return eh * 60 + em - (sh * 60 + sm);
}

export async function getNextTopicForSubject(
  studentId: string,
  subjectId: string,
): Promise<{ topicId: string; remaining: number } | null> {
  await ensureProgressForStudent(studentId);
  const topics = loadTopics()
    .filter((t) => t.subjectId === subjectId)
    .sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name),
    );
  const progress = getProgressByStudent(studentId);
  for (const t of topics) {
    const p = progress.find((pp) => pp.topicId === t.id);
    if (p && !p.completedFlag && p.remaining > 0) {
      return { topicId: t.id, remaining: p.remaining };
    }
  }
  return null;
}

function dateFromWeekStart(
  weekStartISO: string,
  day: 1 | 2 | 3 | 4 | 5 | 6 | 7,
) {
  const d = new Date(weekStartISO + "T00:00:00");
  const result = new Date(d.getTime() + (day - 1) * 24 * 60 * 60 * 1000);
  return result.toISOString().slice(0, 10);
}

export async function planWeek(
  studentId: string,
  weekStartISO: string,
): Promise<PlannedEntry[]> {
  await ensureProgressForStudent(studentId);
  const slots = getWeeklySlotsByStudent(studentId)
    .slice()
    .sort((a, b) => a.day - b.day || a.start.localeCompare(b.start));
  const out: PlannedEntry[] = [];
  // build in-memory progress snapshot for this student
  const topicsAll = loadTopics();
  const progress = getProgressByStudent(studentId);
  const progMap = new Map<string, { remaining: number; done: boolean }>();
  for (const t of topicsAll) {
    const p = progress.find((pp) => pp.topicId === t.id);
    if (p)
      progMap.set(t.id, { remaining: p.remaining, done: !!p.completedFlag });
  }
  const topicsBySubject = new Map<string, typeof topicsAll>();
  for (const t of topicsAll) {
    const arr = topicsBySubject.get(t.subjectId) || ([] as any);
    arr.push(t);
    topicsBySubject.set(t.subjectId, arr);
  }
  topicsBySubject.forEach((arr, sidKey) => {
    arr.sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name),
    );
  });
  const pickNext = (
    subjectId: string,
  ): { topicId: string; remaining: number } | null => {
    const arr = topicsBySubject.get(subjectId) || [];
    for (const t of arr) {
      const st = progMap.get(t.id);
      if (st && !st.done && st.remaining > 0)
        return { topicId: t.id, remaining: st.remaining };
    }
    return null;
  };

  for (const s of slots) {
    let remain = minutesBetween(s.start, s.end);
    if (remain <= 0) continue;
    let guard = 0;
    // Track current cursor within this slot so consecutive topics chain correctly
    let currentStartMin = minutesBetween("00:00", s.start);
    while (remain > 0 && guard++ < 200) {
      const nxt = pickNext(s.subjectId);
      if (!nxt) break;
      const alloc = Math.min(remain, nxt.remaining);
      const date = dateFromWeekStart(weekStartISO, s.day);
      const startH = String(Math.floor(currentStartMin / 60)).padStart(2, "0");
      const startM = String(currentStartMin % 60).padStart(2, "0");
      const start = `${startH}:${startM}`;
      const endMin = currentStartMin + alloc;
      const endH = String(Math.floor(endMin / 60)).padStart(2, "0");
      const endM = String(endMin % 60).padStart(2, "0");
      const end = `${endH}:${endM}`;
      const st = progMap.get(nxt.topicId)!;
      const remainingAfter = Math.max(0, st.remaining - alloc);
      out.push({
        date,
        start,
        end,
        subjectId: s.subjectId,
        topicId: nxt.topicId,
        allocated: alloc,
        remainingAfter,
      });
      st.remaining = remainingAfter;
      if (st.remaining === 0) st.done = true;
      remain -= alloc;
      currentStartMin = endMin; // advance cursor within this slot
    }
  }
  return out;
}

export function weeklyTotalMinutes(studentId: string) {
  return getWeeklySlotsByStudent(studentId).reduce(
    (sum, s) => sum + minutesBetween(s.start, s.end),
    0,
  );
}

export async function loadSessions(): Promise<StudySession[]> {
  try {
    const response = await fetch('/api/study-sessions/all');
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error('Error loading study sessions:', error);
    return [];
  }
}

export async function getSessionsByStudent(studentId: string): Promise<StudySession[]> {
  try {
    const response = await fetch(`/api/study-sessions/${studentId}`);
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error('Error getting study sessions:', error);
    return [];
  }
}

export async function addSession(s: StudySession): Promise<void> {
  try {
    const response = await fetch('/api/study-sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(s)
    });
    if (!response.ok) {
      throw new Error('Failed to save study session');
    }
    toast.success('Çalışma oturumu kaydedildi');
  } catch (error) {
    console.error('Error saving study session:', error);
    toast.error('Çalışma oturumu kaydedilemedi');
    throw error;
  }
}

// ========== DIJITAL KOÇLUK ÖZELLIKLERI ==========

// Akademik Hedefler (YKS/LGS)
export type AcademicGoal = {
  id: string;
  studentId: string;
  examType: "YKS" | "LGS" | "TYT" | "AYT" | "YDT" | "OKUL";
  targetScore?: number;
  currentScore?: number;
  targetRank?: number;
  currentRank?: number;
  targetUniversity?: string;
  targetDepartment?: string;
  deadline: string; // ISO date
  notes?: string;
  createdAt: string; // ISO
};

// Kişilik Profili - Çoklu Zeka
export type MultipleIntelligence = {
  id: string;
  studentId: string;
  linguistic: number; // 1-10
  logicalMathematical: number;
  spatial: number;
  musicalRhythmic: number;
  bodilyKinesthetic: number;
  interpersonal: number;
  intrapersonal: number;
  naturalistic: number;
  existential: number;
  assessmentDate: string; // ISO
  notes?: string;
};

// Öğrenme Stili
export type LearningStyle = {
  id: string;
  studentId: string;
  visual: number; // 1-10 (görsel)
  auditory: number; // (işitsel)
  kinesthetic: number; // (dokunsal/hareket)
  readingWriting: number; // (okuma/yazma)
  preferredStudyTime: "sabah" | "öğlen" | "akşam" | "gece";
  studyEnvironment: "sessiz" | "hafifMüzik" | "grupla" | "yalnız";
  assessmentDate: string; // ISO
  notes?: string;
};

// SMART Hedefler
export type SmartGoal = {
  id: string;
  studentId: string;
  title: string;
  description: string;
  specific: string; // Ne yapılacak?
  measurable: string; // Nasıl ölçülecek?
  achievable: string; // Nasıl başarılacak?
  relevant: string; // Neden önemli?
  timeBound: string; // Zaman sınırı
  priority: "Düşük" | "Orta" | "Yüksek" | "Kritik";
  status: "Planlandı" | "Başladı" | "Devam" | "Tamamlandı" | "Ertelendi";
  progress: number; // 0-100
  startDate: string; // ISO
  targetDate: string; // ISO
  completedDate?: string; // ISO
  milestones?: { title: string; completed: boolean; date?: string }[];
  notes?: string;
  createdAt: string; // ISO
};

// Koçluk Önerileri
export type CoachingRecommendation = {
  id: string;
  studentId: string;
  type: "AKADEMIK" | "KISISEL" | "SOSYAL" | "MOTIVASYON" | "ÇALIŞMA_TEKNİĞİ";
  title: string;
  description: string;
  priority: "Düşük" | "Orta" | "Yüksek";
  automated: boolean; // AI/sistem önerisi mi
  implementationSteps?: string[];
  resources?: { title: string; url?: string; type: "video" | "makale" | "kitap" | "uygulama" }[];
  targetCompletionDate?: string;
  status: "Öneri" | "Kabul" | "Uygulama" | "Tamamlandı" | "İptal";
  createdAt: string; // ISO
  implementedAt?: string; // ISO
  completedAt?: string; // ISO
  feedback?: string;
};

// 360 Derece Değerlendirme
export type Evaluation360 = {
  id: string;
  studentId: string;
  evaluatorType: "ÖĞRENCI" | "VELI" | "ÖĞRETMEN" | "AKRAN";
  evaluatorName?: string;
  academicPerformance: number; // 1-10
  socialSkills: number;
  communication: number;
  leadership: number;
  teamwork: number;
  selfConfidence: number;
  motivation: number;
  timeManagement: number;
  problemSolving: number;
  creativity: number;
  overallRating: number;
  strengths?: string[];
  improvementAreas?: string[];
  comments?: string;
  evaluationDate: string; // ISO
};

// Başarı Rozetleri/Ödüller
export type Achievement = {
  id: string;
  studentId: string;
  type: "ROZETLeR" | "İLERLEME" | "MILESTONE" | "ÖZEL";
  title: string;
  description: string;
  icon: string; // lucide-react icon adı
  color: string; // CSS rengi
  points?: number;
  earnedAt: string; // ISO
  category: "AKADEMİK" | "SOSYAL" | "KİŞİSEL" | "ÇALIŞMA" | "HEDEFLeR";
  criteria?: string; // Nasıl kazanıldı?
};

// Öğrenci Self-Değerlendirme
export type SelfAssessment = {
  id: string;
  studentId: string;
  moodRating: number; // 1-10 (ruh hali)
  motivationLevel: number; // 1-10
  stressLevel: number; // 1-10
  confidenceLevel: number; // 1-10
  studyDifficulty: number; // 1-10
  socialInteraction: number; // 1-10
  sleepQuality: number; // 1-10
  physicalActivity: number; // 1-10
  dailyGoalsAchieved: number; // 0-100%
  todayHighlight?: string; // Günün en iyi yanı
  todayChallenge?: string; // Günün zorluğu
  tomorrowGoal?: string; // Yarın için hedef
  notes?: string;
  assessmentDate: string; // ISO date (YYYY-MM-DD)
};

// ========== AİLE İLETİŞİMİ ÖZELLİKLERİ ==========

// Veli Görüşme Kayıtları
export type ParentMeeting = {
  id: string;
  studentId: string;
  date: string; // ISO
  time: string; // HH:MM
  type: "YÜZ_YÜZE" | "TELEFON" | "ONLINE" | "EV_ZİYARETİ";
  participants: string[]; // Katılımcılar (Veli adları, öğretmenler)
  mainTopics: string[]; // Ana konular
  concerns?: string; // Endişeler/Sorunlar
  decisions?: string; // Alınan kararlar
  actionPlan?: string; // Eylem planı
  nextMeetingDate?: string; // Sonraki görüşme tarihi
  parentSatisfaction?: number; // 1-10 (veli memnuniyeti)
  followUpRequired: boolean;
  notes?: string;
  createdBy: string; // Kaydı oluşturan kişi
  createdAt: string; // ISO
};

// Ev Ziyareti Notları
export type HomeVisit = {
  id: string;
  studentId: string;
  date: string; // ISO
  time: string; // HH:MM
  visitDuration: number; // dakika
  visitors: string[]; // Ziyaretçiler (öğretmen/danışman adları)
  familyPresent: string[]; // Ev'de bulunanlar
  homeEnvironment: "UYGUN" | "ORTA" | "ZOR_KOŞULLAR" | "DEĞERLENDİRİLEMEDİ";
  familyInteraction: "OLUMLU" | "NORMAL" | "GERGİN" | "İŞBİRLİKSİZ";
  observations: string; // Gözlemler
  recommendations: string; // Öneriler
  concerns?: string; // Tespit edilen sorunlar
  resources?: string; // Sağlanan kaynaklar/yardımlar
  followUpActions?: string; // Takip edilecek konular
  nextVisitPlanned?: string; // Sonraki ziyaret tarihi
  notes?: string;
  createdBy: string;
  createdAt: string; // ISO
};

// Aile Katılım Durumu
export type FamilyParticipation = {
  id: string;
  studentId: string;
  eventType: "VELI_TOPLANTISI" | "OKUL_ETKİNLİĞİ" | "ÖĞRETMEN_GÖRÜŞMESİ" | "PERFORMANS_DEĞERLENDİRME" | "DİĞER";
  eventName: string;
  eventDate: string; // ISO
  participationStatus: "KATILDI" | "KATILMADI" | "GEÇ_KATILDI" | "ERKEN_AYRILDI";
  participants?: string[]; // Katılan aile üyeleri
  engagementLevel: "ÇOK_AKTİF" | "AKTİF" | "PASİF" | "İLGİSİZ"; // Katılım düzeyi
  communicationFrequency: "GÜNLÜK" | "HAFTALIK" | "AYLIK" | "SADECE_GEREKENDE"; // İletişim sıklığı
  preferredContactMethod: "TELEFON" | "EMAIL" | "WHATSAPP" | "YÜZ_YÜZE" | "OKUL_SISTEMI";
  parentAvailability?: string; // Müsait olduğu zamanlar
  notes?: string;
  recordedBy: string;
  recordedAt: string; // ISO
};

// Academic Goals functions - migrated to API
export async function loadAcademicGoals(): Promise<AcademicGoal[]> {
  try {
    const response = await fetch('/api/coaching/academic-goals');
    if (!response.ok) throw new Error('Failed to fetch academic goals');
    return await response.json();
  } catch (error) {
    console.error('Error loading academic goals:', error);
    toast.error('Akademik hedefler yüklenirken hata oluştu');
    return [];
  }
}

export async function saveAcademicGoals(list: AcademicGoal[]): Promise<void> {
  console.warn('saveAcademicGoals deprecated. Use addAcademicGoal or updateAcademicGoal instead.');
}

export async function getAcademicGoalsByStudent(studentId: string): Promise<AcademicGoal[]> {
  try {
    const response = await fetch(`/api/coaching/academic-goals/student/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch student academic goals');
    return await response.json();
  } catch (error) {
    console.error('Error loading student academic goals:', error);
    toast.error('Öğrenci akademik hedefleri yüklenirken hata oluştu');
    return [];
  }
}

export async function addAcademicGoal(goal: AcademicGoal): Promise<void> {
  try {
    const response = await fetch('/api/coaching/academic-goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goal)
    });
    if (!response.ok) throw new Error('Failed to add academic goal');
    toast.success('Akademik hedef eklendi');
  } catch (error) {
    console.error('Error adding academic goal:', error);
    toast.error('Akademik hedef eklenemedi');
    throw error;
  }
}

export async function updateAcademicGoal(id: string, updates: Partial<AcademicGoal>): Promise<void> {
  try {
    const response = await fetch(`/api/coaching/academic-goals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update academic goal');
    toast.success('Akademik hedef güncellendi');
  } catch (error) {
    console.error('Error updating academic goal:', error);
    toast.error('Akademik hedef güncellenemedi');
    throw error;
  }
}

// Multiple Intelligence functions - migrated to API
export async function loadMultipleIntelligence(): Promise<MultipleIntelligence[]> {
  console.warn('loadMultipleIntelligence deprecated. Use getMultipleIntelligenceByStudent instead.');
  return [];
}

export async function saveMultipleIntelligence(list: MultipleIntelligence[]): Promise<void> {
  console.warn('saveMultipleIntelligence deprecated. Use addMultipleIntelligence instead.');
}

export async function getMultipleIntelligenceByStudent(studentId: string): Promise<MultipleIntelligence | undefined> {
  try {
    const response = await fetch(`/api/coaching/multiple-intelligence/student/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch multiple intelligence');
    const records = await response.json();
    return records[0]; // En son değerlendirmeyi getir
  } catch (error) {
    console.error('Error loading multiple intelligence:', error);
    toast.error('Çoklu zeka verileri yüklenirken hata oluştu');
    return undefined;
  }
}

export async function addMultipleIntelligence(mi: MultipleIntelligence): Promise<void> {
  try {
    const response = await fetch('/api/coaching/multiple-intelligence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mi)
    });
    if (!response.ok) throw new Error('Failed to add multiple intelligence');
    toast.success('Çoklu zeka değerlendirmesi eklendi');
  } catch (error) {
    console.error('Error adding multiple intelligence:', error);
    toast.error('Çoklu zeka değerlendirmesi eklenemedi');
    throw error;
  }
}

// Learning Style functions - migrated to API
export async function loadLearningStyles(): Promise<LearningStyle[]> {
  console.warn('loadLearningStyles deprecated. Use getLearningStyleByStudent instead.');
  return [];
}

export async function saveLearningStyles(list: LearningStyle[]): Promise<void> {
  console.warn('saveLearningStyles deprecated. Use addLearningStyle instead.');
}

export async function getLearningStyleByStudent(studentId: string): Promise<LearningStyle | undefined> {
  try {
    const response = await fetch(`/api/coaching/learning-styles/student/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch learning styles');
    const records = await response.json();
    return records[0]; // En son değerlendirmeyi getir
  } catch (error) {
    console.error('Error loading learning styles:', error);
    toast.error('Öğrenme stilleri yüklenirken hata oluştu');
    return undefined;
  }
}

export async function addLearningStyle(ls: LearningStyle): Promise<void> {
  try {
    const response = await fetch('/api/coaching/learning-styles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ls)
    });
    if (!response.ok) throw new Error('Failed to add learning style');
    toast.success('Öğrenme stili eklendi');
  } catch (error) {
    console.error('Error adding learning style:', error);
    toast.error('Öğrenme stili eklenemedi');
    throw error;
  }
}

// SMART Goals functions - migrated to API
export async function loadSmartGoals(): Promise<SmartGoal[]> {
  console.warn('loadSmartGoals deprecated. Use getSmartGoalsByStudent instead.');
  return [];
}

export async function saveSmartGoals(list: SmartGoal[]): Promise<void> {
  console.warn('saveSmartGoals deprecated. Use addSmartGoal or updateSmartGoal instead.');
}

export async function getSmartGoalsByStudent(studentId: string): Promise<SmartGoal[]> {
  try {
    const response = await fetch(`/api/coaching/smart-goals/student/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch smart goals');
    return await response.json();
  } catch (error) {
    console.error('Error loading smart goals:', error);
    toast.error('SMART hedefler yüklenirken hata oluştu');
    return [];
  }
}

export async function addSmartGoal(goal: SmartGoal): Promise<void> {
  try {
    const response = await fetch('/api/coaching/smart-goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goal)
    });
    if (!response.ok) throw new Error('Failed to add smart goal');
    toast.success('SMART hedef eklendi');
  } catch (error) {
    console.error('Error adding smart goal:', error);
    toast.error('SMART hedef eklenemedi');
    throw error;
  }
}

export async function updateSmartGoal(id: string, updates: Partial<SmartGoal>): Promise<void> {
  try {
    const response = await fetch(`/api/coaching/smart-goals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update smart goal');
    toast.success('SMART hedef güncellendi');
  } catch (error) {
    console.error('Error updating smart goal:', error);
    toast.error('SMART hedef güncellenemedi');
    throw error;
  }
}

// Coaching Recommendations functions - migrated to API
export async function loadCoachingRecommendations(): Promise<CoachingRecommendation[]> {
  console.warn('loadCoachingRecommendations deprecated. Use getCoachingRecommendationsByStudent instead.');
  return [];
}

export async function saveCoachingRecommendations(list: CoachingRecommendation[]): Promise<void> {
  console.warn('saveCoachingRecommendations deprecated. Use addCoachingRecommendation instead.');
}

export async function getCoachingRecommendationsByStudent(studentId: string): Promise<CoachingRecommendation[]> {
  try {
    const response = await fetch(`/api/coaching/coaching-recommendations/student/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch coaching recommendations');
    return await response.json();
  } catch (error) {
    console.error('Error loading coaching recommendations:', error);
    toast.error('Koçluk önerileri yüklenirken hata oluştu');
    return [];
  }
}

export async function addCoachingRecommendation(rec: CoachingRecommendation): Promise<void> {
  try {
    const response = await fetch('/api/coaching/coaching-recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rec)
    });
    if (!response.ok) throw new Error('Failed to add coaching recommendation');
    toast.success('Koçluk önerisi eklendi');
  } catch (error) {
    console.error('Error adding coaching recommendation:', error);
    toast.error('Koçluk önerisi eklenemedi');
    throw error;
  }
}

export async function updateCoachingRecommendation(id: string, updates: Partial<CoachingRecommendation>): Promise<void> {
  try {
    const response = await fetch(`/api/coaching/coaching-recommendations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update coaching recommendation');
    toast.success('Koçluk önerisi güncellendi');
  } catch (error) {
    console.error('Error updating coaching recommendation:', error);
    toast.error('Koçluk önerisi güncellenemedi');
    throw error;
  }
}

// 360 Evaluation functions - migrated to API
export async function loadEvaluations360(): Promise<Evaluation360[]> {
  console.warn('loadEvaluations360 deprecated. Use getEvaluations360ByStudent instead.');
  return [];
}

export async function saveEvaluations360(list: Evaluation360[]): Promise<void> {
  console.warn('saveEvaluations360 deprecated. Use addEvaluation360 instead.');
}

export async function getEvaluations360ByStudent(studentId: string): Promise<Evaluation360[]> {
  try {
    const response = await fetch(`/api/coaching/evaluations-360/student/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch 360 evaluations');
    return await response.json();
  } catch (error) {
    console.error('Error loading 360 evaluations:', error);
    toast.error('360 değerlendirmeler yüklenirken hata oluştu');
    return [];
  }
}

export async function addEvaluation360(evaluation: Evaluation360): Promise<void> {
  try {
    const response = await fetch('/api/coaching/evaluations-360', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evaluation)
    });
    if (!response.ok) throw new Error('Failed to add 360 evaluation');
    toast.success('360 değerlendirme eklendi');
  } catch (error) {
    console.error('Error adding 360 evaluation:', error);
    toast.error('360 değerlendirme eklenemedi');
    throw error;
  }
}

// Achievements functions - migrated to API
export async function loadAchievements(): Promise<Achievement[]> {
  console.warn('loadAchievements deprecated. Use getAchievementsByStudent instead.');
  return [];
}

export async function saveAchievements(list: Achievement[]): Promise<void> {
  console.warn('saveAchievements deprecated. Use addAchievement instead.');
}

export async function getAchievementsByStudent(studentId: string): Promise<Achievement[]> {
  try {
    const response = await fetch(`/api/coaching/achievements/student/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch achievements');
    return await response.json();
  } catch (error) {
    console.error('Error loading achievements:', error);
    toast.error('Başarılar yüklenirken hata oluştu');
    return [];
  }
}

export async function addAchievement(achievement: Achievement): Promise<void> {
  try {
    const response = await fetch('/api/coaching/achievements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(achievement)
    });
    if (!response.ok) throw new Error('Failed to add achievement');
    toast.success('Başarı eklendi');
  } catch (error) {
    console.error('Error adding achievement:', error);
    toast.error('Başarı eklenemedi');
    throw error;
  }
}

// Self Assessment functions - migrated to API
export async function loadSelfAssessments(): Promise<SelfAssessment[]> {
  console.warn('loadSelfAssessments deprecated. Use getSelfAssessmentsByStudent instead.');
  return [];
}

export async function saveSelfAssessments(list: SelfAssessment[]): Promise<void> {
  console.warn('saveSelfAssessments deprecated. Use addSelfAssessment instead.');
}

export async function getSelfAssessmentsByStudent(studentId: string): Promise<SelfAssessment[]> {
  try {
    const response = await fetch(`/api/coaching/self-assessments/student/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch self assessments');
    return await response.json();
  } catch (error) {
    console.error('Error loading self assessments:', error);
    toast.error('Öz değerlendirmeler yüklenirken hata oluştu');
    return [];
  }
}

export async function addSelfAssessment(assessment: SelfAssessment): Promise<void> {
  try {
    const response = await fetch('/api/coaching/self-assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assessment)
    });
    if (!response.ok) throw new Error('Failed to add self assessment');
    toast.success('Öz değerlendirme eklendi');
  } catch (error) {
    console.error('Error adding self assessment:', error);
    toast.error('Öz değerlendirme eklenemedi');
    throw error;
  }
}

export async function getTodaysSelfAssessment(studentId: string): Promise<SelfAssessment | undefined> {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const assessments = await getSelfAssessmentsByStudent(studentId);
    return assessments.find(sa => sa.assessmentDate === today);
  } catch (error) {
    console.error('Error getting today\'s self assessment:', error);
    return undefined;
  }
}

// Utility functions for coaching features
export async function generateAutoRecommendations(studentId: string): Promise<CoachingRecommendation[]> {
  const recommendations: CoachingRecommendation[] = [];
  const now = new Date().toISOString();
  
  // Risk seviyesine göre otomatik öneriler
  const students = loadStudents();
  const student = students.find(s => s.id === studentId);
  if (!student) return recommendations;

  if (student.risk === "Yüksek") {
    recommendations.push({
      id: crypto.randomUUID(),
      studentId,
      type: "MOTIVASYON",
      title: "Acil Motivasyon Desteği",
      description: "Yüksek risk seviyesinde olan öğrenci için özel motivasyon stratejileri uygulanmalı.",
      priority: "Yüksek",
      automated: true,
      implementationSteps: [
        "Bireysel görüşme planla",
        "Öğrencinin ilgi alanlarını tespit et",
        "Kısa vadeli başarılabilir hedefler belirle",
        "Düzenli takip planı oluştur"
      ],
      status: "Öneri",
      createdAt: now
    });
  }

  // Devamsızlık kontrolü
  const attendance = await getAttendanceByStudent(studentId);
  const recentAbsences = attendance.filter(a => 
    a.status === "Devamsız" && 
    Date.now() - new Date(a.date).getTime() <= 7 * 24 * 60 * 60 * 1000
  ).length;

  if (recentAbsences >= 2) {
    recommendations.push({
      id: crypto.randomUUID(),
      studentId,
      type: "SOSYAL",
      title: "Devamsızlık Takip Programı",
      description: "Son hafta içinde 2 veya daha fazla devamsızlık tespit edildi.",
      priority: "Yüksek",
      automated: true,
      implementationSteps: [
        "Devamsızlık sebeplerini araştır",
        "Veli ile iletişime geç",
        "Okula uyum programı planla"
      ],
      status: "Öneri",
      createdAt: now
    });
  }

  return recommendations;
}

// ========== AİLE İLETİŞİMİ FONKSİYONLARI - MIGRATED TO API ==========

// Parent Meeting functions - migrated to API
export async function loadParentMeetings(): Promise<ParentMeeting[]> {
  console.warn('loadParentMeetings deprecated. Use getParentMeetingsByStudent instead.');
  return [];
}

export async function saveParentMeetings(list: ParentMeeting[]): Promise<void> {
  console.warn('saveParentMeetings deprecated. Use addParentMeeting instead.');
}

export async function getParentMeetingsByStudent(studentId: string): Promise<ParentMeeting[]> {
  try {
    const response = await fetch(`/api/coaching/parent-meetings/student/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch parent meetings');
    return await response.json();
  } catch (error) {
    console.error('Error loading parent meetings:', error);
    toast.error('Veli görüşmeleri yüklenirken hata oluştu');
    return [];
  }
}

export async function addParentMeeting(meeting: ParentMeeting): Promise<void> {
  try {
    const response = await fetch('/api/coaching/parent-meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meeting)
    });
    if (!response.ok) throw new Error('Failed to add parent meeting');
    toast.success('Veli görüşmesi eklendi');
  } catch (error) {
    console.error('Error adding parent meeting:', error);
    toast.error('Veli görüşmesi eklenemedi');
    throw error;
  }
}

export async function updateParentMeeting(id: string, updates: Partial<ParentMeeting>): Promise<void> {
  try {
    const response = await fetch(`/api/coaching/parent-meetings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update parent meeting');
    toast.success('Veli görüşmesi güncellendi');
  } catch (error) {
    console.error('Error updating parent meeting:', error);
    toast.error('Veli görüşmesi güncellenemedi');
    throw error;
  }
}

// Home Visit functions - migrated to API
export async function loadHomeVisits(): Promise<HomeVisit[]> {
  console.warn('loadHomeVisits deprecated. Use getHomeVisitsByStudent instead.');
  return [];
}

export async function saveHomeVisits(list: HomeVisit[]): Promise<void> {
  console.warn('saveHomeVisits deprecated. Use addHomeVisit instead.');
}

export async function getHomeVisitsByStudent(studentId: string): Promise<HomeVisit[]> {
  try {
    const response = await fetch(`/api/coaching/home-visits/student/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch home visits');
    return await response.json();
  } catch (error) {
    console.error('Error loading home visits:', error);
    toast.error('Ev ziyaretleri yüklenirken hata oluştu');
    return [];
  }
}

export async function addHomeVisit(visit: HomeVisit): Promise<void> {
  try {
    const response = await fetch('/api/coaching/home-visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(visit)
    });
    if (!response.ok) throw new Error('Failed to add home visit');
    toast.success('Ev ziyareti eklendi');
  } catch (error) {
    console.error('Error adding home visit:', error);
    toast.error('Ev ziyareti eklenemedi');
    throw error;
  }
}

export async function updateHomeVisit(id: string, updates: Partial<HomeVisit>): Promise<void> {
  try {
    const response = await fetch(`/api/coaching/home-visits/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update home visit');
    toast.success('Ev ziyareti güncellendi');
  } catch (error) {
    console.error('Error updating home visit:', error);
    toast.error('Ev ziyareti güncellenemedi');
    throw error;
  }
}

// Family Participation functions - migrated to API
export async function loadFamilyParticipation(): Promise<FamilyParticipation[]> {
  console.warn('loadFamilyParticipation deprecated. Use getFamilyParticipationByStudent instead.');
  return [];
}

export async function saveFamilyParticipation(list: FamilyParticipation[]): Promise<void> {
  console.warn('saveFamilyParticipation deprecated. Use addFamilyParticipation instead.');
}

export async function getFamilyParticipationByStudent(studentId: string): Promise<FamilyParticipation[]> {
  try {
    const response = await fetch(`/api/coaching/family-participation/student/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch family participation');
    return await response.json();
  } catch (error) {
    console.error('Error loading family participation:', error);
    toast.error('Aile katılım durumu yüklenirken hata oluştu');
    return [];
  }
}

export async function addFamilyParticipation(participation: FamilyParticipation): Promise<void> {
  try {
    const response = await fetch('/api/coaching/family-participation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(participation)
    });
    if (!response.ok) throw new Error('Failed to add family participation');
    toast.success('Aile katılım durumu eklendi');
  } catch (error) {
    console.error('Error adding family participation:', error);
    toast.error('Aile katılım durumu eklenemedi');
    throw error;
  }
}

export async function updateFamilyParticipation(id: string, updates: Partial<FamilyParticipation>): Promise<void> {
  try {
    const response = await fetch(`/api/coaching/family-participation/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update family participation');
    toast.success('Aile katılım durumu güncellendi');
  } catch (error) {
    console.error('Error updating family participation:', error);
    toast.error('Aile katılım durumu güncellenemedi');
    throw error;
  }
}

// ========== NEW COMPREHENSIVE TRACKING FUNCTIONS ==========

// Health Info functions
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

// Special Education functions
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

// Risk Factors functions
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

// Behavior Incidents functions
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

// Exam Results functions
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

function defaultSeed(): Student[] {
  return [
    {
      id: "1001",
      ad: "Ayşe",
      soyad: "Yılmaz",
      sinif: "9/A",
      cinsiyet: "K",
      risk: "Düşük",
      telefon: "+90 555 111 22 33",
      veliAdi: "Fatma Yılmaz",
      veliTelefon: "+90 555 000 11 22",
    },
    {
      id: "1002",
      ad: "Mehmet",
      soyad: "Demir",
      sinif: "10/B",
      cinsiyet: "E",
      risk: "Orta",
      telefon: "+90 555 333 44 55",
    },
    {
      id: "1003",
      ad: "Zeynep",
      soyad: "Kaya",
      sinif: "11/C",
      cinsiyet: "K",
      risk: "Yüksek",
    },
    {
      id: "1004",
      ad: "Ali",
      soyad: "Çelik",
      sinif: "12/A",
      cinsiyet: "E",
      risk: "Düşük",
    },
  ];
}
