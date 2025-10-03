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

  db.exec(`
    CREATE TABLE IF NOT EXISTS home_visits (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      visitDate TEXT NOT NULL,
      visitReason TEXT NOT NULL,
      observations TEXT,
      familyInteraction TEXT,
      homeEnvironment TEXT,
      recommendations TEXT,
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
}
