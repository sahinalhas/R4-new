/**
 * Predictive Risk Timeline Service
 * Öngörücü Risk Zaman Çizelgesi Servisi
 * 
 * 24-48-72 saat risk tahminleri ve pattern bazlı öngörüler
 */

import { AIProviderService } from './ai-provider.service.js';
import { PatternAnalysisService, type PatternInsight } from './pattern-analysis.service.js';
import { StudentContextService } from './student-context.service.js';
import getDatabase from '../lib/database.js';

export interface TimeBasedRiskPrediction {
  timeframe: '24_HOURS' | '48_HOURS' | '72_HOURS' | '1_WEEK';
  riskLevel: 'DÜŞÜK' | 'ORTA' | 'YÜKSEK' | 'KRİTİK';
  probability: number;
  keyIndicators: string[];
  triggerEvents: string[];
  preventiveActions: string[];
}

export interface BehaviorPattern {
  patternType: 'AKADEMİK' | 'DAVRANIŞSAL' | 'SOSYAL' | 'DUYGUSAL' | 'DEVAMSIZLIK';
  patternName: string;
  frequency: 'GÜNLÜK' | 'HAFTALIK' | 'AYLIK' | 'MEVSİMSEL';
  confidence: number;
  description: string;
  triggers: string[];
  peakTimes: string[];
  interventionWindows: string[];
}

export interface PredictiveAlert {
  alertId: string;
  studentId: string;
  predictionDate: string;
  alertType: 'ERKEN_UYARI' | 'ACİL_MÜDAHALE' | 'İZLEME_GEREKLİ' | 'ÖNLEYICI_DESTEK';
  severity: 'DÜŞÜK' | 'ORTA' | 'YÜKSEK' | 'KRİTİK';
  title: string;
  description: string;
  predictedOutcome: string;
  preventionStrategy: string;
  actionDeadline: string;
  responsibleParties: string[];
}

export interface CausalAnalysis {
  observedEvent: string;
  eventDate: string;
  likelyRootCauses: Array<{
    cause: string;
    likelihood: number;
    evidence: string[];
    contributingFactors: string[];
  }>;
  contributingFactors: {
    academic: string[];
    social: string[];
    emotional: string[];
    environmental: string[];
    family: string[];
  };
  cascadeEffects: Array<{
    effect: string;
    probability: number;
    timeframe: string;
    preventionStrategies: string[];
  }>;
}

export interface PredictiveRiskTimeline {
  studentId: string;
  studentName: string;
  generatedAt: string;
  
  currentRiskStatus: {
    overallRisk: 'DÜŞÜK' | 'ORTA' | 'YÜKSEK' | 'KRİTİK';
    activeAlerts: number;
    recentChanges: string[];
    urgentActions: string[];
  };
  
  timeBasedPredictions: {
    next24Hours: TimeBasedRiskPrediction;
    next48Hours: TimeBasedRiskPrediction;
    next72Hours: TimeBasedRiskPrediction;
    nextWeek: TimeBasedRiskPrediction;
  };
  
  identifiedPatterns: BehaviorPattern[];
  
  predictiveAlerts: PredictiveAlert[];
  
  causalAnalyses: CausalAnalysis[];
  
  earlyInterventionOpportunities: Array<{
    window: string;
    opportunity: string;
    expectedImpact: 'YÜKSEK' | 'ORTA' | 'DÜŞÜK';
    actionSteps: string[];
    resources: string[];
    deadline: string;
  }>;
  
  monitoringPlan: {
    checkpoints: Array<{
      time: string;
      whatToMonitor: string[];
      redFlags: string[];
      contactPerson: string;
    }>;
    escalationTriggers: string[];
    successIndicators: string[];
  };
}

class PredictiveRiskTimelineService {
  private aiProvider: AIProviderService;
  private patternService: PatternAnalysisService;
  private contextService: StudentContextService;
  private db: ReturnType<typeof getDatabase>;

  constructor() {
    this.aiProvider = AIProviderService.getInstance();
    this.patternService = new PatternAnalysisService();
    this.contextService = new StudentContextService();
    this.db = getDatabase();
  }

