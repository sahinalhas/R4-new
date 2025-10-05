import type Database from 'better-sqlite3';

export function createSpecialEducationTable(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS special_education (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      hasIEP BOOLEAN DEFAULT FALSE,
      iepDetails TEXT,
      learningDisabilities TEXT,
      supportServices TEXT,
      accommodations TEXT,
      progressNotes TEXT,
      reviewDate TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);
}
