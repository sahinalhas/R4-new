import type Database from 'better-sqlite3';

export const migration003 = {
  version: 3,
  name: 'migrate_user_sessions_schema',
  up: (db: Database.Database) => {
    const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='user_sessions'").get();
    if (tableExists) {
      const sessionCols = db.prepare('PRAGMA table_info(user_sessions)').all() as { name: string; pk: number }[];
      const hasIdPrimaryKey = sessionCols.some((col) => col.name === 'id' && col.pk === 1);
      if (hasIdPrimaryKey) {
        console.log('Migrating user_sessions table to new schema...');
        db.exec('DROP TABLE IF EXISTS user_sessions');
        db.exec(`
          CREATE TABLE user_sessions (
            userId TEXT PRIMARY KEY,
            userData TEXT NOT NULL,
            demoNoticeSeen BOOLEAN DEFAULT FALSE,
            lastActive DATETIME DEFAULT CURRENT_TIMESTAMP,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
        console.log('user_sessions table migrated successfully');
      }
    }
  }
};
