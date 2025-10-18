/**
 * Sınav Format Konfigürasyonları
 * LGS, TYT, AYT ve YDT sınavları için standart ders yapıları ve soru sayıları
 */

export interface ExamSection {
  id: string;
  name: string;
  questionCount: number;
  timeMinutes?: number;
  subsections?: ExamSection[];
}

export interface ExamFormat {
  id: string;
  name: string;
  code: string;
  description: string;
  totalQuestions: number;
  totalTimeMinutes: number;
  sections: ExamSection[];
}

/**
 * LGS (Liselere Geçiş Sınavı) Format
 * Toplam: 90 soru, 135 dakika
 */
export const LGS_FORMAT: ExamFormat = {
  id: 'LGS',
  name: 'Liselere Geçiş Sınavı',
  code: 'LGS',
  description: '8. Sınıf Liselere Geçiş Sınavı',
  totalQuestions: 90,
  totalTimeMinutes: 135,
  sections: [
    {
      id: 'turkce',
      name: 'Türkçe',
      questionCount: 20,
    },
    {
      id: 'tarih',
      name: 'T.C. İnkılap Tarihi ve Atatürkçülük',
      questionCount: 10,
    },
    {
      id: 'din',
      name: 'Din Kültürü ve Ahlak Bilgisi',
      questionCount: 10,
    },
    {
      id: 'ingilizce',
      name: 'İngilizce',
      questionCount: 10,
    },
    {
      id: 'matematik',
      name: 'Matematik',
      questionCount: 20,
    },
    {
      id: 'fen',
      name: 'Fen Bilimleri',
      questionCount: 20,
    },
  ],
};

/**
 * TYT (Temel Yeterlilik Testi) Format
 * Toplam: 120 soru, 165 dakika
 */
export const TYT_FORMAT: ExamFormat = {
  id: 'TYT',
  name: 'Temel Yeterlilik Testi',
  code: 'TYT',
  description: 'YKS Temel Yeterlilik Testi',
  totalQuestions: 120,
  totalTimeMinutes: 165,
  sections: [
    {
      id: 'turkce',
      name: 'Türkçe',
      questionCount: 40,
    },
    {
      id: 'matematik',
      name: 'Temel Matematik',
      questionCount: 40,
    },
    {
      id: 'sosyal',
      name: 'Sosyal Bilimler',
      questionCount: 20,
      subsections: [
        { id: 'tarih', name: 'Tarih', questionCount: 5 },
        { id: 'cografya', name: 'Coğrafya', questionCount: 5 },
        { id: 'felsefe', name: 'Felsefe', questionCount: 5 },
        { id: 'din', name: 'Din Kültürü ve Ahlak Bilgisi', questionCount: 5 },
      ],
    },
    {
      id: 'fen',
      name: 'Fen Bilimleri',
      questionCount: 20,
      subsections: [
        { id: 'fizik', name: 'Fizik', questionCount: 7 },
        { id: 'kimya', name: 'Kimya', questionCount: 7 },
        { id: 'biyoloji', name: 'Biyoloji', questionCount: 6 },
      ],
    },
  ],
};

/**
 * AYT Sayısal (Alan Yeterlilik Testi - Sayısal) Format
 * Toplam: 80 soru, 180 dakika
 */
export const AYT_SAYISAL_FORMAT: ExamFormat = {
  id: 'AYT-SAY',
  name: 'AYT Sayısal',
  code: 'AYT-SAY',
  description: 'Alan Yeterlilik Testi - Sayısal Alan',
  totalQuestions: 80,
  totalTimeMinutes: 180,
  sections: [
    {
      id: 'matematik',
      name: 'Matematik',
      questionCount: 40,
    },
    {
      id: 'fizik',
      name: 'Fizik',
      questionCount: 14,
    },
    {
      id: 'kimya',
      name: 'Kimya',
      questionCount: 13,
    },
    {
      id: 'biyoloji',
      name: 'Biyoloji',
      questionCount: 13,
    },
  ],
};

/**
 * AYT Sözel (Alan Yeterlilik Testi - Sözel) Format
 * Toplam: 80 soru, 180 dakika
 */
