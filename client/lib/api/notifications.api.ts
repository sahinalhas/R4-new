import apiClient from './api-client';
import type { NotificationPreferences, NotificationLog, NotificationTemplate } from '@/../../shared/types/notification.types';

export const notificationsApi = {
  // Notification Preferences
  getPreferences: (userId: number) => 
    apiClient.get<NotificationPreferences>(`/notifications/preferences/${userId}`),
  
  updatePreferences: (userId: number, data: Partial<NotificationPreferences>) => 
    apiClient.put<NotificationPreferences>(`/notifications/preferences/${userId}`, data),

  // Notification Logs
  getNotificationLogs: (params?: { 
    userId?: number; 
    studentId?: number; 
    status?: 'PENDING' | 'SENT' | 'FAILED' | 'DELIVERED';
    dateFrom?: string;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.userId) query.set('userId', params.userId.toString());
    if (params?.studentId) query.set('studentId', params.studentId.toString());
    if (params?.status) query.set('status', params.status);
    if (params?.dateFrom) query.set('dateFrom', params.dateFrom);
    if (params?.limit) query.set('limit', params.limit.toString());
    
    return apiClient.get<NotificationLog[]>(`/notifications/logs?${query.toString()}`);
  },

  // Manual notification sending
  sendNotification: (data: {
    userId: number;
    studentId?: number;
    type: 'RISK_ALERT' | 'INTERVENTION_REMINDER' | 'PROGRESS_UPDATE' | 'MEETING_SCHEDULED';
    channel: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';
    subject?: string;
    body: string;
    priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  }) => apiClient.post<NotificationLog>('/notifications/send', data),

  // Templates
  getTemplates: () => 
    apiClient.get<NotificationTemplate[]>('/notifications/templates'),

  createTemplate: (data: Omit<NotificationTemplate, 'id' | 'created_at' | 'updated_at'>) =>
    apiClient.post<NotificationTemplate>('/notifications/templates', data),

  updateTemplate: (id: number, data: Partial<NotificationTemplate>) =>
    apiClient.put<NotificationTemplate>(`/notifications/templates/${id}`, data),

  deleteTemplate: (id: number) =>
    apiClient.delete(`/notifications/templates/${id}`),

  // Stats
  getNotificationStats: (dateFrom?: string) => 
    apiClient.get<{
      total: number;
      sent: number;
      failed: number;
      delivered: number;
      byChannel: Record<string, number>;
      byType: Record<string, number>;
    }>(`/notifications/stats${dateFrom ? `?dateFrom=${dateFrom}` : ''}`),

  // Retry failed notifications
  retryFailed: () => 
    apiClient.post<{ retried: number }>('/notifications/retry-failed', {}),

  // Parent dashboard access
  generateParentAccess: (studentId: number, expiresInDays?: number) =>
    apiClient.post<{ token: string; link: string; expires_at: string }>(
      '/notifications/parent-access',
      { studentId, expiresInDays }
    ),

  getParentAccessTokens: (studentId: number) =>
    apiClient.get<Array<{
      id: number;
      student_id: number;
      token: string;
      expires_at: string;
      created_at: string;
    }>>(`/notifications/parent-access/${studentId}`),

  revokeParentAccess: (tokenId: number) =>
    apiClient.delete(`/notifications/parent-access/${tokenId}`),
};
