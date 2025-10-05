import type Database from 'better-sqlite3';

export function createCoachingRecommendationsTable(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS coaching_recommendations (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      recommendationType TEXT NOT NULL,
      recommendation TEXT NOT NULL,
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);
}
