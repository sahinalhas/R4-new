import { Router } from 'express';
import { simpleRateLimit } from '../../middleware/validation.js';
import * as counselingSessionsRoutes from './routes/counseling-sessions.routes.js';

const router = Router();

router.get('/', simpleRateLimit(200, 15 * 60 * 1000), counselingSessionsRoutes.getAllCounselingSessions);
router.get('/active', simpleRateLimit(200, 15 * 60 * 1000), counselingSessionsRoutes.getActiveCounselingSessions);
router.get('/class-hours', simpleRateLimit(200, 15 * 60 * 1000), counselingSessionsRoutes.getClassHours);
router.get('/topics', simpleRateLimit(200, 15 * 60 * 1000), counselingSessionsRoutes.getCounselingTopics);
router.get('/:id', simpleRateLimit(200, 15 * 60 * 1000), counselingSessionsRoutes.getCounselingSessionById);
router.post('/', simpleRateLimit(50, 15 * 60 * 1000), counselingSessionsRoutes.createCounselingSession);
router.put('/:id/complete', simpleRateLimit(50, 15 * 60 * 1000), counselingSessionsRoutes.completeCounselingSession);
router.put('/:id/extend', simpleRateLimit(50, 15 * 60 * 1000), counselingSessionsRoutes.extendCounselingSession);
router.post('/auto-complete', simpleRateLimit(20, 15 * 60 * 1000), counselingSessionsRoutes.autoCompleteCounselingSessions);
router.delete('/:id', simpleRateLimit(20, 15 * 60 * 1000), counselingSessionsRoutes.deleteCounselingSession);

export default router;
