/**
 * AI Provider Service
 * OpenAI ve Ollama arasında geçiş için birleşik arayüz
 * Singleton pattern ile tüm servisler aynı provider kullanır
 */

import { OllamaAPIService, type OllamaMessage } from './ollama-api.service.js';

export type AIProvider = 'openai' | 'ollama';

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
  private ollamaService: OllamaAPIService;

  private constructor(config?: Partial<AIProviderConfig>) {
    this.config = {
      provider: (config?.provider || 'ollama') as AIProvider,
      model: config?.model || 'llama3.1',
      temperature: config?.temperature || 0,
      ollamaBaseUrl: config?.ollamaBaseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
    };

    this.ollamaService = new OllamaAPIService(this.config.ollamaBaseUrl);
  }

  /**
   * Get singleton instance
   */
  public static getInstance(config?: Partial<AIProviderConfig>): AIProviderService {
    if (!AIProviderService.instance) {
      AIProviderService.instance = new AIProviderService(config);
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
  }

  /**
   * Check if provider is available
   */
  async isAvailable(): Promise<boolean> {
    if (this.config.provider === 'ollama') {
      return await this.ollamaService.checkHealth();
    } else if (this.config.provider === 'openai') {
      return !!process.env.OPENAI_API_KEY;
    }
    return false;
  }

  /**
   * List available models
   */
  async listModels(): Promise<string[]> {
    if (this.config.provider === 'ollama') {
      const models = await this.ollamaService.listModels();
      return models.map(m => m.name);
    } else if (this.config.provider === 'openai') {
      return ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'];
    }
    return [];
  }

  /**
   * Chat completion
   */
  async chat(request: ChatCompletionRequest): Promise<string> {
    if (this.config.provider === 'ollama') {
      return await this.chatWithOllama(request);
    } else if (this.config.provider === 'openai') {
      return await this.chatWithOpenAI(request);
    }
    throw new Error(`Unsupported AI provider: ${this.config.provider}`);
  }

  /**
   * Streaming chat completion
   */
  async *chatStream(request: ChatCompletionRequest): AsyncGenerator<string, void, unknown> {
    if (this.config.provider === 'ollama') {
      yield* this.ollamaService.chatStream({
        model: this.config.model,
        messages: request.messages as OllamaMessage[],
        temperature: request.temperature ?? this.config.temperature,
        format: request.format === 'json' ? 'json' : undefined
      });
    } else if (this.config.provider === 'openai') {
      yield* this.streamWithOpenAI(request);
    } else {
      throw new Error(`Unsupported AI provider: ${this.config.provider}`);
    }
  }

  /**
   * Ollama chat
   */
  private async chatWithOllama(request: ChatCompletionRequest): Promise<string> {
    const response = await this.ollamaService.chat({
      model: this.config.model,
      messages: request.messages as OllamaMessage[],
      temperature: request.temperature ?? this.config.temperature,
      format: request.format === 'json' ? 'json' : undefined
    });

    return response.message.content;
  }

  /**
   * OpenAI chat
   */
  private async chatWithOpenAI(request: ChatCompletionRequest): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        temperature: request.temperature ?? this.config.temperature,
        messages: request.messages,
        ...(request.format === 'json' ? { response_format: { type: 'json_object' } } : {})
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * OpenAI streaming
   */
  private async *streamWithOpenAI(request: ChatCompletionRequest): AsyncGenerator<string, void, unknown> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        temperature: request.temperature ?? this.config.temperature,
        messages: request.messages,
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch (e) {
            console.error('Error parsing OpenAI stream:', e);
          }
        }
      }
    }
  }
}
