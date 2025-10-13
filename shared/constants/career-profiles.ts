/**
 * Career Profiles and Competency Constants
 * Meslek Profilleri ve Yetkinlik Sabitleri
 */

import type { Competency, CareerProfile, CompetencyCategory } from '../types/career-guidance.types';

// Yetkinlik Tanımları
export const COMPETENCIES: Record<string, Competency> = {
  // Akademik Yetkinlikler
  MATH_SKILLS: {
    id: 'MATH_SKILLS',
    name: 'Matematik Becerileri',
    category: 'ACADEMIC',
    description: 'Problem çözme, sayısal analiz ve matematiksel düşünme'
  },
  SCIENCE_SKILLS: {
    id: 'SCIENCE_SKILLS',
    name: 'Fen Bilimleri Becerileri',
    category: 'ACADEMIC',
    description: 'Bilimsel düşünme, deney tasarımı ve analiz'
  },
  LANGUAGE_SKILLS: {
    id: 'LANGUAGE_SKILLS',
    name: 'Dil Becerileri',
    category: 'ACADEMIC',
    description: 'Okuma, yazma ve dil kullanımı'
  },
  RESEARCH_SKILLS: {
    id: 'RESEARCH_SKILLS',
    name: 'Araştırma Becerileri',
    category: 'ACADEMIC',
    description: 'Bilgi toplama, analiz ve sentez yapma'
  },
  CRITICAL_THINKING: {
    id: 'CRITICAL_THINKING',
    name: 'Eleştirel Düşünme',
    category: 'ACADEMIC',
    description: 'Analitik ve mantıksal düşünme yeteneği'
  },

  // Sosyal-Duygusal Yetkinlikler
  EMPATHY: {
    id: 'EMPATHY',
    name: 'Empati',
    category: 'SOCIAL_EMOTIONAL',
    description: 'Başkalarının duygularını anlama ve paylaşma'
  },
  TEAMWORK: {
    id: 'TEAMWORK',
    name: 'Takım Çalışması',
    category: 'SOCIAL_EMOTIONAL',
    description: 'Grup içinde etkili çalışabilme'
  },
  EMOTIONAL_REGULATION: {
    id: 'EMOTIONAL_REGULATION',
    name: 'Duygu Düzenleme',
    category: 'SOCIAL_EMOTIONAL',
    description: 'Duygularını kontrol ve yönetme'
  },
  CONFLICT_RESOLUTION: {
    id: 'CONFLICT_RESOLUTION',
    name: 'Çatışma Yönetimi',
    category: 'SOCIAL_EMOTIONAL',
    description: 'Çatışmaları çözme ve arabuluculuk'
  },

  // İletişim Becerileri
  VERBAL_COMMUNICATION: {
    id: 'VERBAL_COMMUNICATION',
    name: 'Sözlü İletişim',
    category: 'COMMUNICATION',
    description: 'Etkili konuşma ve sunum yapma'
  },
  WRITTEN_COMMUNICATION: {
    id: 'WRITTEN_COMMUNICATION',
    name: 'Yazılı İletişim',
    category: 'COMMUNICATION',
    description: 'Etkili yazma ve raporlama'
  },
  ACTIVE_LISTENING: {
    id: 'ACTIVE_LISTENING',
    name: 'Aktif Dinleme',
    category: 'COMMUNICATION',
    description: 'Dikkatli dinleme ve anlama'
  },
  PERSUASION: {
    id: 'PERSUASION',
    name: 'İkna Kabiliyeti',
    category: 'COMMUNICATION',
    description: 'Başkalarını etkileme ve ikna etme'
  },

  // Liderlik Becerileri
  LEADERSHIP: {
    id: 'LEADERSHIP',
    name: 'Liderlik',
    category: 'LEADERSHIP',
    description: 'Grup yönetme ve yönlendirme'
  },
  DECISION_MAKING: {
    id: 'DECISION_MAKING',
    name: 'Karar Verme',
    category: 'LEADERSHIP',
    description: 'Etkili ve zamanında karar alma'
  },
  STRATEGIC_THINKING: {
    id: 'STRATEGIC_THINKING',
    name: 'Stratejik Düşünme',
    category: 'LEADERSHIP',
    description: 'Uzun vadeli planlama ve vizyon geliştirme'
  },

  // Teknik Beceriler
  PROGRAMMING: {
    id: 'PROGRAMMING',
    name: 'Programlama',
    category: 'TECHNICAL',
    description: 'Kod yazma ve yazılım geliştirme'
  },
  DATA_ANALYSIS: {
    id: 'DATA_ANALYSIS',
    name: 'Veri Analizi',
    category: 'TECHNICAL',
    description: 'Veri işleme ve analiz etme'
  },
  TECHNICAL_DRAWING: {
    id: 'TECHNICAL_DRAWING',
    name: 'Teknik Çizim',
    category: 'TECHNICAL',
    description: 'Teknik ve mühendislik çizimleri'
  },
  LABORATORY_SKILLS: {
    id: 'LABORATORY_SKILLS',
    name: 'Laboratuvar Becerileri',
    category: 'TECHNICAL',
    description: 'Laboratuvar ekipmanları kullanımı'
  },

  // Yaratıcı Yetkinlikler
  CREATIVITY: {
    id: 'CREATIVITY',
    name: 'Yaratıcılık',
    category: 'CREATIVE',
    description: 'Yenilikçi ve özgün fikirler üretme'
  },
  ARTISTIC_ABILITY: {
    id: 'ARTISTIC_ABILITY',
    name: 'Sanatsal Yetenek',
    category: 'CREATIVE',
    description: 'Görsel ve sanatsal ifade'
  },
  DESIGN_THINKING: {
    id: 'DESIGN_THINKING',
    name: 'Tasarım Düşüncesi',
    category: 'CREATIVE',
    description: 'Kullanıcı odaklı tasarım yapma'
  },
  INNOVATION: {
    id: 'INNOVATION',
    name: 'Yenilikçilik',
    category: 'CREATIVE',
    description: 'Yeni çözümler ve yaklaşımlar geliştirme'
  },

  // Fiziksel Yetkinlikler
  PHYSICAL_COORDINATION: {
    id: 'PHYSICAL_COORDINATION',
    name: 'Fiziksel Koordinasyon',
    category: 'PHYSICAL',
    description: 'El-göz koordinasyonu ve motor beceriler'
  },
  STAMINA: {
    id: 'STAMINA',
    name: 'Dayanıklılık',
    category: 'PHYSICAL',
    description: 'Fiziksel dayanıklılık ve kondisyon'
  },
  MANUAL_DEXTERITY: {
    id: 'MANUAL_DEXTERITY',
    name: 'El Becerisi',
    category: 'PHYSICAL',
    description: 'Hassas el işleri ve uygulama'
  }
};

