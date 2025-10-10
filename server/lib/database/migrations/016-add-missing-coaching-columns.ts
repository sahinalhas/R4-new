import type Database from 'better-sqlite3';

export const migration016 = {
  version: 16,
  name: 'add_missing_coaching_columns',
  up: (db: Database.Database) => {
    const parentMeetingsCols = db.prepare('PRAGMA table_info(parent_meetings)').all() as { name: string }[];
    const homeVisitsCols = db.prepare('PRAGMA table_info(home_visits)').all() as { name: string }[];

    const hasColumn = (cols: { name: string }[], colName: string) => 
      cols.some((col) => col.name === colName);

    if (!hasColumn(parentMeetingsCols, 'notes')) {
      db.exec('ALTER TABLE parent_meetings ADD COLUMN notes TEXT');
    }
    if (!hasColumn(parentMeetingsCols, 'createdBy')) {
      db.exec('ALTER TABLE parent_meetings ADD COLUMN createdBy TEXT');
    }
    if (!hasColumn(parentMeetingsCols, 'createdAt')) {
      db.exec('ALTER TABLE parent_meetings ADD COLUMN createdAt DATETIME DEFAULT CURRENT_TIMESTAMP');
    }

    if (!hasColumn(homeVisitsCols, 'resources')) {
      db.exec('ALTER TABLE home_visits ADD COLUMN resources TEXT');
    }
    if (!hasColumn(homeVisitsCols, 'homeEnvironment')) {
      db.exec('ALTER TABLE home_visits ADD COLUMN homeEnvironment TEXT');
    }
    if (!hasColumn(homeVisitsCols, 'familyInteraction')) {
      db.exec('ALTER TABLE home_visits ADD COLUMN familyInteraction TEXT');
    }
    if (!hasColumn(homeVisitsCols, 'observations')) {
      db.exec('ALTER TABLE home_visits ADD COLUMN observations TEXT');
    }
    if (!hasColumn(homeVisitsCols, 'recommendations')) {
      db.exec('ALTER TABLE home_visits ADD COLUMN recommendations TEXT');
    }
    if (!hasColumn(homeVisitsCols, 'followUpActions')) {
      db.exec('ALTER TABLE home_visits ADD COLUMN followUpActions TEXT');
    }
    if (!hasColumn(homeVisitsCols, 'nextVisitPlanned')) {
      db.exec('ALTER TABLE home_visits ADD COLUMN nextVisitPlanned TEXT');
    }
    if (!hasColumn(homeVisitsCols, 'notes')) {
      db.exec('ALTER TABLE home_visits ADD COLUMN notes TEXT');
    }
    if (!hasColumn(homeVisitsCols, 'createdBy')) {
      db.exec('ALTER TABLE home_visits ADD COLUMN createdBy TEXT');
    }
    if (!hasColumn(homeVisitsCols, 'createdAt')) {
      db.exec('ALTER TABLE home_visits ADD COLUMN createdAt DATETIME DEFAULT CURRENT_TIMESTAMP');
    }

    console.log('Migration 016: Added missing coaching columns (notes, resources, etc.)');
  }
};
