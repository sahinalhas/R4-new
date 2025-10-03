import type Database from 'better-sqlite3';

export const migration007 = {
  version: 7,
  name: 'add_topic_planning_fields',
  up: (db: Database.Database) => {
    console.log('Adding topic planning fields (avgMinutes, order, energyLevel, difficultyScore, priority, deadline)...');
    const topicCols = db.prepare('PRAGMA table_info(topics)').all() as { name: string }[];
    
    if (!topicCols.some(col => col.name === 'avgMinutes')) {
      db.exec('ALTER TABLE topics ADD COLUMN avgMinutes INTEGER DEFAULT 0');
      console.log('  Added avgMinutes column');
    }
    
    if (!topicCols.some(col => col.name === 'order')) {
      db.exec('ALTER TABLE topics ADD COLUMN "order" INTEGER');
      console.log('  Added order column');
    }
    
    if (!topicCols.some(col => col.name === 'energyLevel')) {
      db.exec('ALTER TABLE topics ADD COLUMN energyLevel TEXT CHECK (energyLevel IN ("low", "medium", "high")) DEFAULT "medium"');
      console.log('  Added energyLevel column');
    }
    
    if (!topicCols.some(col => col.name === 'difficultyScore')) {
      db.exec('ALTER TABLE topics ADD COLUMN difficultyScore INTEGER CHECK (difficultyScore >= 1 AND difficultyScore <= 10)');
      console.log('  Added difficultyScore column');
    }
    
    if (!topicCols.some(col => col.name === 'priority')) {
      db.exec('ALTER TABLE topics ADD COLUMN priority INTEGER CHECK (priority >= 1 AND priority <= 10)');
      console.log('  Added priority column');
    }
    
    if (!topicCols.some(col => col.name === 'deadline')) {
      db.exec('ALTER TABLE topics ADD COLUMN deadline TEXT');
      console.log('  Added deadline column');
    }
    
    console.log('Topic planning fields migration completed successfully');
  }
};
