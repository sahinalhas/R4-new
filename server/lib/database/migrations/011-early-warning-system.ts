import type Database from 'better-sqlite3';

export const migration011 = {
  version: 11,
  name: 'early_warning_system',
  up: (db: Database.Database) => {
    console.log('Creating early warning system tables...');

    db.exec(`
      CREATE TABLE IF NOT EXISTS risk_score_history (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        assessmentDate TEXT NOT NULL,
        academicScore REAL DEFAULT 0,
        behavioralScore REAL DEFAULT 0,
        attendanceScore REAL DEFAULT 0,
        socialEmotionalScore REAL DEFAULT 0,
        overallRiskScore REAL NOT NULL,
        riskLevel TEXT NOT NULL CHECK (riskLevel IN ('DÜŞÜK', 'ORTA', 'YÜKSEK', 'KRİTİK')),
        dataPoints TEXT,
        calculationMethod TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
      );
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS early_warning_alerts (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        alertType TEXT NOT NULL,
        alertLevel TEXT NOT NULL CHECK (alertLevel IN ('DÜŞÜK', 'ORTA', 'YÜKSEK', 'KRİTİK')),
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        triggerCondition TEXT,
        triggerValue TEXT,
        threshold TEXT,
        dataSource TEXT,
        status TEXT DEFAULT 'AÇIK' CHECK (status IN ('AÇIK', 'İNCELENİYOR', 'MÜDAHALE_EDİLDİ', 'ÇÖZÜLDÜ', 'KAPALI')),
        assignedTo TEXT,
        notifiedAt TEXT,
        reviewedAt TEXT,
        resolvedAt TEXT,
        resolution TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
      );
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS intervention_recommendations (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        alertId TEXT,
        recommendationType TEXT NOT NULL,
        priority TEXT NOT NULL CHECK (priority IN ('DÜŞÜK', 'ORTA', 'YÜKSEK', 'ACİL')),
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        suggestedActions TEXT NOT NULL,
        targetArea TEXT NOT NULL,
        expectedOutcome TEXT,
        resources TEXT,
        estimatedDuration TEXT,
        status TEXT DEFAULT 'ÖNERİLDİ' CHECK (status IN ('ÖNERİLDİ', 'PLANLANDI', 'UYGULANMAKTA', 'TAMAMLANDI', 'REDDEDİLDİ')),
        implementedBy TEXT,
        implementedAt TEXT,
        effectiveness TEXT CHECK (effectiveness IN ('ÇOK_ETKİLİ', 'ETKİLİ', 'KISMEN_ETKİLİ', 'ETKİSİZ', 'DEĞERLENDİRİLMEDİ')),
        followUpDate TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE,
        FOREIGN KEY (alertId) REFERENCES early_warning_alerts (id) ON DELETE SET NULL
      );
    `);

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_risk_score_history_student 
      ON risk_score_history(studentId, assessmentDate DESC);
    `);

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_early_warning_alerts_student 
      ON early_warning_alerts(studentId, status, alertLevel);
    `);

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_intervention_recommendations_student 
      ON intervention_recommendations(studentId, status, priority);
    `);

    console.log('Early warning system tables created successfully');
  }
};
