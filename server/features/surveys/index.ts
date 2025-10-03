import { Router } from 'express';
import { simpleRateLimit } from '../../middleware/validation.js';
import * as surveysRoutes from './routes/surveys.routes.js';

const router = Router();

router.get("/templates", simpleRateLimit(200, 15 * 60 * 1000), surveysRoutes.getSurveyTemplates);
router.get("/templates/:id", simpleRateLimit(200, 15 * 60 * 1000), surveysRoutes.getSurveyTemplateById);
router.post("/templates", simpleRateLimit(30, 15 * 60 * 1000), surveysRoutes.createSurveyTemplate);
router.put("/templates/:id", simpleRateLimit(30, 15 * 60 * 1000), surveysRoutes.updateSurveyTemplateHandler);
router.delete("/templates/:id", simpleRateLimit(20, 15 * 60 * 1000), surveysRoutes.deleteSurveyTemplateHandler);

router.get("/questions/:templateId", simpleRateLimit(200, 15 * 60 * 1000), surveysRoutes.getQuestionsByTemplateId);
router.post("/questions", simpleRateLimit(50, 15 * 60 * 1000), surveysRoutes.createSurveyQuestion);
router.put("/questions/:id", simpleRateLimit(50, 15 * 60 * 1000), surveysRoutes.updateSurveyQuestionHandler);
router.delete("/questions/:id", simpleRateLimit(30, 15 * 60 * 1000), surveysRoutes.deleteSurveyQuestionHandler);
router.delete("/questions/template/:templateId", simpleRateLimit(20, 15 * 60 * 1000), surveysRoutes.deleteQuestionsByTemplateHandler);

router.get("/distributions", simpleRateLimit(200, 15 * 60 * 1000), surveysRoutes.getSurveyDistributions);
router.get("/distributions/:id", simpleRateLimit(200, 15 * 60 * 1000), surveysRoutes.getSurveyDistributionById);
router.get("/distributions/link/:publicLink", simpleRateLimit(300, 15 * 60 * 1000), surveysRoutes.getSurveyDistributionByPublicLink);
router.post("/distributions", simpleRateLimit(30, 15 * 60 * 1000), surveysRoutes.createSurveyDistribution);
router.put("/distributions/:id", simpleRateLimit(30, 15 * 60 * 1000), surveysRoutes.updateSurveyDistributionHandler);
router.delete("/distributions/:id", simpleRateLimit(20, 15 * 60 * 1000), surveysRoutes.deleteSurveyDistributionHandler);

router.get("/responses", simpleRateLimit(200, 15 * 60 * 1000), surveysRoutes.getSurveyResponses);
router.post("/responses", simpleRateLimit(100, 15 * 60 * 1000), surveysRoutes.createSurveyResponse);
router.put("/responses/:id", simpleRateLimit(50, 15 * 60 * 1000), surveysRoutes.updateSurveyResponseHandler);
router.delete("/responses/:id", simpleRateLimit(30, 15 * 60 * 1000), surveysRoutes.deleteSurveyResponseHandler);

router.get("/analytics/:distributionId", simpleRateLimit(150, 15 * 60 * 1000), surveysRoutes.getSurveyAnalytics);
router.get("/analytics/:distributionId/question/:questionId", simpleRateLimit(150, 15 * 60 * 1000), surveysRoutes.getSurveyQuestionAnalytics);
router.get("/statistics/:distributionId", simpleRateLimit(150, 15 * 60 * 1000), surveysRoutes.getDistributionStatistics);

export default router;