  async generatePredictiveTimeline(studentId: string): Promise<PredictiveRiskTimeline> {
    const [context, patterns] = await Promise.all([
      this.contextService.getStudentContext(studentId),
      this.patternService.analyzeStudentPatterns(studentId)
    ]);

    const isAvailable = await this.aiProvider.isAvailable();
    if (!isAvailable) {
      return this.generateFallbackTimeline(studentId, context, patterns);
    }

    const prompt = this.buildPredictivePrompt(context, patterns);

    try {
      const response = await this.aiProvider.chat({
        messages: [
          {
            role: 'system',
            content: 'Sen öğrenci risk değerlendirmesi konusunda uzman bir veri bilimcisi ve eğitim danışmanısın. Geçmiş verileri ve pattern\'leri analiz ederek gelecekteki riskleri öngörüyorsun. Zamansal tahminler, sebep-sonuç analizleri ve erken müdahale fırsatlarını belirleme konusunda uzmansın.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2
      });

      return this.parseTimelineResponse(studentId, context.student.name, response, patterns);
    } catch (error) {
      console.error('Predictive timeline error:', error);
      return this.generateFallbackTimeline(studentId, context, patterns);
    }
  }

  private buildPredictivePrompt(context: any, patterns: PatternInsight[]): string {
    return `Öğrenci için ÖNGÖRÜCÜ RİSK ZAMAN ÇİZELGESİ oluştur:

📊 ÖĞRENCİ BAĞLAMI:
${JSON.stringify(context, null, 2)}

📈 TESPİT EDİLEN PATTERN'LER:
${JSON.stringify(patterns, null, 2)}

🎯 ZAMAN BAZLI TAHMİNLER:

1. SONRAKİ 24 SAAT:
   - Risk seviyesi tahmini
   - Olası tetikleyici olaylar
   - Acil önleyici aksiyonlar
   - İzleme gereklilikleri

2. SONRAKİ 48 SAAT:
   - Risk gelişimi
   - Kritik müdahale pencereleri
   - Kaynak ihtiyaçları

3. SONRAKİ 72 SAAT:
   - Orta vadeli risk eğilimleri
   - Kümülatif etkiler
   - Stratejik önlemler

4. GELECEK HAFTA:
   - Haftalık risk projeksiyonu
   - Önemli olaylar/tarihler
   - Uzun vadeli önleme stratejileri

🔍 DAVRANIŞSAL PATTERN ANALİZİ:
- Pattern tipleri (akademik, davranışsal, sosyal, duygusal)
- Frekans ve döngüler
- Tetikleyiciler ve zirve zamanları
- Müdahale pencereleri

⚠️ ÖNGÖRÜCÜ UYARILAR:
- Erken uyarı sinyalleri
- Acil müdahale gerektiren durumlar
- Önleyici destek fırsatları
- Aksiyon son tarihleri

🔗 SEBEP-SONUÇ ANALİZİ:
- Gözlemlenen olayların kök nedenleri
- Katkıda bulunan faktörler (akademik, sosyal, duygusal, çevresel, aile)
- Zincirleme etkiler ve önleme stratejileri

💡 ERKEN MÜDAHALE FIRSATLARI:
- Müdahale pencereleri
- Beklenen etki seviyeleri
- Aksiyon adımları ve kaynaklar

📋 İZLEME PLANI:
- Kontrol noktaları ve zamanları
- İzlenecek göstergeler
- Kırmızı bayraklar
- Yükselme tetikleyicileri
- Başarı göstergeleri

⚠️ ÖNEMLİ:
- Veri-driven tahminler yap
- Spesifik zaman dilimleri belirt
- Uygulanabilir aksiyonlar öner
- Risk seviyelerini net belirt
- Önleyici yaklaşıma odaklan

Yanıtını JSON formatında ver (TypeScript PredictiveRiskTimeline tipine uygun).`;
  }

  private parseTimelineResponse(
    studentId: string,
    studentName: string,
    response: string,
    patterns: PatternInsight[]
  ): PredictiveRiskTimeline {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          studentId,
          studentName,
          generatedAt: new Date().toISOString(),
          ...parsed
        };
      }
    } catch (error) {
      console.error('Parse error:', error);
    }

