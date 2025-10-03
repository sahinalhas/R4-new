import { Router } from 'express';

/**
 * Feature Registry
 * 
 * This is the central registry for all feature modules in the backend.
 * Each feature should export an Express Router from its index.ts file.
 * 
 * Migration Status: Stage 0 - Scaffolding only
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
 * - Stage 0: ✅ Scaffolding complete (current)
 * - Stage 1: Core domains - students → surveys → progress
 * - Stage 2: Adjacent domains - attendance, study, meeting-notes, documents, settings, subjects
 * - Stage 3: Peripheral routers - coaching, health, special-education, risk-assessment, behavior, exams, counseling-sessions, auth, sessions
 * - Stage 4: Cleanup - remove legacy imports, delete old route files
 * 
 * STAGE 1 CANONICAL ORDER (MUST FOLLOW):
 * 1. students (foundation for all student features)
 * 2. surveys (independent survey system)
 * 3. progress (student progress tracking)
 * 
 * Subsequent stages follow dependency minimization and risk reduction principles.
 */

export const featureRegistry = Router();

/**
 * Feature routers will be registered here during migration.
 * 
 * Example migration pattern:
 * 
 * import studentsRouter from './students';
 * import surveysRouter from './surveys';
 * import coachingRouter from './coaching';
 * 
 * featureRegistry.use('/students', studentsRouter);
 * featureRegistry.use('/surveys', surveysRouter);
 * featureRegistry.use('/coaching', coachingRouter);
 */

export default featureRegistry;
