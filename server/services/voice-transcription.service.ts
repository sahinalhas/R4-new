/**
 * Voice Transcription Service
 * Aktif AI provider'a göre otomatik sesli not alma
 * Gemini, OpenAI Whisper veya Browser API desteği
 */

import { AIProviderService } from './ai-provider.service.js';
import { GoogleGenAI } from '@google/genai';

export interface TranscriptionResult {
  text: string;
  provider: 'gemini' | 'openai' | 'browser';
  confidence?: number;
  duration?: number;
  language?: string;
}

export class VoiceTranscriptionService {
  private aiProvider: AIProviderService;

  constructor() {
    this.aiProvider = AIProviderService.getInstance();
  }

  /**
   * Ana transcription metodu - aktif provider'a göre otomatik seçim
   */
  async transcribe(audioBuffer: Buffer, mimeType: string): Promise<TranscriptionResult> {
    const provider = this.aiProvider.getProvider();

    switch (provider) {
      case 'gemini':
        return await this.transcribeWithGemini(audioBuffer, mimeType);
      
      case 'openai':
        return await this.transcribeWithWhisper(audioBuffer, mimeType);
      
      case 'ollama':
        // Ollama STT desteklemiyor, browser API kullanılacak
        throw new Error('USE_BROWSER_API');
      
      default:
        throw new Error(`Desteklenmeyen provider: ${provider}`);
    }
  }

  /**
   * Gemini ile transcription (ÜCRETSİZ)
   */
  private async transcribeWithGemini(audioBuffer: Buffer, mimeType: string): Promise<TranscriptionResult> {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY bulunamadı');
    }

    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const startTime = Date.now();

    try {
      const result = await genAI.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  data: audioBuffer.toString('base64'),
                  mimeType: mimeType
                }
              },
              {
                text: 'Bu ses kaydını Türkçe olarak metin haline dönüştür. Sadece konuşulan metni yaz, başka bir açıklama ekleme.'
              }
            ]
          }
        ]
      });

      const text = result.text || '';
      const duration = Date.now() - startTime;

      return {
        text: text.trim(),
        provider: 'gemini',
        duration,
        language: 'tr'
      };
    } catch (error: any) {
      console.error('Gemini transcription hatası:', error);
      throw new Error(`Gemini transcription başarısız: ${error.message}`);
    }
  }

  /**
   * OpenAI Whisper ile transcription
   */
  private async transcribeWithWhisper(audioBuffer: Buffer, mimeType: string): Promise<TranscriptionResult> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY bulunamadı');
    }

    const startTime = Date.now();

    try {
      const FormData = (await import('form-data')).default;
      const form = new FormData();
      
      // Dosya uzantısını mime type'dan belirle
      const ext = mimeType.includes('webm') ? 'webm' : 
                  mimeType.includes('mp3') ? 'mp3' : 
                  mimeType.includes('wav') ? 'wav' : 'mp3';
      
      form.append('file', audioBuffer, {
        filename: `audio.${ext}`,
        contentType: mimeType
      });
      form.append('model', 'whisper-1');
      form.append('language', 'tr');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          ...form.getHeaders()
        },
        body: form as any
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Whisper API hatası: ${error}`);
      }

      const data = await response.json();
      const duration = Date.now() - startTime;

      return {
        text: data.text.trim(),
        provider: 'openai',
        duration,
        language: 'tr'
      };
    } catch (error: any) {
      console.error('Whisper transcription hatası:', error);
      throw new Error(`Whisper transcription başarısız: ${error.message}`);
    }
  }

  /**
   * Browser'dan gelen transcription'ı kaydet
   */
  async saveBrowserTranscription(text: string): Promise<TranscriptionResult> {
    return {
      text,
      provider: 'browser',
      language: 'tr'
    };
  }

  /**
   * Aktif provider'ı kontrol et
   */
  getActiveProvider(): string {
    const provider = this.aiProvider.getProvider();
    
    if (provider === 'ollama') {
      return 'browser'; // Ollama için browser API kullan
    }
    
    return provider;
  }
}
