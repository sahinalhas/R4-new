import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Send, Bot, User, Settings, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIModelsResponse {
  provider: 'openai' | 'ollama';
  currentModel: string;
  availableModels: string[];
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get AI models
  const { data: modelsData } = useQuery<AIModelsResponse>({
    queryKey: ['/api/ai-assistant/models'],
    refetchInterval: 10000
  });

  // Get students for selection
  const { data: studentsData } = useQuery<{ students: any[] }>({
    queryKey: ['/api/students']
  });

  // Streaming chat implementation
  const handleStreamingChat = async (message: string) => {
    try {
      setIsStreaming(true);
      
      // Add user message immediately
      setMessages(prev => [...prev, { role: 'user', content: message }]);

      // Start assistant message (empty at first)
      const assistantMessageIndex = messages.length + 1;
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      const response = await fetch('/api/ai-assistant/chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          studentId: selectedStudent || undefined,
          conversationHistory: messages
        })
      });

      if (!response.ok) {
        throw new Error('Streaming chat başarısız');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Stream okunamadı');
      }

      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulatedContent += parsed.content;
                
                // Update the assistant message in real-time
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[assistantMessageIndex] = {
                    role: 'assistant',
                    content: accumulatedContent
                  };
                  return newMessages;
                });
              }
            } catch (e) {
              console.error('Parse error:', e);
            }
          }
        }
      }

      setIsStreaming(false);
    } catch (error: any) {
      setIsStreaming(false);
      toast.error(error.message || 'Streaming chat hatası');
    }
  };

  // Non-streaming chat fallback
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch('/api/ai-assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          studentId: selectedStudent || undefined,
          conversationHistory: messages
        })
      });

      if (!response.ok) {
        throw new Error('Chat isteği başarısız');
      }

      const data = await response.json();
      return data.data.message;
    },
    onSuccess: (response) => {
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Bir hata oluştu');
    }
  });

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage = input.trim();
    setInput('');

    // Use streaming for better UX
    await handleStreamingChat(userMessage);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI Rehber Asistan</h1>
            <p className="text-muted-foreground">
              Yapay zeka destekli rehberlik asistanı ile öğrencilerinizi daha iyi anlayın
            </p>
          </div>
        </div>

        {/* AI Status Bar */}
        <div className="flex items-center gap-2 mt-4">
          <Badge variant="outline" className="gap-1">
            <Sparkles className="h-3 w-3" />
            {modelsData?.provider === 'ollama' ? 'Ollama' : 'OpenAI'}
          </Badge>
          <Badge variant="secondary">
            {modelsData?.currentModel || 'Yükleniyor...'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Ayarlar
            </CardTitle>
            <CardDescription>
              Asistan ayarlarını yapılandırın
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Öğrenci Seç
              </label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Seçiniz..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tüm Öğrenciler</SelectItem>
                  {studentsData?.students?.map((student: any) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Belirli bir öğrenci hakkında sohbet edin
              </p>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium mb-2 block">
                AI Model
              </label>
              <div className="text-sm text-muted-foreground">
                {modelsData?.currentModel || 'Yükleniyor...'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {modelsData?.provider === 'ollama' 
                  ? 'Yerel Ollama kullanılıyor' 
                  : 'OpenAI kullanılıyor'}
              </p>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => {
                setMessages([]);
                setSelectedStudent('');
                toast.success('Sohbet sıfırlandı');
              }}
            >
              Sohbeti Sıfırla
            </Button>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Sohbet</CardTitle>
            <CardDescription>
              AI asistanınızla konuşun, sorular sorun ve öneriler alın
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages */}
            <ScrollArea className="h-[500px] pr-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <Bot className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    AI Rehber Asistanınıza Hoş Geldiniz
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Öğrencileriniz hakkında sorular sorun, risk analizi yapın, 
                    görüşme özetleri oluşturun veya rehberlik önerileri alın.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-6 w-full max-w-3xl">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!selectedStudent}
                      onClick={() => setInput('Bu öğrencinin kapsamlı bir profilini çıkar. Akademik, sosyal-duygusal, davranışsal tüm boyutları değerlendir. Güçlü yönler, riskler ve öneriler sun.')}
                    >
                      📊 Kapsamlı Profil Analizi
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!selectedStudent}
                      onClick={() => setInput('Bu öğrencinin risklerini derinlemesine analiz et. Akademik, davranışsal, sosyal-duygusal risk faktörlerini belirle. Erken uyarı sinyallerini ve koruyucu faktörleri göster. Acil müdahale gerekiyor mu?')}
                    >
                      ⚠️ Derin Risk Analizi
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!selectedStudent}
                      onClick={() => setInput('Son 6 aydaki verilerden pattern\'leri çıkar. Akademik trendler, davranış döngüleri, devamsızlık patternleri neler? Hangi faktörler birbirleriyle ilişkili? Gelecek için öngörülerin neler?')}
                    >
                      🔍 Pattern ve Trend Analizi
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!selectedStudent}
                      onClick={() => setInput('Bu öğrenci için kanıta dayalı, somut, adım adım müdahale planı hazırla. Kısa, orta ve uzun vadeli hedefler belirle. Kimin ne yapacağını netleştir. İzleme stratejisi öner.')}
                    >
                      📋 Müdahale Planı Oluştur
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!selectedStudent}
                      onClick={() => setInput('Veli görüşmesi için detaylı hazırlık notları hazırla. Hangi konular görüşülmeli? Aileden neler öğrenmeliyiz? İşbirliği önerileri neler? Hassas konulara nasıl yaklaşmalıyız?')}
                    >
                      👨‍👩‍👧 Veli Görüşmesi Hazırlığı
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!selectedStudent}
                      onClick={() => setInput('Öğrencinin güçlü yönlerini, yeteneklerini, ilgi alanlarını vurgula. Bu güçlü yönler nasıl daha fazla kullanılabilir? Motivasyon kaynakları neler? Potansiyelini nasıl geliştirebiliriz?')}
                    >
                      ✨ Güçlü Yönler ve Potansiyel
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!selectedStudent}
                      onClick={() => setInput('Bu öğrencinin öğrenme stilini, öğrenme güçlüklerini ve akademik ihtiyaçlarını analiz et. Öğretmenlere hangi stratejileri önerirsin? Farklılaştırılmış öğretim nasıl uygulanır?')}
                    >
                      🎓 Öğrenme Analizi
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!selectedStudent}
                      onClick={() => setInput('Öğrencinin sosyal-duygusal gelişimini değerlendir. Akran ilişkileri nasıl? Duygu düzenleme becerileri? Empati ve iletişim? Sosyal beceri desteği gerekli mi?')}
                    >
                      💝 Sosyal-Duygusal Değerlendirme
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!selectedStudent}
                      onClick={() => setInput('Bu öğrenci hakkında dikkat etmem gereken ama belki fark etmediğim önemli noktalar var mı? Gözden kaçan detaylar, ilişkiler, çıkarımlar neler?')}
                    >
                      🔎 Proaktif İçgörüler
                    </Button>
                  </div>
                  {!selectedStudent && (
                    <p className="text-sm text-muted-foreground mt-4">
                      👆 Bu analizleri kullanmak için önce bir öğrenci seçin
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      {message.role === 'user' && (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <User className="h-4 w-4 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Mesajınızı yazın..."
                disabled={chatMutation.isPending}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
              >
                {isStreaming ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            {selectedStudent && (
              <p className="text-xs text-muted-foreground">
                Şu anda{' '}
                <span className="font-medium">
                  {studentsData?.students?.find((s: any) => s.id === selectedStudent)?.name || 'Öğrenci'}
                </span>{' '}
                hakkında konuşuyorsunuz
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
