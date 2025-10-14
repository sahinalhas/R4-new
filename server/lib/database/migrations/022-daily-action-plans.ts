import type Database from 'better-sqlite3';

export const migration022 = {
  version: 22,
  name: 'daily_action_plans',
  up: (db: Database.Database) => {
    console.log('📅 Creating daily_action_plans table...');

    db.exec(`
      CREATE TABLE IF NOT EXISTS daily_action_plans (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL UNIQUE,
        counselor_name TEXT,
        plan_data TEXT NOT NULL,
        generated_at TEXT NOT NULL,
        is_auto_generated INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_daily_action_plans_date ON daily_action_plans(date);
      CREATE INDEX IF NOT EXISTS idx_daily_action_plans_generated_at ON daily_action_plans(generated_at);
    `);

    console.log('✅ Daily action plans table created successfully');
  },

  down: (db: Database.Database) => {
    db.exec('DROP TABLE IF EXISTS daily_action_plans');
  }
};
