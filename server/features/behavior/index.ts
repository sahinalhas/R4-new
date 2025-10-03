import { Router } from 'express';
import { simpleRateLimit } from '../../middleware/validation.js';
import * as behaviorRoutes from './routes/behavior.routes.js';

const router = Router();

router.get('/:studentId', simpleRateLimit(200, 15 * 60 * 1000), behaviorRoutes.getBehaviorIncidentsByStudent);
router.get('/:studentId/range', simpleRateLimit(200, 15 * 60 * 1000), behaviorRoutes.getBehaviorIncidentsByDateRange);
router.get('/:studentId/stats', simpleRateLimit(200, 15 * 60 * 1000), behaviorRoutes.getBehaviorStatsByStudent);
router.post('/', simpleRateLimit(50, 15 * 60 * 1000), behaviorRoutes.createBehaviorIncident);
router.put('/:id', simpleRateLimit(50, 15 * 60 * 1000), behaviorRoutes.updateBehaviorIncident);
router.delete('/:id', simpleRateLimit(20, 15 * 60 * 1000), behaviorRoutes.deleteBehaviorIncident);

export default router;
