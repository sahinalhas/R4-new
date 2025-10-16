import type Database from 'better-sqlite3';

export const migration028 = {
  version: 28,
  name: 'add-composite-indexes-for-performance',
  up: (db: Database.Database) => {
    console.log('✅ Creating composite indexes for query optimization...');
    
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_meeting_notes_student_date ON meeting_notes(studentId, date)',
      'CREATE INDEX IF NOT EXISTS idx_behavior_incidents_student_date ON behavior_incidents(studentId, incidentDate)',
      'CREATE INDEX IF NOT EXISTS idx_achievements_student_date ON achievements(studentId, date)',
      'CREATE INDEX IF NOT EXISTS idx_counseling_follow_ups_session_status ON counseling_follow_ups(sessionId, status)',
      'CREATE INDEX IF NOT EXISTS idx_counseling_sessions_date ON counseling_sessions(sessionDate)',
      'CREATE INDEX IF NOT EXISTS idx_counseling_session_students_student ON counseling_session_students(studentId, sessionId)'
    ];

    db.exec('BEGIN TRANSACTION;');
    
    try {
      for (const indexSql of indexes) {
        db.exec(indexSql);
      }
      
      db.exec('COMMIT;');
      console.log('✅ All composite indexes created successfully');
    } catch (error: any) {
      db.exec('ROLLBACK;');
      console.error(`Failed to create indexes: ${error.message}`);
      throw error;
    }
  },
  down: (db: Database.Database) => {
    db.exec(`
      DROP INDEX IF EXISTS idx_meeting_notes_student_date;
      DROP INDEX IF EXISTS idx_behavior_incidents_student_date;
      DROP INDEX IF EXISTS idx_achievements_student_date;
      DROP INDEX IF EXISTS idx_counseling_follow_ups_session_status;
      DROP INDEX IF EXISTS idx_counseling_sessions_date;
      DROP INDEX IF EXISTS idx_counseling_session_students_student;
    `);
    console.log('✅ Removed composite indexes');
  }
};
