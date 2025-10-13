import { apiClient } from './api-client';

export interface LearningStyleProfile {
  studentId: string;
  studentName: string;
  primaryLearningStyle: string;
  secondaryLearningStyle: string;
  learningPreferences: {
    visual: number;
    auditory: number;
    kinesthetic: number;
    reading: number;
  };
  strengths: string[];
  challenges: string[];
  recommendations: string[];
}

export interface AcademicStrengthAnalysis {
  studentId: string;
  strongSubjects: Array<{
    subject: string;
    score: number;
    skills: string[];
  }>;
  weakSubjects: Array<{
    subject: string;
    score: number;
    gaps: string[];
  }>;
  overallPattern: string;
  improvementAreas: string[];
}

export interface PersonalizedStudyPlan {
  studentId: string;
  studentName: string;
  generatedAt: string;
  learningStyle: string;
  motivationType: string;
  weeklyGoals: Array<{
    subject: string;
    goal: string;
    estimatedHours: number;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    strategies: string[];
  }>;
  dailySchedule: Array<{
    day: string;
    sessions: Array<{
      time: string;
      subject: string;
      activity: string;
      duration: number;
      method: string;
    }>;
  }>;
  motivationStrategies: Array<{
    strategy: string;
    frequency: string;
    expectedOutcome: string;
  }>;
  resources: Array<{
    subject: string;
    resourceType: string;
    description: string;
    link?: string;
  }>;
  progressTracking: {
    checkpoints: string[];
    successMetrics: string[];
  };
}

export const personalizedLearningAPI = {
  async getLearningStyleProfile(studentId: string): Promise<LearningStyleProfile> {
    const response = await apiClient.get<{ data: LearningStyleProfile }>(
      `/api/personalized-learning/learning-style/${studentId}`
    );
    return response.data;
  },

  async getAcademicStrengths(studentId: string): Promise<AcademicStrengthAnalysis> {
    const response = await apiClient.get<{ data: AcademicStrengthAnalysis }>(
      `/api/personalized-learning/academic-strengths/${studentId}`
    );
    return response.data;
  },

  async getStudyPlan(studentId: string): Promise<PersonalizedStudyPlan> {
    const response = await apiClient.get<{ data: PersonalizedStudyPlan }>(
      `/api/personalized-learning/study-plan/${studentId}`
    );
    return response.data;
  }
};
