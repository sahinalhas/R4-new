import apiClient from './api-client';

export interface InterventionEffectiveness {
  id: number;
  intervention_id: number;
  student_id: number;
  pre_intervention_metrics: any;
  post_intervention_metrics: any;
  impact_analysis: any;
  success_rating: number;
  lessons_learned: string | null;
  created_at: string;
  updated_at: string;
}

export interface ParentFeedback {
  id: number;
  student_id: number;
  intervention_id: number | null;
  rating: number;
  feedback_text: string | null;
  submitted_at: string;
}

export interface EscalationLog {
  id: number;
  student_id: number;
  alert_id: number;
  escalated_from: string;
  escalated_to: string;
  reason: string;
  response_time_minutes: number | null;
  status: 'PENDING' | 'ACKNOWLEDGED' | 'RESOLVED';
  created_at: string;
  resolved_at: string | null;
}

export const interventionTrackingApi = {
  // Intervention Effectiveness
  getEffectiveness: (interventionId: number) =>
    apiClient.get<InterventionEffectiveness>(`/intervention-tracking/effectiveness/${interventionId}`),

  trackEffectiveness: (data: {
    interventionId: number;
    studentId: number;
    preMetrics: any;
    postMetrics: any;
    lessonsLearned?: string;
  }) => apiClient.post<InterventionEffectiveness>('/intervention-tracking/effectiveness', data),

  getSimilarSuccesses: (params: {
    studentId: number;
    issueType: string;
    riskLevel: string;
  }) => apiClient.post<Array<{
    intervention: any;
    effectiveness: InterventionEffectiveness;
    similarity_score: number;
  }>>('/intervention-tracking/similar-successes', params),

  getInterventionInsights: (interventionId: number) =>
    apiClient.get<{
      effectiveness: InterventionEffectiveness;
      ai_analysis: any;
      recommendations: string[];
    }>(`/intervention-tracking/insights/${interventionId}`),

  // Parent Feedback
  submitParentFeedback: (data: {
    studentId: number;
    interventionId?: number;
    rating: number;
    feedbackText?: string;
  }) => apiClient.post<ParentFeedback>('/intervention-tracking/parent-feedback', data),

  getParentFeedback: (studentId: number) =>
    apiClient.get<ParentFeedback[]>(`/intervention-tracking/parent-feedback/${studentId}`),

  // Escalation
  createEscalation: (data: {
    studentId: number;
    alertId: number;
    escalatedFrom: string;
    escalatedTo: string;
    reason: string;
  }) => apiClient.post<EscalationLog>('/intervention-tracking/escalation', data),

  acknowledgeEscalation: (id: number) =>
    apiClient.put<EscalationLog>(`/intervention-tracking/escalation/${id}/acknowledge`, {}),

  resolveEscalation: (id: number, resolution: string) =>
    apiClient.put<EscalationLog>(`/intervention-tracking/escalation/${id}/resolve`, { resolution }),

  getEscalationLogs: (params: {
    studentId?: number;
    status?: 'PENDING' | 'ACKNOWLEDGED' | 'RESOLVED';
  }) => {
    const query = new URLSearchParams();
    if (params.studentId) query.set('studentId', params.studentId.toString());
    if (params.status) query.set('status', params.status);
    
    return apiClient.get<EscalationLog[]>(`/intervention-tracking/escalation?${query.toString()}`);
  },

  getEscalationMetrics: () =>
    apiClient.get<{
      total_escalations: number;
      pending: number;
      acknowledged: number;
      resolved: number;
      avg_response_time: number;
      critical_count: number;
    }>('/intervention-tracking/escalation/metrics'),
};
