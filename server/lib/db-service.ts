import getDatabase, { initializeDatabase } from './database.js';

import { SurveyTemplate } from '../types/survey-types.js';

// Prepared statements - optimized initialization
interface DatabaseStatements {
  // Students
  getStudents: any;
  getStudent: any;
  insertStudent: any;
  upsertStudent: any;
  updateStudent: any;
  deleteStudent: any;
  
  // Academic Records
  getAcademicsByStudent: any;
  insertAcademic: any;
  
  // Subjects
  getSubjects: any;
  getSubject: any;
  insertSubject: any;
  updateSubject: any;
  deleteSubject: any;
  upsertSubject: any;
  
  // Topics
  getTopics: any;
  getTopicsBySubject: any;
  getTopic: any;
  insertTopic: any;
  updateTopic: any;
  deleteTopic: any;
  upsertTopic: any;
  
  // Progress
  getAllProgress: any;
  getProgress: any;
  getProgressByStudent: any;
  insertProgress: any;
  updateProgress: any;
  upsertProgress: any;
  
  // Academic Goals
  getAcademicGoalsByStudent: any;
  insertAcademicGoal: any;
  updateAcademicGoal: any;
  upsertAcademicGoal: any;
  deleteAcademicGoal: any;
  
  // Survey Templates
  getSurveyTemplates: any;
  getSurveyTemplate: any;
  insertSurveyTemplate: any;
  updateSurveyTemplate: any;
  deleteSurveyTemplate: any;
  
  // Survey Questions
  getQuestionsByTemplate: any;
  insertSurveyQuestion: any;
  updateSurveyQuestion: any;
  deleteSurveyQuestion: any;
  deleteQuestionsByTemplate: any;
  
  // Survey Distributions
  getSurveyDistributions: any;
  getSurveyDistribution: any;
  getSurveyDistributionByLink: any;
  insertSurveyDistribution: any;
  updateSurveyDistribution: any;
  deleteSurveyDistribution: any;
  
  // Survey Responses
  getSurveyResponses: any;
  getSurveyResponse: any;
  getSurveyResponsesByDistribution: any;
  getSurveyResponsesByStudent: any;
  insertSurveyResponse: any;
  updateSurveyResponse: any;
  deleteSurveyResponse: any;
  
  // Legacy Surveys
  getSurveysByStudent: any;
  insertSurvey: any;
  updateSurvey: any;
  
  // Study Sessions
  getStudySessionsByStudent: any;
  insertStudySession: any;
  
  // Notes
  getNotesByStudent: any;
  insertNote: any;
  updateNote: any;
  deleteNote: any;
  
  // Attendance
  getAttendanceByStudent: any;
  insertAttendance: any;
  
  // Interventions
  getInterventionsByStudent: any;
  insertIntervention: any;
  updateIntervention: any;
  
  // Meeting Notes
  getMeetingNotesByStudent: any;
  getMeetingNote: any;
  insertMeetingNote: any;
  updateMeetingNote: any;
  deleteMeetingNote: any;
  
  // Student Documents
  getDocumentsByStudent: any;
  getDocument: any;
  insertDocument: any;
  deleteDocument: any;
  
  // App Settings
  getAppSettings: any;
  upsertAppSettings: any;
  
  // Study Assignments
  getStudyAssignmentsByStudent: any;
  insertStudyAssignment: any;
  updateStudyAssignment: any;
  deleteStudyAssignment: any;
  
  // Weekly Slots
  getAllWeeklySlots: any;
  getWeeklySlotsByStudent: any;
  insertWeeklySlot: any;
  updateWeeklySlot: any;
  deleteWeeklySlot: any;
  
  // User Sessions
  getUserSession: any;
  upsertUserSession: any;
  updateUserSessionActivity: any;
  deleteUserSession: any;
}

let statements: DatabaseStatements | null = null;
let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

// Database operation result wrapper for consistent error handling
interface DbResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Centralized database error handler
function handleDbError(operation: string, error: unknown): DbResult<null> {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`Database error in ${operation}:`, errorMessage);
  return { success: false, error: errorMessage };
}

// Optimized initialization - use singleton pattern to avoid repeated calls
function ensureInitialized(): void {
  if (isInitialized) return;
  
  // Prevent concurrent initialization attempts
  if (initializationPromise) {
    // For synchronous compatibility, we'll initialize immediately if needed
    return;
  }
  
  initializeStatements();
}

