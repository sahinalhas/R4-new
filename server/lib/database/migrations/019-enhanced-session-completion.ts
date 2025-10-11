import type Database from 'better-sqlite3';

export const migration019 = {
  version: 19,
  name: 'enhanced_session_completion',
  up: (db: Database.Database) => {
    console.log('Adding enhanced completion fields to counseling_sessions...');
    const sessionCols = db.prepare('PRAGMA table_info(counseling_sessions)').all() as { name: string }[];
    
    if (!sessionCols.some(col => col.name === 'sessionFlow')) {
      db.exec(`ALTER TABLE counseling_sessions ADD COLUMN sessionFlow TEXT 
        CHECK (sessionFlow IN ('çok_olumlu', 'olumlu', 'nötr', 'sorunlu', 'kriz'))`);
      console.log('  Added sessionFlow column');
    }
    
    if (!sessionCols.some(col => col.name === 'studentParticipationLevel')) {
      db.exec(`ALTER TABLE counseling_sessions ADD COLUMN studentParticipationLevel TEXT 
        CHECK (studentParticipationLevel IN ('çok_aktif', 'aktif', 'pasif', 'dirençli', 'kapalı'))`);
      console.log('  Added studentParticipationLevel column');
    }
    
    if (!sessionCols.some(col => col.name === 'cooperationLevel')) {
      db.exec('ALTER TABLE counseling_sessions ADD COLUMN cooperationLevel INTEGER CHECK (cooperationLevel BETWEEN 1 AND 5)');
      console.log('  Added cooperationLevel column');
    }
    
    if (!sessionCols.some(col => col.name === 'emotionalState')) {
      db.exec(`ALTER TABLE counseling_sessions ADD COLUMN emotionalState TEXT 
        CHECK (emotionalState IN ('sakin', 'kaygılı', 'üzgün', 'sinirli', 'mutlu', 'karışık', 'diğer'))`);
      console.log('  Added emotionalState column');
    }
    
    if (!sessionCols.some(col => col.name === 'physicalState')) {
      db.exec(`ALTER TABLE counseling_sessions ADD COLUMN physicalState TEXT 
        CHECK (physicalState IN ('normal', 'yorgun', 'huzursuz', 'ajite'))`);
      console.log('  Added physicalState column');
    }
    
    if (!sessionCols.some(col => col.name === 'communicationQuality')) {
      db.exec(`ALTER TABLE counseling_sessions ADD COLUMN communicationQuality TEXT 
        CHECK (communicationQuality IN ('açık', 'ketum', 'seçici', 'kapalı'))`);
      console.log('  Added communicationQuality column');
    }
    
    if (!sessionCols.some(col => col.name === 'sessionTags')) {
      db.exec('ALTER TABLE counseling_sessions ADD COLUMN sessionTags TEXT');
      console.log('  Added sessionTags column (JSON array)');
    }
    
    if (!sessionCols.some(col => col.name === 'achievedOutcomes')) {
      db.exec('ALTER TABLE counseling_sessions ADD COLUMN achievedOutcomes TEXT');
      console.log('  Added achievedOutcomes column');
    }
    
    if (!sessionCols.some(col => col.name === 'followUpNeeded')) {
      db.exec('ALTER TABLE counseling_sessions ADD COLUMN followUpNeeded BOOLEAN DEFAULT FALSE');
      console.log('  Added followUpNeeded column');
    }
    
    if (!sessionCols.some(col => col.name === 'followUpPlan')) {
      db.exec('ALTER TABLE counseling_sessions ADD COLUMN followUpPlan TEXT');
      console.log('  Added followUpPlan column');
    }
    
    if (!sessionCols.some(col => col.name === 'actionItems')) {
      db.exec('ALTER TABLE counseling_sessions ADD COLUMN actionItems TEXT');
      console.log('  Added actionItems column (JSON array)');
    }
    
    if (!sessionCols.some(col => col.name === 'aiAnalysisData')) {
      db.exec('ALTER TABLE counseling_sessions ADD COLUMN aiAnalysisData TEXT');
      console.log('  Added aiAnalysisData column (JSON for AI processing)');
    }
    
    console.log('Enhanced session completion migration completed successfully');
  },
  
  down: (db: Database.Database) => {
    console.log('Rolling back enhanced completion fields...');
    
    console.log('SQLite does not support DROP COLUMN, data preserved but columns remain');
  }
};
