import type Database from 'better-sqlite3';

export function createSelfAssessmentsTable(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS self_assessments (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      assessmentType TEXT NOT NULL,
      scores TEXT NOT NULL,
      reflections TEXT,
      assessmentDate TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);
}
