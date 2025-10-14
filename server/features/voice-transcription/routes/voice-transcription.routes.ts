import { Router } from 'express';
import { VoiceTranscriptionService } from '../../../services/voice-transcription.service.js';
import { VoiceAnalysisService } from '../../../services/voice-analysis.service.js';
import { SessionFormAutoFillService } from '../../../services/session-form-auto-fill.service.js';
import type { VoiceNoteRequest, VoiceNoteResponse } from '../types/index.js';

const router = Router();
const transcriptionService = new VoiceTranscriptionService();
const analysisService = new VoiceAnalysisService();
const formAutoFillService = new SessionFormAutoFillService();

/**
 * GET /api/voice-transcription/provider
 * Aktif AI provider'ı öğren
 */
router.get('/provider', async (req, res) => {
  try {
    const provider = transcriptionService.getActiveProvider();
    
    res.json({
      success: true,
      data: {
        provider,
        useBrowserAPI: provider === 'browser' || provider === 'ollama'
      }
    });
  } catch (error: any) {
    console.error('Provider check hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/voice-transcription/transcribe
 * Ses dosyasını metne çevir ve analiz et
 */
router.post('/transcribe', async (req, res) => {
  try {
    const { audioData, browserTranscription, mimeType } = req.body as VoiceNoteRequest;

    let transcriptionResult;

    // Browser'dan gelen transcription varsa direkt kullan
    if (browserTranscription) {
      transcriptionResult = await transcriptionService.saveBrowserTranscription(browserTranscription);
    }
    // Audio data varsa AI ile transcribe et
    else if (audioData && mimeType) {
      const audioBuffer = Buffer.from(audioData, 'base64');
      transcriptionResult = await transcriptionService.transcribe(audioBuffer, mimeType);
    }
    else {
      return res.status(400).json({
        success: false,
        error: 'audioData veya browserTranscription gerekli'
      });
    }

    // AI ile analiz et
    const analysis = await analysisService.analyze(transcriptionResult.text);

    const response: VoiceNoteResponse = {
      transcription: {
        text: transcriptionResult.text,
        provider: transcriptionResult.provider,
        confidence: transcriptionResult.confidence,
        duration: transcriptionResult.duration
      },
      analysis
    };

    // Acil durum varsa log
    if (analysisService.isUrgent(analysis)) {
      console.warn(`⚠️ ACİL DURUM TESPİT EDİLDİ: ${analysis.riskKeywords.join(', ')}`);
    }

    res.json({
      success: true,
      data: response
    });

  } catch (error: any) {
    console.error('Transcription hatası:', error);
    
    // USE_BROWSER_API hatası özel olarak handle et
    if (error.message === 'USE_BROWSER_API') {
      return res.json({
        success: true,
        data: {
          useBrowserAPI: true,
          provider: 'browser'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/voice-transcription/analyze-only
 * Sadece mevcut metni analiz et (transkript hazır)
 */
router.post('/analyze-only', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'text parametresi gerekli'
      });
    }

    const analysis = await analysisService.analyze(text);

    res.json({
      success: true,
      data: analysis
    });

  } catch (error: any) {
    console.error('Analysis hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/voice-transcription/auto-fill-form
 * Sesli not transkriptini alıp tüm görüşme formunu otomatik doldur
 */
router.post('/auto-fill-form', async (req, res) => {
  try {
    const { transcriptionText, sessionType } = req.body;

    if (!transcriptionText) {
      return res.status(400).json({
        success: false,
        error: 'transcriptionText parametresi gerekli'
      });
    }

    const formData = await formAutoFillService.autoFillForm(transcriptionText, sessionType);

    res.json({
      success: true,
      data: formData
    });

  } catch (error: any) {
    console.error('Form auto-fill hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
