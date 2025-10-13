export interface VoiceNoteRequest {
  audioData?: string; // base64 encoded audio
  browserTranscription?: string; // From browser Web Speech API
  mimeType?: string;
  studentId?: string;
  sessionType?: 'INDIVIDUAL' | 'GROUP' | 'PARENT' | 'OTHER';
}

export interface VoiceNoteResponse {
  transcription: {
    text: string;
    provider: string;
    confidence?: number;
    duration?: number;
  };
  analysis: {
    summary: string;
    keywords: string[];
    category: string;
    sentiment: string;
    riskLevel: string;
    riskKeywords: string[];
    urgentAction: boolean;
    recommendations: string[];
  };
  savedNoteId?: number;
}
