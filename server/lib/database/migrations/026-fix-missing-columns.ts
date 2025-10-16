import type Database from 'better-sqlite3';

export const migration026 = {
  version: 26,
  name: 'fix-missing-columns-and-tables',
  up: (db: Database.Database) => {
    // 1. Add eventName column to family_participation if it doesn't exist
    const familyPartCols = db.prepare('PRAGMA table_info(family_participation)').all() as { name: string }[];
    const hasEventName = familyPartCols.some((col) => col.name === 'eventName');
    if (!hasEventName) {
      db.exec('ALTER TABLE family_participation ADD COLUMN eventName TEXT');
      console.log('✅ Added eventName column to family_participation');
    }

    // 2. Add additional family_participation columns if they don't exist
    const hasParticipationStatus = familyPartCols.some((col) => col.name === 'participationStatus');
    if (!hasParticipationStatus) {
      db.exec('ALTER TABLE family_participation ADD COLUMN participationStatus TEXT');
    }

    const hasParticipants = familyPartCols.some((col) => col.name === 'participants');
    if (!hasParticipants) {
      db.exec('ALTER TABLE family_participation ADD COLUMN participants TEXT');
    }

    const hasEngagementLevel = familyPartCols.some((col) => col.name === 'engagementLevel');
    if (!hasEngagementLevel) {
      db.exec('ALTER TABLE family_participation ADD COLUMN engagementLevel TEXT');
    }

    const hasCommunicationFrequency = familyPartCols.some((col) => col.name === 'communicationFrequency');
    if (!hasCommunicationFrequency) {
      db.exec('ALTER TABLE family_participation ADD COLUMN communicationFrequency TEXT');
    }

    const hasPreferredContactMethod = familyPartCols.some((col) => col.name === 'preferredContactMethod');
    if (!hasPreferredContactMethod) {
      db.exec('ALTER TABLE family_participation ADD COLUMN preferredContactMethod TEXT');
    }

    const hasParentAvailability = familyPartCols.some((col) => col.name === 'parentAvailability');
    if (!hasParentAvailability) {
      db.exec('ALTER TABLE family_participation ADD COLUMN parentAvailability TEXT');
    }

    const hasNotes = familyPartCols.some((col) => col.name === 'notes');
    if (!hasNotes) {
      db.exec('ALTER TABLE family_participation ADD COLUMN notes TEXT');
    }

    const hasRecordedBy = familyPartCols.some((col) => col.name === 'recordedBy');
    if (!hasRecordedBy) {
      db.exec('ALTER TABLE family_participation ADD COLUMN recordedBy TEXT');
    }

    const hasRecordedAt = familyPartCols.some((col) => col.name === 'recordedAt');
    if (!hasRecordedAt) {
      db.exec('ALTER TABLE family_participation ADD COLUMN recordedAt TEXT');
    }

    // 3. Create family_context_profiles table if it doesn't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS family_context_profiles (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        familyStructure TEXT,
        primaryCaregiver TEXT,
        numberOfSiblings INTEGER,
        birthOrder TEXT,
        homeLanguage TEXT,
        socioeconomicStatus TEXT,
        parentEducationLevel TEXT,
        parentOccupation TEXT,
        familyDynamics TEXT,
        supportSystem TEXT,
        culturalFactors TEXT,
        stressors TEXT,
        strengths TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Created family_context_profiles table');

    // 4. Fix weekly_slots - add 'day' as alias for 'dayOfWeek' if needed
    const weeklyCols = db.prepare('PRAGMA table_info(weekly_slots)').all() as { name: string }[];
    const hasDay = weeklyCols.some((col) => col.name === 'day');
    const hasDayOfWeek = weeklyCols.some((col) => col.name === 'dayOfWeek');
    
    if (!hasDay && hasDayOfWeek) {
      // SQLite doesn't support ALTER COLUMN, so we add a new column and copy data
      db.exec('ALTER TABLE weekly_slots ADD COLUMN day INTEGER');
      db.exec('UPDATE weekly_slots SET day = dayOfWeek');
      console.log('✅ Added day column to weekly_slots');
    }

    // 5. Add endTime to weekly_slots if missing
    const hasEndTime = weeklyCols.some((col) => col.name === 'endTime');
    if (!hasEndTime) {
      db.exec('ALTER TABLE weekly_slots ADD COLUMN endTime TEXT');
      console.log('✅ Added endTime column to weekly_slots');
    }
  },
  down: (db: Database.Database) => {
    // Down migrations for SQLite are complex due to limited ALTER TABLE support
    // We'll leave tables/columns in place for safety
    console.log('⚠️ Down migration not implemented for safety - columns/tables will remain');
  }
};
