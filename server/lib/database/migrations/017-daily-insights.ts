import type Database from 'better-sqlite3';

export const migration017 = {
  version: 17,
  name: 'daily-insights',
  up(db: Database.Database): void {
    console.log('Running migration: 017-daily-insights');

  // Daily insights tablosu - Her günün rehberlik özeti
  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_insights (
      id TEXT PRIMARY KEY,
      insightDate TEXT NOT NULL,
      reportType TEXT NOT NULL CHECK (reportType IN ('GÜNLÜK', 'HAFTALIK', 'AYLIK')),
      summary TEXT NOT NULL,
      
      -- İstatistikler
      totalStudents INTEGER DEFAULT 0,
      highRiskCount INTEGER DEFAULT 0,
      mediumRiskCount INTEGER DEFAULT 0,
      criticalAlertsCount INTEGER DEFAULT 0,
      newAlertsCount INTEGER DEFAULT 0,
      
      -- Öne çıkan bulgular
      keyFindings TEXT,
      
      -- Öneriler
      priorityActions TEXT,
      suggestedMeetings TEXT,
      
      -- AI Analizi
      aiInsights TEXT,
      trendAnalysis TEXT,
      
      -- Meta
      generatedBy TEXT DEFAULT 'system',
      generatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      
      UNIQUE(insightDate, reportType)
    );
  `);

  // Student daily status - Her öğrencinin günlük durumu
  db.exec(`
    CREATE TABLE IF NOT EXISTS student_daily_status (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      statusDate TEXT NOT NULL,
      
      -- Durum özeti
      overallStatus TEXT CHECK (overallStatus IN ('İYİ', 'DİKKAT', 'ACİL')),
      statusNotes TEXT,
      
      -- Değişimler
      academicChange REAL,
      behaviorChange INTEGER,
      attendanceChange REAL,
      
      -- Flagler
      needsAttention INTEGER DEFAULT 0,
      hasNewAlert INTEGER DEFAULT 0,
      hasCriticalAlert INTEGER DEFAULT 0,
      
      -- Pattern tespitleri
      detectedPatterns TEXT,
      
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE,
      UNIQUE(studentId, statusDate)
    );
  `);

  // Proactive alerts - Sistemin kendi tespit ettiği uyarılar
  db.exec(`
    CREATE TABLE IF NOT EXISTS proactive_alerts (
      id TEXT PRIMARY KEY,
      studentId TEXT,
      alertCategory TEXT NOT NULL CHECK (alertCategory IN (
        'AKADEMİK_DÜŞÜŞ', 
        'DAVRANIŞSAL_PATTERN', 
        'DEVAMSIZLIK_ARTIŞI',
        'SOSYAL_İZOLASYON',
        'RİSK_ARTIŞI',
        'POZİTİF_GELİŞİM'
      )),
      severity TEXT NOT NULL CHECK (severity IN ('BİLGİ', 'DİKKAT', 'YÜKSEK', 'KRİTİK')),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      evidence TEXT,
      recommendation TEXT,
      
      status TEXT DEFAULT 'YENİ' CHECK (status IN ('YENİ', 'GÖRÜLDÜ', 'AKSIYONA_ALINDI', 'ÇÖZÜLDÜ', 'GÖRMEZDEN_GELİNDİ')),
      
      assignedTo TEXT,
      actionTaken TEXT,
      
      detectedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      acknowledgedAt DATETIME,
      resolvedAt DATETIME,
      
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  // İndeksler
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_daily_insights_date ON daily_insights(insightDate);
    CREATE INDEX IF NOT EXISTS idx_student_daily_status_date ON student_daily_status(statusDate);
    CREATE INDEX IF NOT EXISTS idx_student_daily_status_student ON student_daily_status(studentId);
    CREATE INDEX IF NOT EXISTS idx_student_daily_status_needs_attention ON student_daily_status(needsAttention);
    CREATE INDEX IF NOT EXISTS idx_proactive_alerts_status ON proactive_alerts(status);
    CREATE INDEX IF NOT EXISTS idx_proactive_alerts_severity ON proactive_alerts(severity);
    CREATE INDEX IF NOT EXISTS idx_proactive_alerts_student ON proactive_alerts(studentId);
    CREATE INDEX IF NOT EXISTS idx_proactive_alerts_detected ON proactive_alerts(detectedAt);
  `);

    console.log('Migration 017-daily-insights completed');
  },
  
  down(db: Database.Database): void {
    db.exec('DROP TABLE IF EXISTS proactive_alerts');
    db.exec('DROP TABLE IF EXISTS student_daily_status');
    db.exec('DROP TABLE IF EXISTS daily_insights');
  }
};
