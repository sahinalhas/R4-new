/**
 * AI Provider Service
 * OpenAI ve Ollama arasında geçiş için birleşik arayüz
 * Singleton pattern ile tüm servisler aynı provider kullanır
 * Adapter pattern ile provider-specific logic ayrıştırılmıştır
 */

import type { AIAdapter } from './ai-adapters/base-adapter.js';
import { AIAdapterFactory } from './ai-adapters/adapter-factory.js';
import { AppSettingsService } from './app-settings.service.js';

export type AIProvider = 'openai' | 'ollama' | 'gemini';

export interface AIProviderConfig {
  provider: AIProvider;
  model: string;
  temperature?: number;
  ollamaBaseUrl?: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  temperature?: number;
  format?: 'json' | 'text';
}

export class AIProviderService {
  private static instance: AIProviderService;
  private config: AIProviderConfig;
  private adapter: AIAdapter;

  private constructor(config?: Partial<AIProviderConfig>) {
    const savedSettings = AppSettingsService.getAIProvider();
    
    // API anahtarları varsa otomatik olarak o provider'ı kullan
    const hasGeminiKey = !!process.env.GEMINI_API_KEY;
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
    
    let defaultProvider: AIProvider;
    let defaultModel: string;
    
    if (config?.provider) {
      // 1. Öncelik: Config'den gelen provider (programatik kullanım)
      defaultProvider = config.provider;
      defaultModel = config.model || this.getDefaultModelForProvider(config.provider);
    } else if (savedSettings?.provider) {
      // 2. Öncelik: Kullanıcının ayarlardan seçtiği provider
      defaultProvider = savedSettings.provider as AIProvider;
      defaultModel = savedSettings.model || this.getDefaultModelForProvider(savedSettings.provider as AIProvider);
    } else if (hasGeminiKey) {
      // 3. Öncelik: API key varsa o provider'ı kullan (ilk kurulum)
      defaultProvider = 'gemini';
      defaultModel = 'gemini-2.0-flash-exp';
    } else if (hasOpenAIKey) {
      defaultProvider = 'openai';
      defaultModel = 'gpt-4o-mini';
    } else {
      // 4. Son seçenek: Ollama (local)
      defaultProvider = 'ollama';
      defaultModel = 'llama3';
    }
    
    // Model'i belirle - sadece aynı provider için kaydedilmiş model kullanılabilir
    let finalModel: string;
    if (config?.model) {
      // Config'den gelen model öncelikli
      finalModel = config.model;
    } else if (savedSettings?.provider === defaultProvider && savedSettings?.model) {
      // Kaydedilmiş provider ile seçilen provider aynıysa, kaydedilmiş modeli kullan
      finalModel = savedSettings.model;
    } else {
      // Aksi halde provider'a uygun varsayılan modeli kullan
      finalModel = defaultModel;
    }
    
    this.config = {
      provider: defaultProvider,
      model: finalModel,
      temperature: config?.temperature || 0,
      ollamaBaseUrl: config?.ollamaBaseUrl || savedSettings?.ollamaBaseUrl || 'http://localhost:11434'
    };

    this.adapter = AIAdapterFactory.createAdapter(this.config);
    
    console.log(`🤖 AI Provider initialized: ${defaultProvider} (${finalModel})`);
  }
  
  private getDefaultModelForProvider(provider: AIProvider): string {
    switch (provider) {
      case 'gemini':
        return 'gemini-2.0-flash-exp';
      case 'openai':
        return 'gpt-4o-mini';
      case 'ollama':
        return 'llama3';
      default:
        return 'gemini-2.0-flash-exp';
    }
  }

  /**
   * Get singleton instance
   */
  public static getInstance(config?: Partial<AIProviderConfig>): AIProviderService {
    if (!AIProviderService.instance) {
      AIProviderService.instance = new AIProviderService(config);
    } else if (config) {
      // Config verilmişse instance'ı yeniden oluştur
      AIProviderService.instance = new AIProviderService(config);
    }
    return AIProviderService.instance;
  }
  
  /**
   * Reset singleton instance (for testing or manual refresh)
   */
  public static resetInstance(): void {
    AIProviderService.instance = null as any;
  }

  /**
   * Get current provider
   */
  getProvider(): AIProvider {
    return this.config.provider;
  }

  /**
   * Get current model
   */
  getModel(): string {
    return this.config.model;
  }

  /**
   * Set provider
   */
  setProvider(provider: AIProvider, model?: string, ollamaBaseUrl?: string): void {
    this.config.provider = provider;
    if (model) {
      this.config.model = model;
    }
    if (ollamaBaseUrl) {
      this.config.ollamaBaseUrl = ollamaBaseUrl;
    }
    
    // Ayarları database'e kaydet
    AppSettingsService.saveAIProvider(provider, this.config.model, this.config.ollamaBaseUrl);
    
    // Adapter'ı yeniden oluştur
    this.adapter = AIAdapterFactory.createAdapter(this.config);
    
    console.log(`✅ AI Provider değiştirildi: ${provider} (${this.config.model})`);
  }

  /**
   * Check if provider is available
   */
  async isAvailable(): Promise<boolean> {
    return await this.adapter.isAvailable();
  }

  /**
   * List available models
   */
  async listModels(): Promise<string[]> {
    return await this.adapter.listModels();
  }

  /**
   * Chat completion
   */
  async chat(request: ChatCompletionRequest): Promise<string> {
    return await this.adapter.chat(request);
  }

  /**
   * Streaming chat completion
   */
  async *chatStream(request: ChatCompletionRequest): AsyncGenerator<string, void, unknown> {
    yield* this.adapter.chatStream(request);
  }
}
