import type Database from 'better-sqlite3';
import { createAppSettingsTable } from './app-settings.schema';
import { createUserSessionsTable } from './user-sessions.schema';
import { createSchemaMigrationsTable } from './schema-migrations.schema';
import { createWeeklySlotsTable } from './weekly-slots.schema';
import { createSpecialEducationTable } from './special-education.schema';
import { createRiskFactorsTable } from './risk.schema';
import { createBehaviorTable } from './behavior.schema';

export function createSettingsTables(db: Database.Database): void {
  createAppSettingsTable(db);
  createUserSessionsTable(db);
  createSchemaMigrationsTable(db);
  createWeeklySlotsTable(db);
  createSpecialEducationTable(db);
  createRiskFactorsTable(db);
  createBehaviorTable(db);
}
