import { Router } from 'express';
import { getAIProviderService } from '../services/ai-provider.service.js';

const router = Router();

router.get('/status', async (_req, res) => {
  try {
    const aiService = getAIProviderService();
    const provider = aiService.getProvider();
    const model = aiService.getModel();
    
    const status = {
      isActive: true,
      provider: provider,
      model: model,
      providerName: provider === 'gemini' ? 'Google Gemini' : 
                    provider === 'openai' ? 'OpenAI' : 
                    provider === 'ollama' ? 'Ollama (Yerel)' : provider
    };
    
    res.json(status);
  } catch (error) {
    res.json({
      isActive: false,
      provider: null,
      model: null,
      providerName: 'AI Devre Dışı'
    });
  }
});

export default router;
