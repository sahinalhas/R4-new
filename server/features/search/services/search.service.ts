import getDatabase from '../../../lib/database.js';

export interface SearchResults {
  students: Array<{
    id: number;
    name: string;
    className?: string;
    type: 'student';
  }>;
  counselingSessions: Array<{
    id: number;
    title: string;
    date: string;
    studentNames?: string;
    type: 'counseling';
  }>;
  surveys: Array<{
    id: number;
    title: string;
    status: string;
    createdAt: string;
    type: 'survey';
  }>;
  pages: Array<{
    label: string;
    path: string;
    type: 'page';
  }>;
}

export async function performGlobalSearch(query: string): Promise<SearchResults> {
  const db = getDatabase();
  const lowerQuery = query.toLowerCase();
  
  // Search students
  const students = db.prepare(`
    SELECT id, name, className
    FROM students
    WHERE LOWER(name) LIKE ? 
       OR LOWER(className) LIKE ?
       OR CAST(id AS TEXT) LIKE ?
    LIMIT 10
  `).all(`%${lowerQuery}%`, `%${lowerQuery}%`, `%${lowerQuery}%`) as any[];

  // Search counseling sessions
  const counselingSessions = db.prepare(`
    SELECT 
      cs.id,
      cs.topic as title,
      cs.sessionDate as date,
      GROUP_CONCAT(s.name, ', ') as studentNames
    FROM counseling_sessions cs
    LEFT JOIN session_participants sp ON cs.id = sp.sessionId
    LEFT JOIN students s ON sp.studentId = s.id
    WHERE LOWER(cs.topic) LIKE ?
       OR LOWER(cs.notes) LIKE ?
    GROUP BY cs.id
    ORDER BY cs.sessionDate DESC
    LIMIT 10
  `).all(`%${lowerQuery}%`, `%${lowerQuery}%`) as any[];

  // Search surveys
  const surveys = db.prepare(`
    SELECT id, title, status, createdAt
    FROM surveys
    WHERE LOWER(title) LIKE ?
       OR LOWER(description) LIKE ?
    ORDER BY createdAt DESC
    LIMIT 10
  `).all(`%${lowerQuery}%`, `%${lowerQuery}%`) as any[];

  // Static pages that match the query
  const allPages = [
    { label: "Ana Sayfa", path: "/" },
    { label: "Öğrenci Yönetimi", path: "/ogrenci" },
    { label: "Görüşmeler", path: "/gorusmeler" },
    { label: "Anket & Test", path: "/anketler" },
    { label: "Raporlama", path: "/raporlar" },
    { label: "Risk Takip", path: "/risk" },
    { label: "AI Asistan", path: "/ai-asistan" },
    { label: "Günlük AI Raporları", path: "/ai-insights" },
    { label: "Derinlemesine Analiz", path: "/gelismis-analiz" },
    { label: "Günlük Plan", path: "/gunluk-plan" },
    { label: "Ayarlar", path: "/ayarlar" },
  ];

  const pages = allPages.filter(page => 
    page.label.toLowerCase().includes(lowerQuery)
  );

  return {
    students: students.map(s => ({ ...s, type: 'student' as const })),
    counselingSessions: counselingSessions.map(cs => ({ ...cs, type: 'counseling' as const })),
    surveys: surveys.map(s => ({ ...s, type: 'survey' as const })),
    pages: pages.map(p => ({ ...p, type: 'page' as const }))
  };
}
