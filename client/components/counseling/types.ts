import { z } from "zod";

export const individualSessionSchema = z.object({
  studentId: z.string().min(1, "Öğrenci seçilmelidir"),
  topic: z.string().min(1, "Konu seçilmelidir"),
  participantType: z.string(),
  relationshipType: z.string().optional(),
  sessionMode: z.string(),
  sessionLocation: z.string(),
  sessionDetails: z.string().optional(),
});

export const groupSessionSchema = z.object({
  groupName: z.string().optional(),
  studentIds: z.array(z.string()).min(1, "En az bir öğrenci seçilmelidir"),
  topic: z.string().min(1, "Konu seçilmelidir"),
  participantType: z.string(),
  sessionMode: z.string(),
  sessionLocation: z.string(),
  sessionDetails: z.string().optional(),
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