function initializeStatements(): void {
  try {
    // Initialize database schema first
    initializeDatabase();
    
    // Get the database instance
    const db = getDatabase();
    
    // Prepared statements oluştur (veritabanı zaten database.ts'de başlatıldı)
    statements = {
  // Students
  getStudents: db.prepare('SELECT * FROM students ORDER BY name'),
  getStudent: db.prepare('SELECT * FROM students WHERE id = ?'),
  insertStudent: db.prepare(`
    INSERT INTO students (id, name, email, phone, birthDate, address, className, enrollmentDate, status, avatar, parentContact, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  upsertStudent: db.prepare(`
    INSERT INTO students (id, name, email, phone, birthDate, address, className, enrollmentDate, status, avatar, parentContact, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      email = excluded.email,
      phone = excluded.phone,
      birthDate = excluded.birthDate,
      address = excluded.address,
      className = excluded.className,
      status = excluded.status,
      avatar = excluded.avatar,
      parentContact = excluded.parentContact,
      notes = excluded.notes
  `),
  updateStudent: db.prepare(`
    UPDATE students SET name = ?, email = ?, phone = ?, birthDate = ?, address = ?, className = ?, 
                       status = ?, avatar = ?, parentContact = ?, notes = ?
    WHERE id = ?
  `),
  deleteStudent: db.prepare('DELETE FROM students WHERE id = ?'),

  // Academic Records
  getAcademicsByStudent: db.prepare('SELECT * FROM academic_records WHERE studentId = ? ORDER BY year DESC, semester DESC'),
  insertAcademic: db.prepare(`
    INSERT INTO academic_records (studentId, semester, gpa, year, exams, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `),

  // Subjects
  getSubjects: db.prepare('SELECT * FROM subjects ORDER BY name'),
  getSubject: db.prepare('SELECT * FROM subjects WHERE id = ?'),
  insertSubject: db.prepare('INSERT INTO subjects (id, name, code, description, color, category) VALUES (?, ?, ?, ?, ?, ?)'),
  updateSubject: db.prepare('UPDATE subjects SET name = ?, code = ?, description = ?, color = ?, category = ? WHERE id = ?'),
  deleteSubject: db.prepare('DELETE FROM subjects WHERE id = ?'),
  upsertSubject: db.prepare(`
    INSERT INTO subjects (id, name, code, description, color, category)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      code = excluded.code,
      description = excluded.description,
      color = excluded.color,
      category = excluded.category
  `),

  // Topics
  getTopics: db.prepare('SELECT * FROM topics ORDER BY name'),
  getTopicsBySubject: db.prepare('SELECT * FROM topics WHERE subjectId = ? ORDER BY name'),
  getTopic: db.prepare('SELECT * FROM topics WHERE id = ?'),
  insertTopic: db.prepare('INSERT INTO topics (id, subjectId, name, description, difficulty, estimatedHours, avgMinutes, "order", energyLevel, difficultyScore, priority, deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'),
  updateTopic: db.prepare('UPDATE topics SET name = ?, description = ?, difficulty = ?, estimatedHours = ?, avgMinutes = ?, "order" = ?, energyLevel = ?, difficultyScore = ?, priority = ?, deadline = ? WHERE id = ?'),
  deleteTopic: db.prepare('DELETE FROM topics WHERE id = ?'),
  upsertTopic: db.prepare(`
    INSERT INTO topics (id, subjectId, name, description, difficulty, estimatedHours, avgMinutes, "order", energyLevel, difficultyScore, priority, deadline)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      subjectId = excluded.subjectId,
      name = excluded.name,
      description = excluded.description,
      difficulty = excluded.difficulty,
      estimatedHours = excluded.estimatedHours,
      avgMinutes = excluded.avgMinutes,
      "order" = excluded."order",
      energyLevel = excluded.energyLevel,
      difficultyScore = excluded.difficultyScore,
      priority = excluded.priority,
      deadline = excluded.deadline
  `),

  // Progress
  getAllProgress: db.prepare('SELECT * FROM progress ORDER BY lastStudied DESC'),
  getProgressByStudent: db.prepare('SELECT * FROM progress WHERE studentId = ? ORDER BY lastStudied DESC'),
  getProgress: db.prepare('SELECT * FROM progress WHERE studentId = ? AND topicId = ?'),
  insertProgress: db.prepare(`
    INSERT INTO progress (id, studentId, topicId, completed, remaining, lastStudied, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),
  updateProgress: db.prepare(`
    UPDATE progress SET completed = ?, remaining = ?, lastStudied = ?, notes = ?
    WHERE studentId = ? AND topicId = ?
  `),
  upsertProgress: db.prepare(`
    INSERT INTO progress (id, studentId, topicId, completed, remaining, lastStudied, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(studentId, topicId) DO UPDATE SET
      completed = excluded.completed,
      remaining = excluded.remaining,
      lastStudied = excluded.lastStudied,
      notes = excluded.notes,
      updated_at = CURRENT_TIMESTAMP
  `),

  // Academic Goals
  getAcademicGoalsByStudent: db.prepare('SELECT * FROM academic_goals WHERE studentId = ? ORDER BY deadline'),
  insertAcademicGoal: db.prepare(`
    INSERT INTO academic_goals (id, studentId, title, description, targetScore, currentScore, examType, deadline, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  updateAcademicGoal: db.prepare(`
    UPDATE academic_goals SET title = ?, description = ?, targetScore = ?, currentScore = ?, 
                             examType = ?, deadline = ?, status = ?
    WHERE id = ?
  `),
  deleteAcademicGoal: db.prepare('DELETE FROM academic_goals WHERE id = ?'),
  upsertAcademicGoal: db.prepare(`
    INSERT INTO academic_goals (id, studentId, title, description, targetScore, currentScore, examType, deadline, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      description = excluded.description,
      targetScore = excluded.targetScore,
      currentScore = excluded.currentScore,
      examType = excluded.examType,
      deadline = excluded.deadline,
      status = excluded.status
  `),

  // Study Sessions
  getStudySessionsByStudent: db.prepare('SELECT * FROM study_sessions WHERE studentId = ? ORDER BY startTime DESC'),
  insertStudySession: db.prepare(`
    INSERT INTO study_sessions (id, studentId, topicId, startTime, endTime, duration, notes, efficiency)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),

  // Notes
  getNotesByStudent: db.prepare('SELECT * FROM notes WHERE studentId = ? ORDER BY updated_at DESC'),
  insertNote: db.prepare(`
    INSERT INTO notes (id, studentId, title, content, category, tags)
    VALUES (?, ?, ?, ?, ?, ?)
  `),
  updateNote: db.prepare('UPDATE notes SET title = ?, content = ?, category = ?, tags = ? WHERE id = ?'),
  deleteNote: db.prepare('DELETE FROM notes WHERE id = ?'),

  // Legacy Surveys
  getSurveysByStudent: db.prepare('SELECT * FROM surveys WHERE studentId = ? ORDER BY created_at DESC'),
  insertSurvey: db.prepare(`
    INSERT INTO surveys (id, studentId, type, questions, responses, completed)
    VALUES (?, ?, ?, ?, ?, ?)
  `),
  updateSurvey: db.prepare('UPDATE surveys SET responses = ?, completed = ? WHERE id = ?'),

  // Survey Templates
  getSurveyTemplates: db.prepare('SELECT * FROM survey_templates WHERE isActive = TRUE ORDER BY created_at DESC'),
  getSurveyTemplate: db.prepare('SELECT * FROM survey_templates WHERE id = ?'),
  insertSurveyTemplate: db.prepare(`
    INSERT INTO survey_templates (id, title, description, type, mebCompliant, isActive, createdBy, tags, estimatedDuration, targetGrades)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  updateSurveyTemplate: db.prepare(`
    UPDATE survey_templates SET title = ?, description = ?, type = ?, mebCompliant = ?, isActive = ?, 
                               tags = ?, estimatedDuration = ?, targetGrades = ?
    WHERE id = ?
  `),
  deleteSurveyTemplate: db.prepare('UPDATE survey_templates SET isActive = FALSE WHERE id = ?'),

  // Survey Questions
  getQuestionsByTemplate: db.prepare('SELECT * FROM survey_questions WHERE templateId = ? ORDER BY orderIndex'),
  insertSurveyQuestion: db.prepare(`
    INSERT INTO survey_questions (id, templateId, questionText, questionType, required, orderIndex, options, validation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),
  updateSurveyQuestion: db.prepare(`
    UPDATE survey_questions SET questionText = ?, questionType = ?, required = ?, orderIndex = ?, options = ?, validation = ?
    WHERE id = ?
  `),
  deleteSurveyQuestion: db.prepare('DELETE FROM survey_questions WHERE id = ?'),
  deleteQuestionsByTemplate: db.prepare('DELETE FROM survey_questions WHERE templateId = ?'),

  // Survey Distributions
  getSurveyDistributions: db.prepare('SELECT * FROM survey_distributions ORDER BY created_at DESC'),
  getSurveyDistribution: db.prepare('SELECT * FROM survey_distributions WHERE id = ?'),
  getSurveyDistributionByLink: db.prepare('SELECT * FROM survey_distributions WHERE publicLink = ?'),
  insertSurveyDistribution: db.prepare(`
    INSERT INTO survey_distributions (id, templateId, title, description, targetClasses, targetStudents, 
                                     distributionType, excelTemplate, publicLink, startDate, endDate, 
                                     allowAnonymous, maxResponses, status, createdBy)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  updateSurveyDistribution: db.prepare(`
    UPDATE survey_distributions SET title = ?, description = ?, targetClasses = ?, targetStudents = ?,
                                   distributionType = ?, startDate = ?, endDate = ?, allowAnonymous = ?,
                                   maxResponses = ?, status = ?
    WHERE id = ?
  `),
  deleteSurveyDistribution: db.prepare('DELETE FROM survey_distributions WHERE id = ?'),

  // Survey Responses
  getSurveyResponses: db.prepare('SELECT * FROM survey_responses ORDER BY created_at DESC'),
  getSurveyResponsesByDistribution: db.prepare('SELECT * FROM survey_responses WHERE distributionId = ? ORDER BY created_at DESC'),
  getSurveyResponsesByStudent: db.prepare('SELECT * FROM survey_responses WHERE studentId = ? ORDER BY created_at DESC'),
  getSurveyResponse: db.prepare('SELECT * FROM survey_responses WHERE id = ?'),
  insertSurveyResponse: db.prepare(`
    INSERT INTO survey_responses (id, distributionId, studentId, studentInfo, responseData, submissionType, 
                                 isComplete, submittedAt, ipAddress, userAgent)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  updateSurveyResponse: db.prepare(`
    UPDATE survey_responses SET responseData = ?, isComplete = ?, submittedAt = ?
    WHERE id = ?
  `),
  deleteSurveyResponse: db.prepare('DELETE FROM survey_responses WHERE id = ?'),

  // Attendance
  getAttendanceByStudent: db.prepare('SELECT * FROM attendance WHERE studentId = ? ORDER BY date DESC'),
  insertAttendance: db.prepare('INSERT INTO attendance (id, studentId, date, status, notes) VALUES (?, ?, ?, ?, ?)'),

  // Interventions
  getInterventionsByStudent: db.prepare('SELECT * FROM interventions WHERE studentId = ? ORDER BY created_at DESC'),
  insertIntervention: db.prepare(`
    INSERT INTO interventions (id, studentId, date, title, status)
    VALUES (?, ?, ?, ?, ?)
  `),
  updateIntervention: db.prepare('UPDATE interventions SET status = ? WHERE id = ?'),

  // Meeting Notes
  getMeetingNotesByStudent: db.prepare('SELECT * FROM meeting_notes WHERE studentId = ? ORDER BY date DESC'),
  getMeetingNote: db.prepare('SELECT * FROM meeting_notes WHERE id = ?'),
  insertMeetingNote: db.prepare(`
    INSERT INTO meeting_notes (id, studentId, date, type, note, plan)
    VALUES (?, ?, ?, ?, ?, ?)
  `),
  updateMeetingNote: db.prepare(`
    UPDATE meeting_notes SET date = ?, type = ?, note = ?, plan = ?
    WHERE id = ?
  `),
  deleteMeetingNote: db.prepare('DELETE FROM meeting_notes WHERE id = ?'),

  // Student Documents
  getDocumentsByStudent: db.prepare('SELECT * FROM student_documents WHERE studentId = ? ORDER BY created_at DESC'),
  getDocument: db.prepare('SELECT * FROM student_documents WHERE id = ?'),
  insertDocument: db.prepare(`
    INSERT INTO student_documents (id, studentId, name, type, dataUrl)
    VALUES (?, ?, ?, ?, ?)
  `),
  deleteDocument: db.prepare('DELETE FROM student_documents WHERE id = ?'),

  // App Settings
  getAppSettings: db.prepare('SELECT * FROM app_settings WHERE id = 1'),
  upsertAppSettings: db.prepare(`
    INSERT INTO app_settings (id, settings)
    VALUES (1, ?)
    ON CONFLICT(id) DO UPDATE SET settings = excluded.settings
  `),
  
  // Study Assignments
  getStudyAssignmentsByStudent: db.prepare('SELECT * FROM study_assignments WHERE studentId = ? ORDER BY dueDate'),
  insertStudyAssignment: db.prepare(`
    INSERT INTO study_assignments (id, studentId, topicId, dueDate, status, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `),
  updateStudyAssignment: db.prepare(`
    UPDATE study_assignments SET status = ?, notes = ?
    WHERE id = ?
  `),
  deleteStudyAssignment: db.prepare('DELETE FROM study_assignments WHERE id = ?'),
  
  // Weekly Slots
  getAllWeeklySlots: db.prepare('SELECT * FROM weekly_slots ORDER BY day, startTime'),
  getWeeklySlotsByStudent: db.prepare('SELECT * FROM weekly_slots WHERE studentId = ? ORDER BY day, startTime'),
  insertWeeklySlot: db.prepare(`
    INSERT INTO weekly_slots (id, studentId, day, startTime, endTime, subjectId)
    VALUES (?, ?, ?, ?, ?, ?)
  `),
  updateWeeklySlot: db.prepare(`
    UPDATE weekly_slots SET day = ?, startTime = ?, endTime = ?, subjectId = ?
    WHERE id = ?
  `),
  deleteWeeklySlot: db.prepare('DELETE FROM weekly_slots WHERE id = ?'),
  
  // User Sessions
  getUserSession: db.prepare('SELECT * FROM user_sessions WHERE userId = ?'),
  upsertUserSession: db.prepare(`
    INSERT INTO user_sessions (userId, userData, demoNoticeSeen, lastActive)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(userId) DO UPDATE SET
      userData = excluded.userData,
      demoNoticeSeen = excluded.demoNoticeSeen,
      lastActive = CURRENT_TIMESTAMP
  `),
  updateUserSessionActivity: db.prepare(`
    UPDATE user_sessions SET lastActive = CURRENT_TIMESTAMP
    WHERE userId = ?
  `),
  deleteUserSession: db.prepare('DELETE FROM user_sessions WHERE userId = ?'),
    };
    isInitialized = true;
  } catch (error) {
    isInitialized = false;
    initializationPromise = null;
    console.error('Error initializing database statements:', error);
    throw error;
  }
}

// Service functions - localStorage fonksiyonlarının yerine geçecek

export interface Student {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  className?: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated';
  avatar?: string;
  parentContact?: string;
  notes?: string;
}

export interface AcademicRecord {
  id?: number;
  studentId: string;
  semester: string;
  gpa?: number;
  year: number;
  exams?: any[];
  notes?: string;
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
  description?: string;
  color?: string;
  category?: "LGS" | "YKS" | "TYT" | "AYT" | "YDT";
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  estimatedHours?: number;
  avgMinutes?: number;
  order?: number;
  energyLevel?: 'low' | 'medium' | 'high';
  difficultyScore?: number;
  priority?: number;
  deadline?: string;
}

export interface Progress {
  id: string;
  studentId: string;
  topicId: string;
  completed: number;
  remaining: number;
  lastStudied?: string;
  notes?: string;
}

export interface AcademicGoal {
  id: string;
  studentId: string;
  title: string;
  description?: string;
  targetScore?: number;
  currentScore?: number;
  examType?: string;
  deadline: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface MeetingNote {
  id: string;
  studentId: string;
  date: string;
  type: 'Bireysel' | 'Grup' | 'Veli';
  note: string;
  plan?: string;
}

export interface StudentDocument {
  id: string;
  studentId: string;
  name: string;
  type: string;
  dataUrl: string;
  createdAt?: string;
}

export interface AppSettings {
  id: number;
  settings: string;
}

// Student functions - delegated to students repository with error handling preserved
import * as studentsRepository from '../features/students/repository/students.repository.js';

export function loadStudents(): Student[] {
  try {
    ensureInitialized();
    return studentsRepository.loadStudents();
  } catch (error) {
    handleDbError('loadStudents', error);
    return [];
  }
}

export function saveStudents(students: Student[]): void {
  if (!Array.isArray(students)) {
    throw new Error('Students parameter must be an array');
  }
  
  try {
    ensureInitialized();
    studentsRepository.saveStudents(students);
  } catch (error) {
    handleDbError('saveStudents', error);
    throw error;
  }
}

export function saveStudent(student: Student) {
  if (!student || typeof student !== 'object') {
    throw new Error('Student parameter is required and must be an object');
  }
  if (!student.id || !student.name) {
    throw new Error(`Invalid student data: missing required fields (id: ${student.id}, name: ${student.name})`);
  }
  
  try {
    ensureInitialized();
    studentsRepository.saveStudent(student);
  } catch (error) {
    console.error('Error saving student:', error);
    throw error;
  }
}

export function deleteStudent(id: string) {
  try {
    ensureInitialized();
    studentsRepository.deleteStudent(id);
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
}

// Academic Records functions - delegated to students repository with error handling preserved
export function getAcademicsByStudent(studentId: string): AcademicRecord[] {
  try {
    ensureInitialized();
    return studentsRepository.getAcademicsByStudent(studentId);
  } catch (error) {
    console.error('Error loading academic records:', error);
    return [];
  }
}

export function addAcademic(record: AcademicRecord): void {
  try {
    ensureInitialized();
    studentsRepository.addAcademic(record);
  } catch (error) {
    console.error('Error adding academic record:', error);
    throw error;
  }
}

// Subjects functions
export function loadSubjects(): Subject[] {
  try {
    ensureInitialized();
    return statements.getSubjects.all() as Subject[];
  } catch (error) {
    console.error('Error loading subjects:', error);
    return [];
  }
}

export function saveSubjects(subjects: Subject[]) {
  ensureInitialized();
  const transaction = getDatabase().transaction(() => {
    // Get existing subject IDs
    const existingSubjects = statements.getSubjects.all() as Subject[];
    const incomingIds = new Set(subjects.map(s => s.id));
    
    // Delete subjects not in the incoming array
    for (const existing of existingSubjects) {
      if (!incomingIds.has(existing.id)) {
        statements.deleteSubject.run(existing.id);
      }
    }
    
    // Upsert subjects from the incoming array
    for (const subject of subjects) {
      statements.upsertSubject.run(
        subject.id, subject.name, subject.code,
        subject.description, subject.color, subject.category
      );
    }
  });
  
  transaction();
}

// Topics functions
export function loadTopics(): Topic[] {
  try {
    ensureInitialized();
    return statements.getTopics.all() as Topic[];
  } catch (error) {
    console.error('Error loading topics:', error);
    return [];
  }
}

export function saveTopics(topics: Topic[]) {
  ensureInitialized();
  const transaction = getDatabase().transaction(() => {
    // Get existing topic IDs
    const existingTopics = statements.getTopics.all() as Topic[];
    const incomingIds = new Set(topics.map(t => t.id));
    
    // Delete topics not in the incoming array
    for (const existing of existingTopics) {
      if (!incomingIds.has(existing.id)) {
        statements.deleteTopic.run(existing.id);
      }
    }
    
    // Upsert topics from the incoming array
    for (const topic of topics) {
      statements.upsertTopic.run(
        topic.id, topic.subjectId, topic.name, topic.description,
        topic.difficulty, topic.estimatedHours, topic.avgMinutes, topic.order,
        topic.energyLevel, topic.difficultyScore, topic.priority, topic.deadline
      );
    }
  });
  
  transaction();
}

// Progress functions
export function getAllProgress(): Progress[] {
  try {
    ensureInitialized();
    return statements.getAllProgress.all() as Progress[];
  } catch (error) {
    console.error('Error loading all progress:', error);
    return [];
  }
}

export function getProgressByStudent(studentId: string): Progress[] {
  try {
    ensureInitialized();
    return statements.getProgressByStudent.all(studentId) as Progress[];
  } catch (error) {
    console.error('Error loading progress:', error);
    return [];
  }
}

export function saveProgress(progress: Progress[]) {
  ensureInitialized();
  const transaction = getDatabase().transaction(() => {
    for (const p of progress) {
      statements.upsertProgress.run(
        p.id, p.studentId, p.topicId, p.completed,
        p.remaining, p.lastStudied, p.notes
      );
    }
  });
  
  transaction();
}

// Academic Goals functions
export function getAcademicGoalsByStudent(studentId: string): AcademicGoal[] {
  try {
    ensureInitialized();
    return statements.getAcademicGoalsByStudent.all(studentId) as AcademicGoal[];
  } catch (error) {
    console.error('Error loading academic goals:', error);
    return [];
  }
}

export function saveAcademicGoals(goals: AcademicGoal[], options?: { studentIds?: string[], clearAll?: boolean }) {
  ensureInitialized();
  const transaction = getDatabase().transaction(() => {
    // Determine which students to operate on
    let targetStudentIds: string[];
    
    if (options?.clearAll) {
      // Clear all goals globally (dangerous - should be used carefully)
      getDatabase().prepare('DELETE FROM academic_goals').run();
    } else if (options?.studentIds) {
      // Use explicitly provided student IDs
      targetStudentIds = options.studentIds;
    } else if (goals.length > 0) {
      // Extract student IDs from the goals
      targetStudentIds = [...new Set(goals.map(g => g.studentId))];
    } else {
      // Empty array with no context: this is dangerous and unclear
      // Instead of global delete, require explicit student context
      console.error('saveAcademicGoals: Cannot clear goals without student context. Use options.studentIds or options.clearAll');
      throw new Error('Cannot clear academic goals without explicit student context. Provide studentIds in options.');
    }
    
    // Handle targeted student operations (when not clearAll)
    if (!options?.clearAll && targetStudentIds) {
      // Get existing goals for the target students
      const existingGoals: AcademicGoal[] = [];
      for (const studentId of targetStudentIds) {
        existingGoals.push(...statements.getAcademicGoalsByStudent.all(studentId) as AcademicGoal[]);
      }
      
      const incomingIds = new Set(goals.map(g => g.id));
      
      // Delete goals not in the incoming array for the target students
      for (const existing of existingGoals) {
        if (!incomingIds.has(existing.id)) {
          statements.deleteAcademicGoal.run(existing.id);
        }
      }
    }
    
    // Upsert goals from the incoming array
    for (const goal of goals) {
      statements.upsertAcademicGoal.run(
        goal.id, goal.studentId, goal.title, goal.description,
        goal.targetScore, goal.currentScore, goal.examType,
        goal.deadline, goal.status
      );
    }
  });
  
  transaction();
}

// Utilities
export function ensureProgressForStudent(studentId: string) {
  const topics = loadTopics();
  const existingProgress = getProgressByStudent(studentId);
  const existingTopicIds = new Set(existingProgress.map(p => p.topicId));
  
  const newProgress: Progress[] = [];
  for (const topic of topics) {
    if (!existingTopicIds.has(topic.id)) {
      newProgress.push({
        id: `progress_${studentId}_${topic.id}`,
        studentId,
        topicId: topic.id,
        completed: 0,
        remaining: topic.estimatedHours * 60,
        lastStudied: undefined,
        notes: undefined
      });
    }
  }
  
  if (newProgress.length > 0) {
    saveProgress(newProgress);
  }
}

// Survey Template functions
export function loadSurveyTemplates(): SurveyTemplate[] {
  try {
    ensureInitialized();
    const templates = statements!.getSurveyTemplates.all() as (SurveyTemplate & { tags: string | null; targetGrades: string | null })[];
    return templates.map(template => ({
      ...template,
      tags: template.tags ? JSON.parse(template.tags) : [],
      targetGrades: template.targetGrades ? JSON.parse(template.targetGrades) : []
    }));
  } catch (error) {
    console.error('Error loading survey templates:', error);
    return [];
  }
}

export function getSurveyTemplate(id: string): SurveyTemplate | null {
  try {
    ensureInitialized();
    const template = statements!.getSurveyTemplate.get(id) as (SurveyTemplate & { tags: string | null; targetGrades: string | null }) | undefined;
    if (!template) return null;
    
    return {
      ...template,
      tags: template.tags ? JSON.parse(template.tags) : [],
      targetGrades: template.targetGrades ? JSON.parse(template.targetGrades) : []
    };
  } catch (error) {
    console.error('Error getting survey template:', error);
    return null;
  }
}

export function saveSurveyTemplate(template: SurveyTemplate) {
  try {
    ensureInitialized();
    statements!.insertSurveyTemplate.run(
      template.id,
      template.title,
      template.description || null,
      template.type,
      (template.mebCompliant || false) ? 1 : 0,
      (template.isActive ?? true) ? 1 : 0,
      template.createdBy || null,
      template.tags ? JSON.stringify(template.tags) : null,
      template.estimatedDuration || null,
      template.targetGrades ? JSON.stringify(template.targetGrades) : null
    );
  } catch (error) {
    console.error('Error saving survey template:', error);
    throw error;
  }
}

export function updateSurveyTemplate(id: string, template: Partial<SurveyTemplate>) {
  try {
    ensureInitialized();
    statements!.updateSurveyTemplate.run(
      template.title,
      template.description || null,
      template.type,
      (template.mebCompliant || false) ? 1 : 0,
      (template.isActive ?? true) ? 1 : 0,
      template.tags ? JSON.stringify(template.tags) : null,
      template.estimatedDuration || null,
      template.targetGrades ? JSON.stringify(template.targetGrades) : null,
      id
    );
  } catch (error) {
    console.error('Error updating survey template:', error);
    throw error;
  }
}

export function deleteSurveyTemplate(id: string) {
  try {
    ensureInitialized();
    statements.deleteSurveyTemplate.run(id);
  } catch (error) {
    console.error('Error deleting survey template:', error);
    throw error;
  }
}

// Survey Question functions
export function getQuestionsByTemplate(templateId: string): any[] {
  try {
    ensureInitialized();
    const questions = statements.getQuestionsByTemplate.all(templateId) as any[];
    return questions.map(question => ({
      ...question,
      options: question.options ? JSON.parse(question.options) : null,
      validation: question.validation ? JSON.parse(question.validation) : null
    }));
  } catch (error) {
    console.error('Error getting questions by template:', error);
    return [];
  }
}

export function saveSurveyQuestion(question: any) {
  try {
    ensureInitialized();
    statements.insertSurveyQuestion.run(
      question.id,
      question.templateId,
      question.questionText,
      question.questionType,
      (question.required || false) ? 1 : 0,
      question.orderIndex || 0,
      question.options ? JSON.stringify(question.options) : null,
      question.validation ? JSON.stringify(question.validation) : null
    );
  } catch (error) {
    console.error('Error saving survey question:', error);
    throw error;
  }
}

export function updateSurveyQuestion(id: string, question: any) {
  try {
    ensureInitialized();
    statements.updateSurveyQuestion.run(
      question.questionText,
      question.questionType,
      (question.required || false) ? 1 : 0,
      question.orderIndex || 0,
      question.options ? JSON.stringify(question.options) : null,
      question.validation ? JSON.stringify(question.validation) : null,
      id
    );
  } catch (error) {
    console.error('Error updating survey question:', error);
    throw error;
  }
}

export function deleteSurveyQuestion(id: string) {
  try {
    ensureInitialized();
    statements.deleteSurveyQuestion.run(id);
  } catch (error) {
    console.error('Error deleting survey question:', error);
    throw error;
  }
}

export function deleteQuestionsByTemplate(templateId: string) {
  try {
    ensureInitialized();
    statements.deleteQuestionsByTemplate.run(templateId);
  } catch (error) {
    console.error('Error deleting questions by template:', error);
    throw error;
  }
}

// Survey Distribution functions
export function loadSurveyDistributions(): any[] {
  try {
    ensureInitialized();
    const distributions = statements.getSurveyDistributions.all() as any[];
    return distributions.map(distribution => ({
      ...distribution,
      targetClasses: distribution.targetClasses ? JSON.parse(distribution.targetClasses) : [],
      targetStudents: distribution.targetStudents ? JSON.parse(distribution.targetStudents) : []
    }));
  } catch (error) {
    console.error('Error loading survey distributions:', error);
    return [];
  }
}

export function getSurveyDistribution(id: string): any | null {
  try {
    ensureInitialized();
    const distribution = statements.getSurveyDistribution.get(id) as any;
    if (!distribution) return null;
    
    return {
      ...distribution,
      targetClasses: distribution.targetClasses ? JSON.parse(distribution.targetClasses) : [],
      targetStudents: distribution.targetStudents ? JSON.parse(distribution.targetStudents) : []
    };
  } catch (error) {
    console.error('Error getting survey distribution:', error);
    return null;
  }
}

export function getSurveyDistributionByLink(publicLink: string): any | null {
  try {
    ensureInitialized();
    const distribution = statements.getSurveyDistributionByLink.get(publicLink) as any;
    if (!distribution) return null;
    
    return {
      ...distribution,
      targetClasses: distribution.targetClasses ? JSON.parse(distribution.targetClasses) : [],
      targetStudents: distribution.targetStudents ? JSON.parse(distribution.targetStudents) : []
    };
  } catch (error) {
    console.error('Error getting survey distribution by link:', error);
    return null;
  }
}

export function saveSurveyDistribution(distribution: any) {
  try {
    ensureInitialized();
    statements.insertSurveyDistribution.run(
      distribution.id,
      distribution.templateId,
      distribution.title,
      distribution.description || null,
      distribution.targetClasses ? JSON.stringify(distribution.targetClasses) : null,
      distribution.targetStudents ? JSON.stringify(distribution.targetStudents) : null,
      distribution.distributionType,
      distribution.excelTemplate || null,
      distribution.publicLink || null,
      distribution.startDate || null,
      distribution.endDate || null,
      (distribution.allowAnonymous || false) ? 1 : 0,
      distribution.maxResponses || null,
      distribution.status || 'DRAFT',
      distribution.createdBy || null
    );
  } catch (error) {
    console.error('Error saving survey distribution:', error);
    throw error;
  }
}

export function updateSurveyDistribution(id: string, distribution: any) {
  try {
    ensureInitialized();
    statements.updateSurveyDistribution.run(
      distribution.title,
      distribution.description || null,
      distribution.targetClasses ? JSON.stringify(distribution.targetClasses) : null,
      distribution.targetStudents ? JSON.stringify(distribution.targetStudents) : null,
      distribution.distributionType,
      distribution.startDate || null,
      distribution.endDate || null,
      (distribution.allowAnonymous || false) ? 1 : 0,
      distribution.maxResponses || null,
      distribution.status || 'DRAFT',
      id
    );
  } catch (error) {
    console.error('Error updating survey distribution:', error);
    throw error;
  }
}

export function deleteSurveyDistribution(id: string) {
  try {
    ensureInitialized();
    statements.deleteSurveyDistribution.run(id);
  } catch (error) {
    console.error('Error deleting survey distribution:', error);
    throw error;
  }
}

// Survey Response functions
export function loadSurveyResponses(filters?: { distributionId?: string; studentId?: string }): any[] {
  try {
    ensureInitialized();
    let responses: any[];
    
    if (filters?.distributionId) {
      responses = statements.getSurveyResponsesByDistribution.all(filters.distributionId) as any[];
    } else if (filters?.studentId) {
      responses = statements.getSurveyResponsesByStudent.all(filters.studentId) as any[];
    } else {
      responses = statements.getSurveyResponses.all() as any[];
    }
    
    return responses.map(response => ({
      ...response,
      responseData: response.responseData ? JSON.parse(response.responseData) : {},
      studentInfo: response.studentInfo ? JSON.parse(response.studentInfo) : null
    }));
  } catch (error) {
    console.error('Error loading survey responses:', error);
    return [];
  }
}

export function saveSurveyResponse(response: any) {
  try {
    ensureInitialized();
    statements.insertSurveyResponse.run(
      response.id,
      response.distributionId,
      response.studentId || null,
      response.studentInfo ? JSON.stringify(response.studentInfo) : null,
      response.responseData ? JSON.stringify(response.responseData) : '{}',
      response.submissionType || 'ONLINE',
      (response.isComplete || false) ? 1 : 0,
      response.submittedAt || null,
      response.ipAddress || null,
      response.userAgent || null
    );
  } catch (error) {
    console.error('Error saving survey response:', error);
    throw error;
  }
}

export function updateSurveyResponse(id: string, response: any) {
  try {
    ensureInitialized();
    statements.updateSurveyResponse.run(
      response.responseData ? JSON.stringify(response.responseData) : '{}',
      (response.isComplete || false) ? 1 : 0,
      response.submittedAt || null,
      id
    );
  } catch (error) {
    console.error('Error updating survey response:', error);
    throw error;
  }
}

export function deleteSurveyResponse(id: string) {
  try {
    ensureInitialized();
    statements.deleteSurveyResponse.run(id);
  } catch (error) {
    console.error('Error deleting survey response:', error);
    throw error;
  }
}

// Meeting Notes functions
export function getMeetingNotesByStudent(studentId: string): MeetingNote[] {
  try {
    ensureInitialized();
    return statements.getMeetingNotesByStudent.all(studentId) as MeetingNote[];
  } catch (error) {
    console.error('Error getting meeting notes:', error);
    return [];
  }
}

export function saveMeetingNote(note: MeetingNote) {
  try {
    ensureInitialized();
    statements.insertMeetingNote.run(
      note.id,
      note.studentId,
      note.date,
      note.type,
      note.note,
      note.plan || null
    );
  } catch (error) {
    console.error('Error saving meeting note:', error);
    throw error;
  }
}

export function updateMeetingNote(id: string, note: Partial<MeetingNote>) {
  try {
    ensureInitialized();
    const existing = statements.getMeetingNote.get(id) as MeetingNote;
    if (!existing) {
      throw new Error('Meeting note not found');
    }
    statements.updateMeetingNote.run(
      note.date || existing.date,
      note.type || existing.type,
      note.note || existing.note,
      note.plan !== undefined ? note.plan : existing.plan,
      id
    );
  } catch (error) {
    console.error('Error updating meeting note:', error);
    throw error;
  }
}

export function deleteMeetingNote(id: string) {
  try {
    ensureInitialized();
    statements.deleteMeetingNote.run(id);
  } catch (error) {
    console.error('Error deleting meeting note:', error);
    throw error;
  }
}

// Student Documents functions
export function getDocumentsByStudent(studentId: string): StudentDocument[] {
  try {
    ensureInitialized();
    return statements.getDocumentsByStudent.all(studentId) as StudentDocument[];
  } catch (error) {
    console.error('Error getting documents:', error);
    return [];
  }
}

export function saveDocument(doc: StudentDocument) {
  try {
    ensureInitialized();
    statements.insertDocument.run(
      doc.id,
      doc.studentId,
      doc.name,
      doc.type,
      doc.dataUrl
    );
  } catch (error) {
    console.error('Error saving document:', error);
    throw error;
  }
}

export function deleteDocument(id: string) {
  try {
    ensureInitialized();
    statements.deleteDocument.run(id);
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}

// App Settings functions
export function getAppSettings(): any | null {
  try {
    ensureInitialized();
    const result = statements.getAppSettings.get() as AppSettings | undefined;
    if (result && result.settings) {
      const parsed = JSON.parse(result.settings);
      return parsed;
    }
    return null;
  } catch (error) {
    console.error('Error getting app settings:', error);
    return null;
  }
}

export function saveAppSettings(settings: any) {
  try {
    ensureInitialized();
    statements.upsertAppSettings.run(JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving app settings:', error);
    throw error;
  }
}

// Attendance functions
export function getAttendanceByStudent(studentId: string): any[] {
  try {
    ensureInitialized();
    return statements.getAttendanceByStudent.all(studentId);
  } catch (error) {
    console.error('Error loading attendance:', error);
    return [];
  }
}

export function insertAttendance(id: string, studentId: string, date: string, status: string, reason?: string) {
  try {
    ensureInitialized();
    // Map reason parameter to notes column in database
    statements.insertAttendance.run(id, studentId, date, status, reason);
  } catch (error) {
    console.error('Error inserting attendance:', error);
    throw error;
  }
}

// Intervention functions
export function getInterventionsByStudent(studentId: string): any[] {
  try {
    ensureInitialized();
    return statements.getInterventionsByStudent.all(studentId);
  } catch (error) {
    console.error('Error loading interventions:', error);
    return [];
  }
}

export function insertIntervention(id: string, studentId: string, date: string, title: string, status: string) {
  try {
    ensureInitialized();
    statements.insertIntervention.run(id, studentId, date, title, status);
  } catch (error) {
    console.error('Error inserting intervention:', error);
    throw error;
  }
}

// Study Assignment functions
export function getStudyAssignmentsByStudent(studentId: string): any[] {
  try {
    ensureInitialized();
    return statements.getStudyAssignmentsByStudent.all(studentId);
  } catch (error) {
    console.error('Error loading study assignments:', error);
    return [];
  }
}

export function insertStudyAssignment(id: string, studentId: string, topicId: string, dueDate: string, status: string, notes?: string) {
  try {
    ensureInitialized();
    statements.insertStudyAssignment.run(id, studentId, topicId, dueDate, status, notes);
  } catch (error) {
    console.error('Error inserting study assignment:', error);
    throw error;
  }
}

export function updateStudyAssignment(id: string, status: string, notes?: string) {
  try {
    ensureInitialized();
    statements.updateStudyAssignment.run(status, notes, id);
  } catch (error) {
    console.error('Error updating study assignment:', error);
    throw error;
  }
}

export function deleteStudyAssignment(id: string) {
  try {
    ensureInitialized();
    statements.deleteStudyAssignment.run(id);
  } catch (error) {
    console.error('Error deleting study assignment:', error);
    throw error;
  }
}

// Weekly Slot functions
export function getAllWeeklySlots(): any[] {
  try {
    ensureInitialized();
    return statements.getAllWeeklySlots.all();
  } catch (error) {
    console.error('Error loading all weekly slots:', error);
    return [];
  }
}

export function getWeeklySlotsByStudent(studentId: string): any[] {
  try {
    ensureInitialized();
    return statements.getWeeklySlotsByStudent.all(studentId);
  } catch (error) {
    console.error('Error loading weekly slots:', error);
    return [];
  }
}

export function insertWeeklySlot(id: string, studentId: string, day: number, startTime: string, endTime: string, subjectId: string) {
  try {
    ensureInitialized();
    statements.insertWeeklySlot.run(id, studentId, day, startTime, endTime, subjectId);
  } catch (error) {
    console.error('Error inserting weekly slot:', error);
    throw error;
  }
}

export function updateWeeklySlot(id: string, day: number, startTime: string, endTime: string, subjectId: string) {
  try {
    ensureInitialized();
    statements.updateWeeklySlot.run(day, startTime, endTime, subjectId, id);
  } catch (error) {
    console.error('Error updating weekly slot:', error);
    throw error;
  }
}

export function deleteWeeklySlot(id: string) {
  try {
    ensureInitialized();
    statements.deleteWeeklySlot.run(id);
  } catch (error) {
    console.error('Error deleting weekly slot:', error);
    throw error;
  }
}

export interface UserSession {
  userId: string;
  userData: string;
  demoNoticeSeen: boolean;
  lastActive: string;
  created_at?: string;
  updated_at?: string;
}

export function getUserSession(userId: string): UserSession | null {
  try {
    ensureInitialized();
    const session = statements.getUserSession.get(userId) as any;
    if (!session) return null;
    
    return {
      ...session,
      demoNoticeSeen: Boolean(session.demoNoticeSeen)
    };
  } catch (error) {
    console.error('Error getting user session:', error);
    return null;
  }
}

export function upsertUserSession(userId: string, userData: string, demoNoticeSeen: boolean) {
  try {
    ensureInitialized();
    statements.upsertUserSession.run(userId, userData, demoNoticeSeen ? 1 : 0);
  } catch (error) {
    console.error('Error upserting user session:', error);
    throw error;
  }
}

export function updateUserSessionActivity(userId: string) {
  try {
    ensureInitialized();
    statements.updateUserSessionActivity.run(userId);
  } catch (error) {
    console.error('Error updating user session activity:', error);
    throw error;
  }
}

export function deleteUserSession(userId: string) {
  try {
    ensureInitialized();
    statements.deleteUserSession.run(userId);
  } catch (error) {
    console.error('Error deleting user session:', error);
    throw error;
  }
}

export function getStudySessionsByStudent(studentId: string): any[] {
  try {
    ensureInitialized();
    return statements.getStudySessionsByStudent.all(studentId);
  } catch (error) {
    console.error('Error getting study sessions:', error);
    return [];
  }
}

export function insertStudySession(id: string, studentId: string, topicId: string, startTime: string, endTime?: string, duration?: number, notes?: string, efficiency?: number) {
  try {
    ensureInitialized();
    statements.insertStudySession.run(id, studentId, topicId, startTime, endTime, duration, notes, efficiency);
  } catch (error) {
    console.error('Error inserting study session:', error);
    throw error;
  }
}

