import type Database from 'better-sqlite3';

export function createSettingsTables(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS app_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      settings TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      userId TEXT PRIMARY KEY,
      userData TEXT NOT NULL,
      demoNoticeSeen BOOLEAN DEFAULT FALSE,
      lastActive DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version INTEGER NOT NULL UNIQUE,
      name TEXT NOT NULL,
      executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS weekly_slots (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      subjectId TEXT NOT NULL,
      dayOfWeek INTEGER NOT NULL,
      startTime TEXT NOT NULL,
      duration INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE,
      FOREIGN KEY (subjectId) REFERENCES subjects (id) ON DELETE CASCADE
    );
  `);

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

  db.exec(`
    CREATE TABLE IF NOT EXISTS behavior_incidents (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      incidentDate TEXT NOT NULL,
      incidentTime TEXT NOT NULL,
      location TEXT NOT NULL,
      behaviorType TEXT NOT NULL CHECK (behaviorType IN ('OLUMLU', 'KÜÇÜK_İHLAL', 'ORTA_DÜZEY', 'CİDDİ', 'ÇOK_CİDDİ')),
      behaviorCategory TEXT NOT NULL,
      description TEXT NOT NULL,
      antecedent TEXT,
      consequence TEXT,
      duration INTEGER,
      intensity TEXT CHECK (intensity IN ('DÜŞÜK', 'ORTA', 'YÜKSEK')),
      frequency TEXT,
      witnessedBy TEXT,
      othersInvolved TEXT,
      interventionUsed TEXT,
      interventionEffectiveness TEXT CHECK (interventionEffectiveness IN ('ÇOK_ETKİLİ', 'ETKİLİ', 'KISMEN_ETKİLİ', 'ETKİSİZ')),
      parentNotified BOOLEAN DEFAULT FALSE,
      parentNotificationMethod TEXT,
      parentResponse TEXT,
      followUpRequired BOOLEAN DEFAULT FALSE,
      followUpDate TEXT,
      followUpNotes TEXT,
      adminNotified BOOLEAN DEFAULT FALSE,
      consequenceGiven TEXT,
      supportProvided TEXT,
      triggerAnalysis TEXT,
      patternNotes TEXT,
      positiveAlternative TEXT,
      status TEXT DEFAULT 'AÇIK' CHECK (status IN ('AÇIK', 'DEVAM_EDIYOR', 'ÇÖZÜLDÜ', 'İZLENIYOR')),
      recordedBy TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);
}
