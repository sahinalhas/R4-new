import type Database from 'better-sqlite3';

export function createMultipleIntelligenceTable(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS multiple_intelligence (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      linguistic REAL DEFAULT 0,
      logicalMathematical REAL DEFAULT 0,
      spatial REAL DEFAULT 0,
      musicalRhythmic REAL DEFAULT 0,
      bodilyKinesthetic REAL DEFAULT 0,
      interpersonal REAL DEFAULT 0,
      intrapersonal REAL DEFAULT 0,
      naturalist REAL DEFAULT 0,
      notes TEXT,
      assessmentDate TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);
}
