export type MeetingNote = {
  id: string;
  studentId: string;
  date: string;
  type: "Bireysel" | "Grup" | "Veli";
  note: string;
  plan?: string;
};

export type StudentDoc = {
  id: string;
  studentId: string;
  name: string;
  type: string;
  createdAt: string;
  dataUrl: string;
};

export type SurveyResult = {
  id: string;
  studentId: string;
  title: string;
  score?: number;
  date: string;
  details?: string;
};

export type Intervention = {
  id: string;
  studentId: string;
  date: string;
  title: string;
  status: "Planlandı" | "Devam" | "Tamamlandı";
};
