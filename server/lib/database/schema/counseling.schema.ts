import type Database from 'better-sqlite3';

export function createCounselingTables(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS meeting_notes (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      date TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('Bireysel', 'Grup', 'Veli')),
      note TEXT NOT NULL,
      plan TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS counseling_sessions (
      id TEXT PRIMARY KEY,
      sessionType TEXT NOT NULL CHECK (sessionType IN ('individual', 'group')),
      groupName TEXT,
      counselorId TEXT NOT NULL,
      sessionDate TEXT NOT NULL,
      entryTime TEXT NOT NULL,
      entryClassHourId INTEGER,
      exitTime TEXT,
      exitClassHourId INTEGER,
      topic TEXT NOT NULL,
      participantType TEXT NOT NULL,
      relationshipType TEXT,
      otherParticipants TEXT,
      parentName TEXT,
      parentRelationship TEXT,
      teacherName TEXT,
      teacherBranch TEXT,
      otherParticipantDescription TEXT,
      sessionMode TEXT NOT NULL CHECK (sessionMode IN ('yüz_yüze', 'telefon', 'online')),
      sessionLocation TEXT NOT NULL,
      disciplineStatus TEXT,
      institutionalCooperation TEXT,
      sessionDetails TEXT,
      detailedNotes TEXT,
      autoCompleted BOOLEAN DEFAULT FALSE,
      extensionGranted BOOLEAN DEFAULT FALSE,
      completed BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS counseling_session_students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sessionId TEXT NOT NULL,
      studentId TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sessionId) REFERENCES counseling_sessions (id) ON DELETE CASCADE,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE,
      UNIQUE(sessionId, studentId)
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS parent_meetings (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      meetingDate TEXT NOT NULL,
      attendees TEXT NOT NULL,
      topics TEXT NOT NULL,
      outcomes TEXT,
      followUpActions TEXT,
      nextMeetingDate TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  db.exec(`DROP TABLE IF EXISTS home_visits`);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS home_visits (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT,
      visitDuration INTEGER,
      visitors TEXT,
      familyPresent TEXT,
      homeEnvironment TEXT,
      familyInteraction TEXT,
      observations TEXT,
      recommendations TEXT,
      concerns TEXT,
      resources TEXT,
      followUpActions TEXT,
      nextVisitPlanned TEXT,
      notes TEXT,
      createdBy TEXT,
      createdAt TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS family_participation (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      eventDate TEXT NOT NULL,
      eventType TEXT NOT NULL,
      description TEXT,
      participantNames TEXT,
      outcomes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS counseling_reminders (
      id TEXT PRIMARY KEY,
      sessionId TEXT,
      reminderType TEXT NOT NULL CHECK (reminderType IN ('planned_session', 'follow_up', 'parent_meeting')),
      reminderDate TEXT NOT NULL,
      reminderTime TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      studentIds TEXT,
      status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')) DEFAULT 'pending',
      notificationSent BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sessionId) REFERENCES counseling_sessions (id) ON DELETE SET NULL
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS counseling_follow_ups (
      id TEXT PRIMARY KEY,
      sessionId TEXT,
      followUpDate TEXT NOT NULL,
      assignedTo TEXT NOT NULL,
      priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
      status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
      actionItems TEXT NOT NULL,
      notes TEXT,
      completedDate TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sessionId) REFERENCES counseling_sessions (id) ON DELETE SET NULL
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS counseling_outcomes (
      id TEXT PRIMARY KEY,
      sessionId TEXT NOT NULL,
      effectivenessRating INTEGER CHECK (effectivenessRating BETWEEN 1 AND 5),
      progressNotes TEXT,
      goalsAchieved TEXT,
      nextSteps TEXT,
      recommendations TEXT,
      followUpRequired BOOLEAN DEFAULT FALSE,
      followUpDate TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sessionId) REFERENCES counseling_sessions (id) ON DELETE CASCADE
    );
  `);
}
