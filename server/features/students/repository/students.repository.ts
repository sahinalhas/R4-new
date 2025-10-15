import getDatabase from '../../../lib/database.js';
import type { Student, AcademicRecord, Progress } from '../types/students.types.js';

let statements: any = null;
let isInitialized = false;

function ensureInitialized(): void {
  if (isInitialized && statements) return;
  
  const db = getDatabase();
  
  statements = {
    getStudents: db.prepare('SELECT * FROM students ORDER BY name'),
    getStudent: db.prepare('SELECT * FROM students WHERE id = ?'),
    insertStudent: db.prepare(`
      INSERT INTO students (id, name, email, phone, birthDate, address, il, ilce, className, enrollmentDate, status, avatar, parentContact, notes, gender)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    upsertStudent: db.prepare(`
      INSERT INTO students (id, name, email, phone, birthDate, address, il, ilce, className, enrollmentDate, status, avatar, parentContact, notes, gender)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        email = excluded.email,
        phone = excluded.phone,
        birthDate = excluded.birthDate,
        address = excluded.address,
        il = excluded.il,
        ilce = excluded.ilce,
        className = excluded.className,
        status = excluded.status,
        avatar = excluded.avatar,
        parentContact = excluded.parentContact,
        notes = excluded.notes,
        gender = excluded.gender
    `),
    updateStudent: db.prepare(`
      UPDATE students SET name = ?, email = ?, phone = ?, birthDate = ?, address = ?, il = ?, ilce = ?, className = ?, 
                         status = ?, avatar = ?, parentContact = ?, notes = ?, gender = ?
      WHERE id = ?
    `),
    deleteStudent: db.prepare('DELETE FROM students WHERE id = ?'),
    getAcademicsByStudent: db.prepare('SELECT * FROM academic_records WHERE studentId = ? ORDER BY year DESC, semester DESC'),
    insertAcademic: db.prepare(`
      INSERT INTO academic_records (studentId, semester, gpa, year, exams, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `),
    getProgressByStudent: db.prepare('SELECT * FROM progress WHERE studentId = ? ORDER BY lastStudied DESC'),
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
  };
  
  isInitialized = true;
}

export function loadStudents(): Student[] {
  try {
    ensureInitialized();
    return statements.getStudents.all() as Student[];
  } catch (error) {
    console.error('Database error in loadStudents:', error);
    return [];
  }
}

export function saveStudents(students: Student[]): void {
  if (!Array.isArray(students)) {
    throw new Error('Students parameter must be an array');
  }
  
  try {
    ensureInitialized();
    const transaction = getDatabase().transaction(() => {
      try {
        const existingStudents = statements.getStudents.all() as Student[];
        const incomingIds = new Set(students.map(s => s.id));
        
        for (const existing of existingStudents) {
          if (!incomingIds.has(existing.id)) {
            statements.deleteStudent.run(existing.id);
          }
        }
        
        for (const student of students) {
          if (!student.id || !student.name) {
            throw new Error(`Invalid student data: missing required fields (id: ${student.id}, name: ${student.name})`);
          }
          
          statements.upsertStudent.run(
            student.id, student.name, student.email, student.phone,
            student.birthDate, student.address, student.il, student.ilce, student.className,
            student.enrollmentDate, student.status, student.avatar,
            student.parentContact, student.notes, student.gender
          );
        }
      } catch (transactionError) {
        console.error('Transaction failed, rolling back:', transactionError);
        throw transactionError;
      }
    });
    
    transaction();
  } catch (error) {
    console.error('Database error in saveStudents:', error);
    throw error;
  }
}

export function saveStudent(student: Student): void {
  if (!student || typeof student !== 'object') {
    throw new Error('Student parameter is required and must be an object');
  }
  if (!student.id || !student.name) {
    throw new Error(`Invalid student data: missing required fields (id: ${student.id}, name: ${student.name})`);
  }
  
  try {
    ensureInitialized();
    const existing = statements.getStudent.get(student.id);
    if (existing) {
      statements.updateStudent.run(
        student.name, student.email, student.phone, student.birthDate,
        student.address, student.il, student.ilce, student.className, student.status,
        student.avatar, student.parentContact, student.notes, student.gender,
        student.id
      );
    } else {
      statements.insertStudent.run(
        student.id, student.name, student.email, student.phone,
        student.birthDate, student.address, student.il, student.ilce, student.className,
        student.enrollmentDate, student.status, student.avatar,
        student.parentContact, student.notes, student.gender
      );
    }
  } catch (error) {
    console.error('Error saving student:', error);
    throw error;
  }
}

export function deleteStudent(id: string): void {
  try {
    ensureInitialized();
    statements.deleteStudent.run(id);
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
}

export function getAcademicsByStudent(studentId: string): AcademicRecord[] {
  try {
    ensureInitialized();
    const records = statements.getAcademicsByStudent.all(studentId) as any[];
    return records.map(record => ({
      ...record,
      exams: record.exams ? JSON.parse(record.exams) : []
    }));
  } catch (error) {
    console.error('Error loading academic records:', error);
    return [];
  }
}

export function addAcademic(record: AcademicRecord): void {
  try {
    ensureInitialized();
    const examsJson = record.exams ? JSON.stringify(record.exams) : null;
    statements.insertAcademic.run(
      record.studentId,
      record.semester,
      record.gpa !== undefined && record.gpa !== null ? record.gpa : null,
      record.year,
      examsJson,
      record.notes || null
    );
  } catch (error) {
    console.error('Error adding academic record:', error);
    throw error;
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

function saveProgress(progress: Progress[]): void {
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

export function ensureProgressForStudent(studentId: string): void {
  const db = getDatabase();
  const getTopics = db.prepare('SELECT * FROM topics ORDER BY name');
  const topics = getTopics.all() as any[];
  
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
