/**
 * Field Mapper Service
 * AI'nın çıkardığı insights'ı gerçek database alanlarına map eder
 */

import type { ProfileDomain } from '../types/index.js';

interface FieldMapping {
  aiKey: string;
  dbField: string;
  transform?: (value: any) => any;
}

export class FieldMapperService {
  
  /**
   * Her domain için field mapping'leri tanımlar
   */
  private domainMappings: Record<ProfileDomain, FieldMapping[]> = {
    health: [
      { aiKey: 'last_doctor_visit', dbField: 'lastHealthCheckup' },
      { aiKey: 'doktor_kontrolu', dbField: 'lastHealthCheckup' },
      { aiKey: 'doctor_visit', dbField: 'lastHealthCheckup' },
      { aiKey: 'doktor_ziyareti', dbField: 'lastHealthCheckup' },
      { aiKey: 'chronic_disease', dbField: 'chronicDiseases', transform: (v) => JSON.stringify([v]) },
      { aiKey: 'kronik_hastalik', dbField: 'chronicDiseases', transform: (v) => JSON.stringify([v]) },
      { aiKey: 'medication', dbField: 'currentMedications', transform: (v) => JSON.stringify([v]) },
      { aiKey: 'ilac', dbField: 'currentMedications', transform: (v) => JSON.stringify([v]) },
      { aiKey: 'allergy', dbField: 'allergies', transform: (v) => JSON.stringify([v]) },
      { aiKey: 'alerji', dbField: 'allergies', transform: (v) => JSON.stringify([v]) },
      { aiKey: 'medical_history', dbField: 'medicalHistory' },
      { aiKey: 'tibbi_gecmis', dbField: 'medicalHistory' },
      { aiKey: 'special_needs', dbField: 'specialNeeds' },
      { aiKey: 'ozel_ihtiyaclar', dbField: 'specialNeeds' },
      { aiKey: 'physical_limitations', dbField: 'physicalLimitations' },
      { aiKey: 'fiziksel_kisitlamalar', dbField: 'physicalLimitations' }
    ],
    
    academic: [
      { aiKey: 'favorite_subject', dbField: 'strongSubjects', transform: (v) => JSON.stringify([v]) },
      { aiKey: 'sevdigi_ders', dbField: 'strongSubjects', transform: (v) => JSON.stringify([v]) },
      { aiKey: 'strong_subject', dbField: 'strongSubjects', transform: (v) => JSON.stringify([v]) },
      { aiKey: 'güçlü_ders', dbField: 'strongSubjects', transform: (v) => JSON.stringify([v]) },
      { aiKey: 'difficult_subject', dbField: 'weakSubjects', transform: (v) => JSON.stringify([v]) },
      { aiKey: 'zorluk_cekilen_ders', dbField: 'weakSubjects', transform: (v) => JSON.stringify([v]) },
      { aiKey: 'weak_subject', dbField: 'weakSubjects', transform: (v) => JSON.stringify([v]) },
      { aiKey: 'zayıf_ders', dbField: 'weakSubjects', transform: (v) => JSON.stringify([v]) },
      { aiKey: 'study_hours_per_week', dbField: 'studyHoursPerWeek' },
      { aiKey: 'haftalik_calisma_saati', dbField: 'studyHoursPerWeek' },
      { aiKey: 'homework_completion', dbField: 'homeworkCompletionRate' },
      { aiKey: 'odev_tamamlama', dbField: 'homeworkCompletionRate' },
      { aiKey: 'overall_motivation', dbField: 'overallMotivation' },
      { aiKey: 'genel_motivasyon', dbField: 'overallMotivation' },
      { aiKey: 'primary_learning_style', dbField: 'primaryLearningStyle' },
      { aiKey: 'birincil_ogrenme_stili', dbField: 'primaryLearningStyle' },
      { aiKey: 'learning_style', dbField: 'primaryLearningStyle' },
      { aiKey: 'ogrenme_stili', dbField: 'primaryLearningStyle' },
      { aiKey: 'strong_skill', dbField: 'strongSkills', transform: (v) => JSON.stringify([v]) },
      { aiKey: 'güçlü_beceri', dbField: 'strongSkills', transform: (v) => JSON.stringify([v]) },
      { aiKey: 'weak_skill', dbField: 'weakSkills', transform: (v) => JSON.stringify([v]) },
      { aiKey: 'zayıf_beceri', dbField: 'weakSkills', transform: (v) => JSON.stringify([v]) }
    ],
    
    social_emotional: [
      { aiKey: 'mood', dbField: 'currentMood' },
      { aiKey: 'ruh_hali', dbField: 'currentMood' },
      { aiKey: 'stress_level', dbField: 'stressLevel' },
      { aiKey: 'stres_seviyesi', dbField: 'stressLevel' },
      { aiKey: 'anxiety_level', dbField: 'anxietyLevel' },
      { aiKey: 'kaygı_seviyesi', dbField: 'anxietyLevel' },
      { aiKey: 'depression_signs', dbField: 'depressionSigns' },
      { aiKey: 'depresyon_belirtileri', dbField: 'depressionSigns' },
      { aiKey: 'self_esteem', dbField: 'selfEsteem' },
      { aiKey: 'ozsaygi', dbField: 'selfEsteem' },
      { aiKey: 'emotional_regulation', dbField: 'emotionalRegulation' },
      { aiKey: 'duygu_duzenlemesi', dbField: 'emotionalRegulation' },
      { aiKey: 'social_skills', dbField: 'socialSkills' },
      { aiKey: 'sosyal_beceriler', dbField: 'socialSkills' },
      { aiKey: 'peer_relationships', dbField: 'peerRelationships' },
      { aiKey: 'akran_iliskileri', dbField: 'peerRelationships' },
      { aiKey: 'friend_count', dbField: 'numberOfFriends' },
      { aiKey: 'arkadas_sayisi', dbField: 'numberOfFriends' }
    ],
    
    behavioral: [
      { aiKey: 'attention_span', dbField: 'attentionSpan' },
      { aiKey: 'dikkat_suresi', dbField: 'attentionSpan' },
      { aiKey: 'impulsivity', dbField: 'impulsivityLevel' },
      { aiKey: 'dusunmeden_hareket', dbField: 'impulsivityLevel' },
      { aiKey: 'aggression', dbField: 'aggressionLevel' },
      { aiKey: 'saldirganlik', dbField: 'aggressionLevel' },
      { aiKey: 'rule_following', dbField: 'ruleCompliance' },
      { aiKey: 'kural_uyumu', dbField: 'ruleCompliance' },
      { aiKey: 'discipline_issues', dbField: 'disciplineIssues' },
      { aiKey: 'disiplin_sorunlari', dbField: 'disciplineIssues' }
    ],
    
    motivation: [
      { aiKey: 'motivation_level', dbField: 'motivationLevel' },
      { aiKey: 'motivasyon_seviyesi', dbField: 'motivationLevel' },
      { aiKey: 'academic_goals', dbField: 'academicGoals' },
      { aiKey: 'akademik_hedefler', dbField: 'academicGoals' },
      { aiKey: 'career_aspirations', dbField: 'careerAspirations' },
      { aiKey: 'kariyer_hedefleri', dbField: 'careerAspirations' },
      { aiKey: 'engagement_level', dbField: 'engagementLevel' },
      { aiKey: 'ilgi_seviyesi', dbField: 'engagementLevel' },
      { aiKey: 'persistence', dbField: 'persistenceLevel' },
      { aiKey: 'sebat', dbField: 'persistenceLevel' }
    ],
    
    risk_factors: [
      { aiKey: 'risk_level', dbField: 'overallRiskLevel' },
      { aiKey: 'risk_seviyesi', dbField: 'overallRiskLevel' },
      { aiKey: 'substance_use', dbField: 'substanceUseRisk' },
      { aiKey: 'madde_kullanimi', dbField: 'substanceUseRisk' },
      { aiKey: 'self_harm', dbField: 'selfHarmRisk' },
      { aiKey: 'kendine_zarar', dbField: 'selfHarmRisk' },
      { aiKey: 'suicidal_ideation', dbField: 'suicidalIdeation' },
      { aiKey: 'intihar_dusuncesi', dbField: 'suicidalIdeation' },
      { aiKey: 'violence_risk', dbField: 'violenceRisk' },
      { aiKey: 'siddet_riski', dbField: 'violenceRisk' },
      { aiKey: 'truancy', dbField: 'truancyRisk' },
      { aiKey: 'devamsizlik_riski', dbField: 'truancyRisk' }
    ],
    
    talents_interests: [
      { aiKey: 'interests', dbField: 'interests', transform: (v) => JSON.stringify([v]) },
      { aiKey: 'ilgi_alanlari', dbField: 'interests', transform: (v) => JSON.stringify([v]) },
      { aiKey: 'hobbies', dbField: 'hobbies', transform: (v) => JSON.stringify([v]) },
      { aiKey: 'hobiler', dbField: 'hobbies', transform: (v) => JSON.stringify([v]) },
      { aiKey: 'talents', dbField: 'talents', transform: (v) => JSON.stringify([v]) },
      { aiKey: 'yetenekler', dbField: 'talents', transform: (v) => JSON.stringify([v]) },
      { aiKey: 'skills', dbField: 'skills', transform: (v) => JSON.stringify([v]) },
      { aiKey: 'beceriler', dbField: 'skills', transform: (v) => JSON.stringify([v]) },
      { aiKey: 'extracurricular', dbField: 'extracurricularActivities', transform: (v) => JSON.stringify([v]) },
      { aiKey: 'okul_disi_aktiviteler', dbField: 'extracurricularActivities', transform: (v) => JSON.stringify([v]) }
    ],
    
    family: [
      { aiKey: 'family_structure', dbField: 'familyStructure' },
      { aiKey: 'aile_yapisi', dbField: 'familyStructure' },
      { aiKey: 'parents_education', dbField: 'parentsEducationLevel' },
      { aiKey: 'ebeveyn_egitim', dbField: 'parentsEducationLevel' },
      { aiKey: 'family_income', dbField: 'familyIncomeLevel' },
      { aiKey: 'aile_geliri', dbField: 'familyIncomeLevel' },
      { aiKey: 'parental_involvement', dbField: 'parentalInvolvement' },
      { aiKey: 'ebeveyn_ilgisi', dbField: 'parentalInvolvement' },
      { aiKey: 'home_environment', dbField: 'homeEnvironment' },
      { aiKey: 'ev_ortami', dbField: 'homeEnvironment' },
      { aiKey: 'siblings', dbField: 'numberOfSiblings' },
      { aiKey: 'kardes_sayisi', dbField: 'numberOfSiblings' }
    ]
  };

