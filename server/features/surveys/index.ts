import { Router } from 'express';
import { simpleRateLimit } from '../../middleware/validation.js';
import * as surveysRoutes from './routes/surveys.routes.js';

const router = Router();

router.get("/survey-templates", simpleRateLimit(200, 15 * 60 * 1000), surveysRoutes.getSurveyTemplates);
router.get("/survey-templates/:id", simpleRateLimit(200, 15 * 60 * 1000), surveysRoutes.getSurveyTemplateById);
router.post("/survey-templates", simpleRateLimit(30, 15 * 60 * 1000), surveysRoutes.createSurveyTemplate);
router.put("/survey-templates/:id", simpleRateLimit(30, 15 * 60 * 1000), surveysRoutes.updateSurveyTemplateHandler);
router.delete("/survey-templates/:id", simpleRateLimit(20, 15 * 60 * 1000), surveysRoutes.deleteSurveyTemplateHandler);

router.get("/survey-questions/:templateId", simpleRateLimit(200, 15 * 60 * 1000), surveysRoutes.getQuestionsByTemplateId);
router.post("/survey-questions", simpleRateLimit(50, 15 * 60 * 1000), surveysRoutes.createSurveyQuestion);
router.put("/survey-questions/:id", simpleRateLimit(50, 15 * 60 * 1000), surveysRoutes.updateSurveyQuestionHandler);
router.delete("/survey-questions/:id", simpleRateLimit(30, 15 * 60 * 1000), surveysRoutes.deleteSurveyQuestionHandler);
router.delete("/survey-questions/template/:templateId", simpleRateLimit(20, 15 * 60 * 1000), surveysRoutes.deleteQuestionsByTemplateHandler);

router.get("/survey-distributions", simpleRateLimit(200, 15 * 60 * 1000), surveysRoutes.getSurveyDistributions);
router.get("/survey-distributions/:id", simpleRateLimit(200, 15 * 60 * 1000), surveysRoutes.getSurveyDistributionById);
router.get("/survey-distributions/link/:publicLink", simpleRateLimit(300, 15 * 60 * 1000), surveysRoutes.getSurveyDistributionByPublicLink);
router.post("/survey-distributions", simpleRateLimit(30, 15 * 60 * 1000), surveysRoutes.createSurveyDistribution);
router.put("/survey-distributions/:id", simpleRateLimit(30, 15 * 60 * 1000), surveysRoutes.updateSurveyDistributionHandler);
router.delete("/survey-distributions/:id", simpleRateLimit(20, 15 * 60 * 1000), surveysRoutes.deleteSurveyDistributionHandler);

router.get("/survey-responses", simpleRateLimit(200, 15 * 60 * 1000), surveysRoutes.getSurveyResponses);
router.post("/survey-responses", simpleRateLimit(100, 15 * 60 * 1000), surveysRoutes.createSurveyResponse);
router.put("/survey-responses/:id", simpleRateLimit(50, 15 * 60 * 1000), surveysRoutes.updateSurveyResponseHandler);
router.delete("/survey-responses/:id", simpleRateLimit(30, 15 * 60 * 1000), surveysRoutes.deleteSurveyResponseHandler);

router.get("/survey-analytics/:distributionId", simpleRateLimit(150, 15 * 60 * 1000), surveysRoutes.getSurveyAnalytics);
router.get("/survey-analytics/:distributionId/question/:questionId", simpleRateLimit(150, 15 * 60 * 1000), surveysRoutes.getSurveyQuestionAnalytics);
router.get("/survey-statistics/:distributionId", simpleRateLimit(150, 15 * 60 * 1000), surveysRoutes.getDistributionStatistics);

export default router;
