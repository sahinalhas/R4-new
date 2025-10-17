import type Database from 'better-sqlite3';

export function createStudyPlanTables(db: Database.Database): void {
  // Study Assignments - Çalışma atamaları
  db.exec(`
    CREATE TABLE IF NOT EXISTS study_assignments (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      topicId TEXT NOT NULL,
      dueDate TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE,
      FOREIGN KEY (topicId) REFERENCES topics (id) ON DELETE CASCADE
    );
  `);

  // Weekly Slots - Haftalık ders programı
  db.exec(`
    CREATE TABLE IF NOT EXISTS weekly_slots (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      day INTEGER NOT NULL CHECK (day BETWEEN 0 AND 6),
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      subjectId TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE,
      FOREIGN KEY (subjectId) REFERENCES subjects (id) ON DELETE CASCADE
    );
  `);

  // Daily Action Plans - Günlük aksiyon planları
  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_action_plans (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      counselor_name TEXT,
      plan_data TEXT NOT NULL,
      generated_at TEXT NOT NULL,
      is_auto_generated INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(date, counselor_name)
    );
  `);

  // Indexes for performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_study_assignments_student ON study_assignments(studentId);
    CREATE INDEX IF NOT EXISTS idx_study_assignments_topic ON study_assignments(topicId);
    CREATE INDEX IF NOT EXISTS idx_study_assignments_due_date ON study_assignments(dueDate);
    CREATE INDEX IF NOT EXISTS idx_study_assignments_status ON study_assignments(status);

    CREATE INDEX IF NOT EXISTS idx_weekly_slots_student ON weekly_slots(studentId);
    CREATE INDEX IF NOT EXISTS idx_weekly_slots_day ON weekly_slots(day);
    CREATE INDEX IF NOT EXISTS idx_weekly_slots_subject ON weekly_slots(subjectId);

    CREATE INDEX IF NOT EXISTS idx_daily_action_plans_date ON daily_action_plans(date DESC);
    CREATE INDEX IF NOT EXISTS idx_daily_action_plans_counselor ON daily_action_plans(counselor_name);
  `);
}
