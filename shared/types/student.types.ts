/**
 * Unified Student Data Model
 * Birleşik Öğrenci Veri Modeli - Tüm sistemde tutarlı kullanım için
 */

export interface UnifiedStudent {
  // Temel Bilgiler - Required
  id: string;
  ad: string;
  soyad: string;
  
  // Eğitim Bilgileri
  sinif?: string;
  okulNo?: string;
  cinsiyet?: 'K' | 'E';
  dogumTarihi?: string;
  
  // İletişim Bilgileri
  telefon?: string;
  eposta?: string;
  adres?: string;
  il?: string;
  ilce?: string;
  
  // Veli Bilgileri
  veliAdi?: string;
  veliTelefon?: string;
  acilKisi?: string;
  acilTelefon?: string;
  
  // Sistem Bilgileri
  kayitTarihi: string; // enrollmentDate
  durum?: 'aktif' | 'pasif' | 'mezun'; // status
  avatar?: string;
  notlar?: string;
  
  // Değerlendirme Bilgileri
  risk?: 'Düşük' | 'Orta' | 'Yüksek';
  rehberOgretmen?: string;
  etiketler?: string[];
  
  // Genel Bilgiler
  ilgiAlanlari?: string[];
  saglikNotu?: string;
  kanGrubu?: string;
}

/**
 * Backend Student Model (Database)
 */
export interface BackendStudent {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  il?: string;
  ilce?: string;
  className?: string;
  enrollmentDate: string;
  status?: 'active' | 'inactive' | 'graduated';
  avatar?: string;
  parentContact?: string;
  notes?: string;
  gender?: 'K' | 'E';
}

/**
 * Data Transformation Utilities
 * Veri Dönüştürme Araçları
 */

export function backendToUnified(backend: BackendStudent): UnifiedStudent {
  const nameParts = backend.name.split(' ');
  const ad = nameParts[0] || '';
  const soyad = nameParts.slice(1).join(' ') || '';
  
  return {
    id: backend.id,
    ad,
    soyad,
    sinif: backend.className,
    cinsiyet: backend.gender,
    telefon: backend.phone,
    eposta: backend.email,
    adres: backend.address,
    il: backend.il,
    ilce: backend.ilce,
    dogumTarihi: backend.birthDate,
    veliTelefon: backend.parentContact,
    kayitTarihi: backend.enrollmentDate || new Date().toISOString().split('T')[0],
    durum: backend.status === 'active' ? 'aktif' : backend.status === 'inactive' ? 'pasif' : backend.status === 'graduated' ? 'mezun' : 'aktif',
    avatar: backend.avatar,
    notlar: backend.notes
  };
}

export function unifiedToBackend(unified: UnifiedStudent): BackendStudent {
  return {
    id: unified.id,
    name: `${unified.ad} ${unified.soyad}`.trim(),
    email: unified.eposta,
    phone: unified.telefon,
    address: unified.adres,
    il: unified.il,
    ilce: unified.ilce,
    className: unified.sinif,
    enrollmentDate: unified.kayitTarihi || new Date().toISOString().split('T')[0],
    status: unified.durum === 'aktif' ? 'active' : unified.durum === 'pasif' ? 'inactive' : unified.durum === 'mezun' ? 'graduated' : 'active',
    parentContact: unified.veliTelefon,
    birthDate: unified.dogumTarihi,
    avatar: unified.avatar,
    notes: unified.notlar,
    gender: unified.cinsiyet
  };
}

/**
 * Student Profile Completeness Metrics
 * Öğrenci Profil Tamlık Metrikleri
 */
export interface ProfileCompleteness {
  overall: number; // 0-100
  temelBilgiler: number;
  iletisimBilgileri: number;
  veliBilgileri: number;
  akademikProfil: number;
  sosyalDuygusalProfil: number;
  yetenekIlgiProfil: number;
  saglikProfil: number;
  davranisalProfil: number;
  
  eksikAlanlar: {
    kategori: string;
    alanlar: string[];
  }[];
}

/**
 * Unified Student Scores
 * Birleşik Öğrenci Skorları
 */
export interface UnifiedStudentScores {
  studentId: string;
  lastUpdated: string;
  
  // Ana Skorlar (0-100)
  akademikSkor: number;
  sosyalDuygusalSkor: number;
  davranissalSkor: number;
  motivasyonSkor: number;
  riskSkoru: number;
  
  // Detaylı Skorlar
  akademikDetay: {
    notOrtalamasi?: number;
    devamDurumu?: number;
    odeklikSeviyesi?: number;
  };
  
  sosyalDuygusalDetay: {
    empati?: number;
    ozFarkinalik?: number;
    duyguDuzenlemesi?: number;
    iliski?: number;
  };
  
  davranissalDetay: {
    olumluDavranis?: number;
    olumsuzDavranis?: number;
    mudahaleEtkinligi?: number;
  };
}

/**
 * Validation Rules
 * Validasyon Kuralları
 */
export const STUDENT_VALIDATION_RULES = {
  required: ['id', 'ad', 'soyad'],
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[0-9]{10,11}$/,
  minAge: 5,
  maxAge: 25
} as const;

/**
 * Profile Quality Thresholds
 * Profil Kalitesi Eşikleri
 */
export const PROFILE_QUALITY_THRESHOLDS = {
  excellent: 90,
  good: 70,
  fair: 50,
  poor: 30
} as const;
