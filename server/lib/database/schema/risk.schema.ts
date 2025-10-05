import type Database from 'better-sqlite3';

export function createRiskFactorsTable(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS risk_factors (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      riskType TEXT NOT NULL,
      riskLevel TEXT NOT NULL CHECK (riskLevel IN ('DÜŞÜK', 'ORTA', 'YÜKSEK', 'KRİTİK')),
      description TEXT NOT NULL,
      indicators TEXT,
      interventions TEXT,
      assessmentDate TEXT NOT NULL,
      reassessmentDate TEXT,
      status TEXT DEFAULT 'AKTIF' CHECK (status IN ('AKTIF', 'İZLENİYOR', 'AZALDI', 'ÇÖZÜLDÜ')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);
}
