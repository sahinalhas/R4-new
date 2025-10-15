/**
 * AI Components Shared Utilities
 * AI bileşenleri için ortak yardımcı fonksiyonlar
 */

/**
 * Öncelik seviyesine göre renk döndürür
 */
export function getPriorityColor(priority: string): string {
  const normalizedPriority = priority?.toUpperCase();
  
  switch (normalizedPriority) {
    case 'CRITICAL':
    case 'ACİL':
    case 'KRİTİK':
      return 'destructive';
    case 'HIGH':
    case 'YÜKSEK':
      return 'destructive';
    case 'MEDIUM':
    case 'ORTA':
      return 'default';
    case 'LOW':
    case 'DÜŞÜK':
      return 'secondary';
    default:
      return 'outline';
  }
}

/**
 * Öncelik seviyesine göre badge background class döndürür
 */
export function getPriorityBadgeClass(priority: string): string {
  const normalizedPriority = priority?.toUpperCase();
  
  switch (normalizedPriority) {
    case 'CRITICAL':
    case 'ACİL':
    case 'KRİTİK':
      return 'bg-red-500 text-white';
    case 'HIGH':
    case 'YÜKSEK':
      return 'bg-orange-500 text-white';
    case 'MEDIUM':
    case 'ORTA':
      return 'bg-yellow-500 text-black';
    case 'LOW':
    case 'DÜŞÜK':
      return 'bg-green-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}

/**
 * Durum seviyesine göre renk döndürür
 */
export function getStatusColor(status: string): string {
  const normalizedStatus = status?.toUpperCase();
  
  switch (normalizedStatus) {
    case 'ACİL':
    case 'URGENT':
    case 'CRITICAL':
      return 'destructive';
    case 'DİKKAT':
    case 'ATTENTION':
    case 'WARNING':
      return 'default';
    case 'İYİ':
    case 'GOOD':
    case 'OK':
      return 'secondary';
    default:
      return 'outline';
  }
}

/**
 * Risk skoruna göre renk döndürür
 */
export function getScoreColor(score: number): string {
  if (score >= 100) return 'text-red-600 dark:text-red-400';
  if (score >= 70) return 'text-orange-600 dark:text-orange-400';
  if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-green-600 dark:text-green-400';
}

/**
 * Öncelik seviyesini Türkçe'ye çevirir
 */
export function getPriorityLabel(priority: string): string {
  const normalizedPriority = priority?.toLowerCase();
  
  switch (normalizedPriority) {
    case 'critical':
    case 'acil':
      return 'Kritik';
    case 'high':
    case 'yüksek':
      return 'Yüksek';
    case 'medium':
    case 'orta':
      return 'Orta';
    case 'low':
    case 'düşük':
      return 'Düşük';
    default:
      return priority;
  }
}

/**
 * Aciliyet seviyesini Türkçe'ye çevirir
 */
export function getUrgencyLabel(urgency: string): string {
  const normalizedUrgency = urgency?.toLowerCase();
  
  switch (normalizedUrgency) {
    case 'immediate':
      return 'Acil';
    case 'soon':
      return 'Öncelikli';
    case 'moderate':
      return 'Orta';
    case 'low':
      return 'Düşük';
    default:
      return urgency;
  }
}

/**
 * Suggestion type'a göre icon component name döndürür
 */
export function getSuggestionTypeIcon(type: string): string {
  switch (type?.toUpperCase()) {
    case 'PROFILE_UPDATE':
      return 'User';
    case 'RISK_ALERT':
      return 'AlertCircle';
    case 'INTERVENTION_PLAN':
      return 'TrendingUp';
    default:
      return 'Info';
  }
}
