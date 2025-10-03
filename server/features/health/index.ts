import { Router } from 'express';
import { simpleRateLimit } from '../../middleware/validation.js';
import * as healthRoutes from './routes/health.routes.js';

const router = Router();

router.get('/:studentId', simpleRateLimit(200, 15 * 60 * 1000), healthRoutes.getHealthInfoByStudent);
router.post('/', simpleRateLimit(50, 15 * 60 * 1000), healthRoutes.createOrUpdateHealthInfo);
router.delete('/:studentId', simpleRateLimit(20, 15 * 60 * 1000), healthRoutes.deleteHealthInfo);

export default router;