export const AYT_SOZEL_FORMAT: ExamFormat = {
  id: 'AYT-SOZ',
  name: 'AYT Sözel',
  code: 'AYT-SOZ',
  description: 'Alan Yeterlilik Testi - Sözel Alan',
  totalQuestions: 80,
  totalTimeMinutes: 180,
  sections: [
    {
      id: 'edebiyat',
      name: 'Türk Dili ve Edebiyatı',
      questionCount: 24,
    },
    {
      id: 'tarih1',
      name: 'Tarih-1',
      questionCount: 10,
    },
    {
      id: 'cografya1',
      name: 'Coğrafya-1',
      questionCount: 6,
    },
    {
      id: 'tarih2',
      name: 'Tarih-2',
      questionCount: 11,
    },
    {
      id: 'cografya2',
      name: 'Coğrafya-2',
      questionCount: 11,
    },
    {
      id: 'felsefe',
      name: 'Felsefe Grubu',
      questionCount: 12,
    },
    {
      id: 'din',
      name: 'Din Kültürü ve Ahlak Bilgisi',
      questionCount: 6,
    },
  ],
};

/**
 * AYT Eşit Ağırlık (Alan Yeterlilik Testi - Eşit Ağırlık) Format
 * Toplam: 80 soru, 180 dakika
 */
export const AYT_ESIT_AGIRLIK_FORMAT: ExamFormat = {
  id: 'AYT-EA',
  name: 'AYT Eşit Ağırlık',
  code: 'AYT-EA',
  description: 'Alan Yeterlilik Testi - Eşit Ağırlık',
  totalQuestions: 80,
  totalTimeMinutes: 180,
  sections: [
    {
      id: 'matematik',
      name: 'Matematik',
      questionCount: 40,
    },
    {
      id: 'edebiyat',
      name: 'Türk Dili ve Edebiyatı',
      questionCount: 24,
    },
    {
      id: 'tarih1',
      name: 'Tarih-1',
      questionCount: 10,
    },
    {
      id: 'cografya1',
      name: 'Coğrafya-1',
      questionCount: 6,
    },
  ],
};

/**
 * YDT (Yabancı Dil Testi) Format
 * Toplam: 80 soru, 120 dakika
 */
export const YDT_FORMAT: ExamFormat = {
  id: 'YDT',
  name: 'Yabancı Dil Testi',
  code: 'YDT',
  description: 'YKS Yabancı Dil Testi',
  totalQuestions: 80,
  totalTimeMinutes: 120,
  sections: [
    {
      id: 'yabanci_dil',
      name: 'Yabancı Dil',
      questionCount: 80,
    },
  ],
};

/**
 * Tüm sınav formatları
 */
export const EXAM_FORMATS: Record<string, ExamFormat> = {
  LGS: LGS_FORMAT,
  TYT: TYT_FORMAT,
  'AYT-SAY': AYT_SAYISAL_FORMAT,
  'AYT-SOZ': AYT_SOZEL_FORMAT,
  'AYT-EA': AYT_ESIT_AGIRLIK_FORMAT,
  YDT: YDT_FORMAT,
};

/**
 * Sınav tipine göre format döndürür
 */
export function getExamFormat(examType: string): ExamFormat | undefined {
  return EXAM_FORMATS[examType];
}

/**
 * Tüm sınav tiplerinin listesi
 */
export const EXAM_TYPES = [
  { value: 'LGS', label: 'LGS - Liselere Geçiş Sınavı' },
  { value: 'TYT', label: 'TYT - Temel Yeterlilik Testi' },
  { value: 'AYT-SAY', label: 'AYT Sayısal' },
  { value: 'AYT-SOZ', label: 'AYT Sözel' },
  { value: 'AYT-EA', label: 'AYT Eşit Ağırlık' },
  { value: 'YDT', label: 'YDT - Yabancı Dil Testi' },
];

/**
 * YDT dil seçenekleri
 */
export const YDT_LANGUAGES = [
  { value: 'ingilizce', label: 'İngilizce' },
  { value: 'almanca', label: 'Almanca' },
  { value: 'fransizca', label: 'Fransızca' },
  { value: 'arapca', label: 'Arapça' },
  { value: 'rusca', label: 'Rusça' },
];

/**
 * Net hesaplama fonksiyonu
 * @param correct Doğru sayısı
 * @param wrong Yanlış sayısı
 * @returns Net (doğru - yanlış/4)
 */
export function calculateNet(correct: number, wrong: number): number {
  return Math.max(0, correct - wrong / 4);
}

/**
 * Section sonuçlarından toplam net hesaplar
 */
export function calculateTotalNet(sections: Array<{ correct: number; wrong: number }>): number {
  return sections.reduce((total, section) => {
    return total + calculateNet(section.correct, section.wrong);
  }, 0);
}
