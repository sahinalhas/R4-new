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

export type IndividualSessionFormValues = z.infer<typeof individualSessionSchema>;
export type GroupSessionFormValues = z.infer<typeof groupSessionSchema>;
export type CompleteSessionFormValues = z.infer<typeof completeSessionSchema>;

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
