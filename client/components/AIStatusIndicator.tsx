import { useEffect, useState } from 'react';
import { Bot, Sparkles, Circle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { apiClient, createApiHandler } from '@/lib/api/api-client';

interface AIStatus {
  isActive: boolean;
  provider: string | null;
  model: string | null;
  providerName: string;
}

export default function AIStatusIndicator() {
  const [aiStatus, setAiStatus] = useState<AIStatus>({
    isActive: false,
    provider: null,
    model: null,
    providerName: 'Yükleniyor...'
  });

  useEffect(() => {
    const fetchAIStatus = async () => {
      const data = await createApiHandler(
        async () => {
          return await apiClient.get<AIStatus>('/api/ai/status', { showErrorToast: false });
        },
        {
          isActive: false,
          provider: null,
          model: null,
          providerName: 'Kapalı'
        }
      )();
      setAiStatus(data);
    };

    fetchAIStatus();
    const interval = setInterval(fetchAIStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getProviderIcon = () => {
    if (!aiStatus.isActive) {
      return <Bot className="h-4 w-4 text-red-500" />;
    }
    if (aiStatus.provider === 'gemini') {
      return <Sparkles className="h-4 w-4 text-green-500" />;
    } else if (aiStatus.provider === 'openai') {
      return <Bot className="h-4 w-4 text-green-500" />;
    } else {
      return <Circle className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusColor = () => {
    if (!aiStatus.isActive) return 'bg-red-500';
    return 'bg-green-500';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            className="relative p-2 hover:bg-accent rounded-md transition-colors"
            aria-label="AI Asistan Durumu"
          >
            {getProviderIcon()}
            <div className={`absolute top-1 right-1 h-2 w-2 rounded-full ${getStatusColor()} ${aiStatus.isActive ? 'animate-pulse' : ''}`} />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-semibold">AI Asistan Durumu</p>
            <div className="text-sm text-muted-foreground space-y-0.5">
              <p>Durum: <span className="text-foreground font-medium">{aiStatus.isActive ? 'Aktif' : 'Devre Dışı'}</span></p>
              <p>Sağlayıcı: <span className="text-foreground font-medium">{aiStatus.providerName}</span></p>
              {aiStatus.model && (
                <p>Model: <span className="text-foreground font-medium">{aiStatus.model}</span></p>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