  /**
   * AI insights'ları database field'larına map eder
   */
  mapInsightsToFields(
    domain: ProfileDomain,
    insights: Record<string, any>
  ): Record<string, any> {
    const mappings = this.domainMappings[domain] || [];
    const result: Record<string, any> = {};

    // Her insight için mapping bul
    for (const [key, value] of Object.entries(insights)) {
      const mapping = mappings.find(m => 
        m.aiKey.toLowerCase() === key.toLowerCase() ||
        this.isSimilarKey(m.aiKey, key)
      );

      if (mapping) {
        const transformedValue = mapping.transform 
          ? mapping.transform(value)
          : value;
        
        result[mapping.dbField] = transformedValue;
        
        console.log(`📍 Mapped: ${key} -> ${mapping.dbField} = ${transformedValue}`);
      } else {
        // Mapping bulunamadıysa raw olarak sakla
        result[key] = value;
        console.log(`⚠️ No mapping for: ${key}, storing as raw`);
      }
    }

    return result;
  }

  /**
   * İki key'in benzer olup olmadığını kontrol eder
   */
  private isSimilarKey(mappingKey: string, insightKey: string): boolean {
    const normalize = (str: string) => str.toLowerCase()
      .replace(/_/g, '')
      .replace(/\s/g, '');
    
    return normalize(mappingKey) === normalize(insightKey);
  }

  /**
   * Tarih formatını normalize eder
   */
  normalizeDate(value: any): string | null {
    if (!value) return null;
    
    try {
      // "bugün", "dün", "geçen hafta" gibi ifadeleri parse et
      const today = new Date();
      const lowerValue = String(value).toLowerCase();
      
      if (lowerValue.includes('bugün') || lowerValue.includes('today')) {
        return today.toISOString().split('T')[0];
      }
      
      if (lowerValue.includes('dün') || lowerValue.includes('yesterday')) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
      }
      
      if (lowerValue.includes('geçen hafta') || lowerValue.includes('last week')) {
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        return lastWeek.toISOString().split('T')[0];
      }
      
      // ISO tarih formatına çevir
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
      
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Sayısal değerleri normalize eder (0-100 arası)
   */
  normalizeScore(value: any): number | null {
    if (value === null || value === undefined) return null;
    
    const num = Number(value);
    if (isNaN(num)) return null;
    
    // 0-100 arasına sıkıştır
    return Math.max(0, Math.min(100, num));
  }
}
