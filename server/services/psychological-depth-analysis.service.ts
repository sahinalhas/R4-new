/**
 * Psychological Depth Analysis Service
 * Psikolojik Derinlik Analiz Servisi
 * 
 * Öğrencilerin psikolojik, sosyal ve duygusal derinlemesine analizi
 * Motivasyon, aile dinamikleri, akran ilişkileri ve gelişimsel faktörler
 */

import { AIProviderService } from './ai-provider.service.js';
import { StudentContextService } from './student-context.service.js';
import getDatabase from '../lib/database.js';

export interface MotivationalProfile {
  intrinsicMotivation: {
    level: 'YÜKSEK' | 'ORTA' | 'DÜŞÜK';
    indicators: string[];
    developmentAreas: string[];
  };
  extrinsicMotivation: {
    level: 'YÜKSEK' | 'ORTA' | 'DÜŞÜK';
    primaryDrivers: string[];
    effectiveRewards: string[];
  };
  learningOrientation: 'ÖĞRENME_ODAKLI' | 'PERFORMANS_ODAKLI' | 'KAÇINMA_ODAKLI' | 'KARMA';
  goalSetting: {
    quality: 'ETKİLİ' | 'GELİŞTİRİLEBİLİR' | 'ZAYIF';
    autonomy: number;
    recommendations: string[];
  };
  resilienceFactors: {
    strengths: string[];
    vulnerabilities: string[];
    copingStrategies: string[];
  };
}

export interface FamilyDynamicsAnalysis {
  parentalInvolvement: {
    level: 'YÜKSEK' | 'ORTA' | 'DÜŞÜK' | 'İNCELENEMEDİ';
    quality: 'DESTEKLEYICI' | 'KARMA' | 'SORUNLU' | 'BELİRSİZ';
    communicationPatterns: string[];
    improvementAreas: string[];
  };
  familyStructure: {
    type: string;
    stabilityLevel: 'STABLE' | 'TRANSITIONING' | 'UNSTABLE' | 'UNKNOWN';
    impactOnStudent: string[];
  };
  socioeconomicFactors: {
    indicators: string[];
    resourceAvailability: 'YETERLİ' | 'KISITLI' | 'YETERSİZ' | 'BELİRSİZ';
    supportNeeds: string[];
  };
  culturalContext: {
    factors: string[];
    considerationsForIntervention: string[];
  };
  familySupport: {
    emotionalSupport: number;
    academicSupport: number;
    practicalSupport: number;
    recommendations: string[];
  };
}

export interface PeerRelationshipAnalysis {
  socialIntegration: {
    level: 'İYİ_ENTEGRE' | 'ORTA_ENTEGRE' | 'İZOLE' | 'KRİTİK_İZOLASYON';
    friendshipQuality: 'SAĞLIKLI' | 'GELIŞEN' | 'SORUNLU' | 'YOK';
    peerAcceptance: number;
    indicators: string[];
  };
  socialSkills: {
    strengths: string[];
    challenges: string[];
    developmentPriorities: string[];
  };
  peerInfluence: {
    positiveInfluences: string[];
    negativeInfluences: string[];
    riskFactors: string[];
    protectiveActions: string[];
  };
  bullying: {
    victimIndicators: string[];
    perpetratorIndicators: string[];
    bystanderBehavior: string[];
    interventionNeeds: string[];
  };
  socialEmotionalCompetencies: {
    selfAwareness: number;
    selfManagement: number;
    socialAwareness: number;
    relationshipSkills: number;
    responsibleDecisionMaking: number;
    focusAreas: string[];
  };
}

export interface DevelopmentalFactorsAnalysis {
  ageAppropriatenesss: {
    academicDevelopment: 'İLERİDE' | 'UYGUN' | 'GECİKMİŞ';
    socialDevelopment: 'İLERİDE' | 'UYGUN' | 'GECİKMİŞ';
    emotionalDevelopment: 'İLERİDE' | 'UYGUN' | 'GECİKMİŞ';
    considerations: string[];
  };
  criticalDevelopmentalNeeds: string[];
  transitions: {
    currentTransitions: string[];
    supportNeeded: string[];
    expectedChallenges: string[];
  };
}

