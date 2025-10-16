import type Database from 'better-sqlite3';

export const migration028 = {
  version: 28,
  name: 'add-composite-indexes-for-performance',
  up: (db: Database.Database) => {
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_counseling_sessions_student_date 
        ON counseling_sessions(studentId, sessionDate);

      CREATE INDEX IF NOT EXISTS idx_meeting_notes_student_date 
        ON meeting_notes(studentId, date);

      CREATE INDEX IF NOT EXISTS idx_survey_responses_distribution_student 
        ON survey_responses(distributionId, studentId);

      CREATE INDEX IF NOT EXISTS idx_behavior_incidents_student_date 
        ON behavior_incidents(studentId, date);

      CREATE INDEX IF NOT EXISTS idx_achievements_student_date 
        ON achievements(studentId, date);

      CREATE INDEX IF NOT EXISTS idx_exam_results_student_exam 
        ON exam_results(studentId, examId);

      CREATE INDEX IF NOT EXISTS idx_attendance_student_date 
        ON attendance_records(studentId, date);

      CREATE INDEX IF NOT EXISTS idx_special_education_student_type 
        ON special_education_records(studentId, recordType);

      CREATE INDEX IF NOT EXISTS idx_career_roadmaps_student_status 
        ON career_roadmaps(studentId, status);

      CREATE INDEX IF NOT EXISTS idx_ai_suggestions_student_status 
        ON ai_suggestions(studentId, status);

      CREATE INDEX IF NOT EXISTS idx_counseling_follow_ups_session_status 
        ON counseling_follow_ups(sessionId, status);

      CREATE INDEX IF NOT EXISTS idx_risk_score_history_student_date 
        ON risk_score_history(studentId, assessmentDate);

      CREATE INDEX IF NOT EXISTS idx_student_analytics_snapshot_student_date 
        ON student_analytics_snapshot(studentId, snapshotDate);
    `);
    
    console.log('✅ Added composite indexes for query optimization');
  },
  down: (db: Database.Database) => {
    db.exec(`
      DROP INDEX IF EXISTS idx_counseling_sessions_student_date;
      DROP INDEX IF EXISTS idx_meeting_notes_student_date;
      DROP INDEX IF EXISTS idx_survey_responses_distribution_student;
      DROP INDEX IF EXISTS idx_behavior_incidents_student_date;
      DROP INDEX IF EXISTS idx_achievements_student_date;
      DROP INDEX IF EXISTS idx_exam_results_student_exam;
      DROP INDEX IF EXISTS idx_attendance_student_date;
      DROP INDEX IF EXISTS idx_special_education_student_type;
      DROP INDEX IF EXISTS idx_career_roadmaps_student_status;
      DROP INDEX IF EXISTS idx_ai_suggestions_student_status;
      DROP INDEX IF EXISTS idx_counseling_follow_ups_session_status;
      DROP INDEX IF EXISTS idx_risk_score_history_student_date;
      DROP INDEX IF EXISTS idx_student_analytics_snapshot_student_date;
    `);
    console.log('✅ Removed composite indexes');
  }
};
