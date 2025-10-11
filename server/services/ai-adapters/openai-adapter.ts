import { BaseAIAdapter } from './base-adapter.js';
import type { ChatCompletionRequest } from '../ai-provider.service.js';

export class OpenAIAdapter extends BaseAIAdapter {
  private apiKey: string;

  constructor(model: string, temperature: number = 0) {
    super(model, temperature);
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error('OpenAI API key not configured');
    }
    this.apiKey = key;
  }

  async isAvailable(): Promise<boolean> {
    return !!this.apiKey;
  }

  async listModels(): Promise<string[]> {
    return ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'];
  }

  async chat(request: ChatCompletionRequest): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        temperature: request.temperature ?? this.temperature,
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

  async *chatStream(request: ChatCompletionRequest): AsyncGenerator<string, void, unknown> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        temperature: request.temperature ?? this.temperature,
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
