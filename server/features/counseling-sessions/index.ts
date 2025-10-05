import { Router } from 'express';
import { simpleRateLimit } from '../../middleware/validation.js';
import * as counselingSessionsRoutes from './routes/counseling-sessions.routes.js';
import * as remindersRoutes from './routes/reminders.routes.js';
import * as followUpsRoutes from './routes/follow-ups.routes.js';
import * as analyticsRoutes from './routes/analytics.routes.js';

const router = Router();

router.get('/', simpleRateLimit(200, 15 * 60 * 1000), counselingSessionsRoutes.getAllCounselingSessions);
router.get('/active', simpleRateLimit(200, 15 * 60 * 1000), counselingSessionsRoutes.getActiveCounselingSessions);
router.get('/class-hours', simpleRateLimit(200, 15 * 60 * 1000), counselingSessionsRoutes.getClassHours);
router.get('/topics', simpleRateLimit(200, 15 * 60 * 1000), counselingSessionsRoutes.getCounselingTopics);

router.get('/analytics/overview', simpleRateLimit(200, 15 * 60 * 1000), analyticsRoutes.getOverview);
router.get('/analytics/time-series', simpleRateLimit(200, 15 * 60 * 1000), analyticsRoutes.getTimeSeries);
router.get('/analytics/topics', simpleRateLimit(200, 15 * 60 * 1000), analyticsRoutes.getTopics);
router.get('/analytics/participants', simpleRateLimit(200, 15 * 60 * 1000), analyticsRoutes.getParticipants);
router.get('/analytics/classes', simpleRateLimit(200, 15 * 60 * 1000), analyticsRoutes.getClasses);
router.get('/analytics/modes', simpleRateLimit(200, 15 * 60 * 1000), analyticsRoutes.getModes);
router.get('/analytics/student/:studentId', simpleRateLimit(200, 15 * 60 * 1000), analyticsRoutes.getStudentStats);

router.get('/:id', simpleRateLimit(200, 15 * 60 * 1000), counselingSessionsRoutes.getCounselingSessionById);
router.post('/', simpleRateLimit(50, 15 * 60 * 1000), counselingSessionsRoutes.createCounselingSession);
router.put('/:id/complete', simpleRateLimit(50, 15 * 60 * 1000), counselingSessionsRoutes.completeCounselingSession);
router.put('/:id/extend', simpleRateLimit(50, 15 * 60 * 1000), counselingSessionsRoutes.extendCounselingSession);
router.post('/auto-complete', simpleRateLimit(20, 15 * 60 * 1000), counselingSessionsRoutes.autoCompleteCounselingSessions);
router.delete('/:id', simpleRateLimit(20, 15 * 60 * 1000), counselingSessionsRoutes.deleteCounselingSession);

router.get('/reminders', simpleRateLimit(200, 15 * 60 * 1000), remindersRoutes.getAllReminders);
router.get('/reminders/pending', simpleRateLimit(200, 15 * 60 * 1000), remindersRoutes.getPendingReminders);
router.get('/reminders/:id', simpleRateLimit(200, 15 * 60 * 1000), remindersRoutes.getReminderById);
router.post('/reminders', simpleRateLimit(50, 15 * 60 * 1000), remindersRoutes.createReminder);
router.put('/reminders/:id', simpleRateLimit(50, 15 * 60 * 1000), remindersRoutes.updateReminder);
router.put('/reminders/:id/status', simpleRateLimit(50, 15 * 60 * 1000), remindersRoutes.updateReminderStatus);
router.delete('/reminders/:id', simpleRateLimit(20, 15 * 60 * 1000), remindersRoutes.deleteReminder);

router.get('/follow-ups', simpleRateLimit(200, 15 * 60 * 1000), followUpsRoutes.getAllFollowUps);
router.get('/follow-ups/overdue', simpleRateLimit(200, 15 * 60 * 1000), followUpsRoutes.getOverdueFollowUps);
router.get('/follow-ups/:id', simpleRateLimit(200, 15 * 60 * 1000), followUpsRoutes.getFollowUpById);
router.post('/follow-ups', simpleRateLimit(50, 15 * 60 * 1000), followUpsRoutes.createFollowUp);
router.put('/follow-ups/:id', simpleRateLimit(50, 15 * 60 * 1000), followUpsRoutes.updateFollowUp);
router.put('/follow-ups/:id/status', simpleRateLimit(50, 15 * 60 * 1000), followUpsRoutes.updateFollowUpStatus);
router.delete('/follow-ups/:id', simpleRateLimit(20, 15 * 60 * 1000), followUpsRoutes.deleteFollowUp);

export default router;
