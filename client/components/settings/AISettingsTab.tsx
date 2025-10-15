import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, CheckCircle, XCircle, Loader2, Server, Cloud } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

export default function AISettingsTab() {
  const [provider, setProvider] = useState<'ollama' | 'openai' | 'gemini'>('gemini');
  const [model, setModel] = useState('gemini-2.0-flash-exp');
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unchecked' | 'success' | 'error'>('unchecked');
  const [currentActiveProvider, setCurrentActiveProvider] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCurrentSettings();
  }, []);

  const loadCurrentSettings = async () => {
    try {
      const response = await fetch('/api/ai-assistant/models');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const currentProvider = data.data.provider || 'gemini';
          const currentModel = data.data.currentModel || 'gemini-2.0-flash-exp';
          
          setProvider(currentProvider);
          setModel(currentModel);
          setCurrentActiveProvider(`${currentProvider} (${currentModel})`);
          
          if (currentProvider === 'ollama' && data.data.ollamaBaseUrl) {
            setOllamaUrl(data.data.ollamaBaseUrl);
          }
          if (data.data.availableModels) {
            setAvailableModels(data.data.availableModels);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load AI settings:', error);
      toast.error('AI ayarları yüklenemedi');
    }
  };

  const checkConnection = async () => {
    setIsChecking(true);
    setConnectionStatus('unchecked');

    try {
      const endpoint = provider === 'ollama' 
        ? `${ollamaUrl}/api/tags`
        : '/api/ai-assistant/health';

      const response = await fetch(endpoint);
      
      if (response.ok) {
        const data = await response.json();
        
        if (provider === 'ollama' && data.models) {
          const modelNames = data.models.map((m: any) => m.name);
          setAvailableModels(modelNames);
          setConnectionStatus('success');
          toast.success('Ollama bağlantısı başarılı!');
        } else if (provider === 'gemini' && data.success && data.data) {
          if (data.data.available) {
            await loadCurrentSettings();
            setConnectionStatus('success');
            toast.success('Gemini bağlantısı başarılı!');
          } else {
            throw new Error('Gemini API key tanımlı değil');
          }
        } else if (provider === 'openai' && data.success && data.data) {
          if (data.data.available) {
            await loadCurrentSettings();
            setConnectionStatus('success');
            toast.success('OpenAI bağlantısı başarılı!');
          } else {
            throw new Error('OpenAI API key tanımlı değil');
          }
        } else {
          throw new Error('Invalid response');
        }
      } else {
        throw new Error('Connection failed');
      }
    } catch (error: any) {
      console.error('Connection error:', error);
      setConnectionStatus('error');
      const providerName = provider === 'ollama' ? 'Ollama' : provider === 'gemini' ? 'Gemini' : 'OpenAI';
      toast.error(`Bağlantı hatası: ${error.message || providerName + ' servisi erişilemiyor'}`);
    } finally {
      setIsChecking(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const settings = {
        provider,
        model,
        ...(provider === 'ollama' && { ollamaBaseUrl: ollamaUrl })
      };

      const response = await fetch('/api/ai-assistant/set-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        const providerName = provider === 'ollama' ? 'Ollama' : provider === 'gemini' ? 'Gemini' : 'OpenAI';
        toast.success(`✅ AI Ayarları Kaydedildi!\n${providerName} (${model}) aktif olarak ayarlandı. Bu ayar kalıcıdır.`);
        
        // Ayarları yeniden yükle
        await loadCurrentSettings();
        
        // Bağlantı durumunu sıfırla
        setConnectionStatus('unchecked');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save settings');
      }
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(`Ayarlar kaydedilemedi: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mevcut Aktif Provider Bilgisi */}
      {currentActiveProvider && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Şu Anda Aktif AI Provider</p>
                <p className="text-lg font-bold text-foreground">{currentActiveProvider}</p>
              </div>
            </div>
            <Badge variant="default" className="bg-green-500">
              <CheckCircle className="mr-1 h-3 w-3" />
              Aktif
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Bu ayar kalıcıdır. Uygulama yeniden başlatılsa bile bu AI provider kullanılacaktır.
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle>AI Provider Yapılandırması</CardTitle>
          </div>
          <CardDescription>
            Yapay zeka özelliklerini kullanmak için bir AI provider seçin ve yapılandırın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ai-provider">AI Provider</Label>
            <Select value={provider} onValueChange={(value: 'ollama' | 'openai' | 'gemini') => setProvider(value)}>
              <SelectTrigger id="ai-provider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4" />
                    Gemini (Ücretsiz)
                  </div>
                </SelectItem>
                <SelectItem value="ollama">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    Ollama (Lokal)
                  </div>
                </SelectItem>
                <SelectItem value="openai">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4" />
                    OpenAI (Ücretli)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {provider === 'ollama' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="ollama-url">Ollama Base URL</Label>
                <Input
                  id="ollama-url"
                  value={ollamaUrl}
                  onChange={(e) => setOllamaUrl(e.target.value)}
                  placeholder="http://localhost:11434"
                />
                <p className="text-xs text-muted-foreground">
                  Ollama servisinin çalıştığı URL. Varsayılan: http://localhost:11434
                </p>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  Ollama Kurulumu
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Ollama'yı <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ollama.ai</a> adresinden indirin</li>
                  <li>Terminalden <code className="bg-muted px-1 rounded">ollama pull llama3</code> komutuyla model indirin</li>
                  <li>Servisi <code className="bg-muted px-1 rounded">ollama serve</code> komutuyla başlatın</li>
                </ul>
              </div>
            </>
          )}

          {provider === 'gemini' && (
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                Gemini AI (Önerilen - Ücretsiz)
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                Google'ın Gemini AI modeli ücretsizdir ve limit yoktur (makul kullanım dahilinde).
              </p>
              <p className="text-sm text-muted-foreground">
                GEMINI_API_KEY zaten tanımlanmış durumda. Eğer değiştirmek isterseniz, API key'inizi <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a> üzerinden alabilirsiniz.
              </p>
            </div>
          )}

          {provider === 'openai' && (
            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                OpenAI API Key Gerekli
              </h4>
              <p className="text-sm text-muted-foreground">
                OpenAI kullanmak için OPENAI_API_KEY environment variable'ı tanımlanmalıdır.
                API key'inizi <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI Platform</a> üzerinden alabilirsiniz.
              </p>
            </div>
          )}

          <Separator />

          <div className="flex items-center gap-3">
            <Button 
              onClick={checkConnection} 
              disabled={isChecking}
              variant="outline"
            >
              {isChecking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Kontrol ediliyor...
                </>
              ) : (
                <>
                  <Server className="mr-2 h-4 w-4" />
                  Bağlantıyı Test Et
                </>
              )}
            </Button>

            {connectionStatus === 'success' && (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="mr-1 h-3 w-3" />
                Bağlı
              </Badge>
            )}
            {connectionStatus === 'error' && (
              <Badge variant="destructive">
                <XCircle className="mr-1 h-3 w-3" />
                Bağlantı Hatası
              </Badge>
            )}
          </div>

          {availableModels.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="ai-model">Model Seçimi</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger id="ai-model">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {availableModels.length} model mevcut
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button 
              onClick={saveSettings}
              disabled={isSaving}
              className="min-w-[140px]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Ayarları Kaydet
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Özellikleri</CardTitle>
          <CardDescription>
            Sistemde mevcut yapay zeka destekli özellikler
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div className="flex items-center justify-between p-2 border rounded-lg">
              <span className="text-sm font-medium">AI Asistan (Sohbet)</span>
              <Badge variant="default">Aktif</Badge>
            </div>
            <div className="flex items-center justify-between p-2 border rounded-lg">
              <span className="text-sm font-medium">Günlük AI Insights</span>
              <Badge variant="default">Aktif</Badge>
            </div>
            <div className="flex items-center justify-between p-2 border rounded-lg">
              <span className="text-sm font-medium">Toplu Analiz</span>
              <Badge variant="default">Aktif</Badge>
            </div>
            <div className="flex items-center justify-between p-2 border rounded-lg">
              <span className="text-sm font-medium">Risk Tahmini</span>
              <Badge variant="default">Aktif</Badge>
            </div>
            <div className="flex items-center justify-between p-2 border rounded-lg">
              <span className="text-sm font-medium">Müdahale Önerileri</span>
              <Badge variant="default">Aktif</Badge>
            </div>
            <div className="flex items-center justify-between p-2 border rounded-lg">
              <span className="text-sm font-medium">Otomatik Rapor Oluşturma</span>
              <Badge variant="default">Aktif</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
