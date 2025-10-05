import type Database from 'better-sqlite3';

export const migration008 = {
  version: 8,
  name: 'add_participant_fields',
  up: (db: Database.Database) => {
    console.log('Adding participant type fields to counseling_sessions...');
    const sessionCols = db.prepare('PRAGMA table_info(counseling_sessions)').all() as { name: string }[];
    
    if (!sessionCols.some(col => col.name === 'parentName')) {
      db.exec('ALTER TABLE counseling_sessions ADD COLUMN parentName TEXT');
      console.log('  Added parentName column');
    }
    
    if (!sessionCols.some(col => col.name === 'parentRelationship')) {
      db.exec('ALTER TABLE counseling_sessions ADD COLUMN parentRelationship TEXT');
      console.log('  Added parentRelationship column');
    }
    
    if (!sessionCols.some(col => col.name === 'teacherName')) {
      db.exec('ALTER TABLE counseling_sessions ADD COLUMN teacherName TEXT');
      console.log('  Added teacherName column');
    }
    
    if (!sessionCols.some(col => col.name === 'teacherBranch')) {
      db.exec('ALTER TABLE counseling_sessions ADD COLUMN teacherBranch TEXT');
      console.log('  Added teacherBranch column');
    }
    
    if (!sessionCols.some(col => col.name === 'otherParticipantDescription')) {
      db.exec('ALTER TABLE counseling_sessions ADD COLUMN otherParticipantDescription TEXT');
      console.log('  Added otherParticipantDescription column');
    }
    
    console.log('Participant fields migration completed successfully');
  }
};
