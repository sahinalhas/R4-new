/**
 * Profile Aggregation Service
 * Tüm veri kaynaklarını birleştirerek canlı öğrenci profilini oluşturur
 */

import { DataValidationService } from './data-validation.service.js';
import { AIProviderService } from '../../../services/ai-provider.service.js';
import type { 
  ProfileUpdateRequest, 
  ProfileUpdateResult, 
  UnifiedStudentIdentity,
  DataConflict,
  ProfileDomain
} from '../types/index.js';

export class ProfileAggregationService {
  private validationService: DataValidationService;
  private aiProvider: AIProviderService;

  constructor() {
    this.validationService = new DataValidationService();
    this.aiProvider = AIProviderService.getInstance();
  }

  /**
   * Yeni veri geldiğinde profili otomatik günceller
   */
  async processDataUpdate(request: ProfileUpdateRequest): Promise<ProfileUpdateResult> {
    try {
      console.log(`📊 Processing data update for student ${request.studentId} from ${request.source}`);

      // 1. Veriyi AI ile doğrula
      const validationResult = await this.validationService.validateData(
        request.source,
        request.rawData
      );

      if (!validationResult.isValid) {
        return {
          success: false,
          updatedDomains: [],
          validationResult,
          conflicts: [],
          autoResolved: false,
          message: `Veri doğrulama başarısız: ${validationResult.reasoning}`
        };
      }

      // 2. Çelişkileri kontrol et
      const conflicts = validationResult.conflicts || [];

      // 3. Profil alanlarını güncelle
      const updatedDomains = await this.updateProfileDomains(
        request.studentId,
        validationResult.suggestedDomain,
        validationResult.extractedInsights,
        request.source
      );

      // 4. Unified Identity'yi güncelle
      await this.refreshUnifiedIdentity(request.studentId);

      // 5. Log kaydı
      await this.logProfileUpdate(request, validationResult, updatedDomains);

      return {
        success: true,
        updatedDomains,
        validationResult,
        conflicts,
        autoResolved: conflicts.length === 0,
        message: `Profil başarıyla güncellendi. ${updatedDomains.length} alan etkilendi.`
      };
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  /**
   * Profil alanlarını günceller
   */
  private async updateProfileDomains(
    studentId: string,
    domains: ProfileDomain[],
    insights: Record<string, any>,
    source: string
  ): Promise<ProfileDomain[]> {
    const updated: ProfileDomain[] = [];

    for (const domain of domains) {
      try {
        await this.updateSpecificDomain(studentId, domain, insights, source);
        updated.push(domain);
      } catch (error) {
        console.error(`Failed to update domain ${domain}:`, error);
      }
    }

    return updated;
  }

  /**
   * Belirli bir profil alanını günceller
   */
  private async updateSpecificDomain(
    studentId: string,
    domain: ProfileDomain,
    insights: Record<string, any>,
    source: string
  ): Promise<void> {
    // Bu fonksiyon her domain için özel güncelleme mantığı içerir
    // Şimdilik log kaydı yapıyoruz, sonra repository'lere bağlayacağız
    
    console.log(`✅ Updated ${domain} for student ${studentId} with insights:`, insights);
    
    // TODO: Repository'lere bağla
    // - Academic profile güncelle
    // - Social-emotional profile güncelle
    // - Risk factors güncelle
    // vs.
  }

  /**
   * Unified Student Identity'yi yeniler - "Öğrenci Kimdir?" sorusunun cevabı
   */
  async refreshUnifiedIdentity(studentId: string): Promise<UnifiedStudentIdentity> {
    try {
      // Tüm profil verilerini topla
      const allData = await this.gatherAllProfileData(studentId);

      // AI ile öğrenci kimliğini oluştur
      const identity = await this.generateStudentIdentity(studentId, allData);

      // Database'e kaydet (şimdilik sadece return ediyoruz)
      return identity;
    } catch (error) {
      console.error('Unified identity refresh error:', error);
      throw error;
    }
  }

  /**
   * Tüm profil verilerini toplar
   */
  private async gatherAllProfileData(studentId: string): Promise<any> {
    // TODO: Tüm repository'lerden veri topla
    return {
      studentId,
      // academic: await academicRepo.getProfile(studentId),
      // socialEmotional: await socialRepo.getProfile(studentId),
      // behavioral: await behaviorRepo.getProfile(studentId),
      // etc...
    };
  }

  /**
   * AI ile öğrenci kimliğini oluşturur
   */
  private async generateStudentIdentity(
    studentId: string,
    allData: any
  ): Promise<UnifiedStudentIdentity> {
    const prompt = `Sen bir eğitim uzmanı AI'sısın. Bir öğrenci hakkındaki TÜM verileri analiz edip, o öğrencinin KİM olduğunu anlamalısın.

ÖĞRENCİ ID: ${studentId}

TÜM VERİLER:
${JSON.stringify(allData, null, 2)}

GÖREV: Bu öğrencinin kimliğini oluştur. Şu soruları yanıtla:

1. Bu öğrenci KİM? (Kişilik özeti)
2. Güçlü yönleri neler?
3. Zorlukları neler?
4. Şu an nasıl bir durumda?
5. Öğrenme stili nedir?
6. Risk seviyesi nedir?
7. Hangi müdahaleler önerilir?

ZORUNLU JSON FORMATI:
{
  "summary": "Bu öğrenci kimdir - 2-3 cümle özet",
  "keyCharacteristics": ["özellik1", "özellik2", "özellik3"],
  "currentState": "Şu anki genel durumu",
  "academicScore": 0-100,
  "socialEmotionalScore": 0-100,
  "behavioralScore": 0-100,
  "motivationScore": 0-100,
  "riskLevel": 0-100,
  "strengths": ["güçlü yön 1", "güçlü yön 2"],
  "challenges": ["zorluk 1", "zorluk 2"],
  "recentChanges": ["yakın zamandaki değişiklik 1", "değişiklik 2"],
  "personalityProfile": "Kişilik profili açıklaması",
  "learningStyle": "Öğrenme stili",
  "interventionPriority": "low/medium/high/critical",
  "recommendedActions": ["öneri 1", "öneri 2", "öneri 3"]
}

SADECE JSON döndür.`;

    try {
      const response = await this.aiProvider.generateText(prompt, {
        temperature: 0.4,
        responseFormat: 'json'
      });

      const parsed = JSON.parse(response.replace(/```json\n?/g, '').replace(/```\n?/g, ''));

      return {
        studentId,
        lastUpdated: new Date().toISOString(),
        summary: parsed.summary || 'Profil oluşturuluyor...',
        keyCharacteristics: parsed.keyCharacteristics || [],
        currentState: parsed.currentState || 'Veri toplanıyor',
        academicScore: parsed.academicScore || 50,
        socialEmotionalScore: parsed.socialEmotionalScore || 50,
        behavioralScore: parsed.behavioralScore || 50,
        motivationScore: parsed.motivationScore || 50,
        riskLevel: parsed.riskLevel || 50,
        strengths: parsed.strengths || [],
        challenges: parsed.challenges || [],
        recentChanges: parsed.recentChanges || [],
        personalityProfile: parsed.personalityProfile || '',
        learningStyle: parsed.learningStyle || '',
        interventionPriority: parsed.interventionPriority || 'medium',
        recommendedActions: parsed.recommendedActions || []
      };
    } catch (error) {
      console.error('Identity generation error:', error);
      
      // Fallback identity
      return {
        studentId,
        lastUpdated: new Date().toISOString(),
        summary: 'Profil analizi devam ediyor...',
        keyCharacteristics: [],
        currentState: 'Veri toplanıyor',
        academicScore: 50,
        socialEmotionalScore: 50,
        behavioralScore: 50,
        motivationScore: 50,
        riskLevel: 50,
        strengths: [],
        challenges: [],
        recentChanges: [],
        personalityProfile: '',
        learningStyle: '',
        interventionPriority: 'medium',
        recommendedActions: []
      };
    }
  }

  /**
   * Profil güncelleme logunu kaydeder
   */
  private async logProfileUpdate(
    request: ProfileUpdateRequest,
    validation: any,
    updatedDomains: ProfileDomain[]
  ): Promise<void> {
    console.log(`📝 Profile update log:`, {
      studentId: request.studentId,
      source: request.source,
      domains: updatedDomains,
      confidence: validation.confidence
    });
    
    // TODO: Database'e log kaydet
  }

  /**
   * Çelişkileri otomatik çözümler
   */
  async resolveConflicts(
    studentId: string,
    conflicts: DataConflict[]
  ): Promise<DataConflict[]> {
    const resolved: DataConflict[] = [];

    for (const conflict of conflicts) {
      // Yüksek severity'li çelişkiler manuel onay gerektirir
      if (conflict.severity === 'high') {
        console.warn(`⚠️ High severity conflict detected for student ${studentId}:`, conflict);
        continue;
      }

      // Düşük severity'li çelişkiler otomatik çözülür
      // Strateji: Yeni veri daha güncel kabul edilir
      resolved.push({
        ...conflict,
        severity: 'low'
      });
    }

    return resolved;
  }
}
