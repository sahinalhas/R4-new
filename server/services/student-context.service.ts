/**
 * Student Context Service
 * Öğrenci Bağlam Servisi
 * 
 * Tüm öğrenci verilerini toplar ve AI için anlamlı bağlam oluşturur
 */

import getDatabase from '../lib/database.js';
import type { UnifiedStudentScores, ProfileCompleteness } from '../../shared/types/student.types.js';

export interface StudentContext {
  // Temel Bilgiler
  student: {
    id: string;
    name: string;
    grade: string;
    age?: number;
    gender?: string;
  };

  // Akademik Bilgiler
  academic: {
    gpa?: number;
    recentExams?: Array<{ subject: string; score: number; date: string }>;
    strengths?: string[];
    weaknesses?: string[];
    performanceTrend?: 'improving' | 'declining' | 'stable';
  };

  // Sosyal-Duygusal Bilgiler
  socialEmotional: {
    competencies?: Record<string, number>;
    strengths?: string[];
    challenges?: string[];
    relationships?: string;
  };

  // Davranışsal Bilgiler
  behavioral: {
    recentIncidents?: Array<{
      date: string;
      type: string;
      severity: string;
      description: string;
    }>;
    positiveCount?: number;
    negativeCount?: number;
    trends?: string;
  };

  // Devam Durumu
  attendance: {
    rate?: number;
    recentAbsences?: number;
    excusedVsUnexcused?: { excused: number; unexcused: number };
  };

  // Risk Değerlendirmesi
  risk: {
    level: 'DÜŞÜK' | 'ORTA' | 'YÜKSEK' | 'ÇOK_YÜKSEK';
    factors?: string[];
    protectiveFactors?: string[];
    alerts?: Array<{
      type: string;
      level: string;
      description: string;
      date: string;
    }>;
  };

  // Görüşmeler ve Müdahaleler
  interventions: {
    recentSessions?: Array<{
      date: string;
      type: string;
      topic: string;
      summary?: string;
    }>;
    activeInterventions?: Array<{
      title: string;
      status: string;
      startDate: string;
    }>;
  };

  // Yetenek ve İlgiler
  talentsInterests?: {
    talents?: string[];
    interests?: string[];
    hobbies?: string[];
    careerGoals?: string[];
  };

  // Sağlık Bilgileri (Genel)
  health?: {
    conditions?: string[];
    medications?: string[];
    notes?: string;
  };

  // Skorlar
  scores?: UnifiedStudentScores;
  completeness?: ProfileCompleteness;
}

export class StudentContextService {
  private db: ReturnType<typeof getDatabase>;

  constructor() {
    this.db = getDatabase();
  }

  /**
   * Get complete student context for AI
   */
  async getStudentContext(studentId: string): Promise<StudentContext> {
    const context: StudentContext = {
      student: await this.getBasicInfo(studentId),
      academic: await this.getAcademicContext(studentId),
      socialEmotional: await this.getSocialEmotionalContext(studentId),
      behavioral: await this.getBehavioralContext(studentId),
      attendance: await this.getAttendanceContext(studentId),
      risk: await this.getRiskContext(studentId),
      interventions: await this.getInterventionContext(studentId),
      talentsInterests: await this.getTalentsInterestsContext(studentId),
      health: await this.getHealthContext(studentId)
    };

    return context;
  }

  /**
   * Get basic student information
   */
  private async getBasicInfo(studentId: string): Promise<StudentContext['student']> {
    const student = this.db.prepare('SELECT * FROM students WHERE id = ?').get(studentId) as any;
    
    if (!student) {
      throw new Error(`Student not found: ${studentId}`);
    }

    const age = student.birthDate ? 
      new Date().getFullYear() - new Date(student.birthDate).getFullYear() : 
      undefined;

    return {
      id: student.id,
      name: student.name,
      grade: student.className || 'Bilinmiyor',
      age,
      gender: student.gender
    };
  }

