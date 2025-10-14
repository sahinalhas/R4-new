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

// Conflict Resolution Types
export interface ConflictResolution {
  id: string;
  studentId: string;
  conflictType: string;
  domain?: string;
  oldValue: any;
  newValue: any;
  resolvedValue?: any;
  resolutionMethod: string;
  severity: string;
  reasoning?: string;
  timestamp: string;
  resolvedBy?: string;
}

export interface ManualCorrectionRequest {
  studentId: string;
  domain: string;
  field: string;
  oldValue: any;
  newValue: any;
  reason: string;
  correctedBy: string;
}

// Manual Correction APIs
export async function correctAIExtraction(correction: ManualCorrectionRequest): Promise<void> {
  const response = await fetch('/api/profile-sync/correction', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(correction),
  });
  if (!response.ok) throw new Error('Failed to save correction');
}

export async function getCorrectionHistory(studentId: string): Promise<any[]> {
  const response = await fetch(`/api/profile-sync/corrections/${studentId}`);
  if (!response.ok) throw new Error('Failed to fetch correction history');
  const data = await response.json();
  return data.corrections || [];
}

export async function undoLastUpdate(studentId: string, logId: string, performedBy: string): Promise<void> {
  const response = await fetch('/api/profile-sync/undo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, logId, performedBy }),
  });
  if (!response.ok) throw new Error('Failed to undo update');
}

// Conflict Resolution APIs
export async function getPendingConflicts(studentId?: string): Promise<ConflictResolution[]> {
  try {
    const url = studentId 
      ? `/api/profile-sync/conflicts/pending?studentId=${studentId}`
      : '/api/profile-sync/conflicts/pending';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch pending conflicts');
    const data = await response.json();
    return data.conflicts || [];
  } catch (error) {
    console.error('Error fetching pending conflicts:', error);
    return [];
  }
}

export async function resolveConflictManually(
  conflictId: string, 
  selectedValue: any, 
  resolvedBy: string,
  reason?: string
): Promise<void> {
  const response = await fetch('/api/profile-sync/conflicts/resolve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conflictId, selectedValue, resolvedBy, reason }),
  });
  if (!response.ok) throw new Error('Failed to resolve conflict');
}

export async function bulkResolveConflicts(
  resolutions: Array<{ conflictId: string; selectedValue: any }>,
  resolvedBy: string
): Promise<void> {
  const response = await fetch('/api/profile-sync/conflicts/bulk-resolve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resolutions, resolvedBy }),
  });
  if (!response.ok) throw new Error('Failed to bulk resolve conflicts');
}

// Class Analytics APIs
export async function getClassProfileSummary(classId: string): Promise<any> {
  try {
    const response = await fetch(`/api/profile-sync/class/${encodeURIComponent(classId)}/summary`);
    if (!response.ok) throw new Error('Failed to fetch class summary');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching class summary:', error);
    return null;
  }
}

export async function getClassTrends(classId: string, period?: string): Promise<any> {
  try {
    const url = period
      ? `/api/profile-sync/class/${encodeURIComponent(classId)}/trends?period=${period}`
      : `/api/profile-sync/class/${encodeURIComponent(classId)}/trends`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch class trends');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching class trends:', error);
    return null;
  }
}

export async function compareClasses(classIds: string[]): Promise<any> {
  try {
    const params = new URLSearchParams({ classes: classIds.join(',') });
    const response = await fetch(`/api/profile-sync/class/compare?${params}`);
    if (!response.ok) throw new Error('Failed to compare classes');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error comparing classes:', error);
    return null;
  }
}
