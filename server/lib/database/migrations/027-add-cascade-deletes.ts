import type Database from 'better-sqlite3';

export const migration027 = {
  version: 27,
  name: 'add-cascade-delete-rules',
  up: (db: Database.Database) => {
    db.exec('PRAGMA foreign_keys = OFF;');
    
    db.exec(`
      CREATE TABLE counseling_follow_ups_new (
        id TEXT PRIMARY KEY,
        sessionId TEXT NOT NULL,
        description TEXT NOT NULL,
        dueDate TEXT NOT NULL,
        status TEXT DEFAULT 'PENDING',
        completedAt TEXT,
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sessionId) REFERENCES counseling_sessions(id) ON DELETE CASCADE
      );

      INSERT INTO counseling_follow_ups_new SELECT * FROM counseling_follow_ups;
      DROP TABLE counseling_follow_ups;
      ALTER TABLE counseling_follow_ups_new RENAME TO counseling_follow_ups;

      CREATE TABLE counseling_reminders_new (
        id TEXT PRIMARY KEY,
        sessionId TEXT NOT NULL,
        reminderDate TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'PENDING',
        sentAt TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sessionId) REFERENCES counseling_sessions(id) ON DELETE CASCADE
      );

      INSERT INTO counseling_reminders_new SELECT * FROM counseling_reminders;
      DROP TABLE counseling_reminders;
      ALTER TABLE counseling_reminders_new RENAME TO counseling_reminders;

      CREATE TABLE achievements_new (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        date TEXT,
        impact TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
      );

      INSERT INTO achievements_new SELECT * FROM achievements;
      DROP TABLE achievements;
      ALTER TABLE achievements_new RENAME TO achievements;

      CREATE TABLE smart_goals_new (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        specific TEXT NOT NULL,
        measurable TEXT NOT NULL,
        achievable TEXT NOT NULL,
        relevant TEXT NOT NULL,
        timeBound TEXT NOT NULL,
        status TEXT DEFAULT 'IN_PROGRESS',
        progress INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
      );

      INSERT INTO smart_goals_new SELECT * FROM smart_goals;
      DROP TABLE smart_goals;
      ALTER TABLE smart_goals_new RENAME TO smart_goals;

      CREATE TABLE family_participation_new (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        eventType TEXT NOT NULL,
        eventName TEXT,
        date TEXT NOT NULL,
        attendees TEXT,
        participationStatus TEXT,
        participants TEXT,
        engagementLevel TEXT,
        communicationFrequency TEXT,
        preferredContactMethod TEXT,
        parentAvailability TEXT,
        notes TEXT,
        recordedBy TEXT,
        recordedAt TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
      );

      INSERT INTO family_participation_new SELECT * FROM family_participation;
      DROP TABLE family_participation;
      ALTER TABLE family_participation_new RENAME TO family_participation;
    `);

    db.exec('PRAGMA foreign_keys = ON;');
    
    console.log('✅ Added CASCADE DELETE rules to critical tables');
  },
  down: (db: Database.Database) => {
    console.log('⚠️ Down migration not implemented - CASCADE DELETE rules will remain');
  }
};
