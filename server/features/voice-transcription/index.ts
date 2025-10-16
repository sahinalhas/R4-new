import { Router } from 'express';
import { simpleRateLimit } from '../../middleware/validation.js';
import voiceTranscriptionRoutes from './routes/voice-transcription.routes.js';

const router = Router();

router.use('/', simpleRateLimit(50, 15 * 60 * 1000), voiceTranscriptionRoutes);

export default router;
