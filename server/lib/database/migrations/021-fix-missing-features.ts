import type Database from 'better-sqlite3';

export const migration021 = {
  version: 21,
  name: 'fix_missing_features',
  up: (db: Database.Database) => {
    console.log('🔧 Fixing missing database features...');

    // 1. Add 'reason' column to attendance table
    const attendanceCols = db.prepare('PRAGMA table_info(attendance)').all() as { name: string }[];
    const hasReasonCol = attendanceCols.some((col) => col.name === 'reason');
    
    if (!hasReasonCol) {
      console.log('Adding reason column to attendance table...');
      db.exec('ALTER TABLE attendance ADD COLUMN reason TEXT');
    }

    // 2. Create attendance_records table (if it doesn't exist)
    db.exec(`
      CREATE TABLE IF NOT EXISTS attendance_records (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED', 'TARDY')),
        period TEXT,
        subject TEXT,
        reason TEXT,
        notes TEXT,
        recordedBy TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
      );
    `);

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_attendance_records_student ON attendance_records(studentId);
      CREATE INDEX IF NOT EXISTS idx_attendance_records_date ON attendance_records(date);
      CREATE INDEX IF NOT EXISTS idx_attendance_records_status ON attendance_records(status);
    `);

    // 3. Add missing columns to students table
    const studentsCols = db.prepare('PRAGMA table_info(students)').all() as { name: string }[];
    
    const hasPrimaryLearningStyle = studentsCols.some((col) => col.name === 'primaryLearningStyle');
    const hasEnglishScore = studentsCols.some((col) => col.name === 'englishScore');
    
    if (!hasPrimaryLearningStyle) {
      console.log('Adding primaryLearningStyle column to students table...');
      db.exec(`ALTER TABLE students ADD COLUMN primaryLearningStyle TEXT CHECK (primaryLearningStyle IN ('VISUAL', 'AUDITORY', 'KINESTHETIC', 'READ_WRITE', 'MULTIMODAL'))`);
    }
    
    if (!hasEnglishScore) {
      console.log('Adding englishScore column to students table...');
      db.exec('ALTER TABLE students ADD COLUMN englishScore REAL');
    }

    console.log('✅ Missing features fixed successfully');
  },

  down: (db: Database.Database) => {
    // Note: SQLite doesn't support DROP COLUMN, so we can't truly rollback column additions
    db.exec('DROP TABLE IF EXISTS attendance_records;');
  }
};
