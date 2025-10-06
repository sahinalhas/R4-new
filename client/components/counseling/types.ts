import { z } from "zod";

export const individualSessionSchema = z.object({
  studentId: z.string().min(1, "Öğrenci seçilmelidir"),
  topic: z.string().min(1, "Konu seçilmelidir"),
  participantType: z.string().default("öğrenci"),
  relationshipType: z.string().optional(),
  parentName: z.string().optional(),
  parentRelationship: z.string().optional(),
  teacherName: z.string().optional(),
  teacherBranch: z.string().optional(),
  otherParticipantDescription: z.string().optional(),
  sessionMode: z.string(),
  sessionLocation: z.string(),
  disciplineStatus: z.string().optional(),
  sessionDate: z.date(),
  sessionTime: z.string().min(1, "Görüşme saati seçilmelidir"),
  sessionDetails: z.string().optional(),
}).refine((data) => {
  if (data.participantType === "veli") {
    return !!data.parentName && !!data.parentRelationship;
  }
  return true;
}, {
  message: "Veli seçildiğinde veli adı ve yakınlık derecesi zorunludur",
  path: ["parentName"],
}).refine((data) => {
  if (data.participantType === "öğretmen") {
    return !!data.teacherName;
  }
  return true;
}, {
  message: "Öğretmen seçildiğinde öğretmen adı zorunludur",
  path: ["teacherName"],
}).refine((data) => {
  if (data.participantType === "diğer") {
    return !!data.otherParticipantDescription;
  }
  return true;
}, {
  message: "Diğer seçildiğinde katılımcı açıklaması zorunludur",
  path: ["otherParticipantDescription"],
});

export const groupSessionSchema = z.object({
  groupName: z.string().optional(),
  studentIds: z.array(z.string()).min(1, "En az bir öğrenci seçilmelidir"),
  topic: z.string().min(1, "Konu seçilmelidir"),
  participantType: z.string().default("öğrenci"),
  parentName: z.string().optional(),
  parentRelationship: z.string().optional(),
  teacherName: z.string().optional(),
  teacherBranch: z.string().optional(),
  otherParticipantDescription: z.string().optional(),
  sessionMode: z.string(),
  sessionLocation: z.string(),
  disciplineStatus: z.string().optional(),
  sessionDate: z.date(),
  sessionTime: z.string().min(1, "Görüşme saati seçilmelidir"),
  sessionDetails: z.string().optional(),
}).refine((data) => {
  if (data.participantType === "veli") {
    return !!data.parentName && !!data.parentRelationship;
  }
  return true;
}, {
  message: "Veli seçildiğinde veli adı ve yakınlık derecesi zorunludur",
  path: ["parentName"],
}).refine((data) => {
  if (data.participantType === "öğretmen") {
    return !!data.teacherName;
  }
  return true;
}, {
  message: "Öğretmen seçildiğinde öğretmen adı zorunludur",
  path: ["teacherName"],
}).refine((data) => {
  if (data.participantType === "diğer") {
    return !!data.otherParticipantDescription;
  }
  return true;
}, {
  message: "Diğer seçildiğinde katılımcı açıklaması zorunludur",
  path: ["otherParticipantDescription"],
});

export const completeSessionSchema = z.object({
  exitTime: z.string(),
  detailedNotes: z.string().optional(),
});

export const reminderSchema = z.object({
  sessionId: z.string().optional(),
  reminderType: z.enum(["planned_session", "follow_up", "parent_meeting"]),
  reminderDate: z.date(),
  reminderTime: z.string().min(1, "Saat gereklidir"),
  title: z.string().min(1, "Başlık gereklidir"),
  description: z.string().optional(),
  studentIds: z.array(z.string()).min(1, "En az bir öğrenci seçilmelidir"),
});

