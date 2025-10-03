import { Router } from 'express';
import { simpleRateLimit } from '../../middleware/validation.js';
import * as coachingRoutes from './routes/coaching.routes.js';

const router = Router();

router.get('/academic-goals', simpleRateLimit(200, 15 * 60 * 1000), coachingRoutes.getAcademicGoals);
router.get('/academic-goals/student/:studentId', simpleRateLimit(200, 15 * 60 * 1000), coachingRoutes.getAcademicGoalsByStudent);
router.post('/academic-goals', simpleRateLimit(50, 15 * 60 * 1000), coachingRoutes.createAcademicGoal);
router.put('/academic-goals/:id', simpleRateLimit(50, 15 * 60 * 1000), coachingRoutes.updateAcademicGoal);
router.delete('/academic-goals/:id', simpleRateLimit(20, 15 * 60 * 1000), coachingRoutes.deleteAcademicGoal);

router.get('/multiple-intelligence/student/:studentId', simpleRateLimit(200, 15 * 60 * 1000), coachingRoutes.getMultipleIntelligenceByStudent);
router.post('/multiple-intelligence', simpleRateLimit(50, 15 * 60 * 1000), coachingRoutes.createMultipleIntelligence);

router.get('/learning-styles/student/:studentId', simpleRateLimit(200, 15 * 60 * 1000), coachingRoutes.getLearningStylesByStudent);
router.post('/learning-styles', simpleRateLimit(50, 15 * 60 * 1000), coachingRoutes.createLearningStyle);

router.get('/smart-goals/student/:studentId', simpleRateLimit(200, 15 * 60 * 1000), coachingRoutes.getSmartGoalsByStudent);
router.post('/smart-goals', simpleRateLimit(50, 15 * 60 * 1000), coachingRoutes.createSmartGoal);
router.put('/smart-goals/:id', simpleRateLimit(50, 15 * 60 * 1000), coachingRoutes.updateSmartGoal);

router.get('/coaching-recommendations/student/:studentId', simpleRateLimit(200, 15 * 60 * 1000), coachingRoutes.getCoachingRecommendationsByStudent);
router.post('/coaching-recommendations', simpleRateLimit(50, 15 * 60 * 1000), coachingRoutes.createCoachingRecommendation);
router.put('/coaching-recommendations/:id', simpleRateLimit(50, 15 * 60 * 1000), coachingRoutes.updateCoachingRecommendation);

router.get('/evaluations-360/student/:studentId', simpleRateLimit(200, 15 * 60 * 1000), coachingRoutes.getEvaluations360ByStudent);
router.post('/evaluations-360', simpleRateLimit(50, 15 * 60 * 1000), coachingRoutes.createEvaluation360);

router.get('/achievements/student/:studentId', simpleRateLimit(200, 15 * 60 * 1000), coachingRoutes.getAchievementsByStudent);
router.post('/achievements', simpleRateLimit(50, 15 * 60 * 1000), coachingRoutes.createAchievement);

router.get('/self-assessments/student/:studentId', simpleRateLimit(200, 15 * 60 * 1000), coachingRoutes.getSelfAssessmentsByStudent);
router.post('/self-assessments', simpleRateLimit(50, 15 * 60 * 1000), coachingRoutes.createSelfAssessment);

router.get('/parent-meetings/student/:studentId', simpleRateLimit(200, 15 * 60 * 1000), coachingRoutes.getParentMeetingsByStudent);
router.post('/parent-meetings', simpleRateLimit(50, 15 * 60 * 1000), coachingRoutes.createParentMeeting);
router.put('/parent-meetings/:id', simpleRateLimit(50, 15 * 60 * 1000), coachingRoutes.updateParentMeeting);

router.get('/home-visits/student/:studentId', simpleRateLimit(200, 15 * 60 * 1000), coachingRoutes.getHomeVisitsByStudent);
router.post('/home-visits', simpleRateLimit(50, 15 * 60 * 1000), coachingRoutes.createHomeVisit);
router.put('/home-visits/:id', simpleRateLimit(50, 15 * 60 * 1000), coachingRoutes.updateHomeVisit);

router.get('/family-participation/student/:studentId', simpleRateLimit(200, 15 * 60 * 1000), coachingRoutes.getFamilyParticipationByStudent);
router.post('/family-participation', simpleRateLimit(50, 15 * 60 * 1000), coachingRoutes.createFamilyParticipation);
router.put('/family-participation/:id', simpleRateLimit(50, 15 * 60 * 1000), coachingRoutes.updateFamilyParticipation);

export default router;
