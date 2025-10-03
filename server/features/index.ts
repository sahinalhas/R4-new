import { Router } from 'express';
import studentsRouter from './students/index.js';
import surveysRouter from './surveys/index.js';
import progressRouter from './progress/index.js';
import subjectsRouter from './subjects/index.js';
import settingsRouter from './settings/index.js';
import attendanceRouter from './attendance/index.js';
import studyRouter from './study/index.js';
import meetingNotesRouter from './meeting-notes/index.js';
import documentsRouter from './documents/index.js';
import coachingRouter from './coaching/index.js';
import examsRouter from './exams/index.js';
import sessionsRouter from './sessions/index.js';
import healthRouter from './health/index.js';
import specialEducationRouter from './special-education/index.js';
import riskAssessmentRouter from './risk-assessment/index.js';
import behaviorRouter from './behavior/index.js';

/**
 * Feature Registry
 * 
 * This is the central registry for all feature modules in the backend.
 * Each feature should export an Express Router from its index.ts file.
 * 
 * Migration Status: Stage 3 Wave 2 - COMPLETE! ✅
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
 * - Stage 1: ✅ Core domains - students ✅ → surveys ✅ → progress ✅
 * - Stage 2: ✅ Adjacent domains - subjects ✅ → settings ✅ → attendance ✅ → study ✅ → meeting-notes ✅ → documents ✅
 * - Stage 3 Wave 1: ✅ Academic Data Cluster - coaching ✅ → exams ✅ → sessions ✅
 * - Stage 3 Wave 2: ✅ Student Support Cluster - health ✅ → special-education ✅ → risk-assessment ✅ → behavior ✅
 * - Stage 3 Wave 3: counseling-sessions, auth
 * - Stage 4: Cleanup - remove legacy imports, delete old route files
 * 
 * STAGE 1 CANONICAL ORDER (COMPLETED):
 * 1. students (foundation for all student features) ✅
 * 2. surveys (independent survey system) ✅
 * 3. progress (student progress tracking) ✅
 * 
 * STAGE 2 CANONICAL ORDER (COMPLETE):
 * 1. subjects (first adjacent domain - subjects and topics CRUD) ✅
 * 2. settings (second adjacent domain - app settings management) ✅
 * 3. attendance (third adjacent domain - attendance tracking) ✅
 * 4. study (fourth adjacent domain - study assignments and weekly slots) ✅
 * 5. meeting-notes (fifth adjacent domain - meeting notes CRUD) ✅
 * 6. documents (sixth adjacent domain - student documents CRUD) ✅
 * 
 * Subsequent stages follow dependency minimization and risk reduction principles.
 */

export const featureRegistry = Router();

/**
 * Stage 1.1: Students - ✅ Migrated
 * Stage 1.2: Surveys - ✅ Migrated
 * Stage 1.3: Progress - ✅ Migrated
 * Stage 2.1: Subjects - ✅ Migrated
 * Stage 2.2: Settings - ✅ Migrated
 * Stage 2.3: Attendance - ✅ Migrated
 * Stage 2.4: Study - ✅ Migrated
 * Stage 2.5: Meeting Notes - ✅ Migrated
 * Stage 2.6: Documents - ✅ Migrated (STAGE 2 COMPLETE!)
 * Stage 3.1: Coaching - ✅ Migrated (Wave 1: Academic Data Cluster)
 * Stage 3.2: Exams - ✅ Migrated (Wave 1: Academic Data Cluster)
 * Stage 3.3: Sessions - ✅ Migrated (Wave 1: Academic Data Cluster - WAVE 1 COMPLETE!)
 * Stage 3.4: Health - ✅ Migrated (Wave 2: Student Support Cluster)
 * Stage 3.5: Special Education - ✅ Migrated (Wave 2: Student Support Cluster)
 * Stage 3.6: Risk Assessment - ✅ Migrated (Wave 2: Student Support Cluster)
 * Stage 3.7: Behavior - ✅ Migrated (Wave 2: Student Support Cluster - WAVE 2 COMPLETE!)
 * 
 * Migrated features:
 * - students: Full CRUD operations, academics, progress, interventions
 * - surveys: Templates, Questions, Distributions, Responses, Analytics
 * - progress: Progress tracking and academic goals
 * - subjects: Subjects and topics CRUD operations
 * - settings: App settings management (get, save)
 * - attendance: Attendance tracking (get by student, create)
 * - study: Study assignments and weekly slots CRUD operations
 * - meeting-notes: Meeting notes CRUD operations (get, create, update, delete)
 * - documents: Student documents CRUD operations (get, create, delete)
 * - coaching: Academic goals, multiple intelligence, learning styles, SMART goals, recommendations, 
 *            360 evaluations, achievements, self assessments, parent meetings, home visits, family participation
 * - exams: Exam results CRUD, exam analysis, progress tracking
 * - sessions: Study sessions CRUD operations
 * - health: Health information CRUD, emergency contacts, medical history
 * - special-education: IEP/BEP records CRUD, RAM reports, support services
 * - risk-assessment: Risk factors CRUD, high-risk student queries, assessment tracking
 * - behavior: Behavior incidents CRUD, statistics, date range queries
 * 
 * Next migrations (Stage 3 Wave 3):
 * - counseling-sessions, auth
 */

featureRegistry.use('/students', studentsRouter);
featureRegistry.use('/surveys', surveysRouter);
featureRegistry.use('/', progressRouter);
featureRegistry.use('/', subjectsRouter);
featureRegistry.use('/', settingsRouter);
featureRegistry.use('/', attendanceRouter);
featureRegistry.use('/', studyRouter);
featureRegistry.use('/', meetingNotesRouter);
featureRegistry.use('/', documentsRouter);
featureRegistry.use('/coaching', coachingRouter);
featureRegistry.use('/exams', examsRouter);
featureRegistry.use('/study-sessions', sessionsRouter);
featureRegistry.use('/health-info', healthRouter);
featureRegistry.use('/special-education', specialEducationRouter);
featureRegistry.use('/risk-factors', riskAssessmentRouter);
featureRegistry.use('/behavior-incidents', behaviorRouter);

export default featureRegistry;
