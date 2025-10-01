// Turkish UI labels extracted for better maintainability and internationalization
export const UI_LABELS = {
  // Navigation and pages
  STUDENT_MANAGEMENT: 'Öğrenci Yönetimi',
  COURSES_AND_TOPICS: 'Dersler & Konular',
  SETTINGS: 'Ayarlar',
  MEETINGS: 'Görüşmeler',
  SURVEYS: 'Anketler',
  REPORTS: 'Raporlama',
  ACTIVITIES: 'Etkinlikler',
  RISK_INTERVENTION: 'Risk ve Müdahale Takip',
  PERFORMANCE_STATISTICS: 'Performans & İstatistik',
  HOME_PAGE: 'Ana Sayfa',

  // Common actions
  SAVE: 'Kaydet',
  DELETE: 'Sil',
  CANCEL: 'Vazgeç',
  ADD: 'Ekle',
  EDIT: 'Düzenle',
  REMOVE: 'Kaldır',
  UPDATE: 'Güncelle',
  CLOSE: 'Kapat',
  CONFIRM: 'Onayla',

  // Student information
  FIRST_NAME: 'Ad',
  LAST_NAME: 'Soyad',
  FULL_NAME: 'Ad Soyad',
  CLASS: 'Sınıf',
  GENDER: 'Cinsiyet',
  SCORE: 'Puan',
  RISK: 'Risk',
  STATUS: 'Durum',
  PHONE: 'Telefon',
  EMAIL: 'E-posta',
  ADDRESS: 'Adres',
  BIRTH_DATE: 'Doğum Tarihi',

  // Course and academic
  ADD_COURSE: 'Ders Ekle',
  ADD_TOPIC: 'Konu Ekle',
  COURSE_NAME: 'Ders Adı',
  TOPIC_NAME: 'Konu Adı',
  COMPLETED: 'Tamamlandı',
  IN_PROGRESS: 'Devam Ediyor',
  NOT_STARTED: 'Başlanmadı',

  // Status values
  ACTIVE: 'Aktif',
  INACTIVE: 'Pasif',
  GRADUATED: 'Mezun',

  // Academic goals and coaching
  ACADEMIC_GOALS: 'Akademik Hedefler',
  COACHING: 'Koçluk',
  RECOMMENDATIONS: 'Öneriler',
  ACHIEVEMENTS: 'Başarılar',
  EVALUATION: 'Değerlendirme',

  // Time and scheduling
  TODAY: 'Bugün',
  YESTERDAY: 'Dün',
  THIS_WEEK: 'Bu Hafta',
  THIS_MONTH: 'Bu Ay',
  DATE: 'Tarih',
  TIME: 'Saat',

  // Common labels
  DESCRIPTION: 'Açıklama',
  NOTES: 'Notlar',
  DETAILS: 'Detaylar',
  INFORMATION: 'Bilgi',
  SEARCH: 'Ara',
  FILTER: 'Filtrele',
  EXPORT: 'Dışa Aktar',
  IMPORT: 'İçe Aktar',
} as const;

export type UILabel = keyof typeof UI_LABELS;