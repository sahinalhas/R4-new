import type Database from 'better-sqlite3';

export const migration025 = {
  version: 25,
  name: 'add-family-context-profiles',
  up: (db: Database.Database) => {
    // Check if table exists
    const tableExists = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='family_context_profiles'
    `).get();

    if (!tableExists) {
      db.exec(`
        CREATE TABLE family_context_profiles (
          id TEXT PRIMARY KEY,
          studentId TEXT NOT NULL,
          parentalInvolvementLevel TEXT CHECK (parentalInvolvementLevel IN ('DÜŞÜK', 'ORTA', 'YÜKSEK')),
          familyStabilityLevel TEXT CHECK (familyStabilityLevel IN ('STABLE', 'TRANSITIONING', 'UNSTABLE')),
          communicationQuality TEXT CHECK (communicationQuality IN ('İYİ', 'KARMA', 'SORUNLU')),
          familyIncomeLevel TEXT,
          householdSize INTEGER,
          numberOfSiblings INTEGER,
          parentEducationLevel TEXT,
          homeEnvironmentQuality TEXT,
          accessToResources TEXT,
          culturalFactors TEXT,
          notes TEXT,
          assessmentDate TEXT NOT NULL,
          assessedBy TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
        )
      `);
      console.log('✅ family_context_profiles table created successfully');
    }
  },
  down: (db: Database.Database) => {
    db.exec('DROP TABLE IF EXISTS family_context_profiles');
  }
};
