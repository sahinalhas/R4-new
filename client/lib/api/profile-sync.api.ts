/**
 * Profile Sync API Client
 * Canlı profil senkronizasyon API çağrıları
 */

export interface UnifiedStudentIdentity {
  studentId: string;
  lastUpdated: string;
  
  // Core Identity
  summary: string;
  keyCharacteristics: string[];
  currentState: string;
  
  // Domain Scores (0-100)
  academicScore: number;
  socialEmotionalScore: number;
  behavioralScore: number;
  motivationScore: number;
  riskLevel: number;
  
  // Quick Facts
  strengths: string[];
  challenges: string[];
  recentChanges: string[];
  
  // AI Insights
  personalityProfile: string;
  learningStyle: string;
  interventionPriority: 'low' | 'medium' | 'high' | 'critical';
  recommendedActions: string[];
}

export interface ProfileSyncLog {
  id: string;
  studentId: string;
  source: string;
  sourceId: string;
  domain: string;
  action: string;
  validationScore: number;
  aiReasoning: string;
  extractedInsights: Record<string, any>;
  timestamp: string;
  processedBy: string;
}

export interface SyncStatistics {
  totalUpdates: number;
  avgValidationScore: number;
  uniqueSources: number;
  affectedDomains: number;
}

// Get student identity
export async function getStudentIdentity(studentId: string): Promise<UnifiedStudentIdentity | null> {
  try {
    const response = await fetch(`/api/profile-sync/identity/${studentId}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch student identity');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching student identity:', error);
    return null;
  }
}

// Refresh student identity
export async function refreshStudentIdentity(studentId: string): Promise<void> {
  try {
    const response = await fetch(`/api/profile-sync/identity/${studentId}/refresh`, {
      method: 'POST'
    });
    if (!response.ok) {
      throw new Error('Failed to refresh identity');
    }
  } catch (error) {
    console.error('Error refreshing identity:', error);
    throw error;
  }
}

// Get sync logs for student
export async function getStudentSyncLogs(studentId: string, limit = 50): Promise<ProfileSyncLog[]> {
  try {
    const response = await fetch(`/api/profile-sync/logs/student/${studentId}?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch sync logs');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching sync logs:', error);
    return [];
  }
}

// Get sync statistics
export async function getSyncStatistics(studentId?: string): Promise<SyncStatistics | null> {
  try {
    const url = studentId 
      ? `/api/profile-sync/statistics?studentId=${studentId}`
      : '/api/profile-sync/statistics';
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch statistics');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return null;
  }
}

// Get all identities (for overview page)
export async function getAllIdentities(): Promise<UnifiedStudentIdentity[]> {
  try {
    const response = await fetch('/api/profile-sync/identities');
    if (!response.ok) {
      throw new Error('Failed to fetch identities');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching identities:', error);
    return [];
  }
}
