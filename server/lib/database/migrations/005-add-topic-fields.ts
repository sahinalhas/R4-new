import type Database from 'better-sqlite3';

export const migration005 = {
  version: 5,
  name: 'add_avgMinutes_and_order_to_topics',
  up: (db: Database.Database) => {
    const topicCols = db.prepare('PRAGMA table_info(topics)').all() as { name: string }[];
    const hasAvgMinutes = topicCols.some((col) => col.name === 'avgMinutes');
    const hasOrder = topicCols.some((col) => col.name === 'order');
    
    if (!hasAvgMinutes) {
      db.exec('ALTER TABLE topics ADD COLUMN avgMinutes INTEGER DEFAULT 60');
    }
    if (!hasOrder) {
      db.exec('ALTER TABLE topics ADD COLUMN "order" INTEGER DEFAULT 0');
    }
  }
};
