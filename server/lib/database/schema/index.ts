import type Database from 'better-sqlite3';
import { createStudentsTables } from './students.schema';
import { createAcademicTables } from './academic.schema';
import { createSurveysTables } from './surveys.schema';
import { createCounselingTables } from './counseling.schema';
import { createCoachingTables } from './coaching.schema';
import { createSettingsTables } from './settings.schema';
import { createUsersTable } from './users.schema';
import { createAnalyticsCacheTable } from './analytics-cache.schema';
import { initStandardizedProfileTables } from './standardized-profile.schema';
import { createCareerGuidanceTables, seedCareerProfiles } from './career-guidance.schema';

export function initializeDatabaseSchema(db: Database.Database): void {
  createUsersTable(db);
  createStudentsTables(db);
  createAcademicTables(db);
  createSurveysTables(db);
  createCounselingTables(db);
  createCoachingTables(db);
  createSettingsTables(db);
  createAnalyticsCacheTable(db);
  initStandardizedProfileTables(db);
  createCareerGuidanceTables(db);
  seedCareerProfiles(db);
}
