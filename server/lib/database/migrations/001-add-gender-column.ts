import type Database from 'better-sqlite3';

export const migration001 = {
  version: 1,
  name: 'add_gender_column_to_students',
  up: (db: Database.Database) => {
    const studentCols = db.prepare('PRAGMA table_info(students)').all() as { name: string }[];
    const hasGender = studentCols.some((col) => col.name === 'gender');
    if (!hasGender) {
      db.exec('ALTER TABLE students ADD COLUMN gender TEXT CHECK (gender IN ("K", "E")) DEFAULT "K"');
    }
  }
};
