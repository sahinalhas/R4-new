/**
 * AI Suggestions API Client
 * AI öneri sistemi için frontend API client
 */

import type {
  AISuggestion,
  CreateSuggestionRequest,
  ReviewSuggestionRequest,
  SuggestionFilters,
  SuggestionStats
} from '../../../shared/types/ai-suggestion.types';

const API_BASE = '/api/ai-suggestions';

/**
 * Bekleyen tüm önerileri getir
 */
export async function getPendingSuggestions(limit?: number): Promise<AISuggestion[]> {
  const url = limit ? `${API_BASE}/pending?limit=${limit}` : `${API_BASE}/pending`;
  const response = await fetch(url);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Öneriler alınamadı');
  }
  
  return data.data;
}

/**
 * Öğrenci için bekleyen önerileri getir
 */
export async function getStudentSuggestions(studentId: string): Promise<AISuggestion[]> {
  const response = await fetch(`${API_BASE}/student/${studentId}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Öğrenci önerileri alınamadı');
  }
  
  return data.data;
}

/**
 * Öneriyi ID ile getir
 */
export async function getSuggestionById(id: string): Promise<AISuggestion> {
  const response = await fetch(`${API_BASE}/${id}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Öneri bulunamadı');
  }
  
  return data.data;
}

/**
 * Filtrelerle öneri ara
 */
export async function searchSuggestions(filters: SuggestionFilters): Promise<AISuggestion[]> {
  const response = await fetch(`${API_BASE}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters)
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Öneri araması yapılamadı');
  }
  
  return data.data;
}

/**
 * Öneriyi onayla
 */
export async function approveSuggestion(
  id: string,
  reviewedBy: string,
  reviewNotes?: string,
  feedbackRating?: number,
  feedbackNotes?: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reviewedBy,
      reviewNotes,
      feedbackRating,
      feedbackNotes
    })
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Öneri onaylanamadı');
  }
}

/**
 * Öneriyi reddet
 */
export async function rejectSuggestion(
  id: string,
  reviewedBy: string,
  reviewNotes?: string,
  feedbackRating?: number,
  feedbackNotes?: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reviewedBy,
      reviewNotes,
      feedbackRating,
      feedbackNotes
    })
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Öneri reddedilemedi');
  }
}

/**
 * Öneriyi düzenle ve uygula
 */
export async function modifySuggestion(
  id: string,
  reviewedBy: string,
  modifiedChanges: any[],
  reviewNotes?: string,
  feedbackRating?: number,
  feedbackNotes?: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}/modify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reviewedBy,
      modifiedChanges,
      reviewNotes,
      feedbackRating,
      feedbackNotes
    })
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Öneri düzenlenemedi');
  }
}

/**
 * Öneriyi incele (genel review fonksiyonu)
 */
export async function reviewSuggestion(request: ReviewSuggestionRequest): Promise<void> {
  const response = await fetch(`${API_BASE}/${request.suggestionId}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Öneri incelenemedi');
  }
}

/**
 * İstatistikleri getir
 */
export async function getSuggestionStats(): Promise<SuggestionStats> {
  const response = await fetch(`${API_BASE}/stats/overview`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'İstatistikler alınamadı');
  }
  
  return data.data;
}

/**
 * Süresi dolmuş önerileri temizle
 */
export async function cleanupExpiredSuggestions(): Promise<number> {
  const response = await fetch(`${API_BASE}/cleanup`, {
    method: 'POST'
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Temizlik yapılamadı');
  }
  
  return data.data.cleanedCount;
}

/**
 * Yeni öneri oluştur (admin/sistem kullanımı için)
 */
export async function createSuggestion(request: CreateSuggestionRequest): Promise<string> {
  const response = await fetch(`${API_BASE}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Öneri oluşturulamadı');
  }
  
  return data.data.id;
}

/**
 * Toplu öneri oluştur
 */
export async function createBulkSuggestions(requests: CreateSuggestionRequest[]): Promise<string[]> {
  const response = await fetch(`${API_BASE}/bulk-create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ suggestions: requests })
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Toplu öneri oluşturulamadı');
  }
  
  return data.data.ids;
}
