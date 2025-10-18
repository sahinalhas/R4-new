import getDatabase from '../../../lib/database';
import { AssessmentsRepository } from '../repository/assessments.repository';
import type {
  Assessment,
  AssessmentResult,
  MockExam,
  MockExamResult,
  SubjectGrade,
  AssessmentFilters,
  StudentAssessmentSummary,
  MockExamBulkUpload,
  SubjectGradeBulkUpload
} from '@shared/types/assessment.types';
import { randomUUID } from 'crypto';

/**
 * Service for Assessment Business Logic
 */
export class AssessmentService {
  private repository: AssessmentsRepository;

  constructor() {
    const db = getDatabase();
    this.repository = new AssessmentsRepository(db);
  }

  // ============= ASSESSMENT TYPES =============

  getAssessmentTypes() {
    return this.repository.getAssessmentTypes();
  }

  getAssessmentTypesByCategory(category: string) {
    return this.repository.getAssessmentTypesByCategory(category);
  }

  // ============= ASSESSMENTS =============

  getAssessments(filters?: AssessmentFilters): Assessment[] {
    return this.repository.getAssessments(filters);
  }

  getAssessmentById(id: string): Assessment | null {
    return this.repository.getAssessmentById(id);
  }

  createAssessment(assessment: Omit<Assessment, 'id' | 'created_at' | 'updated_at'>): Assessment {
    const id = randomUUID();
    const newAssessment = { ...assessment, id };
    this.repository.createAssessment(newAssessment);
    return this.getAssessmentById(id)!;
  }

  updateAssessment(id: string, updates: Partial<Assessment>): Assessment {
    this.repository.updateAssessment(id, updates);
    return this.getAssessmentById(id)!;
  }

  deleteAssessment(id: string): void {
    this.repository.deleteAssessment(id);
  }

  // ============= ASSESSMENT RESULTS =============

  getAssessmentResults(assessmentId: string): AssessmentResult[] {
    return this.repository.getAssessmentResults(assessmentId);
  }

  getStudentAssessmentResults(studentId: string, filters?: AssessmentFilters): AssessmentResult[] {
    return this.repository.getStudentAssessmentResults(studentId, filters);
  }

  createAssessmentResult(result: Omit<AssessmentResult, 'id' | 'created_at' | 'updated_at'>): AssessmentResult {
    const id = randomUUID();
    
    // Calculate percentage if not provided
    const percentage = result.percentage || (result.score && result.score !== null 
      ? (result.score / (this.getAssessmentById(result.assessmentId)?.maxScore || 100)) * 100
      : null);

    const newResult = { 
      ...result, 
      id,
      percentage 
    };
    
    this.repository.createAssessmentResult(newResult);
    return newResult as AssessmentResult;
  }

  updateAssessmentResult(id: string, updates: Partial<AssessmentResult>): void {
    this.repository.updateAssessmentResult(id, updates);
  }

  // ============= MOCK EXAMS =============

  createMockExamWithResults(data: {
    assessment: Omit<Assessment, 'id' | 'created_at' | 'updated_at'>;
    mockExam: Omit<MockExam, 'id' | 'assessmentId' | 'created_at' | 'updated_at'>;
    results: Array<{
      studentId: string;
      sectionResults: any[];
      topicResults?: any[];
      timeSpent?: number;
      targetNet?: number;
    }>;
  }): { assessmentId: string; mockExamId: string } {
    const assessmentId = randomUUID();
    const mockExamId = randomUUID();

    // Create assessment
    this.repository.createAssessment({ ...data.assessment, id: assessmentId });

    // Create mock exam
    this.repository.createMockExam({ ...data.mockExam, id: mockExamId, assessmentId });

    // Create results
    for (const result of data.results) {
      // Calculate totals from section results
      const totalCorrect = result.sectionResults.reduce((sum, s) => sum + s.correct, 0);
      const totalWrong = result.sectionResults.reduce((sum, s) => sum + s.wrong, 0);
      const totalEmpty = result.sectionResults.reduce((sum, s) => sum + s.empty, 0);
      const netScore = totalCorrect - (totalWrong / 4);
      const score = netScore;

      // Create assessment result
      const assessmentResultId = randomUUID();
      this.repository.createAssessmentResult({
        id: assessmentResultId,
        assessmentId,
        studentId: result.studentId,
        score,
        percentage: null,
        grade: null,
        rank: null,
        classAverage: null,
        schoolAverage: null,
        notes: null,
        submittedAt: new Date().toISOString(),
        gradedAt: new Date().toISOString(),
        gradedBy: null
      });

      // Create mock exam result
      this.repository.createMockExamResult({
        id: randomUUID(),
        mockExamId,
        studentId: result.studentId,
        assessmentResultId,
        totalCorrect,
        totalWrong,
        totalEmpty,
        netScore,
        targetNet: result.targetNet || null,
        sectionResults: result.sectionResults,
        topicResults: result.topicResults || null,
        timeSpent: result.timeSpent || null
      });
    }

    // Calculate and update ranks
    this.calculateRanks(assessmentId);

    return { assessmentId, mockExamId };
  }