    return this.generateFallbackTimeline(studentId, { student: { name: studentName } }, patterns);
  }

  private generateFallbackTimeline(studentId: string, context: any, patterns: PatternInsight[]): PredictiveRiskTimeline {
    const urgentPatterns = patterns.filter(p => p.severity === 'CRITICAL' || p.severity === 'WARNING');
    
    return {
      studentId,
      studentName: context.student.name,
      generatedAt: new Date().toISOString(),
      currentRiskStatus: {
        overallRisk: urgentPatterns.length > 2 ? 'YÜKSEK' : urgentPatterns.length > 0 ? 'ORTA' : 'DÜŞÜK',
        activeAlerts: urgentPatterns.length,
        recentChanges: patterns.slice(0, 3).map(p => p.description),
        urgentActions: urgentPatterns.map(p => p.recommendation || 'İzleme gerekli')
      },
      timeBasedPredictions: {
        next24Hours: {
          timeframe: '24_HOURS',
          riskLevel: urgentPatterns.length > 2 ? 'YÜKSEK' : 'ORTA',
          probability: urgentPatterns.length > 0 ? 70 : 30,
          keyIndicators: urgentPatterns.slice(0, 2).map(p => p.title),
          triggerEvents: ['Mevcut pattern\'lerin devamı', 'Stresli durumlar'],
          preventiveActions: ['Yakın izleme', 'Destekleyici iletişim', 'Erken müdahale hazırlığı']
        },
        next48Hours: {
          timeframe: '48_HOURS',
          riskLevel: urgentPatterns.length > 1 ? 'ORTA' : 'DÜŞÜK',
          probability: urgentPatterns.length > 0 ? 60 : 25,
          keyIndicators: patterns.slice(0, 3).map(p => p.title),
          triggerEvents: ['Kümülatif stres', 'Sosyal zorluklar'],
          preventiveActions: ['Aile ile iletişim', 'Destek planı hazırlama']
        },
        next72Hours: {
          timeframe: '72_HOURS',
          riskLevel: 'ORTA',
          probability: 50,
          keyIndicators: ['Trend devamı', 'Çevresel faktörler'],
          triggerEvents: ['Hafta sonu etkisi', 'Ödev/sınav stresi'],
          preventiveActions: ['Hafta sonu planı', 'Kaynak temini']
        },
        nextWeek: {
          timeframe: '1_WEEK',
          riskLevel: urgentPatterns.length > 0 ? 'ORTA' : 'DÜŞÜK',
          probability: 40,
          keyIndicators: ['Uzun vadeli pattern\'ler'],
          triggerEvents: ['Önemli tarihler', 'Dönemsel değişiklikler'],
          preventiveActions: ['Kapsamlı destek planı', 'Müdahale hazırlığı']
        }
      },
      identifiedPatterns: patterns.map(p => ({
        patternType: this.categorizPattern(p.category),
        patternName: p.title,
        frequency: 'HAFTALIK',
        confidence: p.severity === 'CRITICAL' ? 90 : p.severity === 'WARNING' ? 70 : 50,
        description: p.description,
        triggers: p.evidence,
        peakTimes: ['Belirleniyor'],
        interventionWindows: ['Sabah saatleri', 'Ders arası']
      })),
      predictiveAlerts: urgentPatterns.map((p, i) => ({
        alertId: `pred-${Date.now()}-${i}`,
        studentId,
        predictionDate: new Date().toISOString(),
        alertType: p.severity === 'CRITICAL' ? 'ACİL_MÜDAHALE' : 'ERKEN_UYARI',
        severity: p.severity === 'CRITICAL' ? 'YÜKSEK' : 'ORTA',
        title: p.title,
        description: p.description,
        predictedOutcome: 'Risk artışı olasılığı',
        preventionStrategy: p.recommendation || 'Yakın izleme ve destek',
        actionDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        responsibleParties: ['Rehber Öğretmen', 'Sınıf Öğretmeni']
      })),
      causalAnalyses: patterns.slice(0, 2).map(p => ({
        observedEvent: p.title,
        eventDate: new Date().toISOString(),
        likelyRootCauses: [
          {
            cause: 'Altta yatan faktörler',
            likelihood: 70,
            evidence: p.evidence,
            contributingFactors: ['Değerlendirme gerekli']
          }
        ],
        contributingFactors: {
          academic: p.category === 'TREND' ? [p.description] : [],
          social: p.category === 'PATTERN' ? [p.description] : [],
          emotional: p.category === 'CORRELATION' ? [p.description] : [],
          environmental: [],
          family: []
        },
        cascadeEffects: [
          {
            effect: 'Durum kötüleşebilir',
            probability: 60,
            timeframe: '3-7 gün',
            preventionStrategies: [p.recommendation || 'Müdahale planı']
          }
        ]
      })),
      earlyInterventionOpportunities: [
        {
          window: 'Bugün - 48 saat',
          opportunity: 'Erken tespit ve destek',
          expectedImpact: 'YÜKSEK',
          actionSteps: ['Öğrenci ile görüşme', 'Aile bilgilendirme', 'Destek planı'],
          resources: ['Rehberlik servisi', 'Sınıf öğretmeni desteği'],
          deadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
        }
      ],
      monitoringPlan: {
        checkpoints: [
          {
            time: 'Her gün saat 09:00',
            whatToMonitor: ['Devamsızlık', 'Genel durum', 'Davranış'],
            redFlags: urgentPatterns.map(p => p.title),
            contactPerson: 'Rehber Öğretmen'
          },
          {
            time: 'Her gün saat 14:00',
            whatToMonitor: ['Ders katılımı', 'Sosyal etkileşim'],
            redFlags: ['Geri çekilme', 'İzolasyon'],
            contactPerson: 'Sınıf Öğretmeni'
          }
        ],
        escalationTriggers: [
          'Devamsızlık artışı',
          'Akademik performans düşüşü',
          'Davranış değişiklikleri',
          'Sosyal izolasyon'
        ],
        successIndicators: [
          'Düzenli devam',
          'Ders katılımı artışı',
          'Pozitif sosyal etkileşim',
          'İyileşen akademik performans'
        ]
      }
    };
  }

  private categorizPattern(category: string): BehaviorPattern['patternType'] {
    switch (category) {
      case 'TREND':
        return 'AKADEMİK';
      case 'PATTERN':
        return 'DAVRANIŞSAL';
      case 'CORRELATION':
        return 'SOSYAL';
      case 'ANOMALY':
        return 'DUYGUSAL';
      default:
        return 'DAVRANIŞSAL';
    }
  }
}

export default PredictiveRiskTimelineService;