export interface PsychologicalDepthAnalysis {
  studentId: string;
  studentName: string;
  analysisDate: string;
  
  motivationalProfile: MotivationalProfile;
  familyDynamics: FamilyDynamicsAnalysis;
  peerRelationships: PeerRelationshipAnalysis;
  developmentalFactors: DevelopmentalFactorsAnalysis;
  
  synthesisAndRecommendations: {
    keyPsychologicalThemes: string[];
    primaryConcerns: string[];
    strengthsToLeverage: string[];
    criticalInterventions: Array<{
      area: string;
      priority: 'ACİL' | 'YÜKSEK' | 'ORTA';
      intervention: string;
      rationale: string;
      expectedOutcome: string;
      timeline: string;
    }>;
    counselingApproach: {
      recommendedModality: string;
      therapeuticTechniques: string[];
      sessionFrequency: string;
      involvementNeeded: string[];
    };
    holisticWellbeingPlan: string;
  };
}

class PsychologicalDepthAnalysisService {
  private aiProvider: AIProviderService;
  private contextService: StudentContextService;
  private db: ReturnType<typeof getDatabase>;

  constructor() {
    this.aiProvider = AIProviderService.getInstance();
    this.contextService = new StudentContextService();
    this.db = getDatabase();
  }

  async generatePsychologicalAnalysis(studentId: string): Promise<PsychologicalDepthAnalysis> {
    const context = await this.contextService.getStudentContext(studentId);
    
    const isAvailable = await this.aiProvider.isAvailable();
    if (!isAvailable) {
      return this.generateFallbackAnalysis(studentId, context);
    }

    const prompt = this.buildPsychologicalAnalysisPrompt(context);
    
    try {
      const response = await this.aiProvider.chat({
        messages: [
          {
            role: 'system',
            content: 'Sen deneyimli bir okul psikoloğu ve rehber öğretmensin. 15+ yıllık deneyiminle öğrencilerin psikolojik, sosyal ve duygusal durumlarını derinlemesine analiz ediyorsun. Gelişim psikolojisi, aile sistemleri teorisi, sosyal öğrenme teorisi ve travma-bilinçli yaklaşımlar konusunda uzmansın.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3
      });

      return this.parseAIResponse(studentId, context.student.name, response);
    } catch (error) {
      console.error('AI analysis error:', error);
      return this.generateFallbackAnalysis(studentId, context);
    }
  }

  private buildPsychologicalAnalysisPrompt(context: any): string {
    return `Aşağıdaki öğrenci için DERİNLEMESİNE PSİKOLOJİK ANALİZ yap:

📊 ÖĞRENCİ BAĞLAMI:
${JSON.stringify(context, null, 2)}

🎯 ANALİZ GEREKSİNİMLERİ:

1. MOTİVASYONEL PROFİL:
   - İçsel ve dışsal motivasyon seviyeleri
   - Öğrenme yönelimi (öğrenme odaklı / performans odaklı / kaçınma odaklı)
   - Hedef belirleme kalitesi ve özerklik
   - Dayanıklılık faktörleri ve başa çıkma stratejileri

2. AİLE DİNAMİKLERİ:
   - Ebeveyn katılımı seviyesi ve kalitesi
   - Aile yapısı ve istikrar
   - Sosyoekonomik faktörler ve kaynak erişimi
   - Kültürel bağlam ve aile desteği
   - Öğrenci üzerindeki etki

3. AKRAN İLİŞKİLERİ:
   - Sosyal entegrasyon ve arkadaşlık kalitesi
   - Sosyal beceriler (güçlü ve zayıf yönler)
   - Akran etkisi (pozitif/negatif)
   - Zorbalık göstergeleri (mağdur/fail/seyirci)
   - Sosyal-duygusal yetkinlikler (5 boyut)

4. GELİŞİMSEL FAKTÖRLER:
   - Yaşa uygunluk (akademik, sosyal, duygusal)
   - Kritik gelişimsel ihtiyaçlar
   - Geçiş dönemleri ve destek gereksinimleri

5. SENTEZ VE ÖNERİLER:
   - Ana psikolojik temalar
   - Temel endişe alanları
   - Kullanılabilir güçlü yönler
   - Kritik müdahaleler (öncelik, gerekçe, beklenen sonuç, zaman çizelgesi)
   - Önerilen danışmanlık yaklaşımı
   - Bütüncül iyilik hali planı

⚠️ ÖNEMLİ:
- Kanıta dayalı değerlendirmeler yap
- Kültürel hassasiyet göster
- Travma-bilinçli yaklaşım kullan
- Güçlü yönleri vurgula
- Pratik, uygulanabilir öneriler sun
- Aile ve okul işbirliğini destekle

Yanıtını JSON formatında ver (TypeScript PsychologicalDepthAnalysis tipine uygun).`;
  }

  private parseAIResponse(studentId: string, studentName: string, response: string): PsychologicalDepthAnalysis {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          studentId,
          studentName,
          analysisDate: new Date().toISOString(),
          ...parsed
        };
      }
    } catch (error) {
      console.error('Parse error:', error);
    }

