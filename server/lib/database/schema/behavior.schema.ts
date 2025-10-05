import type Database from 'better-sqlite3';

export function createBehaviorTable(db: Database.Database): void {
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
