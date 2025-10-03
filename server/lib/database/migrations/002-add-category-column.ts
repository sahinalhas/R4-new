import type Database from 'better-sqlite3';

export const migration002 = {
  version: 2,
  name: 'add_category_column_to_subjects',
  up: (db: Database.Database) => {
    const subjectCols = db.prepare('PRAGMA table_info(subjects)').all() as { name: string }[];
    const hasCategory = subjectCols.some((col) => col.name === 'category');
    if (!hasCategory) {
      db.exec('ALTER TABLE subjects ADD COLUMN category TEXT CHECK (category IN ("LGS", "YKS", "TYT", "AYT", "YDT"))');
    }
  }
};
