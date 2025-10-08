import type Database from 'better-sqlite3';

export const migration010 = {
  version: 10,
  name: 'add_student_analytics_snapshot',
  up: (db: Database.Database) => {
    db.exec(`
      CREATE TABLE IF NOT EXISTS student_analytics_snapshot (
        student_id TEXT PRIMARY KEY,
        student_name TEXT NOT NULL,
        class_name TEXT,
        risk_score INTEGER NOT NULL,
        risk_level TEXT NOT NULL CHECK(risk_level IN ('Düşük', 'Orta', 'Yüksek', 'Kritik')),
        success_probability INTEGER NOT NULL,
        attendance_rate INTEGER NOT NULL,
        academic_trend INTEGER NOT NULL,
        study_consistency INTEGER NOT NULL,
        avg_exam_score REAL DEFAULT 0,
        total_sessions INTEGER DEFAULT 0,
        early_warnings TEXT,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_analytics_snapshot_risk ON student_analytics_snapshot(risk_level);
      CREATE INDEX IF NOT EXISTS idx_analytics_snapshot_class ON student_analytics_snapshot(class_name);
      CREATE INDEX IF NOT EXISTS idx_analytics_snapshot_updated ON student_analytics_snapshot(last_updated);
    `);
  }
};
