import type Database from 'better-sqlite3';

export const migration004 = {
  version: 4,
  name: 'fix_interventions_schema',
  up: (db: Database.Database) => {
    const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='interventions'").get();
    if (tableExists) {
      const cols = db.prepare('PRAGMA table_info(interventions)').all() as { name: string }[];
      const hasType = cols.some((col) => col.name === 'type');
      const hasDate = cols.some((col) => col.name === 'date');
      
      if (hasType && !hasDate) {
        console.log('Migrating interventions table to new schema...');
        
        const existingData = db.prepare('SELECT * FROM interventions').all();
        
        db.exec('DROP TABLE interventions');
        
        db.exec(`
          CREATE TABLE interventions (
            id TEXT PRIMARY KEY,
            studentId TEXT NOT NULL,
            date TEXT NOT NULL,
            title TEXT NOT NULL,
            status TEXT NOT NULL CHECK (status IN ('Planlandı', 'Devam', 'Tamamlandı')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
          )
        `);
        
        const insertStmt = db.prepare('INSERT INTO interventions (id, studentId, date, title, status, created_at) VALUES (?, ?, ?, ?, ?, ?)');
        for (const row of existingData as any[]) {
          insertStmt.run(
            row.id,
            row.studentId,
            row.dueDate || row.created_at || new Date().toISOString(),
            row.title,
            row.status === 'planned' ? 'Planlandı' : (row.status === 'completed' ? 'Tamamlandı' : 'Devam'),
            row.created_at || new Date().toISOString()
          );
        }
        
        console.log('interventions table migrated successfully');
      }
    }
  }
};
