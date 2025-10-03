import { getDatabase, closeDatabase } from './connection';
import { initializeDatabaseSchema } from './schema';
import { runDatabaseMigrations } from './migrations';
import { setupDatabaseTriggers } from './triggers';
import { setupDatabaseIndexes } from './indexes';
import { createBackup, cleanupOldBackups, scheduleAutoBackup } from './backup';

export default getDatabase;

export function initializeDatabase(): void {
  const db = getDatabase();
  
  try {
    initializeDatabaseSchema(db);
    runDatabaseMigrations(db);
    setupDatabaseTriggers(db);
    setupDatabaseIndexes(db);
  } catch (initError) {
    console.error('Failed to initialize database:', initError);
    throw new Error('Failed to initialize database');
  }
}

export function runMigrations(): void {
  const db = getDatabase();
  runDatabaseMigrations(db);
}

export function setupTriggers(): void {
  const db = getDatabase();
  setupDatabaseTriggers(db);
}

export { 
  closeDatabase,
  createBackup,
  cleanupOldBackups,
  scheduleAutoBackup
};
