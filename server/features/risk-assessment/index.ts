import { Router } from 'express';
import { simpleRateLimit } from '../../middleware/validation.js';
import * as riskAssessmentRoutes from './routes/risk-assessment.routes.js';

const router = Router();

router.get('/:studentId', simpleRateLimit(200, 15 * 60 * 1000), riskAssessmentRoutes.getRiskFactorsByStudent);
router.get('/:studentId/latest', simpleRateLimit(200, 15 * 60 * 1000), riskAssessmentRoutes.getLatestRiskFactorsByStudent);
router.get('/high-risk-students/all', simpleRateLimit(200, 15 * 60 * 1000), riskAssessmentRoutes.getAllHighRiskStudents);
router.post('/', simpleRateLimit(50, 15 * 60 * 1000), riskAssessmentRoutes.createRiskFactors);
router.put('/:id', simpleRateLimit(50, 15 * 60 * 1000), riskAssessmentRoutes.updateRiskFactors);
router.delete('/:id', simpleRateLimit(20, 15 * 60 * 1000), riskAssessmentRoutes.deleteRiskFactors);

export default router;
