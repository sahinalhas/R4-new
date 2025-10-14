/**
 * Profile Sync Feature - Main Export
 * Canlı Öğrenci Profili Senkronizasyon Sistemi
 */

import { Router } from 'express';
import * as routes from './routes/profile-sync.routes.js';

const router = Router();

// Unified Student Identity endpoints
router.get('/identity/:studentId', routes.getStudentIdentity);
router.get('/identities', routes.getAllIdentities);
router.post('/identity/:studentId/refresh', routes.refreshStudentIdentity);

// Profile Update endpoints
router.post('/update', routes.processProfileUpdate);

// Sync Logs endpoints
router.get('/logs/student/:studentId', routes.getStudentSyncLogs);
router.get('/logs/source/:source', routes.getSyncLogsBySource);

// Conflicts endpoints
router.get('/conflicts/student/:studentId', routes.getStudentConflicts);
router.get('/conflicts/high-severity', routes.getHighSeverityConflicts);

// Statistics
router.get('/statistics', routes.getSyncStatistics);

export default router;

// Export services for internal use
export { autoSyncHooks } from './services/auto-sync-hooks.service.js';
export { ProfileAggregationService } from './services/profile-aggregation.service.js';
export { DataValidationService } from './services/data-validation.service.js';
