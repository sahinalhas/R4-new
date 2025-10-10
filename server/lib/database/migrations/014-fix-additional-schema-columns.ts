import type Database from 'better-sqlite3';

export const migration014 = {
  version: 14,
  name: 'fix_additional_schema_columns',
  up: (db: Database.Database) => {
    const parentMeetingsCols = db.prepare('PRAGMA table_info(parent_meetings)').all() as { name: string }[];
    const multipleIntelligenceCols = db.prepare('PRAGMA table_info(multiple_intelligence)').all() as { name: string }[];
    const homeVisitsCols = db.prepare('PRAGMA table_info(home_visits)').all() as { name: string }[];
    const evaluations360Cols = db.prepare('PRAGMA table_info(evaluations_360)').all() as { name: string }[];

    const hasColumn = (cols: { name: string }[], colName: string) => 
      cols.some((col) => col.name === colName);

    if (!hasColumn(parentMeetingsCols, 'time')) {
      db.exec('ALTER TABLE parent_meetings ADD COLUMN time TEXT');
    }
    if (!hasColumn(parentMeetingsCols, 'type')) {
      db.exec('ALTER TABLE parent_meetings ADD COLUMN type TEXT');
    }
    if (!hasColumn(parentMeetingsCols, 'participants')) {
      db.exec('ALTER TABLE parent_meetings ADD COLUMN participants TEXT');
    }
    if (!hasColumn(parentMeetingsCols, 'mainTopics')) {
      db.exec('ALTER TABLE parent_meetings ADD COLUMN mainTopics TEXT');
    }
    if (!hasColumn(parentMeetingsCols, 'concerns')) {
      db.exec('ALTER TABLE parent_meetings ADD COLUMN concerns TEXT');
    }
    if (!hasColumn(parentMeetingsCols, 'decisions')) {
      db.exec('ALTER TABLE parent_meetings ADD COLUMN decisions TEXT');
    }
    if (!hasColumn(parentMeetingsCols, 'actionPlan')) {
      db.exec('ALTER TABLE parent_meetings ADD COLUMN actionPlan TEXT');
    }
    if (!hasColumn(parentMeetingsCols, 'parentSatisfaction')) {
      db.exec('ALTER TABLE parent_meetings ADD COLUMN parentSatisfaction INTEGER');
    }

    if (!hasColumn(multipleIntelligenceCols, 'linguisticVerbal')) {
      db.exec('ALTER TABLE multiple_intelligence ADD COLUMN linguisticVerbal INTEGER');
      db.exec('UPDATE multiple_intelligence SET linguisticVerbal = linguistic WHERE linguisticVerbal IS NULL');
    }
    if (!hasColumn(multipleIntelligenceCols, 'visualSpatial')) {
      db.exec('ALTER TABLE multiple_intelligence ADD COLUMN visualSpatial INTEGER');
      db.exec('UPDATE multiple_intelligence SET visualSpatial = spatial WHERE visualSpatial IS NULL');
    }
    if (!hasColumn(multipleIntelligenceCols, 'dominantIntelligences')) {
      db.exec('ALTER TABLE multiple_intelligence ADD COLUMN dominantIntelligences TEXT');
    }
    if (!hasColumn(multipleIntelligenceCols, 'developmentAreas')) {
      db.exec('ALTER TABLE multiple_intelligence ADD COLUMN developmentAreas TEXT');
    }
    if (!hasColumn(multipleIntelligenceCols, 'recommendations')) {
      db.exec('ALTER TABLE multiple_intelligence ADD COLUMN recommendations TEXT');
    }

    if (!hasColumn(homeVisitsCols, 'date')) {
      db.exec('ALTER TABLE home_visits ADD COLUMN date TEXT');
      db.exec('UPDATE home_visits SET date = visitDate WHERE date IS NULL');
    }
    if (!hasColumn(homeVisitsCols, 'time')) {
      db.exec('ALTER TABLE home_visits ADD COLUMN time TEXT');
    }
    if (!hasColumn(homeVisitsCols, 'visitDuration')) {
      db.exec('ALTER TABLE home_visits ADD COLUMN visitDuration TEXT');
    }
    if (!hasColumn(homeVisitsCols, 'visitors')) {
      db.exec('ALTER TABLE home_visits ADD COLUMN visitors TEXT');
    }
    if (!hasColumn(homeVisitsCols, 'familyPresent')) {
      db.exec('ALTER TABLE home_visits ADD COLUMN familyPresent TEXT');
    }

    if (!hasColumn(evaluations360Cols, 'selfEvaluation')) {
      db.exec('ALTER TABLE evaluations_360 ADD COLUMN selfEvaluation TEXT');
    }
    if (!hasColumn(evaluations360Cols, 'teacherEvaluation')) {
      db.exec('ALTER TABLE evaluations_360 ADD COLUMN teacherEvaluation TEXT');
    }
    if (!hasColumn(evaluations360Cols, 'peerEvaluation')) {
      db.exec('ALTER TABLE evaluations_360 ADD COLUMN peerEvaluation TEXT');
    }
    if (!hasColumn(evaluations360Cols, 'parentEvaluation')) {
      db.exec('ALTER TABLE evaluations_360 ADD COLUMN parentEvaluation TEXT');
    }
    if (!hasColumn(evaluations360Cols, 'strengths')) {
      db.exec('ALTER TABLE evaluations_360 ADD COLUMN strengths TEXT');
    }
    if (!hasColumn(evaluations360Cols, 'areasForImprovement')) {
      db.exec('ALTER TABLE evaluations_360 ADD COLUMN areasForImprovement TEXT');
    }
    if (!hasColumn(evaluations360Cols, 'actionPlan')) {
      db.exec('ALTER TABLE evaluations_360 ADD COLUMN actionPlan TEXT');
    }
  }
};
