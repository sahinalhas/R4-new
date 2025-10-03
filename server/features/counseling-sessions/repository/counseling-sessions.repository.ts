import getDatabase from '../../../lib/database.js';
import type { CounselingSession, CounselingSessionWithStudents } from '../types/index.js';

let statements: any = null;
let isInitialized = false;

function ensureInitialized(): void {
  if (isInitialized && statements) return;
  
  const db = getDatabase();
  
  statements = {
    getAllSessions: db.prepare(`
      SELECT * FROM counseling_sessions 
      ORDER BY sessionDate DESC, entryTime DESC
    `),
    getActiveSessions: db.prepare(`
      SELECT * FROM counseling_sessions 
      WHERE completed = 0
      ORDER BY sessionDate DESC, entryTime DESC
    `),
    getSessionById: db.prepare('SELECT * FROM counseling_sessions WHERE id = ?'),
    getStudentsBySession: db.prepare(`
      SELECT s.* FROM students s
      INNER JOIN counseling_session_students css ON s.id = css.studentId
      WHERE css.sessionId = ?
    `),
    getStudentBySession: db.prepare(`
      SELECT s.* FROM students s
      INNER JOIN counseling_session_students css ON s.id = css.studentId
      WHERE css.sessionId = ?
      LIMIT 1
    `),
    insertSession: db.prepare(`
      INSERT INTO counseling_sessions (
        id, sessionType, groupName, counselorId, sessionDate, entryTime, entryClassHourId,
        topic, participantType, relationshipType, otherParticipants, sessionMode,
        sessionLocation, disciplineStatus, institutionalCooperation, sessionDetails,
        completed
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    insertSessionStudent: db.prepare(`
      INSERT INTO counseling_session_students (sessionId, studentId)
      VALUES (?, ?)
    `),
    completeSession: db.prepare(`
      UPDATE counseling_sessions 
      SET exitTime = ?, exitClassHourId = ?, detailedNotes = ?, 
          autoCompleted = ?, completed = 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `),
    extendSession: db.prepare(`
      UPDATE counseling_sessions 
      SET extensionGranted = 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `),
    getSessionsToAutoComplete: db.prepare(`
      SELECT * FROM counseling_sessions 
      WHERE completed = 0 
      AND (
        (sessionDate < ? )
        OR (sessionDate = ? AND (
          (extensionGranted = 0 AND 
           CAST((julianday(?) - julianday(entryTime)) * 24 * 60 AS INTEGER) >= 60)
          OR 
          (extensionGranted = 1 AND 
           CAST((julianday(?) - julianday(entryTime)) * 24 * 60 AS INTEGER) >= 75)
        ))
      )
    `),
    autoCompleteSession: db.prepare(`
      UPDATE counseling_sessions 
      SET exitTime = ?, completed = 1, autoCompleted = 1, 
          detailedNotes = COALESCE(detailedNotes, '') || '\n\n⚠️ Bu görüşme otomatik olarak tamamlanmıştır.',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `),
    deleteSession: db.prepare('DELETE FROM counseling_sessions WHERE id = ?'),
    getAppSettings: db.prepare('SELECT settings FROM app_settings WHERE id = 1')
  };
  
  isInitialized = true;
}

export function getAllSessions(): CounselingSession[] {
  ensureInitialized();
  return statements.getAllSessions.all() as CounselingSession[];
}

export function getActiveSessions(): CounselingSession[] {
  ensureInitialized();
  return statements.getActiveSessions.all() as CounselingSession[];
}

export function getSessionById(id: string): CounselingSession | null {
  ensureInitialized();
  return statements.getSessionById.get(id) as CounselingSession | null;
}

export function getStudentsBySessionId(sessionId: string): any[] {
  ensureInitialized();
  return statements.getStudentsBySession.all(sessionId);
}

export function getStudentBySessionId(sessionId: string): any | null {
  ensureInitialized();
  return statements.getStudentBySession.get(sessionId);
}

export function createSession(session: CounselingSession, studentIds: string[]): void {
  ensureInitialized();
  const db = getDatabase();
  
  const transaction = db.transaction(() => {
    statements.insertSession.run(
      session.id,
      session.sessionType,
      session.groupName || null,
      session.counselorId,
      session.sessionDate,
      session.entryTime,
      session.entryClassHourId || null,
      session.topic,
      session.participantType,
      session.relationshipType || null,
      session.otherParticipants || null,
      session.sessionMode,
      session.sessionLocation,
      session.disciplineStatus || null,
      session.institutionalCooperation || null,
      session.sessionDetails || null,
      0
    );
    
    for (const studentId of studentIds) {
      statements.insertSessionStudent.run(session.id, studentId);
    }
  });
  
  transaction();
}

export function completeSession(
  id: string,
  exitTime: string,
  exitClassHourId: number | null,
  detailedNotes: string | null,
  autoCompleted: boolean
): { changes: number } {
  ensureInitialized();
  const result = statements.completeSession.run(
    exitTime,
    exitClassHourId || null,
    detailedNotes || null,
    autoCompleted ? 1 : 0,
    id
  );
  return { changes: result.changes };
}

export function extendSession(id: string): { changes: number } {
  ensureInitialized();
  const result = statements.extendSession.run(id);
  return { changes: result.changes };
}

export function getSessionsToAutoComplete(
  currentDate: string,
  currentTime: string
): CounselingSession[] {
  ensureInitialized();
  return statements.getSessionsToAutoComplete.all(
    currentDate,
    currentDate,
    currentTime,
    currentTime
  ) as CounselingSession[];
}

export function autoCompleteSession(id: string, exitTime: string): void {
  ensureInitialized();
  statements.autoCompleteSession.run(exitTime, id);
}

export function deleteSession(id: string): { changes: number } {
  ensureInitialized();
  const result = statements.deleteSession.run(id);
  return { changes: result.changes };
}

export function getAppSettings(): any {
  ensureInitialized();
  const row = statements.getAppSettings.get();
  return row;
}
