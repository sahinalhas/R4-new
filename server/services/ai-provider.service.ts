/**
 * AI Provider Service
 * OpenAI ve Ollama arasında geçiş için birleşik arayüz
 * Singleton pattern ile tüm servisler aynı provider kullanır
 * Adapter pattern ile provider-specific logic ayrıştırılmıştır
 */

import type { AIAdapter } from './ai-adapters/base-adapter.js';
import { AIAdapterFactory } from './ai-adapters/adapter-factory.js';

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
    const defaultProvider = process.env.GEMINI_API_KEY ? 'gemini' : 'ollama';
    const defaultModel = process.env.GEMINI_API_KEY ? 'gemini-2.0-flash-exp' : 'llama3';
    
    this.config = {
      provider: (config?.provider || defaultProvider) as AIProvider,
      model: config?.model || defaultModel,
      temperature: config?.temperature || 0,
      ollamaBaseUrl: config?.ollamaBaseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
    };

    this.adapter = AIAdapterFactory.createAdapter(this.config);
  }

  /**
   * Get singleton instance
   */
  public static getInstance(config?: Partial<AIProviderConfig>): AIProviderService {
    if (!AIProviderService.instance) {
      AIProviderService.instance = new AIProviderService(config);
    } else if (!config) {
      const hasGeminiKey = !!process.env.GEMINI_API_KEY;
      const currentProvider = AIProviderService.instance.config.provider;
      
      if (hasGeminiKey && currentProvider === 'ollama') {
        console.log('🔄 Switching to Gemini (GEMINI_API_KEY detected)');
        AIProviderService.instance.config.provider = 'gemini';
        AIProviderService.instance.config.model = 'gemini-2.0-flash-exp';
        AIProviderService.instance.adapter = AIAdapterFactory.createAdapter(AIProviderService.instance.config);
      }
    }
    return AIProviderService.instance;
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
  setProvider(provider: AIProvider, model?: string): void {
    this.config.provider = provider;
    if (model) {
      this.config.model = model;
    }
    this.adapter = AIAdapterFactory.createAdapter(this.config);
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
