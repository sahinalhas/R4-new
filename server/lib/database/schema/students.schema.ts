import type Database from 'better-sqlite3';

export function createStudentsTables(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      birthDate TEXT,
      address TEXT,
      className TEXT,
      enrollmentDate TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      avatar TEXT,
      parentContact TEXT,
      notes TEXT,
      gender TEXT CHECK (gender IN ('K', 'E')) DEFAULT 'K',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS student_documents (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      dataUrl TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS attendance (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);
}
