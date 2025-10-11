import type Database from 'better-sqlite3';

export function up(db: Database.Database): void {
  // Bildirim Logları Tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS notification_logs (
      id TEXT PRIMARY KEY,
      recipientType TEXT NOT NULL CHECK(recipientType IN ('PARENT', 'TEACHER', 'COUNSELOR', 'ADMIN')),
      recipientId TEXT,
      recipientName TEXT,
      recipientContact TEXT,
      notificationType TEXT NOT NULL CHECK(notificationType IN ('EMAIL', 'SMS', 'PUSH', 'IN_APP')),
      channel TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      
      studentId TEXT,
      alertId TEXT,
      interventionId TEXT,
      
      status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'SENT', 'DELIVERED', 'FAILED', 'READ')),
      priority TEXT DEFAULT 'NORMAL' CHECK(priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
      
      sentAt TEXT,
      deliveredAt TEXT,
      readAt TEXT,
      failureReason TEXT,
      
      metadata TEXT,
      templateId TEXT,
      
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
    );
  `);

  // Müdahale Etkinlik Takibi Tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS intervention_effectiveness (
      id TEXT PRIMARY KEY,
      interventionId TEXT NOT NULL,
      studentId TEXT NOT NULL,
      
      interventionType TEXT NOT NULL,
      interventionTitle TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT,
      duration INTEGER,
      
      preInterventionMetrics TEXT NOT NULL,
      postInterventionMetrics TEXT,
      
      academicImpact REAL,
      behavioralImpact REAL,
      attendanceImpact REAL,
      socialEmotionalImpact REAL,
      overallEffectiveness REAL,
      
      effectivenessLevel TEXT CHECK(effectivenessLevel IN ('VERY_EFFECTIVE', 'EFFECTIVE', 'PARTIALLY_EFFECTIVE', 'NOT_EFFECTIVE', 'PENDING')),
      
      successFactors TEXT,
      challenges TEXT,
      lessonsLearned TEXT,
      recommendations TEXT,
      
      aiAnalysis TEXT,
      patternMatches TEXT,
      similarInterventions TEXT,
      
      evaluatedBy TEXT,
      evaluatedAt TEXT,
      
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
    );
  `);

  // Veli Geri Bildirim Tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS parent_feedback (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      parentName TEXT NOT NULL,
      parentContact TEXT,
      
      feedbackType TEXT NOT NULL CHECK(feedbackType IN ('INTERVENTION', 'REPORT', 'COMMUNICATION', 'GENERAL', 'CONCERN', 'APPRECIATION')),
      relatedId TEXT,
      
      rating INTEGER CHECK(rating BETWEEN 1 AND 5),
      feedbackText TEXT,
      
      concerns TEXT,
      suggestions TEXT,
      appreciations TEXT,
      
      followUpRequired INTEGER DEFAULT 0,
      followUpNotes TEXT,
      respondedBy TEXT,
      respondedAt TEXT,
      
      status TEXT DEFAULT 'NEW' CHECK(status IN ('NEW', 'REVIEWED', 'RESPONDED', 'CLOSED')),
      
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
    );
  `);

  // Eskalasyon Logları Tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS escalation_logs (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      alertId TEXT,
      interventionId TEXT,
      
      escalationType TEXT NOT NULL CHECK(escalationType IN ('RISK_INCREASE', 'INTERVENTION_FAILURE', 'URGENT_SITUATION', 'NO_RESPONSE', 'PARENT_REQUEST')),
      currentLevel TEXT NOT NULL,
      escalatedTo TEXT NOT NULL,
      
      triggerReason TEXT NOT NULL,
      riskLevel TEXT CHECK(riskLevel IN ('DÜŞÜK', 'ORTA', 'YÜKSEK', 'KRİTİK')),
      
      escalatedBy TEXT,
      escalatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      
      responseTime INTEGER,
      respondedBy TEXT,
      respondedAt TEXT,
      
      actionTaken TEXT,
      resolution TEXT,
      
      status TEXT DEFAULT 'OPEN' CHECK(status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
      
      notificationsSent TEXT,
      
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
    );
  `);

  // Bildirim Tercihleri Tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS notification_preferences (
      id TEXT PRIMARY KEY,
      userId TEXT,
      parentId TEXT,
      studentId TEXT,
      
      userType TEXT NOT NULL CHECK(userType IN ('COUNSELOR', 'TEACHER', 'ADMIN', 'PARENT')),
      
      emailEnabled INTEGER DEFAULT 1,
      smsEnabled INTEGER DEFAULT 0,
      pushEnabled INTEGER DEFAULT 1,
      inAppEnabled INTEGER DEFAULT 1,
      
      emailAddress TEXT,
      phoneNumber TEXT,
      
      alertTypes TEXT,
      riskLevels TEXT,
      
      quietHoursStart TEXT,
      quietHoursEnd TEXT,
      
      weeklyDigest INTEGER DEFAULT 0,
      monthlyReport INTEGER DEFAULT 1,
      
      language TEXT DEFAULT 'tr',
      
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Bildirim Şablonları Tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS notification_templates (
      id TEXT PRIMARY KEY,
      templateName TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL CHECK(category IN ('RISK_ALERT', 'INTERVENTION', 'PROGRESS', 'MEETING', 'GENERAL')),
      
      language TEXT DEFAULT 'tr',
      
      subjectTemplate TEXT,
      messageTemplate TEXT NOT NULL,
      
      variables TEXT,
      
      channel TEXT NOT NULL CHECK(channel IN ('EMAIL', 'SMS', 'PUSH', 'IN_APP', 'ALL')),
      
      isActive INTEGER DEFAULT 1,
      
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Veli Erişim Tokenleri Tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS parent_access_tokens (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      parentName TEXT NOT NULL,
      parentContact TEXT NOT NULL,
      
      accessToken TEXT NOT NULL UNIQUE,
      accessLevel TEXT DEFAULT 'VIEW_ONLY' CHECK(accessLevel IN ('VIEW_ONLY', 'VIEW_AND_COMMENT', 'FULL')),
      
      expiresAt TEXT,
      isActive INTEGER DEFAULT 1,
      
      lastAccessedAt TEXT,
      accessCount INTEGER DEFAULT 0,
      
      createdBy TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
    );
  `);

  // Otomatik Görev Scheduler Tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS scheduled_tasks (
      id TEXT PRIMARY KEY,
      taskType TEXT NOT NULL CHECK(taskType IN ('WEEKLY_DIGEST', 'MONTHLY_REPORT', 'INTERVENTION_REMINDER', 'FOLLOW_UP', 'ESCALATION_CHECK')),
      
      targetType TEXT NOT NULL CHECK(targetType IN ('STUDENT', 'PARENT', 'COUNSELOR', 'ALL')),
      targetId TEXT,
      
      scheduleType TEXT NOT NULL CHECK(scheduleType IN ('ONCE', 'DAILY', 'WEEKLY', 'MONTHLY')),
      scheduledTime TEXT NOT NULL,
      
      lastRun TEXT,
      nextRun TEXT NOT NULL,
      
      status TEXT DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'PAUSED', 'COMPLETED', 'FAILED')),
      
      taskData TEXT,
      
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // İndeksler
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_notification_logs_student ON notification_logs(studentId);
    CREATE INDEX IF NOT EXISTS idx_notification_logs_status ON notification_logs(status);
    CREATE INDEX IF NOT EXISTS idx_notification_logs_created ON notification_logs(created_at);
    
    CREATE INDEX IF NOT EXISTS idx_intervention_effectiveness_student ON intervention_effectiveness(studentId);
    CREATE INDEX IF NOT EXISTS idx_intervention_effectiveness_level ON intervention_effectiveness(effectivenessLevel);
    
    CREATE INDEX IF NOT EXISTS idx_parent_feedback_student ON parent_feedback(studentId);
    CREATE INDEX IF NOT EXISTS idx_parent_feedback_status ON parent_feedback(status);
    
    CREATE INDEX IF NOT EXISTS idx_escalation_logs_student ON escalation_logs(studentId);
    CREATE INDEX IF NOT EXISTS idx_escalation_logs_status ON escalation_logs(status);
    
    CREATE INDEX IF NOT EXISTS idx_parent_access_tokens_student ON parent_access_tokens(studentId);
    CREATE INDEX IF NOT EXISTS idx_parent_access_tokens_token ON parent_access_tokens(accessToken);
    
    CREATE INDEX IF NOT EXISTS idx_scheduled_tasks_next_run ON scheduled_tasks(nextRun);
    CREATE INDEX IF NOT EXISTS idx_scheduled_tasks_status ON scheduled_tasks(status);
  `);

  // Tetikleyiciler
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_notification_logs_timestamp 
    AFTER UPDATE ON notification_logs
    BEGIN
      UPDATE notification_logs SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
    
    CREATE TRIGGER IF NOT EXISTS update_intervention_effectiveness_timestamp 
    AFTER UPDATE ON intervention_effectiveness
    BEGIN
      UPDATE intervention_effectiveness SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
    
    CREATE TRIGGER IF NOT EXISTS update_parent_feedback_timestamp 
    AFTER UPDATE ON parent_feedback
    BEGIN
      UPDATE parent_feedback SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
    
    CREATE TRIGGER IF NOT EXISTS update_escalation_logs_timestamp 
    AFTER UPDATE ON escalation_logs
    BEGIN
      UPDATE escalation_logs SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
    
    CREATE TRIGGER IF NOT EXISTS update_notification_preferences_timestamp 
    AFTER UPDATE ON notification_preferences
    BEGIN
      UPDATE notification_preferences SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
    
    CREATE TRIGGER IF NOT EXISTS update_parent_access_tokens_timestamp 
    AFTER UPDATE ON parent_access_tokens
    BEGIN
      UPDATE parent_access_tokens SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
    
    CREATE TRIGGER IF NOT EXISTS update_scheduled_tasks_timestamp 
    AFTER UPDATE ON scheduled_tasks
    BEGIN
      UPDATE scheduled_tasks SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
  `);

  // Varsayılan bildirim şablonları ekle
  db.exec(`
    INSERT OR IGNORE INTO notification_templates (id, templateName, category, language, subjectTemplate, messageTemplate, variables, channel) VALUES
    ('tpl_risk_alert_critical', 'Kritik Risk Uyarısı', 'RISK_ALERT', 'tr', 
     '⚠️ Acil: {{studentName}} için kritik risk uyarısı',
     'Sayın {{parentName}},\n\n{{studentName}} için kritik düzeyde bir risk tespit edildi.\n\nRisk Türü: {{alertType}}\nDetaylar: {{description}}\n\nLütfen en kısa sürede okul rehberlik servisi ile iletişime geçiniz.\n\nRehberlik Servisi',
     '["studentName", "parentName", "alertType", "description"]', 'ALL'),
    
    ('tpl_intervention_created', 'Yeni Müdahale Planı', 'INTERVENTION', 'tr',
     '📋 {{studentName}} için müdahale planı oluşturuldu',
     'Sayın {{parentName}},\n\n{{studentName}} için bir müdahale planı hazırlanmıştır.\n\nMüdahale: {{interventionTitle}}\nBaşlangıç: {{startDate}}\n\nDetayları görüntülemek için: {{dashboardLink}}\n\nRehberlik Servisi',
     '["studentName", "parentName", "interventionTitle", "startDate", "dashboardLink"]', 'ALL'),
    
    ('tpl_weekly_progress', 'Haftalık İlerleme Raporu', 'PROGRESS', 'tr',
     '📊 {{studentName}} - Haftalık İlerleme Raporu',
     'Sayın {{parentName}},\n\n{{studentName}} için haftalık ilerleme özeti:\n\n{{progressSummary}}\n\nDetaylı rapor: {{reportLink}}\n\nRehberlik Servisi',
     '["studentName", "parentName", "progressSummary", "reportLink"]', 'EMAIL'),
    
    ('tpl_meeting_invitation', 'Veli Görüşme Daveti', 'MEETING', 'tr',
     '📅 Veli Görüşme Daveti - {{studentName}}',
     'Sayın {{parentName}},\n\n{{studentName}} hakkında görüşmek istiyoruz.\n\nTarih: {{meetingDate}}\nSaat: {{meetingTime}}\nKonu: {{meetingTopic}}\n\nOnaylamak için: {{confirmLink}}\n\nRehberlik Servisi',
     '["studentName", "parentName", "meetingDate", "meetingTime", "meetingTopic", "confirmLink"]', 'ALL');
  `);

  console.log('✅ Migration 018: Notification automation tables created successfully');
}

export function down(db: Database.Database): void {
  db.exec(`
    DROP TRIGGER IF EXISTS update_scheduled_tasks_timestamp;
    DROP TRIGGER IF EXISTS update_parent_access_tokens_timestamp;
    DROP TRIGGER IF EXISTS update_notification_preferences_timestamp;
    DROP TRIGGER IF EXISTS update_escalation_logs_timestamp;
    DROP TRIGGER IF EXISTS update_parent_feedback_timestamp;
    DROP TRIGGER IF EXISTS update_intervention_effectiveness_timestamp;
    DROP TRIGGER IF EXISTS update_notification_logs_timestamp;
    
    DROP INDEX IF EXISTS idx_scheduled_tasks_status;
    DROP INDEX IF EXISTS idx_scheduled_tasks_next_run;
    DROP INDEX IF EXISTS idx_parent_access_tokens_token;
    DROP INDEX IF EXISTS idx_parent_access_tokens_student;
    DROP INDEX IF EXISTS idx_escalation_logs_status;
    DROP INDEX IF EXISTS idx_escalation_logs_student;
    DROP INDEX IF EXISTS idx_parent_feedback_status;
    DROP INDEX IF EXISTS idx_parent_feedback_student;
    DROP INDEX IF EXISTS idx_intervention_effectiveness_level;
    DROP INDEX IF EXISTS idx_intervention_effectiveness_student;
    DROP INDEX IF EXISTS idx_notification_logs_created;
    DROP INDEX IF EXISTS idx_notification_logs_status;
    DROP INDEX IF EXISTS idx_notification_logs_student;
    
    DROP TABLE IF EXISTS scheduled_tasks;
    DROP TABLE IF EXISTS parent_access_tokens;
    DROP TABLE IF EXISTS notification_templates;
    DROP TABLE IF EXISTS notification_preferences;
    DROP TABLE IF EXISTS escalation_logs;
    DROP TABLE IF EXISTS parent_feedback;
    DROP TABLE IF EXISTS intervention_effectiveness;
    DROP TABLE IF EXISTS notification_logs;
  `);

  console.log('✅ Migration 018: Rolled back notification automation tables');
}
