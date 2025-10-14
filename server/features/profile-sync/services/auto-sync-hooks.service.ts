/**
 * Auto Sync Hooks Service
 * Veri geldiğinde otomatik profil senkronizasyonu tetikler
 */

import { ProfileAggregationService } from './profile-aggregation.service.js';
import type { ProfileUpdateRequest, DataSource } from '../types/index.js';

export class AutoSyncHooksService {
  private aggregationService: ProfileAggregationService;
  private static instance: AutoSyncHooksService;

  private constructor() {
    this.aggregationService = new ProfileAggregationService();
  }

  static getInstance(): AutoSyncHooksService {
    if (!AutoSyncHooksService.instance) {
      AutoSyncHooksService.instance = new AutoSyncHooksService();
    }
    return AutoSyncHooksService.instance;
  }

  /**
   * Görüşme tamamlandığında profili güncelle
   */
  async onCounselingSessionCompleted(sessionData: {
    id: string;
    studentId?: string;
    studentIds?: string[];
    detailedNotes?: string;
    sessionTags?: string[];
    emotionalState?: string;
    cooperationLevel?: number;
    [key: string]: any;
  }): Promise<void> {
    console.log('🎯 Counseling session completed, updating profile...');

    const studentIds = sessionData.studentId 
      ? [sessionData.studentId] 
      : sessionData.studentIds || [];

    for (const studentId of studentIds) {
      const request: ProfileUpdateRequest = {
        studentId,
        source: 'counseling_session',
        sourceId: sessionData.id,
        rawData: {
          notes: sessionData.detailedNotes,
          tags: sessionData.sessionTags,
          emotionalState: sessionData.emotionalState,
          cooperationLevel: sessionData.cooperationLevel,
          sessionData: sessionData
        },
        timestamp: new Date().toISOString()
      };

      try {
        const result = await this.aggregationService.processDataUpdate(request);
        console.log(`✅ Profile updated for student ${studentId}:`, result.message);
      } catch (error) {
        console.error(`❌ Failed to update profile for student ${studentId}:`, error);
      }
    }
  }

  /**
   * Anket cevaplandığında profili güncelle
   */
  async onSurveyResponseSubmitted(responseData: {
    id: string;
    studentId?: string;
    studentInfo?: any;
    responseData: any;
    distributionId: string;
    [key: string]: any;
  }): Promise<void> {
    console.log('📋 Survey response submitted, updating profile...');

    const studentId = responseData.studentId || responseData.studentInfo?.id;
    
    if (!studentId) {
      console.warn('⚠️ Survey response has no student ID, skipping profile update');
      return;
    }

    const request: ProfileUpdateRequest = {
      studentId,
      source: 'survey_response',
      sourceId: responseData.id,
      rawData: {
        responses: responseData.responseData,
        distributionId: responseData.distributionId,
        surveyData: responseData
      },
      timestamp: new Date().toISOString()
    };

    try {
      const result = await this.aggregationService.processDataUpdate(request);
      console.log(`✅ Profile updated for student ${studentId}:`, result.message);
    } catch (error) {
      console.error(`❌ Failed to update profile for student ${studentId}:`, error);
    }
  }

  /**
   * Sınav sonucu eklendiğinde profili güncelle
   */
  async onExamResultAdded(examData: {
    id: string;
    studentId: string;
    examName: string;
    score: number;
    subject?: string;
    date: string;
    [key: string]: any;
  }): Promise<void> {
    console.log('📝 Exam result added, updating profile...');

    const request: ProfileUpdateRequest = {
      studentId: examData.studentId,
      source: 'exam_result',
      sourceId: examData.id,
      rawData: {
        examName: examData.examName,
        score: examData.score,
        subject: examData.subject,
        date: examData.date,
        examData: examData
      },
      timestamp: new Date().toISOString()
    };

    try {
      const result = await this.aggregationService.processDataUpdate(request);
      console.log(`✅ Profile updated for student ${examData.studentId}:`, result.message);
    } catch (error) {
      console.error(`❌ Failed to update profile for student ${examData.studentId}:`, error);
    }
  }

  /**
   * Davranış kaydı eklendiğinde profili güncelle
   */
  async onBehaviorIncidentRecorded(incidentData: {
    id: string;
    studentId: string;
    behaviorType: string;
    description: string;
    severity: string;
    date: string;
    [key: string]: any;
  }): Promise<void> {
    console.log('⚠️ Behavior incident recorded, updating profile...');

    const request: ProfileUpdateRequest = {
      studentId: incidentData.studentId,
      source: 'behavior_incident',
      sourceId: incidentData.id,
      rawData: {
        behaviorType: incidentData.behaviorType,
        description: incidentData.description,
        severity: incidentData.severity,
        date: incidentData.date,
        incidentData: incidentData
      },
      timestamp: new Date().toISOString()
    };

    try {
      const result = await this.aggregationService.processDataUpdate(request);
      console.log(`✅ Profile updated for student ${incidentData.studentId}:`, result.message);
    } catch (error) {
      console.error(`❌ Failed to update profile for student ${incidentData.studentId}:`, error);
    }
  }

