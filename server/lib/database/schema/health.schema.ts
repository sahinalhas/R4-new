import type Database from 'better-sqlite3';

export function createHealthTable(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS health_info (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      bloodType TEXT,
      allergies TEXT,
      chronicConditions TEXT,
      medications TEXT,
      emergencyContact TEXT,
      emergencyPhone TEXT,
      doctorName TEXT,
      doctorPhone TEXT,
      healthNotes TEXT,
      lastCheckupDate TEXT,
      vaccinationStatus TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);
}
