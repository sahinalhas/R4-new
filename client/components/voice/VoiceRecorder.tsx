import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Mic, Square, Loader2, CheckCircle, AlertTriangle, Edit2, Trash2, Save, X } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { apiClient } from '@/lib/api/api-client';
import { VOICE_ENDPOINTS } from '@/lib/constants/api-endpoints';

interface VoiceRecorderProps {
  onTranscriptionComplete?: (result: TranscriptionResult) => void;
  studentId?: string;
  sessionType?: 'INDIVIDUAL' | 'GROUP' | 'PARENT' | 'OTHER';
}

interface TranscriptionResult {
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
}

export function VoiceRecorder({ onTranscriptionComplete, studentId, sessionType }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const [useBrowserAPI, setUseBrowserAPI] = useState(false);
  const [provider, setProvider] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState<string>('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const browserTranscriptRef = useRef<string>('');
  
  const { toast } = useToast();

  // Check aktif provider
  useEffect(() => {
    checkProvider();
  }, []);

  const checkProvider = async () => {
    try {
      const response = await apiClient.get<{ success: boolean; data: { provider: string; useBrowserAPI: boolean } }>('/api/voice-transcription/provider');
      
      if (response?.data) {
        setProvider(response.data.provider || '');
        setUseBrowserAPI(response.data.useBrowserAPI);
      }
    } catch (error) {
      console.error('Provider kontrol hatası:', error);
      setUseBrowserAPI(true); // Fallback to browser
    }
  };

  const startRecording = async () => {
    try {
      // Browser Web Speech API kontrolü
      if (useBrowserAPI && !('webkitSpeechRecognition' in window)) {
        toast({
          title: 'Uyumsuz Tarayıcı',
          description: 'Sesli not özelliği için Chrome veya Edge kullanmanız gerekmektedir.',
          variant: 'destructive',
        });
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // MediaRecorder başlat (audio data için)
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();

      // Browser Speech API başlat (real-time transcription için)
      if (useBrowserAPI && 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'tr-TR';
        
        browserTranscriptRef.current = '';
        
        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          browserTranscriptRef.current = finalTranscript || interimTranscript;
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition hatası:', event.error);
        };

        recognition.start();
        recognitionRef.current = recognition;
      }

      setIsRecording(true);
      
      toast({
        title: 'Kayıt Başladı',
        description: useBrowserAPI 
          ? 'Konuşmaya başlayabilirsiniz (Tarayıcı API kullanılıyor)'
          : `Konuşmaya başlayabilirsiniz (${provider ? provider.toUpperCase() : 'AI'} ile işlenecek)`,
      });

    } catch (error) {
      console.error('Mikrofon erişim hatası:', error);
      toast({
        title: 'Hata',
        description: 'Mikrofona erişilemedi. Lütfen izin verin.',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setIsProcessing(true);

    // Stop browser speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    // Stop media recorder
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        try {
          let result;

          // Browser API kullanıyorsak direkt transcript gönder
          if (useBrowserAPI && browserTranscriptRef.current) {
            result = await sendBrowserTranscription(browserTranscriptRef.current);
          }
          // Browser API gerekli ama transcript yok (recognition başarısız)
          else if (useBrowserAPI && !browserTranscriptRef.current) {
            throw new Error('Ses tanıma başarısız oldu. Lütfen tekrar deneyin.');
          }
          // Değilse audio dosyasını gönder
          else {
            result = await sendAudioFile(audioBlob);
          }

          setTranscriptionResult(result);
          
          if (onTranscriptionComplete) {
            onTranscriptionComplete(result);
          }

          // Urgent action varsa özel uyarı
          if (result.analysis.urgentAction) {
            toast({
              title: '⚠️ Acil Durum Tespit Edildi',
              description: `Risk anahtar kelimeleri: ${result.analysis.riskKeywords.join(', ')}`,
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'İşlem Tamamlandı',
              description: `Analiz: ${result.analysis.category} - ${result.analysis.sentiment}`,
            });
          }

        } catch (error) {
          console.error('Transcription hatası:', error);
          const errorMessage = error instanceof Error ? error.message : 'Transkript oluşturulamadı';
          toast({
            title: 'Hata',
            description: errorMessage,
            variant: 'destructive',
          });
        } finally {
          setIsProcessing(false);
        }

        // Cleanup
        mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
        mediaRecorderRef.current = null;
      };
    } else {
      setIsProcessing(false);
    }
  };

  const sendBrowserTranscription = async (text: string): Promise<TranscriptionResult> => {
    const response = await apiClient.post<{ success: boolean; data: TranscriptionResult }>(VOICE_ENDPOINTS.TRANSCRIBE, {
      browserTranscription: text,
      studentId,
      sessionType
    });
    return response.data;
  };

  const sendAudioFile = async (audioBlob: Blob): Promise<TranscriptionResult> => {
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          const base64Audio = (reader.result as string).split(',')[1];
          
          const response = await apiClient.post<{ success: boolean; data: TranscriptionResult }>(VOICE_ENDPOINTS.TRANSCRIBE, {
            audioData: base64Audio,
            mimeType: audioBlob.type,
            studentId,
            sessionType
          });
          
          resolve(response.data);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Transcription failed';
          reject(new Error(errorMessage));
        }
      };

      reader.onerror = () => reject(new Error('Dosya okunamadı'));
      reader.readAsDataURL(audioBlob);
    });
  };

  const handleEdit = () => {
    if (transcriptionResult?.transcription?.text) {
      setEditedText(transcriptionResult.transcription.text);
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (transcriptionResult && editedText.trim()) {
      const updatedResult = {
        ...transcriptionResult,
        transcription: {
          ...transcriptionResult.transcription,
          text: editedText.trim()
        }
      };
      
      setTranscriptionResult(updatedResult);
      setIsEditing(false);
      
      if (onTranscriptionComplete) {
        onTranscriptionComplete(updatedResult);
      }
      
      toast({
        title: 'Başarılı',
        description: 'Not güncellendi',
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedText('');
  };

  const handleDelete = () => {
    setTranscriptionResult(null);
    setIsEditing(false);
    setEditedText('');
    
    toast({
      title: 'Silindi',
      description: 'Sesli not silindi',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Sesli Not Al
        </CardTitle>
        <CardDescription>
          {useBrowserAPI 
            ? 'Tarayıcı ses tanıma kullanılıyor (gerçek zamanlı)'
            : `${provider ? provider.toUpperCase() : 'AI'} ile ses tanıma aktif`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center gap-4">
          {!isRecording && !isProcessing && (
            <Button
              type="button"
              size="lg"
              onClick={startRecording}
              className="gap-2"
            >
              <Mic className="h-5 w-5" />
              Kaydı Başlat
            </Button>
          )}

          {isRecording && (
            <Button
              type="button"
              size="lg"
              onClick={stopRecording}
              variant="destructive"
              className="gap-2 animate-pulse"
            >
              <Square className="h-5 w-5" />
              Kaydı Durdur
            </Button>
          )}

          {isProcessing && (
            <Button size="lg" disabled className="gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              İşleniyor...
            </Button>
          )}
        </div>

        {transcriptionResult && (
          <div className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Transkript
                </h4>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleEdit}
                        className="gap-1"
                      >
                        <Edit2 className="h-3 w-3" />
                        Düzenle
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleDelete}
                        className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                        Sil
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        type="button"
                        size="sm"
                        variant="default"
                        onClick={handleSaveEdit}
                        className="gap-1"
                      >
                        <Save className="h-3 w-3" />
                        Kaydet
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                        className="gap-1"
                      >
                        <X className="h-3 w-3" />
                        İptal
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              {isEditing ? (
                <Textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="min-h-[100px] text-sm"
                  placeholder="Metni düzenleyin..."
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {transcriptionResult?.transcription?.text || 'Transkript mevcut değil'}
                </p>
              )}
              
              <p className="text-xs text-muted-foreground">
                Sağlayıcı: {transcriptionResult?.transcription?.provider?.toUpperCase() || 'Bilinmiyor'}
                {transcriptionResult?.transcription?.duration && ` • ${transcriptionResult.transcription.duration}ms`}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">AI Analizi</h4>
              
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Özet:</span>
                  <span className="font-medium">{transcriptionResult.analysis.summary}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kategori:</span>
                  <span className="font-medium">{transcriptionResult.analysis.category}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duygu:</span>
                  <span className="font-medium">{transcriptionResult.analysis.sentiment}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Risk Seviyesi:</span>
                  <span className={`font-medium ${
                    transcriptionResult.analysis.riskLevel === 'YÜKSEK' ? 'text-red-500' :
                    transcriptionResult.analysis.riskLevel === 'ORTA' ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>
                    {transcriptionResult.analysis.riskLevel}
                  </span>
                </div>

                {transcriptionResult.analysis.keywords.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Anahtar Kelimeler:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {transcriptionResult.analysis.keywords.map((keyword, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {transcriptionResult.analysis.riskKeywords.length > 0 && (
                  <div>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Risk Anahtar Kelimeleri:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {transcriptionResult.analysis.riskKeywords.map((keyword, i) => (
                        <span key={i} className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {transcriptionResult.analysis.recommendations.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Öneriler:</span>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {transcriptionResult.analysis.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm">{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