  /**
   * Görüşme notu eklendiğinde profili güncelle
   */
  async onMeetingNoteAdded(noteData: {
    id: string;
    studentId: string;
    type: string;
    note: string;
    plan?: string;
    date: string;
    [key: string]: any;
  }): Promise<void> {
    console.log('📝 Meeting note added, updating profile...');

    const request: ProfileUpdateRequest = {
      studentId: noteData.studentId,
      source: 'meeting_note',
      sourceId: noteData.id,
      rawData: {
        type: noteData.type,
        note: noteData.note,
        plan: noteData.plan,
        date: noteData.date,
        noteData: noteData
      },
      timestamp: new Date().toISOString()
    };

    try {
      const result = await this.aggregationService.processDataUpdate(request);
      console.log(`✅ Profile updated for student ${noteData.studentId}:`, result.message);
    } catch (error) {
      console.error(`❌ Failed to update profile for student ${noteData.studentId}:`, error);
    }
  }

  /**
   * Veli görüşmesi yapıldığında profili güncelle
   */
  async onParentMeetingRecorded(meetingData: {
    id: string;
    studentId: string;
    attendees: string;
    topics: string;
    outcomes?: string;
    followUpActions?: string;
    meetingDate: string;
    [key: string]: any;
  }): Promise<void> {
    console.log('👨‍👩‍👧 Parent meeting recorded, updating profile...');

    const request: ProfileUpdateRequest = {
      studentId: meetingData.studentId,
      source: 'parent_meeting',
      sourceId: meetingData.id,
      rawData: {
        attendees: meetingData.attendees,
        topics: meetingData.topics,
        outcomes: meetingData.outcomes,
        followUpActions: meetingData.followUpActions,
        meetingDate: meetingData.meetingDate,
        meetingData: meetingData
      },
      timestamp: new Date().toISOString()
    };

    try {
      const result = await this.aggregationService.processDataUpdate(request);
      console.log(`✅ Profile updated for student ${meetingData.studentId}:`, result.message);
    } catch (error) {
      console.error(`❌ Failed to update profile for student ${meetingData.studentId}:`, error);
    }
  }

  /**
   * Öz değerlendirme yapıldığında profili güncelle
   */
  async onSelfAssessmentCompleted(assessmentData: {
    id: string;
    studentId: string;
    mood: string;
    energy: number;
    notes?: string;
    date: string;
    [key: string]: any;
  }): Promise<void> {
    console.log('🎯 Self assessment completed, updating profile...');

    const request: ProfileUpdateRequest = {
      studentId: assessmentData.studentId,
      source: 'self_assessment',
      sourceId: assessmentData.id,
      rawData: {
        mood: assessmentData.mood,
        energy: assessmentData.energy,
        notes: assessmentData.notes,
        date: assessmentData.date,
        assessmentData: assessmentData
      },
      timestamp: new Date().toISOString()
    };

    try {
      const result = await this.aggregationService.processDataUpdate(request);
      console.log(`✅ Profile updated for student ${assessmentData.studentId}:`, result.message);
    } catch (error) {
      console.error(`❌ Failed to update profile for student ${assessmentData.studentId}:`, error);
    }
  }

  /**
   * Devamsızlık kaydı eklendiğinde profili güncelle
   */
  async onAttendanceRecorded(attendanceData: {
    id: string;
    studentId: string;
    date: string;
    status: string;
    notes?: string;
    [key: string]: any;
  }): Promise<void> {
    // Sadece önemli devamsızlıkları işle (Yok, Geç)
    if (attendanceData.status !== 'Var') {
      console.log('📅 Attendance recorded, updating profile...');

      const request: ProfileUpdateRequest = {
        studentId: attendanceData.studentId,
        source: 'attendance',
        sourceId: attendanceData.id,
        rawData: {
          date: attendanceData.date,
          status: attendanceData.status,
          notes: attendanceData.notes,
          attendanceData: attendanceData
        },
        timestamp: new Date().toISOString()
      };

      try {
        const result = await this.aggregationService.processDataUpdate(request);
        console.log(`✅ Profile updated for student ${attendanceData.studentId}:`, result.message);
      } catch (error) {
        console.error(`❌ Failed to update profile for student ${attendanceData.studentId}:`, error);
      }
    }
  }
}

// Singleton instance export
export const autoSyncHooks = AutoSyncHooksService.getInstance();