  bulkUploadMockExam(data: MockExamBulkUpload): { assessmentId: string; mockExamId: string } {
    const assessmentTypeId = `deneme-${data.examType.toLowerCase()}`;
    
    return this.createMockExamWithResults({
      assessment: {
        assessmentTypeId,
        title: `${data.examProvider} ${data.examNumber}`,
        description: `${data.examType} Deneme Sınavı`,
        assessmentDate: data.examDate,
        semester: null,
        academicYear: null,
        className: data.className,
        subjectId: null,
        maxScore: null,
        passingScore: null,
        weight: 1.0,
        metadata: { examProvider: data.examProvider, examNumber: data.examNumber },
        createdBy: null
      },
      mockExam: {
        examType: data.examType,
        examProvider: data.examProvider,
        examNumber: data.examNumber,
        totalQuestions: null,
        totalTime: null,
        sections: null
      },
      results: data.results
    });
  }

  getStudentMockExamResults(studentId: string): MockExamResult[] {
    return this.repository.getStudentMockExamResults(studentId);
  }

  // ============= SUBJECT GRADES =============

  createSubjectGrade(grade: Omit<SubjectGrade, 'id' | 'created_at' | 'updated_at'>): SubjectGrade {
    const id = randomUUID();
    const newGrade = { ...grade, id };
    this.repository.createSubjectGrade(newGrade);
    return newGrade as SubjectGrade;
  }

  bulkUploadSubjectGrades(data: SubjectGradeBulkUpload): void {
    const grades = data.grades.map(g => ({
      id: randomUUID(),
      studentId: g.studentId,
      subjectId: data.subjectId,
      assessmentId: null,
      semester: data.semester,
      academicYear: data.academicYear,
      gradeType: data.gradeType,
      score: g.score,
      maxScore: 100,
      weight: 1.0,
      notes: g.notes || null,
      enteredBy: null,
      enteredAt: new Date().toISOString()
    }));

    this.repository.bulkCreateSubjectGrades(grades);
  }

  getStudentSubjectGrades(studentId: string, filters?: { semester?: string; academicYear?: string; subjectId?: string }): SubjectGrade[] {
    return this.repository.getStudentSubjectGrades(studentId, filters);
  }

  // ============= ANALYTICS =============

  getStudentAssessmentSummary(studentId: string, filters?: AssessmentFilters): StudentAssessmentSummary {
    const results = this.repository.getStudentAssessmentResults(studentId, filters);
    
    if (results.length === 0) {
      return {
        studentId,
        studentName: '',
        totalAssessments: 0,
        averageScore: 0,
        averagePercentage: 0,
        recentTrend: 'STABLE',
        weakTopics: [],
        strongTopics: [],
        riskLevel: 'LOW'
      };
    }

    const scores = results.filter(r => r.score !== null).map(r => r.score!);
    const percentages = results.filter(r => r.percentage !== null).map(r => r.percentage!);

    const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const averagePercentage = percentages.length > 0 ? percentages.reduce((a, b) => a + b, 0) / percentages.length : 0;

    // Calculate trend (compare last 3 with previous 3)
    let recentTrend: 'IMPROVING' | 'STABLE' | 'DECLINING' = 'STABLE';
    if (scores.length >= 6) {
      const recent = scores.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
      const previous = scores.slice(3, 6).reduce((a, b) => a + b, 0) / 3;
      const diff = recent - previous;
      if (diff > 5) recentTrend = 'IMPROVING';
      else if (diff < -5) recentTrend = 'DECLINING';
    }

    // Determine risk level based on performance
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (averagePercentage < 40) riskLevel = 'CRITICAL';
    else if (averagePercentage < 60) riskLevel = 'HIGH';
    else if (averagePercentage < 75) riskLevel = 'MEDIUM';

    return {
      studentId,
      studentName: '',
      totalAssessments: results.length,
      averageScore,
      averagePercentage,
      recentTrend,
      weakTopics: [],
      strongTopics: [],
      riskLevel
    };
  }

  // ============= UTILITIES =============

  private calculateRanks(assessmentId: string): void {
    const results = this.repository.getAssessmentResults(assessmentId);
    const sorted = results
      .filter(r => r.score !== null)
      .sort((a, b) => (b.score || 0) - (a.score || 0));

    sorted.forEach((result, index) => {
      this.repository.updateAssessmentResult(result.id, { rank: index + 1 });
    });

    // Calculate class average
    const scores = sorted.map(r => r.score!);
    const classAverage = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    // Update all results with class average
    sorted.forEach(result => {
      this.repository.updateAssessmentResult(result.id, { classAverage });
    });
  }
}
