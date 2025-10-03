import type Database from 'better-sqlite3';

export const migration006 = {
  version: 6,
  name: 'add_unique_constraint_to_subjects',
  up: (db: Database.Database) => {
    const indexes = db.prepare('PRAGMA index_list(subjects)').all() as { name: string }[];
    const hasUniqueIndex = indexes.some((idx) => idx.name === 'idx_subjects_name_category_unique');
    
    if (!hasUniqueIndex) {
      console.log('Creating unique index on subjects (name, category)...');
      
      const allSubjects = db.prepare('SELECT * FROM subjects ORDER BY created_at DESC').all() as any[];
      const seen = new Map<string, string>();
      const toDelete: string[] = [];
      
      for (const subject of allSubjects) {
        const key = `${subject.name}|${subject.category || ''}`;
        if (seen.has(key)) {
          toDelete.push(subject.id);
          console.log('  Removing duplicate subject before index creation:', subject.name, subject.category || '(no category)');
        } else {
          seen.set(key, subject.id);
        }
      }
      
      if (toDelete.length > 0) {
        const deleteStmt = db.prepare('DELETE FROM subjects WHERE id = ?');
        const deleteTx = db.transaction((ids: string[]) => {
          for (const id of ids) {
            deleteStmt.run(id);
          }
        });
        deleteTx(toDelete);
        console.log('  Removed', toDelete.length, 'duplicate subjects');
      }
      
      db.exec('CREATE UNIQUE INDEX idx_subjects_name_category_unique ON subjects(name, COALESCE(category, \'\'))');
      console.log('Unique index created successfully');
    }
  }
};