export const followUpSchema = z.object({
  sessionId: z.string().optional(),
  followUpDate: z.date(),
  assignedTo: z.string().min(1, "Atanan kişi gereklidir"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  actionItems: z.string().min(1, "Yapılacaklar gereklidir"),
  notes: z.string().optional(),
});

export const outcomeSchema = z.object({
  sessionId: z.string().min(1, "Görüşme ID gereklidir"),
  effectivenessRating: z.number().min(1, "En az 1 puan").max(5, "En fazla 5 puan").optional(),
  progressNotes: z.string().optional(),
  goalsAchieved: z.string().optional(),
  nextSteps: z.string().optional(),
  recommendations: z.string().optional(),
  followUpRequired: z.boolean().default(false),
  followUpDate: z.date().optional(),
}).refine((data) => {
  if (data.followUpRequired && !data.followUpDate) {
    return false;
  }
  return true;
}, {
  message: "Takip gerekiyorsa takip tarihi belirtilmelidir",
  path: ["followUpDate"],
});

export type IndividualSessionFormValues = z.infer<typeof individualSessionSchema>;
export type GroupSessionFormValues = z.infer<typeof groupSessionSchema>;
export type CompleteSessionFormValues = z.infer<typeof completeSessionSchema>;
export type ReminderFormValues = z.infer<typeof reminderSchema>;
export type FollowUpFormValues = z.infer<typeof followUpSchema>;
export type OutcomeFormValues = z.infer<typeof outcomeSchema>;

export interface Student {
  id: string;
  name: string;
  className: string;
}

export interface ClassHour {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
}

export interface CounselingTopic {
  id: string;
  title: string;
  category: string;
  fullPath: string;
}

export interface CounselingSession {
  id: string;
  sessionType: 'individual' | 'group';
  groupName?: string;
  counselorId: string;
  sessionDate: string;
  entryTime: string;
  entryClassHourId?: number;
  exitTime?: string;
  exitClassHourId?: number;
  topic: string;
  participantType: string;
  relationshipType?: string;
  otherParticipants?: string;
  parentName?: string;
  parentRelationship?: string;
  teacherName?: string;
  teacherBranch?: string;
  otherParticipantDescription?: string;
  sessionMode: string;
  sessionLocation: string;
  disciplineStatus?: string;
  institutionalCooperation?: string;
  sessionDetails?: string;
  detailedNotes?: string;
  autoCompleted: boolean;
  extensionGranted: boolean;
  completed: boolean;
  created_at: string;
  updated_at: string;
  student?: Student;
  students?: Student[];
}

export interface CounselingReminder {
  id: string;
  sessionId?: string;
  reminderType: 'planned_session' | 'follow_up' | 'parent_meeting';
  reminderDate: string;
  reminderTime: string;
  title: string;
  description?: string;
  studentIds: string;
  status: 'pending' | 'completed' | 'cancelled';
  notificationSent: boolean;
  created_at: string;
  updated_at: string;
  students?: Student[];
}

export interface CounselingFollowUp {
  id: string;
  sessionId?: string;
  followUpDate: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed';
  actionItems: string;
  notes?: string;
  completedDate?: string;
  created_at: string;
  updated_at: string;
}

export interface CounselingOutcome {
  id: string;
  sessionId: string;
  effectivenessRating?: number;
  progressNotes?: string;
  goalsAchieved?: string;
  nextSteps?: string;
  recommendations?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  created_at: string;
  updated_at: string;
}

export interface OverallStats {
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  thisMonthSessions: number;
  thisWeekSessions: number;
  todaySessions: number;
  avgDuration: number;
  longestDuration: number;
  shortestDuration: number;
  individualPercentage: number;
  groupPercentage: number;
}

export interface TimeSeriesData {
  date: string;
  count: number;
  completed: number;
  active: number;
}

export interface TopicAnalysis {
  topic: string;
  count: number;
  avgDuration: number;
}

export interface ParticipantAnalysis {
  type: string;
  count: number;
  percentage: number;
}

export interface ClassAnalysis {
  className: string;
  count: number;
}

export interface SessionModeAnalysis {
  mode: string;
  count: number;
  percentage: number;
}

export interface SessionFilters {
  startDate?: string;
  endDate?: string;
  topic?: string;
  className?: string;
  status?: 'completed' | 'active' | 'all';
  participantType?: string;
  sessionType?: 'individual' | 'group' | 'all';
  sessionMode?: string;
  studentId?: string;
}
