/**
 * Migration 025: AI Suggestion Queue System
 * AI önerilerini onay beklemek üzere saklayan sistem
 */

import type Database from 'better-sqlite3';

export const migration025 = {
  version: 25,
  name: 'ai_suggestion_queue_system',
  up: (db: Database.Database) => {
    // AI Öneri Kuyruğu tablosu
    db.exec(`
      CREATE TABLE IF NOT EXISTS ai_suggestion_queue (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        suggestionType TEXT NOT NULL CHECK (suggestionType IN (
          'PROFILE_UPDATE',
          'RISK_ALERT',
          'INTERVENTION_PLAN',
          'MEETING_SUGGESTION',
          'FOLLOW_UP',
          'BEHAVIOR_INSIGHT',
          'ACADEMIC_INSIGHT'
        )),
        source TEXT NOT NULL,
        sourceId TEXT,
        priority TEXT NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) DEFAULT 'MEDIUM',
        status TEXT NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'MODIFIED')) DEFAULT 'PENDING',
        
        -- Öneri detayları
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        reasoning TEXT,
        confidence REAL,
        
        -- Değişiklik detayları (JSON)
        proposedChanges TEXT,
        currentValues TEXT,
        
        -- AI metadata
        aiModel TEXT,
        aiVersion TEXT,
        analysisData TEXT,
        
        -- Kullanıcı etkileşimi
        reviewedBy TEXT,
        reviewedAt TEXT,
        reviewNotes TEXT,
        feedbackRating INTEGER CHECK (feedbackRating BETWEEN 1 AND 5),
        feedbackNotes TEXT,
        
        -- Zaman damgaları
        createdAt TEXT NOT NULL DEFAULT (datetime('now')),
        expiresAt TEXT,
        appliedAt TEXT,
        
        FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (reviewedBy) REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    // İndeksler
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_ai_suggestions_student 
        ON ai_suggestion_queue(studentId);
      
      CREATE INDEX IF NOT EXISTS idx_ai_suggestions_status 
        ON ai_suggestion_queue(status);
      
      CREATE INDEX IF NOT EXISTS idx_ai_suggestions_priority 
        ON ai_suggestion_queue(priority);
      
      CREATE INDEX IF NOT EXISTS idx_ai_suggestions_created 
        ON ai_suggestion_queue(createdAt);
      
      CREATE INDEX IF NOT EXISTS idx_ai_suggestions_type 
        ON ai_suggestion_queue(suggestionType);
      
      CREATE INDEX IF NOT EXISTS idx_ai_suggestions_pending 
        ON ai_suggestion_queue(status, priority, createdAt) 
        WHERE status = 'PENDING';
    `);

    // Öneri istatistikleri tablosu
    db.exec(`
      CREATE TABLE IF NOT EXISTS ai_suggestion_stats (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        suggestionType TEXT NOT NULL,
        totalCreated INTEGER DEFAULT 0,
        totalApproved INTEGER DEFAULT 0,
        totalRejected INTEGER DEFAULT 0,
        totalModified INTEGER DEFAULT 0,
        avgConfidence REAL,
        avgFeedbackRating REAL,
        createdAt TEXT NOT NULL DEFAULT (datetime('now')),
        
        UNIQUE(date, suggestionType)
      );
    `);

    console.log('✅ Migration 025: AI Suggestion Queue System created');
  },
  
  down: (db: Database.Database) => {
    db.exec(`
      DROP INDEX IF EXISTS idx_ai_suggestions_pending;
      DROP INDEX IF EXISTS idx_ai_suggestions_type;
      DROP INDEX IF EXISTS idx_ai_suggestions_created;
      DROP INDEX IF EXISTS idx_ai_suggestions_priority;
      DROP INDEX IF EXISTS idx_ai_suggestions_status;
      DROP INDEX IF EXISTS idx_ai_suggestions_student;
      DROP TABLE IF EXISTS ai_suggestion_stats;
      DROP TABLE IF EXISTS ai_suggestion_queue;
    `);
    console.log('✅ Migration 025: AI Suggestion Queue System rolled back');
  }
};
