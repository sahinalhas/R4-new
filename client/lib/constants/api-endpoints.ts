/**
 * API Endpoints Constants
 * Centralized API endpoint definitions
 */

const API_BASE = '/api';

/**
 * Authentication Endpoints
 */
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE}/users/login`,
  REGISTER: `${API_BASE}/users`,
  LOGOUT: `${API_BASE}/session/logout`,
  SESSION: `${API_BASE}/session`,
  DEMO_USER: `${API_BASE}/session/demo-user`,
} as const;

/**
 * User Endpoints
 */
export const USER_ENDPOINTS = {
  BASE: `${API_BASE}/users`,
  BY_ID: (id: string) => `${API_BASE}/users/${id}`,
  LOGIN: AUTH_ENDPOINTS.LOGIN,
  PASSWORD: (id: string) => `${API_BASE}/users/${id}/password`,
  COUNT: `${API_BASE}/users/count`,
} as const;

/**
 * Student Endpoints
 */
export const STUDENT_ENDPOINTS = {
  BASE: `${API_BASE}/students`,
  BY_ID: (id: string) => `${API_BASE}/students/${id}`,
  BULK: `${API_BASE}/students/bulk`,
  ACADEMICS: (id: string) => `${API_BASE}/students/${id}/academics`,
} as const;

/**
 * Survey Endpoints
 */
export const SURVEY_ENDPOINTS = {
  TEMPLATES: `${API_BASE}/survey-templates`,
  TEMPLATE_BY_ID: (id: string) => `${API_BASE}/survey-templates/${id}`,
  QUESTIONS: (templateId: string) => `${API_BASE}/survey-questions/${templateId}`,
  DISTRIBUTIONS: `${API_BASE}/survey-distributions`,
  DISTRIBUTION_BY_LINK: (publicLink: string) => `${API_BASE}/survey-distributions/link/${publicLink}`,
  RESPONSES: `${API_BASE}/survey-responses`,
  ANALYTICS: (distributionId: string) => `${API_BASE}/survey-analytics/${distributionId}`,
} as const;

/**
 * Counseling Endpoints
 */
export const COUNSELING_ENDPOINTS = {
  BASE: `${API_BASE}/counseling-sessions`,
  SESSIONS: `${API_BASE}/counseling-sessions/sessions`,
  BY_ID: (id: string) => `${API_BASE}/counseling-sessions/${id}`,
  COMPLETE: (id: string) => `${API_BASE}/counseling-sessions/${id}/complete`,
  EXTEND: (id: string) => `${API_BASE}/counseling-sessions/${id}/extend`,
  TOPICS: `${API_BASE}/counseling-sessions/topics`,
  REMINDERS: `${API_BASE}/counseling-sessions/reminders`,
  REMINDER_BY_ID: (id: string) => `${API_BASE}/counseling-sessions/reminders/${id}`,
  FOLLOW_UPS: `${API_BASE}/counseling-sessions/follow-ups`,
  OUTCOMES: `${API_BASE}/counseling-sessions/outcomes`,
} as const;

/**
 * AI Endpoints
 */
export const AI_ENDPOINTS = {
  CHAT: `${API_BASE}/ai-assistant/chat-stream`,
  MODELS: `${API_BASE}/ai-assistant/models`,
  SET_PROVIDER: `${API_BASE}/ai-assistant/set-provider`,
  ANALYZE_RISK: `${API_BASE}/ai-assistant/analyze-risk`,
  DAILY_INSIGHTS: `${API_BASE}/daily-insights/today`,
  GENERATE_INSIGHTS: `${API_BASE}/daily-insights/generate`,
} as const;

/**
 * Backup Endpoints
 */
export const BACKUP_ENDPOINTS = {
  CREATE: `${API_BASE}/backup/create`,
  LIST: `${API_BASE}/backup/list`,
  RESTORE: (id: string) => `${API_BASE}/backup/restore/${id}`,
  DELETE: (id: string) => `${API_BASE}/backup/${id}`,
  AUDIT_LOGS: `${API_BASE}/backup/audit-logs`,
  ENCRYPT: `${API_BASE}/backup/encrypt`,
  DECRYPT: `${API_BASE}/backup/decrypt`,
} as const;

/**
 * Voice Transcription Endpoints
 */
export const VOICE_ENDPOINTS = {
  TRANSCRIBE: `${API_BASE}/voice-transcription/transcribe`,
  ANALYZE: `${API_BASE}/voice-transcription/analyze`,
} as const;

/**
 * Analytics Endpoints
 */
export const ANALYTICS_ENDPOINTS = {
  OVERVIEW: `${API_BASE}/analytics/overview`,
  BULK_AI: `${API_BASE}/analytics/bulk-ai/school-wide`,
  EARLY_WARNING: `${API_BASE}/analytics/bulk-ai/early-warning`,
  CACHE_INVALIDATE: `${API_BASE}/analytics/cache/invalidate`,
} as const;

/**
 * Advanced AI Analysis Endpoints
 */
export const ADVANCED_AI_ENDPOINTS = {
  PSYCHOLOGICAL: (studentId: string) => `${API_BASE}/advanced-ai-analysis/psychological/${studentId}`,
  PREDICTIVE_TIMELINE: (studentId: string) => `${API_BASE}/advanced-ai-analysis/predictive-timeline/${studentId}`,
  DAILY_ACTION_PLAN: `${API_BASE}/advanced-ai-analysis/daily-action-plan`,
  STUDENT_TIMELINE: (studentId: string) => `${API_BASE}/advanced-ai-analysis/student-timeline/${studentId}`,
  COMPARATIVE: `${API_BASE}/advanced-ai-analysis/comparative`,
} as const;

/**
 * Profile Sync Endpoints
 */
export const PROFILE_SYNC_ENDPOINTS = {
  IDENTITY: (studentId: string) => `${API_BASE}/profile-sync/identity/${studentId}`,
  REFRESH: (studentId: string) => `${API_BASE}/profile-sync/refresh/${studentId}`,
  LOGS: (studentId: string) => `${API_BASE}/profile-sync/logs/student/${studentId}`,
  CONFLICTS: `${API_BASE}/profile-sync/conflicts`,
  RESOLVE_CONFLICT: `${API_BASE}/profile-sync/resolve-conflict`,
} as const;

/**
 * Student Profile Endpoints
 */
export const STUDENT_PROFILE_ENDPOINTS = {
  SCORES: (studentId: string) => `${API_BASE}/student-profile/${studentId}/scores`,
  AI_ANALYSIS: (studentId: string) => `${API_BASE}/student-profile/${studentId}/ai-analysis`,
  ACADEMIC: (studentId: string) => `${API_BASE}/student-profile/${studentId}/academic`,
  SOCIAL_EMOTIONAL: (studentId: string) => `${API_BASE}/student-profile/${studentId}/social-emotional`,
  AGGREGATE: (studentId: string) => `${API_BASE}/student-profile/${studentId}/aggregate`,
} as const;

/**
 * Reports Endpoints
 */
export const REPORT_ENDPOINTS = {
  SCHOOL_STATS: `${API_BASE}/advanced-reports/school-stats`,
  CLASS_COMPARISONS: `${API_BASE}/advanced-reports/class-comparisons`,
  COMPARE_CLASSES: (class1: string, class2: string) => 
    `${API_BASE}/advanced-reports/compare/${encodeURIComponent(class1)}/${encodeURIComponent(class2)}`,
  TRENDS: `${API_BASE}/advanced-reports/trends`,
  COMPREHENSIVE: `${API_BASE}/advanced-reports/comprehensive`,
  EXPORT_EXCEL: `${API_BASE}/advanced-reports/export-excel`,
} as const;

/**
 * Helper function to build query params
 */
export function buildQueryParams(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Helper function to build full URL with query params
 */
export function buildUrl(
  endpoint: string, 
  params?: Record<string, string | number | boolean | undefined>
): string {
  if (!params) return endpoint;
  return `${endpoint}${buildQueryParams(params)}`;
}
