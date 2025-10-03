import type { ClassHour } from "../types";

export function getCurrentClassHour(classHours: ClassHour[]): ClassHour | undefined {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  return classHours.find(hour => 
    currentTime >= hour.startTime && currentTime <= hour.endTime
  );
}

export function getElapsedTime(entryTime: string, sessionDate: string): number {
  const entry = new Date(`${sessionDate}T${entryTime}`);
  const now = new Date();
  const diff = Math.floor((now.getTime() - entry.getTime()) / 1000 / 60);
  return diff;
}

export function getTimerColor(minutes: number, extensionGranted: boolean): string {
  const limit = extensionGranted ? 75 : 60;
  if (minutes >= limit - 5) return 'text-red-600';
  if (minutes >= limit - 15) return 'text-orange-600';
  if (minutes >= limit - 30) return 'text-yellow-600';
  return 'text-green-600';
}

export function calculateSessionDuration(entryTime: string, exitTime: string): number | null {
  if (!exitTime || !entryTime) return null;
  
  const duration = Math.floor(
    (new Date(`2000-01-01T${exitTime}`).getTime() - 
     new Date(`2000-01-01T${entryTime}`).getTime()) / 1000 / 60
  );
  
  return duration;
}

export function getSessionName(session: { sessionType: 'individual' | 'group'; student?: { name: string }; groupName?: string }): string {
  return session.sessionType === 'individual' 
    ? session.student?.name || 'Bilinmeyen' 
    : session.groupName || 'Grup Görüşmesi';
}