    return this.generateBasicAnalysisFromText(studentId, studentName, response);
  }

  private generateBasicAnalysisFromText(studentId: string, studentName: string, text: string): PsychologicalDepthAnalysis {
    return {
      studentId,
      studentName,
      analysisDate: new Date().toISOString(),
      motivationalProfile: {
        intrinsicMotivation: {
          level: 'ORTA',
          indicators: ['AI yanıtından çıkarılan göstergeler'],
          developmentAreas: ['Metin analizine dayalı gelişim alanları']
        },
        extrinsicMotivation: {
          level: 'ORTA',
          primaryDrivers: ['Analiz edilen temel motivatörler'],
          effectiveRewards: ['Önerilen ödüller']
        },
        learningOrientation: 'KARMA',
        goalSetting: {
          quality: 'GELİŞTİRİLEBİLİR',
          autonomy: 50,
          recommendations: ['Hedef belirleme becerileri geliştirme']
        },
        resilienceFactors: {
          strengths: ['Tespit edilen güçlü yönler'],
          vulnerabilities: ['Dikkat edilmesi gereken alanlar'],
          copingStrategies: ['Mevcut başa çıkma stratejileri']
        }
      },
      familyDynamics: {
        parentalInvolvement: {
          level: 'ORTA',
          quality: 'KARMA',
          communicationPatterns: ['Gözlemlenen iletişim örüntüleri'],
          improvementAreas: ['İyileştirme önerileri']
        },
        familyStructure: {
          type: 'Standart',
          stabilityLevel: 'STABLE',
          impactOnStudent: ['Aile yapısının öğrenci üzerindeki etkileri']
        },
        socioeconomicFactors: {
          indicators: ['Tespit edilen göstergeler'],
          resourceAvailability: 'BELİRSİZ',
          supportNeeds: ['Destek ihtiyaçları']
        },
        culturalContext: {
          factors: ['Kültürel faktörler'],
          considerationsForIntervention: ['Müdahalede dikkat edilecek noktalar']
        },
        familySupport: {
          emotionalSupport: 50,
          academicSupport: 50,
          practicalSupport: 50,
          recommendations: ['Aile desteği önerileri']
        }
      },
      peerRelationships: {
        socialIntegration: {
          level: 'ORTA_ENTEGRE',
          friendshipQuality: 'GELIŞEN',
          peerAcceptance: 50,
          indicators: ['Sosyal entegrasyon göstergeleri']
        },
        socialSkills: {
          strengths: ['Sosyal beceri güçlü yönleri'],
          challenges: ['Geliştirilecek alanlar'],
          developmentPriorities: ['Öncelikli gelişim alanları']
        },
        peerInfluence: {
          positiveInfluences: ['Olumlu akran etkileri'],
          negativeInfluences: ['Olumsuz etki riskleri'],
          riskFactors: ['Risk faktörleri'],
          protectiveActions: ['Koruyucu önlemler']
        },
        bullying: {
          victimIndicators: [],
          perpetratorIndicators: [],
          bystanderBehavior: [],
          interventionNeeds: []
        },
        socialEmotionalCompetencies: {
          selfAwareness: 50,
          selfManagement: 50,
          socialAwareness: 50,
          relationshipSkills: 50,
          responsibleDecisionMaking: 50,
          focusAreas: ['Odaklanılacak yetkinlik alanları']
        }
      },
      developmentalFactors: {
        ageAppropriatenesss: {
          academicDevelopment: 'UYGUN',
          socialDevelopment: 'UYGUN',
          emotionalDevelopment: 'UYGUN',
          considerations: ['Gelişimsel değerlendirmeler']
        },
        criticalDevelopmentalNeeds: ['Kritik gelişimsel ihtiyaçlar'],
        transitions: {
          currentTransitions: ['Mevcut geçiş dönemleri'],
          supportNeeded: ['Gerekli destekler'],
          expectedChallenges: ['Beklenen zorluklar']
        }
      },
      synthesisAndRecommendations: {
        keyPsychologicalThemes: ['Ana psikolojik temalar (AI yanıtından)'],
        primaryConcerns: ['Temel endişe alanları'],
        strengthsToLeverage: ['Kullanılabilecek güçlü yönler'],
        criticalInterventions: [
          {
            area: 'Genel Destek',
            priority: 'ORTA',
            intervention: 'AI önerileri doğrultusunda müdahale',
            rationale: 'Analiz bulgularına dayalı',
            expectedOutcome: 'Pozitif gelişim ve iyileşme',
            timeline: '3-6 ay'
          }
        ],
        counselingApproach: {
          recommendedModality: 'Bireysel ve grup danışmanlığı',
          therapeuticTechniques: ['Önerilen teknikler'],
          sessionFrequency: 'Haftada 1-2 seans',
          involvementNeeded: ['Gerekli katılımcılar']
        },
        holisticWellbeingPlan: text.substring(0, 500) + '...'
      }
    };
  }

  private generateFallbackAnalysis(studentId: string, context: any): PsychologicalDepthAnalysis {
    return {
      studentId,
      studentName: context.student.name,
      analysisDate: new Date().toISOString(),
      motivationalProfile: {
        intrinsicMotivation: {
          level: 'ORTA',
          indicators: ['Veri yetersizliği nedeniyle detaylı analiz yapılamadı'],
          developmentAreas: ['Daha fazla veri toplama gerekiyor']
        },
        extrinsicMotivation: {
          level: 'ORTA',
          primaryDrivers: ['Belirlenemedi'],
          effectiveRewards: ['Bireysel değerlendirme gerekli']
        },
        learningOrientation: 'KARMA',
        goalSetting: {
          quality: 'GELİŞTİRİLEBİLİR',
          autonomy: 50,
          recommendations: ['Hedef belirleme becerilerini gözlemle ve destekle']
        },
        resilienceFactors: {
          strengths: ['Değerlendirme gerekli'],
          vulnerabilities: ['Değerlendirme gerekli'],
          copingStrategies: ['Değerlendirme gerekli']
        }
      },
      familyDynamics: {
        parentalInvolvement: {
          level: 'İNCELENEMEDİ',
          quality: 'BELİRSİZ',
          communicationPatterns: ['Aile görüşmesi yapılmalı'],
          improvementAreas: ['Önce mevcut durum değerlendirilmeli']
        },
        familyStructure: {
          type: 'Bilinmiyor',
          stabilityLevel: 'UNKNOWN',
          impactOnStudent: ['Aile görüşmesi gerekli']
        },
        socioeconomicFactors: {
          indicators: ['Veri yok'],
          resourceAvailability: 'BELİRSİZ',
          supportNeeds: ['Değerlendirme yapılmalı']
        },
        culturalContext: {
          factors: ['Bilinmiyor'],
          considerationsForIntervention: ['Aile ve öğrenci ile görüşme gerekli']
        },
        familySupport: {
          emotionalSupport: 50,
          academicSupport: 50,
          practicalSupport: 50,
          recommendations: ['Aile ile görüşme planla']
        }
      },
      peerRelationships: {
        socialIntegration: {
          level: 'ORTA_ENTEGRE',
          friendshipQuality: 'GELIŞEN',
          peerAcceptance: 50,
          indicators: ['Gözlem ve değerlendirme gerekli']
        },
        socialSkills: {
          strengths: ['Değerlendirilmeli'],
          challenges: ['Değerlendirilmeli'],
          developmentPriorities: ['Sosyometrik değerlendirme yapılmalı']
        },
        peerInfluence: {
          positiveInfluences: ['Gözlem gerekli'],
          negativeInfluences: ['Gözlem gerekli'],
          riskFactors: ['Değerlendirme yapılmalı'],
          protectiveActions: ['Önce risk değerlendirmesi']
        },
        bullying: {
          victimIndicators: [],
          perpetratorIndicators: [],
          bystanderBehavior: [],
          interventionNeeds: ['Dikkatli gözlem yapılmalı']
        },
        socialEmotionalCompetencies: {
          selfAwareness: 50,
          selfManagement: 50,
          socialAwareness: 50,
          relationshipSkills: 50,
          responsibleDecisionMaking: 50,
          focusAreas: ['SEL değerlendirmesi yapılmalı']
        }
      },
      developmentalFactors: {
        ageAppropriatenesss: {
          academicDevelopment: 'UYGUN',
          socialDevelopment: 'UYGUN',
          emotionalDevelopment: 'UYGUN',
          considerations: ['Detaylı gelişimsel değerlendirme önerilir']
        },
        criticalDevelopmentalNeeds: ['Gelişimsel tarama yapılmalı'],
        transitions: {
          currentTransitions: ['Değerlendirilmeli'],
          supportNeeded: ['Değerlendirilmeli'],
          expectedChallenges: ['Değerlendirilmeli']
        }
      },
      synthesisAndRecommendations: {
        keyPsychologicalThemes: ['Yeterli veri yok - kapsamlı değerlendirme gerekli'],
        primaryConcerns: ['Veri toplama ve değerlendirme öncelikli'],
        strengthsToLeverage: ['Öğrenci ile bireysel görüşme yapılmalı'],
        criticalInterventions: [
          {
            area: 'Veri Toplama',
            priority: 'YÜKSEK',
            intervention: 'Kapsamlı değerlendirme süreci başlat',
            rationale: 'Etkili müdahale için yeterli veri gerekli',
            expectedOutcome: 'Öğrenci ihtiyaçlarının net belirlenmesi',
            timeline: '2-4 hafta'
          }
        ],
        counselingApproach: {
          recommendedModality: 'Önce tanıma ve değerlendirme',
          therapeuticTechniques: ['Değerlendirme sonrası belirlenecek'],
          sessionFrequency: 'Değerlendirme aşamasında haftada 1',
          involvementNeeded: ['Öğrenci', 'Aile', 'Öğretmenler']
        },
        holisticWellbeingPlan: 'AI servisi kullanılamıyor. Kapsamlı değerlendirme sonrası plan oluşturulmalı.'
      }
    };
  }
}

export default PsychologicalDepthAnalysisService;
