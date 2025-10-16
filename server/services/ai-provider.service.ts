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
    
    // API anahtarlarını kontrol et
    const hasGeminiKey = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
    const hasOpenAIKey = !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim().length > 0);
    
    let defaultProvider: AIProvider;
    let defaultModel: string;
    
    if (config?.provider) {
      // 1. ÖNCELİK: Programatik config (özel kullanımlar için)
      defaultProvider = config.provider;
      defaultModel = config.model || this.getDefaultModelForProvider(config.provider);
    } else if (savedSettings?.provider) {
      // 2. ÖNCELİK: KULLANICI AYARLARI (Ayarlar sayfasından seçilen - EN ÖNEMLİ!)
      defaultProvider = savedSettings.provider as AIProvider;
      defaultModel = savedSettings.model || this.getDefaultModelForProvider(savedSettings.provider as AIProvider);
      console.log(`📋 Kullanıcı ayarlarından yüklendi: ${defaultProvider} (${defaultModel})`);
    } else if (hasGeminiKey) {
      // 3. Öncelik: İlk kurulumda Gemini API key varsa Gemini
      defaultProvider = 'gemini';
      defaultModel = 'gemini-2.5-flash';
      console.log('🔑 Gemini API key bulundu, varsayılan olarak ayarlandı');
    } else if (hasOpenAIKey) {
      // 4. Öncelik: İlk kurulumda OpenAI API key varsa OpenAI
      defaultProvider = 'openai';
      defaultModel = 'gpt-4o-mini';
      console.log('🔑 OpenAI API key bulundu, varsayılan olarak ayarlandı');
    } else {
      // 5. Son seçenek: Ollama (local)
      defaultProvider = 'ollama';
      defaultModel = 'llama3';
      console.log('🏠 Varsayılan olarak Ollama (local) kullanılıyor');
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
        return 'gemini-2.5-flash';
      case 'openai':
        return 'gpt-4o-mini';
      case 'ollama':
        return 'llama3';
      default:
        return 'gemini-2.5-flash';
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

export function getAIProviderService(config?: Partial<AIProviderConfig>): AIProviderService {
  return AIProviderService.getInstance(config);
}
