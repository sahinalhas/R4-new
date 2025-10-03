import * as repository from '../repository/counseling-sessions.repository.js';
import { sanitizeString } from '../../../middleware/validation.js';
import type { CounselingSession, CounselingSessionWithStudents, ClassHour, CounselingTopic } from '../types/index.js';

export function getAllSessionsWithStudents(): CounselingSessionWithStudents[] {
  const sessions = repository.getAllSessions();
  
  return sessions.map((session) => {
    if (session.sessionType === 'group') {
      const students = repository.getStudentsBySessionId(session.id);
      return { ...session, students };
    } else {
      const student = repository.getStudentBySessionId(session.id);
      return { ...session, student };
    }
  });
}

export function getActiveSessionsWithStudents(): CounselingSessionWithStudents[] {
  const sessions = repository.getActiveSessions();
  
  return sessions.map((session) => {
    if (session.sessionType === 'group') {
      const students = repository.getStudentsBySessionId(session.id);
      return { ...session, students };
    } else {
      const student = repository.getStudentBySessionId(session.id);
      return { ...session, student };
    }
  });
}

export function getSessionByIdWithStudents(id: string): CounselingSessionWithStudents | null {
  const sanitizedId = sanitizeString(id);
  const session = repository.getSessionById(sanitizedId);
  
  if (!session) return null;
  
  if (session.sessionType === 'group') {
    const students = repository.getStudentsBySessionId(sanitizedId);
    return { ...session, students };
  } else {
    const student = repository.getStudentBySessionId(sanitizedId);
    return { ...session, student };
  }
}

export function createCounselingSession(data: any): { success: boolean; id: string } {
  const session: CounselingSession = {
    id: data.id,
    sessionType: data.sessionType,
    groupName: data.groupName ? sanitizeString(data.groupName) : undefined,
    counselorId: sanitizeString(data.counselorId),
    sessionDate: data.sessionDate,
    entryTime: data.entryTime,
    entryClassHourId: data.entryClassHourId,
    topic: sanitizeString(data.topic),
    participantType: data.participantType,
    relationshipType: data.relationshipType ? sanitizeString(data.relationshipType) : undefined,
    otherParticipants: data.otherParticipants ? sanitizeString(data.otherParticipants) : undefined,
    sessionMode: data.sessionMode,
    sessionLocation: data.sessionLocation,
    disciplineStatus: data.disciplineStatus ? sanitizeString(data.disciplineStatus) : undefined,
    institutionalCooperation: data.institutionalCooperation ? sanitizeString(data.institutionalCooperation) : undefined,
    sessionDetails: data.sessionDetails ? sanitizeString(data.sessionDetails) : undefined,
    completed: 0
  };
  
  const sanitizedStudentIds = data.studentIds.map((id: string) => sanitizeString(id));
  
  repository.createSession(session, sanitizedStudentIds);
  return { success: true, id: session.id };
}

export function completeCounselingSession(
  id: string,
  exitTime: string,
  exitClassHourId: number | null,
  detailedNotes: string | null,
  autoCompleted: boolean
): { success: boolean; notFound?: boolean } {
  const sanitizedId = sanitizeString(id);
  const sanitizedNotes = detailedNotes ? sanitizeString(detailedNotes) : null;
  
  const result = repository.completeSession(
    sanitizedId,
    exitTime,
    exitClassHourId,
    sanitizedNotes,
    autoCompleted
  );
  
  if (result.changes === 0) {
    return { success: false, notFound: true };
  }
  
  return { success: true };
}

export function extendCounselingSession(id: string): { success: boolean; notFound?: boolean } {
  const sanitizedId = sanitizeString(id);
  const result = repository.extendSession(sanitizedId);
  
  if (result.changes === 0) {
    return { success: false, notFound: true };
  }
  
  return { success: true };
}

export function autoCompleteSessions(): { success: boolean; completedCount: number } {
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);
  
  const sessionsToComplete = repository.getSessionsToAutoComplete(currentDate, currentTime);
  const completedCount = sessionsToComplete.length;
  
  if (completedCount > 0) {
    for (const session of sessionsToComplete) {
      repository.autoCompleteSession(session.id, currentTime);
    }
  }
  
  return { success: true, completedCount };
}

export function deleteCounselingSession(id: string): { success: boolean; notFound?: boolean } {
  const sanitizedId = sanitizeString(id);
  const result = repository.deleteSession(sanitizedId);
  
  if (result.changes === 0) {
    return { success: false, notFound: true };
  }
  
  return { success: true };
}

export function getClassHours(): ClassHour[] {
  const settingsRow = repository.getAppSettings();
  
  if (!settingsRow || !settingsRow.settings) {
    return [];
  }
  
  const settings = JSON.parse(settingsRow.settings);
  const periods = settings?.school?.periods || [];
  
  return periods.map((period: any, index: number) => ({
    id: index + 1,
    name: `${index + 1}. Ders`,
    startTime: period.start,
    endTime: period.end
  }));
}

export function getCounselingTopics(): CounselingTopic[] {
  const settingsRow = repository.getAppSettings();
  
  if (!settingsRow || !settingsRow.settings) {
    return [];
  }
  
  const settings = JSON.parse(settingsRow.settings);
  const presentationSystem = settings?.presentationSystem || [];
  
  const topics: CounselingTopic[] = [];
  
  function extractTopics(categories: any[], parentTitle = '') {
    for (const category of categories) {
      const fullTitle = parentTitle ? `${parentTitle} > ${category.title}` : category.title;
      
      if (category.items && category.items.length > 0) {
        for (const item of category.items) {
          topics.push({
            id: item.id,
            title: item.title,
            category: fullTitle,
            fullPath: `${fullTitle} > ${item.title}`
          });
        }
      }
      
      if (category.children && category.children.length > 0) {
        extractTopics(category.children, fullTitle);
      }
    }
  }
  
  for (const tab of presentationSystem) {
    if (tab.categories && tab.categories.length > 0) {
      extractTopics(tab.categories, tab.title);
    }
  }
  
  return topics;
}
