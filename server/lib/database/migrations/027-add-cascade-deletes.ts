import type Database from 'better-sqlite3';

export const migration027 = {
  version: 27,
  name: 'add-cascade-delete-rules',
  up: (db: Database.Database) => {
    console.log('✅ Migration 027 skipped - CASCADE DELETE rules already in place from schema files');
  },
  down: (db: Database.Database) => {
    console.log('⚠️ Down migration not needed');
  }
};
