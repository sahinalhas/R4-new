/**
 * Voice Analysis Service
 * AI ile sesli not analizi - özet, anahtar kelimeler, kategori, risk tespiti
 */

import { AIProviderService } from './ai-provider.service.js';

export interface VoiceAnalysisResult {
  summary: string;
  keywords: string[];
  category: 'AKADEMİK' | 'SOSYAL-DUYGUSAL' | 'DAVRANIŞSAL' | 'AİLE' | 'SAĞLIK' | 'GENEL';
  sentiment: 'POZİTİF' | 'NÖTR' | 'NEGATİF' | 'ENDİŞELİ';
  riskLevel: 'YOK' | 'DÜŞÜK' | 'ORTA' | 'YÜKSEK' | 'KRİTİK';
  riskKeywords: string[];
  urgentAction: boolean;
  recommendations: string[];
}

export class VoiceAnalysisService {
  private aiProvider: AIProviderService;

  constructor() {
    this.aiProvider = AIProviderService.getInstance();
  }

  /**
   * Sesli notun AI analizi
   */
  async analyze(transcriptionText: string): Promise<VoiceAnalysisResult> {
    const prompt = `
Aşağıdaki rehberlik görüşmesi notunu analiz et ve JSON formatında sonuç döndür:

NOT: "${transcriptionText}"

Analiz edilecekler:
1. ÖZET (summary): 2-3 cümlelik kısa özet
2. ANAHTAR KELİMELER (keywords): En önemli 5-7 kelime
3. KATEGORİ (category): AKADEMİK, SOSYAL-DUYGUSAL, DAVRANIŞSAL, AİLE, SAĞLIK, GENEL
4. DUYGU DURUMU (sentiment): POZİTİF, NÖTR, NEGATİF, ENDİŞELİ
5. RİSK SEVİYESİ (riskLevel): YOK, DÜŞÜK, ORTA, YÜKSEK, KRİTİK
6. RİSK KELİMELERİ (riskKeywords): İntihar, şiddet, istismar, kaçma gibi kritik kelimeler varsa listele
7. ACİL EYLEM (urgentAction): true/false - acil müdahale gerekiyor mu?
8. ÖNERİLER (recommendations): 3-5 eylem önerisi

Risk kelimeleri: intihar, kendine zarar, şiddet, istismar, taciz, kaçma, okul bırakma, uyuşturucu, alkol, tehdit, kavga

JSON formatı:
{
  "summary": "...",
  "keywords": ["kelime1", "kelime2", ...],
  "category": "KATEGORİ",
  "sentiment": "DUYGU",
  "riskLevel": "SEVİYE",
  "riskKeywords": ["..."],
  "urgentAction": true/false,
  "recommendations": ["öneri1", "öneri2", ...]
}
`;

    try {
      const response = await this.aiProvider.chat({
        messages: [
          { role: 'system', content: 'Sen profesyonel bir öğrenci rehberlik uzmanısın. Görüşme notlarını analiz edip önemli bilgileri çıkarıyorsun.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0,
        format: 'json'
      });

      const result = JSON.parse(response) as VoiceAnalysisResult;
      
      // Validasyon
      if (!result.summary || !result.keywords || !result.category) {
        throw new Error('AI analizi eksik döndü');
      }

      return result;
    } catch (error: any) {
      console.error('Voice analysis hatası:', error);
      
      // Hata durumunda basit analiz döndür
      return this.fallbackAnalysis(transcriptionText);
    }
  }

  /**
   * Hata durumunda basit analiz
   */
  private fallbackAnalysis(text: string): VoiceAnalysisResult {
    const lowerText = text.toLowerCase();
    
    // Basit risk kelime tespiti
    const riskWords = ['intihar', 'kendine zarar', 'şiddet', 'istismar', 'taciz', 'kaçma', 'uyuşturucu', 'alkol'];
    const foundRiskWords = riskWords.filter(word => lowerText.includes(word));
    
    // Kategori tahmini
    let category: VoiceAnalysisResult['category'] = 'GENEL';
    if (lowerText.includes('ders') || lowerText.includes('sınav') || lowerText.includes('not')) {
      category = 'AKADEMİK';
    } else if (lowerText.includes('arkadaş') || lowerText.includes('sosyal') || lowerText.includes('duygusal')) {
      category = 'SOSYAL-DUYGUSAL';
    } else if (lowerText.includes('davranış') || lowerText.includes('kural') || lowerText.includes('disiplin')) {
      category = 'DAVRANIŞSAL';
    } else if (lowerText.includes('aile') || lowerText.includes('anne') || lowerText.includes('baba')) {
      category = 'AİLE';
    } else if (lowerText.includes('sağlık') || lowerText.includes('hastalık')) {
      category = 'SAĞLIK';
    }

    return {
      summary: text.length > 100 ? text.substring(0, 97) + '...' : text,
      keywords: text.split(' ').filter(w => w.length > 4).slice(0, 5),
      category,
      sentiment: foundRiskWords.length > 0 ? 'ENDİŞELİ' : 'NÖTR',
      riskLevel: foundRiskWords.length > 0 ? 'YÜKSEK' : 'YOK',
      riskKeywords: foundRiskWords,
      urgentAction: foundRiskWords.length > 0,
      recommendations: foundRiskWords.length > 0 
        ? ['Acil müdahale planı oluşturun', 'İlgili uzmanlara yönlendirin', 'Aileyi bilgilendirin']
        : ['Takip görüşmesi planlayın']
    };
  }

  /**
   * Acil durum kontrolü
   */
  isUrgent(analysis: VoiceAnalysisResult): boolean {
    return analysis.urgentAction || 
           analysis.riskLevel === 'KRİTİK' || 
           (analysis.riskLevel === 'YÜKSEK' && analysis.riskKeywords.length > 0);
  }
}
