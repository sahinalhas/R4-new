import type Database from 'better-sqlite3';

export const migration015 = {
  version: 15,
  name: 'fix_remaining_columns',
  up: (db: Database.Database) => {
    const multipleIntelligenceCols = db.prepare('PRAGMA table_info(multiple_intelligence)').all() as { name: string }[];
    const homeVisitsCols = db.prepare('PRAGMA table_info(home_visits)').all() as { name: string }[];
    const parentMeetingsCols = db.prepare('PRAGMA table_info(parent_meetings)').all() as { name: string }[];
    const evaluations360Cols = db.prepare('PRAGMA table_info(evaluations_360)').all() as { name: string }[];

    const hasColumn = (cols: { name: string }[], colName: string) => 
      cols.some((col) => col.name === colName);

    if (!hasColumn(multipleIntelligenceCols, 'naturalistic')) {
      db.exec('ALTER TABLE multiple_intelligence ADD COLUMN naturalistic INTEGER');
    }

    if (!hasColumn(homeVisitsCols, 'concerns')) {
      db.exec('ALTER TABLE home_visits ADD COLUMN concerns TEXT');
    }

    if (!hasColumn(parentMeetingsCols, 'followUpRequired')) {
      db.exec('ALTER TABLE parent_meetings ADD COLUMN followUpRequired INTEGER DEFAULT 0');
    }

    if (!hasColumn(evaluations360Cols, 'notes')) {
      db.exec('ALTER TABLE evaluations_360 ADD COLUMN notes TEXT');
    }

    console.log('Migration 015: Fixed remaining schema columns');
  }
};
