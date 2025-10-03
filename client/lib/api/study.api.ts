import { toast } from "sonner";
import type { 
  StudySubject, 
  StudyTopic, 
  StudyAssignment, 
  StudySession, 
  WeeklySlot, 
  TopicProgress,
  ScheduleTemplate
} from "../types/study.types";

let subjectsCache: StudySubject[] | null = null;
let topicsCache: StudyTopic[] | null = null;
let weeklySlotsCache: WeeklySlot[] | null = null;
let progressCache: TopicProgress[] | null = null;

export function loadSubjects(): StudySubject[] {
  if (subjectsCache !== null) {
    return subjectsCache;
  }
  
  loadSubjectsAsync();
  
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

export function loadTopics(): StudyTopic[] {
  if (topicsCache !== null) {
    return topicsCache;
  }
  
  loadTopicsAsync();
  
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

export function loadWeeklySlots(): WeeklySlot[] {
  if (weeklySlotsCache !== null) {
    return weeklySlotsCache;
  }
  
  loadWeeklySlotsAsync();
  
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

export function loadProgress(): TopicProgress[] {
  if (progressCache !== null) {
    return progressCache;
  }
  
  loadProgressAsync();
  
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
    p.lastStudied = undefined;
    p.reviewCount = 0;
    p.nextReviewDate = undefined;
    await saveProgress(list);
  }
}

export function getTopicsDueForReview(studentId: string): TopicProgress[] {
  const today = new Date().toISOString().split('T')[0];
  const progress = getProgressByStudent(studentId);
  
  return progress.filter(p => {
    if (!p.nextReviewDate || !p.completedFlag) return false;
    return p.nextReviewDate <= today;
  });
}

export function getUpcomingReviews(studentId: string, days: number = 7): TopicProgress[] {
  const today = new Date();
  const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
  const futureDateStr = futureDate.toISOString().split('T')[0];
  const todayStr = today.toISOString().split('T')[0];
  const progress = getProgressByStudent(studentId);
  
  return progress.filter(p => {
    if (!p.nextReviewDate || !p.completedFlag) return false;
    return p.nextReviewDate > todayStr && p.nextReviewDate <= futureDateStr;
  }).sort((a, b) => (a.nextReviewDate || '').localeCompare(b.nextReviewDate || ''));
}

function calculateNextReviewDate(reviewCount: number): string {
  const now = new Date();
  let daysToAdd = 0;
  
  switch (reviewCount) {
    case 0:
      daysToAdd = 1;
      break;
    case 1:
      daysToAdd = 3;
      break;
    case 2:
      daysToAdd = 7;
      break;
    case 3:
      daysToAdd = 14;
      break;
    case 4:
      daysToAdd = 30;
      break;
    default:
      daysToAdd = 60;
      break;
  }
  
  const nextDate = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  return nextDate.toISOString().split('T')[0];
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
  
  const today = new Date().toISOString().split('T')[0];
  p.lastStudied = today;
  
  if (p.completedFlag) {
    p.reviewCount = (p.reviewCount || 0) + 1;
    p.nextReviewDate = calculateNextReviewDate(p.reviewCount);
  }
  
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

export function weeklyTotalMinutes(studentId: string) {
  const minutesBetween = (start: string, end: string) => {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    return eh * 60 + em - (sh * 60 + sm);
  };
  
  return getWeeklySlotsByStudent(studentId).reduce(
    (sum, s) => sum + minutesBetween(s.start, s.end),
    0,
  );
}