  /**
   * Get academic context
   */
  private async getAcademicContext(studentId: string): Promise<StudentContext['academic']> {
    const academic = this.db.prepare(
      'SELECT * FROM academic_profile WHERE studentId = ? ORDER BY assessmentDate DESC LIMIT 1'
    ).get(studentId) as any;

    const exams = this.db.prepare(
      'SELECT * FROM exam_results WHERE studentId = ? ORDER BY examDate DESC LIMIT 5'
    ).all(studentId) as any[];

    return {
      gpa: academic?.averageGrade,
      recentExams: exams.map(exam => ({
        subject: exam.subject || exam.examName,
        score: exam.score || exam.grade,
        date: exam.examDate
      })),
      strengths: academic?.strongSubjects ? JSON.parse(academic.strongSubjects) : [],
      weaknesses: academic?.weakSubjects ? JSON.parse(academic.weakSubjects) : [],
      performanceTrend: this.calculatePerformanceTrend(exams)
    };
  }

  /**
   * Get social-emotional context
   */
  private async getSocialEmotionalContext(studentId: string): Promise<StudentContext['socialEmotional']> {
    const sel = this.db.prepare(
      'SELECT * FROM social_emotional_profile WHERE studentId = ? ORDER BY assessmentDate DESC LIMIT 1'
    ).get(studentId) as any;

    if (!sel) {
      return {};
    }

    return {
      competencies: {
        'Empati': sel.empathyLevel || 0,
        'Öz-farkındalık': sel.selfAwarenessLevel || 0,
        'Duygu Düzenleme': sel.emotionRegulationLevel || 0,
        'İlişki Becerileri': sel.relationshipSkillsLevel || 0,
        'Sorumlu Karar Verme': sel.responsibleDecisionMakingLevel || 0
      },
      strengths: sel.socialStrengths ? JSON.parse(sel.socialStrengths) : [],
      challenges: sel.socialChallenges ? JSON.parse(sel.socialChallenges) : [],
      relationships: sel.peerRelationshipQuality
    };
  }

