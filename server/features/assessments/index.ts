import { Router } from 'express';
import assessmentsRoutes from './routes/assessments.routes';

const router = Router();

// Mount assessment routes
router.use('/', assessmentsRoutes);

export default router;
