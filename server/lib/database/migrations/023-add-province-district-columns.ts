import type Database from 'better-sqlite3';

export const migration023 = {
  version: 23,
  name: 'add-province-district-columns',
  up: (db: Database.Database): void => {
    db.exec(`
      ALTER TABLE students ADD COLUMN il TEXT;
    `);
    
    db.exec(`
      ALTER TABLE students ADD COLUMN ilce TEXT;
    `);
  },
  down: (db: Database.Database): void => {
    const tableInfo = db.pragma('table_info(students)') as any[];
    const hasIl = tableInfo.some((col: any) => col.name === 'il');
    const hasIlce = tableInfo.some((col: any) => col.name === 'ilce');
    
    if (hasIl || hasIlce) {
      const columns = (db.pragma('table_info(students)') as any[])
        .filter((col: any) => col.name !== 'il' && col.name !== 'ilce')
        .map((col: any) => col.name)
        .join(', ');
      
      db.exec(`
        CREATE TABLE students_backup AS SELECT ${columns} FROM students;
        DROP TABLE students;
        ALTER TABLE students_backup RENAME TO students;
      `);
    }
  }
};
