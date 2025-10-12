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
  const [provider, setProvider] = useState<'ollama' | 'openai'>('ollama');
  const [model, setModel] = useState('llama3');
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unchecked' | 'success' | 'error'>('unchecked');

  useEffect(() => {
    loadCurrentSettings();
  }, []);

  const loadCurrentSettings = async () => {
    try {
      const response = await fetch('/api/ai-assistant/models');
      if (response.ok) {
        const data = await response.json();
        setProvider(data.provider || 'ollama');
        setModel(data.currentModel || 'llama3');
        if (data.provider === 'ollama' && data.ollamaBaseUrl) {
          setOllamaUrl(data.ollamaBaseUrl);
        }
      }
    } catch (error) {
      console.error('Failed to load AI settings:', error);
    }
  };

  const checkConnection = async () => {
    setIsChecking(true);
    setConnectionStatus('unchecked');

    try {
      const endpoint = provider === 'ollama' 
        ? `${ollamaUrl}/api/tags`
        : '/api/ai-assistant/models';

      const response = await fetch(endpoint);
      
      if (response.ok) {
        const data = await response.json();
        
        if (provider === 'ollama' && data.models) {
          const modelNames = data.models.map((m: any) => m.name);
          setAvailableModels(modelNames);
          setConnectionStatus('success');
          toast.success('Ollama bağlantısı başarılı!');
        } else if (provider === 'openai' && data.availableModels) {
          setAvailableModels(data.availableModels);
          setConnectionStatus('success');
          toast.success('OpenAI bağlantısı başarılı!');
        } else {
          throw new Error('Invalid response');
        }
      } else {
        throw new Error('Connection failed');
      }
    } catch (error) {
      console.error('Connection error:', error);
      setConnectionStatus('error');
      toast.error(`Bağlantı hatası: ${provider === 'ollama' ? 'Ollama' : 'OpenAI'} servisi erişilemiyor`);
    } finally {
      setIsChecking(false);
    }
  };

  const saveSettings = async () => {
    try {
      const settings = {
        provider,
        model,
        ...(provider === 'ollama' && { ollamaBaseUrl: ollamaUrl })
      };

      const response = await fetch('/api/ai-assistant/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast.success('AI ayarları kaydedildi!');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Ayarlar kaydedilemedi');
    }
  };

  return (
    <div className="space-y-6">
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
            <Select value={provider} onValueChange={(value: 'ollama' | 'openai') => setProvider(value)}>
              <SelectTrigger id="ai-provider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ollama">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    Ollama (Lokal)
                  </div>
                </SelectItem>
                <SelectItem value="openai">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4" />
                    OpenAI (Cloud)
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

          <div className="flex justify-end">
            <Button onClick={saveSettings}>
              Ayarları Kaydet
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
