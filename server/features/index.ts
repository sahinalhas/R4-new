import { Router } from 'express';
import studentsRouter from './students/index.js';
import surveysRouter from './surveys/index.js';

/**
 * Feature Registry
 * 
 * This is the central registry for all feature modules in the backend.
 * Each feature should export an Express Router from its index.ts file.
 * 
 * Migration Status: Stage 1.2 - Students and Surveys migrated
 * 
 * Standard Feature Structure:
 * server/features/<feature-name>/
 *   ├── routes/      - Express route handlers and endpoint definitions
 *   ├── services/    - Business logic and orchestration
 *   ├── repository/  - Data access layer (database operations)
 *   ├── types/       - TypeScript type definitions and interfaces
 *   └── index.ts     - Feature router export (aggregates routes)
 * 
 * Migration Strategy (5 Stages):
 * - Stage 0: ✅ Scaffolding complete
 * - Stage 1: Core domains - students ✅ → surveys ✅ → progress
 * - Stage 2: Adjacent domains - attendance, study, meeting-notes, documents, settings, subjects
 * - Stage 3: Peripheral routers - coaching, health, special-education, risk-assessment, behavior, exams, counseling-sessions, auth, sessions
 * - Stage 4: Cleanup - remove legacy imports, delete old route files
 * 
 * STAGE 1 CANONICAL ORDER (MUST FOLLOW):
 * 1. students (foundation for all student features) ✅
 * 2. surveys (independent survey system) ✅
 * 3. progress (student progress tracking)
 * 
 * Subsequent stages follow dependency minimization and risk reduction principles.
 */

export const featureRegistry = Router();

/**
 * Stage 1.1: Students - ✅ Migrated
 * Stage 1.2: Surveys - ✅ Migrated
 * 
 * Migrated features:
 * - students: Full CRUD operations, academics, progress, interventions
 * - surveys: Templates, Questions, Distributions, Responses, Analytics
 * 
 * Next migrations (Stage 1):
 * - progress: Student progress tracking
 */

featureRegistry.use('/students', studentsRouter);
featureRegistry.use('/surveys', surveysRouter);

export default featureRegistry;
