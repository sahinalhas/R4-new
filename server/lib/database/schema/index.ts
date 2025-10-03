import type Database from 'better-sqlite3';
import { createStudentsTables } from './students.schema';
import { createAcademicTables } from './academic.schema';
import { createSurveysTables } from './surveys.schema';
import { createCounselingTables } from './counseling.schema';
import { createCoachingTables } from './coaching.schema';
import { createSettingsTables } from './settings.schema';

export function initializeDatabaseSchema(db: Database.Database): void {
  createStudentsTables(db);
  createAcademicTables(db);
  createSurveysTables(db);
  createCounselingTables(db);
  createCoachingTables(db);
  createSettingsTables(db);
}
