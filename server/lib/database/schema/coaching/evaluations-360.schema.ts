import type Database from 'better-sqlite3';

export function createEvaluations360Table(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS evaluations_360 (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      evaluatorType TEXT NOT NULL,
      evaluatorName TEXT,
      ratings TEXT NOT NULL,
      comments TEXT,
      evaluationDate TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);
}