// Meslek Profilleri
export const CAREER_PROFILES: CareerProfile[] = [
  // STEM Meslekleri
  {
    id: 'SOFTWARE_ENGINEER',
    name: 'Yazılım Mühendisi',
    category: 'STEM',
    description: 'Yazılım sistemleri tasarlar, geliştirir ve sürdürür',
    requiredEducationLevel: 'Lisans (Bilgisayar Mühendisliği, Yazılım Mühendisliği)',
    averageSalary: '₺45,000 - ₺120,000',
    jobOutlook: 'Çok Yüksek',
    workEnvironment: 'Ofis, Uzaktan Çalışma',
    requiredCompetencies: [
      { competencyId: 'PROGRAMMING', competencyName: 'Programlama', category: 'TECHNICAL', minimumLevel: 8, importance: 'CRITICAL', weight: 0.3 },
      { competencyId: 'MATH_SKILLS', competencyName: 'Matematik Becerileri', category: 'ACADEMIC', minimumLevel: 7, importance: 'HIGH', weight: 0.2 },
      { competencyId: 'CRITICAL_THINKING', competencyName: 'Eleştirel Düşünme', category: 'ACADEMIC', minimumLevel: 7, importance: 'HIGH', weight: 0.15 },
      { competencyId: 'TEAMWORK', competencyName: 'Takım Çalışması', category: 'SOCIAL_EMOTIONAL', minimumLevel: 6, importance: 'MEDIUM', weight: 0.15 },
      { competencyId: 'WRITTEN_COMMUNICATION', competencyName: 'Yazılı İletişim', category: 'COMMUNICATION', minimumLevel: 6, importance: 'MEDIUM', weight: 0.1 },
      { competencyId: 'INNOVATION', competencyName: 'Yenilikçilik', category: 'CREATIVE', minimumLevel: 6, importance: 'MEDIUM', weight: 0.1 }
    ]
  },
  {
    id: 'DATA_SCIENTIST',
    name: 'Veri Bilimci',
    category: 'STEM',
    description: 'Büyük veri setlerini analiz eder ve içgörüler çıkarır',
    requiredEducationLevel: 'Lisans/Yüksek Lisans (Matematik, İstatistik, Bilgisayar Mühendisliği)',
    averageSalary: '₺50,000 - ₺150,000',
    jobOutlook: 'Çok Yüksek',
    workEnvironment: 'Ofis, Uzaktan Çalışma',
    requiredCompetencies: [
      { competencyId: 'DATA_ANALYSIS', competencyName: 'Veri Analizi', category: 'TECHNICAL', minimumLevel: 9, importance: 'CRITICAL', weight: 0.3 },
      { competencyId: 'MATH_SKILLS', competencyName: 'Matematik Becerileri', category: 'ACADEMIC', minimumLevel: 8, importance: 'CRITICAL', weight: 0.25 },
      { competencyId: 'PROGRAMMING', competencyName: 'Programlama', category: 'TECHNICAL', minimumLevel: 7, importance: 'HIGH', weight: 0.2 },
      { competencyId: 'CRITICAL_THINKING', competencyName: 'Eleştirel Düşünme', category: 'ACADEMIC', minimumLevel: 7, importance: 'HIGH', weight: 0.15 },
      { competencyId: 'WRITTEN_COMMUNICATION', competencyName: 'Yazılı İletişim', category: 'COMMUNICATION', minimumLevel: 6, importance: 'MEDIUM', weight: 0.1 }
    ]
  },
  {
    id: 'MECHANICAL_ENGINEER',
    name: 'Makine Mühendisi',
    category: 'STEM',
    description: 'Mekanik sistemler ve makineler tasarlar ve geliştirir',
    requiredEducationLevel: 'Lisans (Makine Mühendisliği)',
    averageSalary: '₺35,000 - ₺85,000',
    jobOutlook: 'Yüksek',
    workEnvironment: 'Ofis, Fabrika, Saha',
    requiredCompetencies: [
      { competencyId: 'MATH_SKILLS', competencyName: 'Matematik Becerileri', category: 'ACADEMIC', minimumLevel: 8, importance: 'CRITICAL', weight: 0.25 },
      { competencyId: 'SCIENCE_SKILLS', competencyName: 'Fen Bilimleri Becerileri', category: 'ACADEMIC', minimumLevel: 8, importance: 'CRITICAL', weight: 0.25 },
      { competencyId: 'TECHNICAL_DRAWING', competencyName: 'Teknik Çizim', category: 'TECHNICAL', minimumLevel: 7, importance: 'HIGH', weight: 0.2 },
      { competencyId: 'CRITICAL_THINKING', competencyName: 'Eleştirel Düşünme', category: 'ACADEMIC', minimumLevel: 7, importance: 'HIGH', weight: 0.15 },
      { competencyId: 'INNOVATION', competencyName: 'Yenilikçilik', category: 'CREATIVE', minimumLevel: 6, importance: 'MEDIUM', weight: 0.15 }
    ]
  },

  // Sağlık Meslekleri
  {
    id: 'PHYSICIAN',
    name: 'Doktor (Hekim)',
    category: 'HEALTH',
    description: 'Hastaları teşhis eder, tedavi eder ve sağlık danışmanlığı verir',
    requiredEducationLevel: 'Tıp Fakültesi + Uzmanlık',
    averageSalary: '₺60,000 - ₺200,000+',
    jobOutlook: 'Yüksek',
    workEnvironment: 'Hastane, Klinik, Özel Muayenehane',
    requiredCompetencies: [
      { competencyId: 'SCIENCE_SKILLS', competencyName: 'Fen Bilimleri Becerileri', category: 'ACADEMIC', minimumLevel: 9, importance: 'CRITICAL', weight: 0.25 },
      { competencyId: 'EMPATHY', competencyName: 'Empati', category: 'SOCIAL_EMOTIONAL', minimumLevel: 9, importance: 'CRITICAL', weight: 0.2 },
      { competencyId: 'CRITICAL_THINKING', competencyName: 'Eleştirel Düşünme', category: 'ACADEMIC', minimumLevel: 8, importance: 'HIGH', weight: 0.15 },
      { competencyId: 'DECISION_MAKING', competencyName: 'Karar Verme', category: 'LEADERSHIP', minimumLevel: 8, importance: 'HIGH', weight: 0.15 },
      { competencyId: 'VERBAL_COMMUNICATION', competencyName: 'Sözlü İletişim', category: 'COMMUNICATION', minimumLevel: 7, importance: 'HIGH', weight: 0.1 },
      { competencyId: 'EMOTIONAL_REGULATION', competencyName: 'Duygu Düzenleme', category: 'SOCIAL_EMOTIONAL', minimumLevel: 7, importance: 'MEDIUM', weight: 0.15 }
    ]
  },
  {
    id: 'NURSE',
    name: 'Hemşire',
    category: 'HEALTH',
    description: 'Hasta bakımı ve sağlık hizmetleri sunar',
    requiredEducationLevel: 'Lisans (Hemşirelik)',
    averageSalary: '₺25,000 - ₺60,000',
    jobOutlook: 'Çok Yüksek',
    workEnvironment: 'Hastane, Klinik, Bakım Evleri',
    requiredCompetencies: [
      { competencyId: 'EMPATHY', competencyName: 'Empati', category: 'SOCIAL_EMOTIONAL', minimumLevel: 9, importance: 'CRITICAL', weight: 0.25 },
      { competencyId: 'SCIENCE_SKILLS', competencyName: 'Fen Bilimleri Becerileri', category: 'ACADEMIC', minimumLevel: 7, importance: 'HIGH', weight: 0.2 },
      { competencyId: 'TEAMWORK', competencyName: 'Takım Çalışması', category: 'SOCIAL_EMOTIONAL', minimumLevel: 8, importance: 'HIGH', weight: 0.2 },
      { competencyId: 'VERBAL_COMMUNICATION', competencyName: 'Sözlü İletişim', category: 'COMMUNICATION', minimumLevel: 7, importance: 'HIGH', weight: 0.15 },
      { competencyId: 'EMOTIONAL_REGULATION', competencyName: 'Duygu Düzenleme', category: 'SOCIAL_EMOTIONAL', minimumLevel: 7, importance: 'MEDIUM', weight: 0.1 },
      { competencyId: 'STAMINA', competencyName: 'Dayanıklılık', category: 'PHYSICAL', minimumLevel: 7, importance: 'MEDIUM', weight: 0.1 }
    ]
  },
  {
    id: 'PSYCHOLOGIST',
    name: 'Psikolog',
    category: 'HEALTH',
    description: 'Zihinsel sağlık danışmanlığı ve terapi sunar',
    requiredEducationLevel: 'Lisans (Psikoloji) + Yüksek Lisans',
    averageSalary: '₺30,000 - ₺80,000',
    jobOutlook: 'Yüksek',
    workEnvironment: 'Klinik, Hastane, Özel Danışmanlık',
    requiredCompetencies: [
      { competencyId: 'EMPATHY', competencyName: 'Empati', category: 'SOCIAL_EMOTIONAL', minimumLevel: 10, importance: 'CRITICAL', weight: 0.3 },
      { competencyId: 'ACTIVE_LISTENING', competencyName: 'Aktif Dinleme', category: 'COMMUNICATION', minimumLevel: 9, importance: 'CRITICAL', weight: 0.25 },
      { competencyId: 'CRITICAL_THINKING', competencyName: 'Eleştirel Düşünme', category: 'ACADEMIC', minimumLevel: 8, importance: 'HIGH', weight: 0.15 },
      { competencyId: 'RESEARCH_SKILLS', competencyName: 'Araştırma Becerileri', category: 'ACADEMIC', minimumLevel: 7, importance: 'HIGH', weight: 0.1 },
      { competencyId: 'VERBAL_COMMUNICATION', competencyName: 'Sözlü İletişim', category: 'COMMUNICATION', minimumLevel: 8, importance: 'HIGH', weight: 0.1 },
      { competencyId: 'EMOTIONAL_REGULATION', competencyName: 'Duygu Düzenleme', category: 'SOCIAL_EMOTIONAL', minimumLevel: 8, importance: 'MEDIUM', weight: 0.1 }
    ]
  },

  // Eğitim Meslekleri
  {
    id: 'TEACHER',
    name: 'Öğretmen',
    category: 'EDUCATION',
    description: 'Öğrencilere eğitim verir ve gelişimlerini destekler',
    requiredEducationLevel: 'Lisans (Eğitim Fakültesi)',
    averageSalary: '₺25,000 - ₺50,000',
    jobOutlook: 'Yüksek',
    workEnvironment: 'Okul, Eğitim Kurumları',
    requiredCompetencies: [
      { competencyId: 'VERBAL_COMMUNICATION', competencyName: 'Sözlü İletişim', category: 'COMMUNICATION', minimumLevel: 9, importance: 'CRITICAL', weight: 0.25 },
      { competencyId: 'EMPATHY', competencyName: 'Empati', category: 'SOCIAL_EMOTIONAL', minimumLevel: 8, importance: 'CRITICAL', weight: 0.2 },
      { competencyId: 'LEADERSHIP', competencyName: 'Liderlik', category: 'LEADERSHIP', minimumLevel: 7, importance: 'HIGH', weight: 0.15 },
      { competencyId: 'CONFLICT_RESOLUTION', competencyName: 'Çatışma Yönetimi', category: 'SOCIAL_EMOTIONAL', minimumLevel: 7, importance: 'HIGH', weight: 0.15 },
      { competencyId: 'CREATIVITY', competencyName: 'Yaratıcılık', category: 'CREATIVE', minimumLevel: 7, importance: 'MEDIUM', weight: 0.15 },
      { competencyId: 'EMOTIONAL_REGULATION', competencyName: 'Duygu Düzenleme', category: 'SOCIAL_EMOTIONAL', minimumLevel: 7, importance: 'MEDIUM', weight: 0.1 }
    ]
  },

  // İş ve Yönetim
  {
    id: 'BUSINESS_MANAGER',
    name: 'İşletme Yöneticisi',
    category: 'BUSINESS',
    description: 'İş operasyonlarını yönetir ve stratejik kararlar alır',
    requiredEducationLevel: 'Lisans (İşletme, Yönetim)',
    averageSalary: '₺40,000 - ₺120,000',
    jobOutlook: 'Yüksek',
    workEnvironment: 'Ofis',
    requiredCompetencies: [
      { competencyId: 'LEADERSHIP', competencyName: 'Liderlik', category: 'LEADERSHIP', minimumLevel: 9, importance: 'CRITICAL', weight: 0.25 },
      { competencyId: 'STRATEGIC_THINKING', competencyName: 'Stratejik Düşünme', category: 'LEADERSHIP', minimumLevel: 8, importance: 'CRITICAL', weight: 0.2 },
      { competencyId: 'DECISION_MAKING', competencyName: 'Karar Verme', category: 'LEADERSHIP', minimumLevel: 8, importance: 'HIGH', weight: 0.15 },
      { competencyId: 'VERBAL_COMMUNICATION', competencyName: 'Sözlü İletişim', category: 'COMMUNICATION', minimumLevel: 8, importance: 'HIGH', weight: 0.15 },
      { competencyId: 'DATA_ANALYSIS', competencyName: 'Veri Analizi', category: 'TECHNICAL', minimumLevel: 6, importance: 'MEDIUM', weight: 0.15 },
      { competencyId: 'PERSUASION', competencyName: 'İkna Kabiliyeti', category: 'COMMUNICATION', minimumLevel: 7, importance: 'MEDIUM', weight: 0.1 }
    ]
  },
  {
    id: 'MARKETING_SPECIALIST',
    name: 'Pazarlama Uzmanı',
    category: 'BUSINESS',
    description: 'Pazarlama stratejileri geliştirir ve kampanyalar yürütür',
    requiredEducationLevel: 'Lisans (İşletme, Pazarlama)',
    averageSalary: '₺30,000 - ₺80,000',
    jobOutlook: 'Yüksek',
    workEnvironment: 'Ofis, Uzaktan Çalışma',
    requiredCompetencies: [
      { competencyId: 'CREATIVITY', competencyName: 'Yaratıcılık', category: 'CREATIVE', minimumLevel: 8, importance: 'CRITICAL', weight: 0.25 },
      { competencyId: 'VERBAL_COMMUNICATION', competencyName: 'Sözlü İletişim', category: 'COMMUNICATION', minimumLevel: 8, importance: 'HIGH', weight: 0.2 },
      { competencyId: 'WRITTEN_COMMUNICATION', competencyName: 'Yazılı İletişim', category: 'COMMUNICATION', minimumLevel: 8, importance: 'HIGH', weight: 0.2 },
      { competencyId: 'DATA_ANALYSIS', competencyName: 'Veri Analizi', category: 'TECHNICAL', minimumLevel: 6, importance: 'MEDIUM', weight: 0.15 },
      { competencyId: 'PERSUASION', competencyName: 'İkna Kabiliyeti', category: 'COMMUNICATION', minimumLevel: 7, importance: 'MEDIUM', weight: 0.1 },
      { competencyId: 'STRATEGIC_THINKING', competencyName: 'Stratejik Düşünme', category: 'LEADERSHIP', minimumLevel: 6, importance: 'MEDIUM', weight: 0.1 }
    ]
  },

  // Sanat ve Tasarım
  {
    id: 'GRAPHIC_DESIGNER',
    name: 'Grafik Tasarımcı',
    category: 'ARTS',
    description: 'Görsel tasarımlar ve grafikler oluşturur',
    requiredEducationLevel: 'Lisans (Grafik Tasarım, Güzel Sanatlar)',
    averageSalary: '₺25,000 - ₺65,000',
    jobOutlook: 'Orta-Yüksek',
    workEnvironment: 'Ofis, Uzaktan Çalışma, Ajans',
    requiredCompetencies: [
      { competencyId: 'ARTISTIC_ABILITY', competencyName: 'Sanatsal Yetenek', category: 'CREATIVE', minimumLevel: 9, importance: 'CRITICAL', weight: 0.3 },
      { competencyId: 'CREATIVITY', competencyName: 'Yaratıcılık', category: 'CREATIVE', minimumLevel: 9, importance: 'CRITICAL', weight: 0.25 },
      { competencyId: 'DESIGN_THINKING', competencyName: 'Tasarım Düşüncesi', category: 'CREATIVE', minimumLevel: 8, importance: 'HIGH', weight: 0.2 },
      { competencyId: 'VERBAL_COMMUNICATION', competencyName: 'Sözlü İletişim', category: 'COMMUNICATION', minimumLevel: 6, importance: 'MEDIUM', weight: 0.15 },
      { competencyId: 'TEAMWORK', competencyName: 'Takım Çalışması', category: 'SOCIAL_EMOTIONAL', minimumLevel: 6, importance: 'MEDIUM', weight: 0.1 }
    ]
  },
  {
    id: 'ARCHITECT',
    name: 'Mimar',
    category: 'ARTS',
    description: 'Bina ve yapılar tasarlar',
    requiredEducationLevel: 'Lisans (Mimarlık)',
    averageSalary: '₺35,000 - ₺90,000',
    jobOutlook: 'Orta-Yüksek',
    workEnvironment: 'Ofis, Saha',
    requiredCompetencies: [
      { competencyId: 'DESIGN_THINKING', competencyName: 'Tasarım Düşüncesi', category: 'CREATIVE', minimumLevel: 9, importance: 'CRITICAL', weight: 0.25 },
      { competencyId: 'CREATIVITY', competencyName: 'Yaratıcılık', category: 'CREATIVE', minimumLevel: 8, importance: 'CRITICAL', weight: 0.2 },
      { competencyId: 'TECHNICAL_DRAWING', competencyName: 'Teknik Çizim', category: 'TECHNICAL', minimumLevel: 8, importance: 'HIGH', weight: 0.2 },
      { competencyId: 'MATH_SKILLS', competencyName: 'Matematik Becerileri', category: 'ACADEMIC', minimumLevel: 7, importance: 'HIGH', weight: 0.15 },
      { competencyId: 'VERBAL_COMMUNICATION', competencyName: 'Sözlü İletişim', category: 'COMMUNICATION', minimumLevel: 7, importance: 'MEDIUM', weight: 0.1 },
      { competencyId: 'INNOVATION', competencyName: 'Yenilikçilik', category: 'CREATIVE', minimumLevel: 7, importance: 'MEDIUM', weight: 0.1 }
    ]
  },

  // Hukuk
  {
    id: 'LAWYER',
    name: 'Avukat',
    category: 'LAW',
    description: 'Hukuki danışmanlık verir ve müvekkilleri temsil eder',
    requiredEducationLevel: 'Hukuk Fakültesi + Staj',
    averageSalary: '₺40,000 - ₺150,000',
    jobOutlook: 'Orta-Yüksek',
    workEnvironment: 'Ofis, Mahkeme',
    requiredCompetencies: [
      { competencyId: 'CRITICAL_THINKING', competencyName: 'Eleştirel Düşünme', category: 'ACADEMIC', minimumLevel: 9, importance: 'CRITICAL', weight: 0.25 },
      { competencyId: 'VERBAL_COMMUNICATION', competencyName: 'Sözlü İletişim', category: 'COMMUNICATION', minimumLevel: 9, importance: 'CRITICAL', weight: 0.2 },
      { competencyId: 'WRITTEN_COMMUNICATION', competencyName: 'Yazılı İletişim', category: 'COMMUNICATION', minimumLevel: 9, importance: 'CRITICAL', weight: 0.2 },
      { competencyId: 'RESEARCH_SKILLS', competencyName: 'Araştırma Becerileri', category: 'ACADEMIC', minimumLevel: 8, importance: 'HIGH', weight: 0.15 },
      { competencyId: 'PERSUASION', competencyName: 'İkna Kabiliyeti', category: 'COMMUNICATION', minimumLevel: 8, importance: 'HIGH', weight: 0.1 },
      { competencyId: 'EMOTIONAL_REGULATION', competencyName: 'Duygu Düzenleme', category: 'SOCIAL_EMOTIONAL', minimumLevel: 7, importance: 'MEDIUM', weight: 0.1 }
    ]
  },

  // Sosyal Hizmetler
  {
    id: 'SOCIAL_WORKER',
    name: 'Sosyal Çalışmacı',
    category: 'SOCIAL_SERVICES',
    description: 'Bireylere ve ailelere sosyal destek sağlar',
    requiredEducationLevel: 'Lisans (Sosyal Hizmetler)',
    averageSalary: '₺25,000 - ₺55,000',
    jobOutlook: 'Yüksek',
    workEnvironment: 'Kamu Kurumları, STK, Saha',
    requiredCompetencies: [
      { competencyId: 'EMPATHY', competencyName: 'Empati', category: 'SOCIAL_EMOTIONAL', minimumLevel: 10, importance: 'CRITICAL', weight: 0.3 },
      { competencyId: 'ACTIVE_LISTENING', competencyName: 'Aktif Dinleme', category: 'COMMUNICATION', minimumLevel: 9, importance: 'CRITICAL', weight: 0.25 },
      { competencyId: 'CONFLICT_RESOLUTION', competencyName: 'Çatışma Yönetimi', category: 'SOCIAL_EMOTIONAL', minimumLevel: 8, importance: 'HIGH', weight: 0.15 },
      { competencyId: 'VERBAL_COMMUNICATION', competencyName: 'Sözlü İletişim', category: 'COMMUNICATION', minimumLevel: 8, importance: 'HIGH', weight: 0.15 },
      { competencyId: 'EMOTIONAL_REGULATION', competencyName: 'Duygu Düzenleme', category: 'SOCIAL_EMOTIONAL', minimumLevel: 8, importance: 'MEDIUM', weight: 0.15 }
    ]
  },

  // Spor
  {
    id: 'SPORTS_COACH',
    name: 'Spor Antrenörü',
    category: 'SPORTS',
    description: 'Sporcuların gelişimini sağlar ve takımları yönetir',
    requiredEducationLevel: 'Lisans (Beden Eğitimi, Spor Bilimleri)',
    averageSalary: '₺25,000 - ₺80,000',
    jobOutlook: 'Orta',
    workEnvironment: 'Spor Tesisleri, Saha',
    requiredCompetencies: [
      { competencyId: 'LEADERSHIP', competencyName: 'Liderlik', category: 'LEADERSHIP', minimumLevel: 8, importance: 'CRITICAL', weight: 0.25 },
      { competencyId: 'VERBAL_COMMUNICATION', competencyName: 'Sözlü İletişim', category: 'COMMUNICATION', minimumLevel: 8, importance: 'HIGH', weight: 0.2 },
      { competencyId: 'STAMINA', competencyName: 'Dayanıklılık', category: 'PHYSICAL', minimumLevel: 8, importance: 'HIGH', weight: 0.2 },
      { competencyId: 'TEAMWORK', competencyName: 'Takım Çalışması', category: 'SOCIAL_EMOTIONAL', minimumLevel: 7, importance: 'MEDIUM', weight: 0.15 },
      { competencyId: 'STRATEGIC_THINKING', competencyName: 'Stratejik Düşünme', category: 'LEADERSHIP', minimumLevel: 7, importance: 'MEDIUM', weight: 0.1 },
      { competencyId: 'EMPATHY', competencyName: 'Empati', category: 'SOCIAL_EMOTIONAL', minimumLevel: 7, importance: 'MEDIUM', weight: 0.1 }
    ]
  },

  // Medya ve İletişim
  {
    id: 'JOURNALIST',
    name: 'Gazeteci',
    category: 'MEDIA',
    description: 'Haber toplama, yazma ve yayımlama',
    requiredEducationLevel: 'Lisans (Gazetecilik, İletişim)',
    averageSalary: '₺25,000 - ₺70,000',
    jobOutlook: 'Orta',
    workEnvironment: 'Medya Kuruluşları, Saha',
    requiredCompetencies: [
      { competencyId: 'WRITTEN_COMMUNICATION', competencyName: 'Yazılı İletişim', category: 'COMMUNICATION', minimumLevel: 9, importance: 'CRITICAL', weight: 0.3 },
      { competencyId: 'VERBAL_COMMUNICATION', competencyName: 'Sözlü İletişim', category: 'COMMUNICATION', minimumLevel: 8, importance: 'HIGH', weight: 0.2 },
      { competencyId: 'RESEARCH_SKILLS', competencyName: 'Araştırma Becerileri', category: 'ACADEMIC', minimumLevel: 8, importance: 'HIGH', weight: 0.2 },
      { competencyId: 'CRITICAL_THINKING', competencyName: 'Eleştirel Düşünme', category: 'ACADEMIC', minimumLevel: 7, importance: 'MEDIUM', weight: 0.15 },
      { competencyId: 'ACTIVE_LISTENING', competencyName: 'Aktif Dinleme', category: 'COMMUNICATION', minimumLevel: 7, importance: 'MEDIUM', weight: 0.15 }
    ]
  }
];

