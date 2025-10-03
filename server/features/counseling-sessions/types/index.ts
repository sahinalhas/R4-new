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
  completed: number;
  autoCompleted?: number;
  extensionGranted?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CounselingSessionWithStudents extends CounselingSession {
  students?: any[];
  student?: any;
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