  /**
   * Get behavioral context
   */
  private async getBehavioralContext(studentId: string): Promise<StudentContext['behavioral']> {
    const incidents = this.db.prepare(`
      SELECT * FROM behavior_incidents 
      WHERE studentId = ? 
      ORDER BY incidentDate DESC, incidentTime DESC 
      LIMIT 10
    `).all(studentId) as any[];

    const stats = this.db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN behaviorCategory = 'Olumlu' THEN 1 ELSE 0 END) as positive,
        SUM(CASE WHEN behaviorCategory != 'Olumlu' THEN 1 ELSE 0 END) as negative
      FROM behavior_incidents 
      WHERE studentId = ?
    `).get(studentId) as any;

    return {
      recentIncidents: incidents.map(inc => ({
        date: inc.incidentDate,
        type: inc.behaviorType,
        severity: inc.intensity,
        description: inc.description
      })),
      positiveCount: stats?.positive || 0,
      negativeCount: stats?.negative || 0,
      trends: this.analyzeBehaviorTrends(incidents)
    };
  }

  /**
   * Get attendance context
   */
  private async getAttendanceContext(studentId: string): Promise<StudentContext['attendance']> {
    const attendance = this.db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Var' THEN 1 ELSE 0 END) as present,
        SUM(CASE WHEN status = 'Yok' AND (notes LIKE '%mazeret%' OR notes LIKE '%izinli%') THEN 1 ELSE 0 END) as excused,
        SUM(CASE WHEN status = 'Yok' AND (notes NOT LIKE '%mazeret%' AND notes NOT LIKE '%izinli%') THEN 1 ELSE 0 END) as unexcused
      FROM attendance 
      WHERE studentId = ?
    `).get(studentId) as any;

    const recentAbsences = this.db.prepare(`
      SELECT COUNT(*) as count 
      FROM attendance 
      WHERE studentId = ? AND status = 'Yok' AND date >= date('now', '-30 days')
    `).get(studentId) as any;

    const rate = attendance?.total > 0 ? 
      Math.round((attendance.present / attendance.total) * 100) : 
      undefined;

    return {
      rate,
      recentAbsences: recentAbsences?.count || 0,
      excusedVsUnexcused: {
        excused: attendance?.excused || 0,
        unexcused: attendance?.unexcused || 0
      }
    };
  }

  /**
   * Get risk context
   */
  private async getRiskContext(studentId: string): Promise<StudentContext['risk']> {
    const riskScore = this.db.prepare(
      'SELECT * FROM risk_score_history WHERE studentId = ? ORDER BY assessmentDate DESC LIMIT 1'
    ).get(studentId) as any;

    const alerts = this.db.prepare(`
      SELECT * FROM early_warning_alerts 
      WHERE studentId = ? AND status IN ('AÇIK', 'İNCELENİYOR')
      ORDER BY created_at DESC
    `).all(studentId) as any[];

    const riskProfile = this.db.prepare(
      'SELECT * FROM risk_protective_profile WHERE studentId = ? ORDER BY assessmentDate DESC LIMIT 1'
    ).get(studentId) as any;

    return {
      level: riskScore?.riskLevel || 'DÜŞÜK',
      factors: riskProfile?.riskFactors ? JSON.parse(riskProfile.riskFactors) : [],
      protectiveFactors: riskProfile?.protectiveFactors ? JSON.parse(riskProfile.protectiveFactors) : [],
      alerts: alerts.map(alert => ({
        type: alert.alertType,
        level: alert.alertLevel,
        description: alert.description,
        date: alert.created_at
      }))
    };
  }

  /**
   * Get intervention context
   */
  private async getInterventionContext(studentId: string): Promise<StudentContext['interventions']> {
    const sessions = this.db.prepare(`
      SELECT cs.*, css.studentId
      FROM counseling_sessions cs
      JOIN counseling_session_students css ON cs.id = css.sessionId
      WHERE css.studentId = ?
      ORDER BY cs.sessionDate DESC
      LIMIT 5
    `).all(studentId) as any[];

    const interventions = this.db.prepare(`
      SELECT * FROM interventions 
      WHERE studentId = ? AND status IN ('Devam', 'Planlandı')
      ORDER BY created_at DESC
    `).all(studentId) as any[];

    return {
      recentSessions: sessions.map(session => ({
        date: session.sessionDate,
        type: session.sessionType === 'individual' ? 'Bireysel' : 'Grup',
        topic: session.topic,
        summary: session.detailedNotes
      })),
      activeInterventions: interventions.map(int => ({
        title: int.title,
        status: int.status,
        startDate: int.date
      }))
    };
  }

  /**
   * Get talents and interests context
   */
  private async getTalentsInterestsContext(studentId: string): Promise<StudentContext['talentsInterests']> {
    const profile = this.db.prepare(
      'SELECT * FROM talents_interests_profile WHERE studentId = ? ORDER BY assessmentDate DESC LIMIT 1'
    ).get(studentId) as any;

    if (!profile) {
      return undefined;
    }

    return {
      talents: profile.talents ? JSON.parse(profile.talents) : [],
      interests: profile.interests ? JSON.parse(profile.interests) : [],
      hobbies: profile.hobbies ? JSON.parse(profile.hobbies) : [],
      careerGoals: profile.careerAspirations ? JSON.parse(profile.careerAspirations) : []
    };
  }

  /**
   * Get health context
   */
  private async getHealthContext(studentId: string): Promise<StudentContext['health']> {
    const health = this.db.prepare(
      'SELECT * FROM standardized_health_profile WHERE studentId = ? ORDER BY assessmentDate DESC LIMIT 1'
    ).get(studentId) as any;

    if (!health) {
      return undefined;
    }

    return {
      conditions: health.chronicConditions ? JSON.parse(health.chronicConditions) : [],
      medications: health.currentMedications ? JSON.parse(health.currentMedications) : [],
      notes: health.healthNotes
    };
  }

  /**
   * Calculate performance trend from exams
   */
  private calculatePerformanceTrend(exams: any[]): 'improving' | 'declining' | 'stable' {
    if (exams.length < 2) return 'stable';

    const recent = exams.slice(0, 3);
    const older = exams.slice(3, 6);

    if (recent.length === 0 || older.length === 0) return 'stable';

    const recentAvg = recent.reduce((sum, e) => sum + (e.score || e.grade || 0), 0) / recent.length;
    const olderAvg = older.reduce((sum, e) => sum + (e.score || e.grade || 0), 0) / older.length;

    const diff = recentAvg - olderAvg;

    if (diff > 5) return 'improving';
    if (diff < -5) return 'declining';
    return 'stable';
  }

  /**
   * Analyze behavior trends
   */
  private analyzeBehaviorTrends(incidents: any[]): string {
    if (incidents.length === 0) return 'Davranış kaydı yok';

    const recent = incidents.slice(0, 5);
    const positiveCount = recent.filter(i => i.behaviorCategory === 'Olumlu').length;
    const negativeCount = recent.length - positiveCount;

    if (positiveCount > negativeCount * 2) {
      return 'Son dönemde olumlu davranışlar ağırlıkta';
    } else if (negativeCount > positiveCount * 2) {
      return 'Son dönemde olumsuz davranışlar artışta';
    } else {
      return 'Davranış dengeli seyrediyor';
    }
  }

  /**
   * Format context as natural language text for AI
   */
  formatContextForAI(context: StudentContext): string {
    let text = `# ${context.student.name} - Öğrenci Profili\n\n`;

    text += `## Temel Bilgiler\n`;
    text += `- Sınıf: ${context.student.grade}\n`;
    if (context.student.age) text += `- Yaş: ${context.student.age}\n`;
    if (context.student.gender) text += `- Cinsiyet: ${context.student.gender}\n`;
    text += `\n`;

    if (context.academic.gpa) {
      text += `## Akademik Durum\n`;
      text += `- Not Ortalaması: ${context.academic.gpa}\n`;
      text += `- Performans Eğilimi: ${context.academic.performanceTrend === 'improving' ? 'Gelişiyor' : context.academic.performanceTrend === 'declining' ? 'Düşüşte' : 'Stabil'}\n`;
      if (context.academic.strengths && context.academic.strengths.length > 0) {
        text += `- Güçlü Dersler: ${context.academic.strengths.join(', ')}\n`;
      }
      if (context.academic.weaknesses && context.academic.weaknesses.length > 0) {
        text += `- Gelişim Gereken Dersler: ${context.academic.weaknesses.join(', ')}\n`;
      }
      text += `\n`;
    }

    if (context.socialEmotional.competencies) {
      text += `## Sosyal-Duygusal Gelişim\n`;
      Object.entries(context.socialEmotional.competencies).forEach(([key, value]) => {
        text += `- ${key}: ${value}/10\n`;
      });
      if (context.socialEmotional.relationships) {
        text += `- Akran İlişkileri: ${context.socialEmotional.relationships}\n`;
      }
      text += `\n`;
    }

    if (context.behavioral.recentIncidents && context.behavioral.recentIncidents.length > 0) {
      text += `## Davranışsal Durum\n`;
      text += `- Olumlu Davranış Sayısı: ${context.behavioral.positiveCount}\n`;
      text += `- Olumsuz Davranış Sayısı: ${context.behavioral.negativeCount}\n`;
      text += `- Eğilim: ${context.behavioral.trends}\n`;
      text += `\n`;
    }

    if (context.attendance.rate !== undefined) {
      text += `## Devam Durumu\n`;
      text += `- Devam Oranı: %${context.attendance.rate}\n`;
      text += `- Son 30 Gündeki Devamsızlık: ${context.attendance.recentAbsences} gün\n`;
      text += `\n`;
    }

    text += `## Risk Değerlendirmesi\n`;
    text += `- Risk Seviyesi: ${context.risk.level}\n`;
    if (context.risk.factors && context.risk.factors.length > 0) {
      text += `- Risk Faktörleri: ${context.risk.factors.join(', ')}\n`;
    }
    if (context.risk.protectiveFactors && context.risk.protectiveFactors.length > 0) {
      text += `- Koruyucu Faktörler: ${context.risk.protectiveFactors.join(', ')}\n`;
    }
    if (context.risk.alerts && context.risk.alerts.length > 0) {
      text += `- Aktif Uyarılar: ${context.risk.alerts.length} adet\n`;
    }
    text += `\n`;

    if (context.interventions.activeInterventions && context.interventions.activeInterventions.length > 0) {
      text += `## Aktif Müdahaleler\n`;
      context.interventions.activeInterventions.forEach(int => {
        text += `- ${int.title} (${int.status})\n`;
      });
      text += `\n`;
    }

    if (context.talentsInterests) {
      text += `## Yetenek ve İlgi Alanları\n`;
      if (context.talentsInterests.talents && context.talentsInterests.talents.length > 0) {
        text += `- Yetenekler: ${context.talentsInterests.talents.join(', ')}\n`;
      }
      if (context.talentsInterests.interests && context.talentsInterests.interests.length > 0) {
        text += `- İlgi Alanları: ${context.talentsInterests.interests.join(', ')}\n`;
      }
      if (context.talentsInterests.careerGoals && context.talentsInterests.careerGoals.length > 0) {
        text += `- Kariyer Hedefleri: ${context.talentsInterests.careerGoals.join(', ')}\n`;
      }
    }

    return text;
  }
}