// Yetkinlik Kategorisi Etiketleri
export const COMPETENCY_CATEGORY_LABELS: Record<CompetencyCategory, string> = {
  ACADEMIC: 'Akademik Yetkinlikler',
  SOCIAL_EMOTIONAL: 'Sosyal-Duygusal Yetkinlikler',
  TECHNICAL: 'Teknik Beceriler',
  CREATIVE: 'Yaratıcı Yetkinlikler',
  PHYSICAL: 'Fiziksel Yetkinlikler',
  LEADERSHIP: 'Liderlik Becerileri',
  COMMUNICATION: 'İletişim Becerileri'
};

// Meslek Kategorisi Etiketleri
export const CAREER_CATEGORY_LABELS = {
  STEM: 'Fen, Teknoloji, Mühendislik, Matematik',
  HEALTH: 'Sağlık',
  EDUCATION: 'Eğitim',
  BUSINESS: 'İş ve Yönetim',
  ARTS: 'Sanat ve Tasarım',
  SOCIAL_SERVICES: 'Sosyal Hizmetler',
  LAW: 'Hukuk',
  SPORTS: 'Spor',
  MEDIA: 'Medya ve İletişim',
  TRADES: 'El Sanatları ve Teknik İşler'
};

// Uyumluluk Seviyesi Renkleri
export const COMPATIBILITY_COLORS = {
  EXCELLENT: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
  GOOD: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  MODERATE: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
  LOW: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' }
};

// Önem Seviyesi Renkleri
export const IMPORTANCE_COLORS = {
  CRITICAL: { bg: 'bg-red-100', text: 'text-red-800' },
  HIGH: { bg: 'bg-orange-100', text: 'text-orange-800' },
  MEDIUM: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  LOW: { bg: 'bg-gray-100', text: 'text-gray-800' }
};
