import type Database from 'better-sqlite3';
import type {
  AssessmentType,
  Assessment,
  AssessmentResult,
  MockExam,
  MockExamResult,
  SubjectGrade,
  TopicAssessment,
  PerformanceTask,
  PerformanceTaskResult,
  AssessmentAnalysis,
  AssessmentFilters,
  AssessmentAnalysisFilters
} from '@shared/types/assessment.types';

/**
 * Repository for Assessment System
 * Handles all database operations for assessments
 */
export class AssessmentsRepository {
  constructor(private db: Database.Database) {}

  // ============= ASSESSMENT TYPES =============

  getAssessmentTypes(): AssessmentType[] {
    const stmt = this.db.prepare('SELECT * FROM assessment_types WHERE isActive = 1 ORDER BY category, name');
    return stmt.all() as AssessmentType[];
  }

  getAssessmentTypesByCategory(category: string): AssessmentType[] {
    const stmt = this.db.prepare('SELECT * FROM assessment_types WHERE category = ? AND isActive = 1');
    return stmt.all(category) as AssessmentType[];
  }

  getAssessmentTypeById(id: string): AssessmentType | null {
    const stmt = this.db.prepare('SELECT * FROM assessment_types WHERE id = ?');
    return (stmt.get(id) as AssessmentType) || null;
  }

  // ============= ASSESSMENTS =============

  getAssessments(filters?: AssessmentFilters): Assessment[] {
    let query = 'SELECT * FROM assessments WHERE 1=1';
    const params: any[] = [];

    if (filters) {
      if (filters.assessmentTypeId) {
        query += ' AND assessmentTypeId = ?';
        params.push(filters.assessmentTypeId);
      }
      if (filters.className) {
        query += ' AND className = ?';
        params.push(filters.className);
      }
      if (filters.subjectId) {
        query += ' AND subjectId = ?';
        params.push(filters.subjectId);
      }
      if (filters.semester) {
        query += ' AND semester = ?';
        params.push(filters.semester);
      }
      if (filters.academicYear) {
        query += ' AND academicYear = ?';
        params.push(filters.academicYear);
      }
      if (filters.dateFrom) {
        query += ' AND assessmentDate >= ?';
        params.push(filters.dateFrom);
      }
      if (filters.dateTo) {
        query += ' AND assessmentDate <= ?';
        params.push(filters.dateTo);
      }
    }

    query += ' ORDER BY assessmentDate DESC';

    const stmt = this.db.prepare(query);
    return stmt.all(...params) as Assessment[];
  }

  getAssessmentById(id: string): Assessment | null {
    const stmt = this.db.prepare('SELECT * FROM assessments WHERE id = ?');
    return (stmt.get(id) as Assessment) || null;
  }

  createAssessment(assessment: Omit<Assessment, 'created_at' | 'updated_at'>): void {
    const stmt = this.db.prepare(`
      INSERT INTO assessments (
        id, assessmentTypeId, title, description, assessmentDate,
        semester, academicYear, className, subjectId, maxScore,
        passingScore, weight, metadata, createdBy
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      assessment.id,
      assessment.assessmentTypeId,
      assessment.title,
      assessment.description,
      assessment.assessmentDate,
      assessment.semester,
      assessment.academicYear,
      assessment.className,
      assessment.subjectId,
      assessment.maxScore,
      assessment.passingScore,
      assessment.weight,
      assessment.metadata ? JSON.stringify(assessment.metadata) : null,
      assessment.createdBy
    );
  }

  updateAssessment(id: string, updates: Partial<Assessment>): void {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) {
      fields.push('title = ?');
      values.push(updates.title);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.assessmentDate !== undefined) {
      fields.push('assessmentDate = ?');
      values.push(updates.assessmentDate);
    }
    if (updates.semester !== undefined) {
      fields.push('semester = ?');
      values.push(updates.semester);
    }
    if (updates.academicYear !== undefined) {
      fields.push('academicYear = ?');
      values.push(updates.academicYear);
    }
    if (updates.maxScore !== undefined) {
      fields.push('maxScore = ?');
      values.push(updates.maxScore);
    }
    if (updates.passingScore !== undefined) {
      fields.push('passingScore = ?');
      values.push(updates.passingScore);
    }
    if (updates.metadata !== undefined) {
      fields.push('metadata = ?');
      values.push(updates.metadata ? JSON.stringify(updates.metadata) : null);
    }

    if (fields.length === 0) return;

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = this.db.prepare(`UPDATE assessments SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
  }

  deleteAssessment(id: string): void {
    const stmt = this.db.prepare('DELETE FROM assessments WHERE id = ?');
    stmt.run(id);
  }

  // ============= ASSESSMENT RESULTS =============

  getAssessmentResults(assessmentId: string): AssessmentResult[] {
    const stmt = this.db.prepare('SELECT * FROM assessment_results WHERE assessmentId = ? ORDER BY rank ASC');
    return stmt.all(assessmentId) as AssessmentResult[];
  }

  getStudentAssessmentResults(studentId: string, filters?: AssessmentFilters): AssessmentResult[] {
    let query = `
      SELECT ar.* FROM assessment_results ar
      JOIN assessments a ON ar.assessmentId = a.id
      WHERE ar.studentId = ?
    `;
    const params: any[] = [studentId];

    if (filters) {
      if (filters.assessmentTypeId) {
        query += ' AND a.assessmentTypeId = ?';
        params.push(filters.assessmentTypeId);
      }
      if (filters.dateFrom) {
        query += ' AND a.assessmentDate >= ?';
        params.push(filters.dateFrom);
      }
      if (filters.dateTo) {
        query += ' AND a.assessmentDate <= ?';
        params.push(filters.dateTo);
      }
    }

    query += ' ORDER BY a.assessmentDate DESC';

    const stmt = this.db.prepare(query);
    return stmt.all(...params) as AssessmentResult[];
  }

  createAssessmentResult(result: Omit<AssessmentResult, 'created_at' | 'updated_at'>): void {
    const stmt = this.db.prepare(`
      INSERT INTO assessment_results (
        id, assessmentId, studentId, score, percentage, grade,
        rank, classAverage, schoolAverage, notes, submittedAt, gradedAt, gradedBy
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      result.id,
      result.assessmentId,
      result.studentId,
      result.score,
      result.percentage,
      result.grade,
      result.rank,
      result.classAverage,
      result.schoolAverage,
      result.notes,
      result.submittedAt,
      result.gradedAt,
      result.gradedBy
    );
  }

  updateAssessmentResult(id: string, updates: Partial<AssessmentResult>): void {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.score !== undefined) {
      fields.push('score = ?');
      values.push(updates.score);
    }
    if (updates.percentage !== undefined) {
      fields.push('percentage = ?');
      values.push(updates.percentage);
    }
    if (updates.grade !== undefined) {
      fields.push('grade = ?');
      values.push(updates.grade);
    }
    if (updates.rank !== undefined) {
      fields.push('rank = ?');
      values.push(updates.rank);
    }
    if (updates.classAverage !== undefined) {
      fields.push('classAverage = ?');
      values.push(updates.classAverage);
    }
    if (updates.notes !== undefined) {
      fields.push('notes = ?');
      values.push(updates.notes);
    }

    if (fields.length === 0) return;

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = this.db.prepare(`UPDATE assessment_results SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
  }

  // ============= MOCK EXAMS =============

  createMockExam(mockExam: Omit<MockExam, 'created_at' | 'updated_at'>): void {
    const stmt = this.db.prepare(`
      INSERT INTO mock_exams (
        id, assessmentId, examType, examProvider, examNumber,
        totalQuestions, totalTime, sections
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      mockExam.id,
      mockExam.assessmentId,
      mockExam.examType,
      mockExam.examProvider,
      mockExam.examNumber,
      mockExam.totalQuestions,
      mockExam.totalTime,
      mockExam.sections ? JSON.stringify(mockExam.sections) : null
    );
  }

  getMockExamByAssessmentId(assessmentId: string): MockExam | null {
    const stmt = this.db.prepare('SELECT * FROM mock_exams WHERE assessmentId = ?');
    return (stmt.get(assessmentId) as MockExam) || null;
  }

  createMockExamResult(result: Omit<MockExamResult, 'created_at' | 'updated_at'>): void {
    const stmt = this.db.prepare(`
      INSERT INTO mock_exam_results (
        id, mockExamId, studentId, assessmentResultId,
        totalCorrect, totalWrong, totalEmpty, netScore, targetNet,
        sectionResults, topicResults, timeSpent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      result.id,
      result.mockExamId,
      result.studentId,
      result.assessmentResultId,
      result.totalCorrect,
      result.totalWrong,
      result.totalEmpty,
      result.netScore,
      result.targetNet,
      result.sectionResults ? JSON.stringify(result.sectionResults) : null,
      result.topicResults ? JSON.stringify(result.topicResults) : null,
      result.timeSpent
    );
  }

  getMockExamResults(mockExamId: string): MockExamResult[] {
    const stmt = this.db.prepare('SELECT * FROM mock_exam_results WHERE mockExamId = ?');
    return stmt.all(mockExamId) as MockExamResult[];
  }

  getStudentMockExamResults(studentId: string): MockExamResult[] {
    const stmt = this.db.prepare(`
      SELECT mer.* FROM mock_exam_results mer
      JOIN mock_exams me ON mer.mockExamId = me.id
      JOIN assessments a ON me.assessmentId = a.id
      WHERE mer.studentId = ?
      ORDER BY a.assessmentDate DESC
    `);
    return stmt.all(studentId) as MockExamResult[];
  }

  // ============= SUBJECT GRADES =============

  createSubjectGrade(grade: Omit<SubjectGrade, 'created_at' | 'updated_at'>): void {
    const stmt = this.db.prepare(`
      INSERT INTO subject_grades (
        id, studentId, subjectId, assessmentId, semester, academicYear,
        gradeType, score, maxScore, weight, notes, enteredBy, enteredAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      grade.id,
      grade.studentId,
      grade.subjectId,
      grade.assessmentId,
      grade.semester,
      grade.academicYear,
      grade.gradeType,
      grade.score,
      grade.maxScore,
      grade.weight,
      grade.notes,
      grade.enteredBy,
      grade.enteredAt
    );
  }

  getStudentSubjectGrades(studentId: string, filters?: { semester?: string; academicYear?: string; subjectId?: string }): SubjectGrade[] {
    let query = 'SELECT * FROM subject_grades WHERE studentId = ?';
    const params: any[] = [studentId];

    if (filters) {
      if (filters.semester) {
        query += ' AND semester = ?';
        params.push(filters.semester);
      }
      if (filters.academicYear) {
        query += ' AND academicYear = ?';
        params.push(filters.academicYear);
      }
      if (filters.subjectId) {
        query += ' AND subjectId = ?';
        params.push(filters.subjectId);
      }
    }

    query += ' ORDER BY enteredAt DESC';

    const stmt = this.db.prepare(query);
    return stmt.all(...params) as SubjectGrade[];
  }

  // ============= TOPIC ASSESSMENTS =============

  createTopicAssessment(assessment: Omit<TopicAssessment, 'created_at' | 'updated_at'>): void {
    const stmt = this.db.prepare(`
      INSERT INTO topic_assessments (
        id, assessmentId, studentId, topicId, outcome, score, maxScore,
        mastered, attempts, lastAttemptDate, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      assessment.id,
      assessment.assessmentId,
      assessment.studentId,
      assessment.topicId,
      assessment.outcome,
      assessment.score,
      assessment.maxScore,
      assessment.mastered ? 1 : 0,
      assessment.attempts,
      assessment.lastAttemptDate,
      assessment.notes
    );
  }

  getStudentTopicAssessments(studentId: string): TopicAssessment[] {
    const stmt = this.db.prepare('SELECT * FROM topic_assessments WHERE studentId = ?');
    return stmt.all(studentId) as TopicAssessment[];
  }

  // ============= PERFORMANCE TASKS =============

  createPerformanceTask(task: Omit<PerformanceTask, 'created_at' | 'updated_at'>): void {
    const stmt = this.db.prepare(`
      INSERT INTO performance_tasks (
        id, assessmentId, taskType, criteria, maxCriteriaScore
      ) VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(
      task.id,
      task.assessmentId,
      task.taskType,
      JSON.stringify(task.criteria),
      task.maxCriteriaScore
    );
  }

  createPerformanceTaskResult(result: Omit<PerformanceTaskResult, 'created_at' | 'updated_at'>): void {
    const stmt = this.db.prepare(`
      INSERT INTO performance_task_results (
        id, performanceTaskId, studentId, assessmentResultId,
        criteriaScores, feedback, strengths, improvements
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      result.id,
      result.performanceTaskId,
      result.studentId,
      result.assessmentResultId,
      result.criteriaScores ? JSON.stringify(result.criteriaScores) : null,
      result.feedback,
      result.strengths ? JSON.stringify(result.strengths) : null,
      result.improvements ? JSON.stringify(result.improvements) : null
    );
  }

  // ============= ASSESSMENT ANALYSIS =============

  createAssessmentAnalysis(analysis: Omit<AssessmentAnalysis, 'created_at'>): void {
    const stmt = this.db.prepare(`
      INSERT INTO assessment_analyses (
        id, assessmentId, studentId, analysisType, severity,
        findings, recommendations, generatedBy, generatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      analysis.id,
      analysis.assessmentId,
      analysis.studentId,
      analysis.analysisType,
      analysis.severity,
      JSON.stringify(analysis.findings),
      analysis.recommendations ? JSON.stringify(analysis.recommendations) : null,
      analysis.generatedBy,
      analysis.generatedAt
    );
  }

  getAssessmentAnalyses(filters?: AssessmentAnalysisFilters): AssessmentAnalysis[] {
    let query = 'SELECT * FROM assessment_analyses WHERE 1=1';
    const params: any[] = [];

    if (filters) {
      if (filters.studentId) {
        query += ' AND studentId = ?';
        params.push(filters.studentId);
      }
      if (filters.assessmentId) {
        query += ' AND assessmentId = ?';
        params.push(filters.assessmentId);
      }
      if (filters.analysisType) {
        query += ' AND analysisType = ?';
        params.push(filters.analysisType);
      }
      if (filters.severity) {
        query += ' AND severity = ?';
        params.push(filters.severity);
      }
      if (filters.acknowledged !== undefined) {
        query += filters.acknowledged ? ' AND acknowledgedAt IS NOT NULL' : ' AND acknowledgedAt IS NULL';
      }
    }

    query += ' ORDER BY generatedAt DESC';

    const stmt = this.db.prepare(query);
    return stmt.all(...params) as AssessmentAnalysis[];
  }

  acknowledgeAnalysis(id: string, acknowledgedBy: string): void {
    const stmt = this.db.prepare(`
      UPDATE assessment_analyses
      SET acknowledgedBy = ?, acknowledgedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(acknowledgedBy, id);
  }

  // ============= BATCH OPERATIONS =============

  bulkCreateAssessmentResults(results: Omit<AssessmentResult, 'created_at' | 'updated_at'>[]): void {
    const stmt = this.db.prepare(`
      INSERT INTO assessment_results (
        id, assessmentId, studentId, score, percentage, grade,
        rank, classAverage, schoolAverage, notes, submittedAt, gradedAt, gradedBy
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = this.db.transaction(() => {
      for (const result of results) {
        stmt.run(
          result.id,
          result.assessmentId,
          result.studentId,
          result.score,
          result.percentage,
          result.grade,
          result.rank,
          result.classAverage,
          result.schoolAverage,
          result.notes,
          result.submittedAt,
          result.gradedAt,
          result.gradedBy
        );
      }
    });

    insertMany();
  }

  bulkCreateSubjectGrades(grades: Omit<SubjectGrade, 'created_at' | 'updated_at'>[]): void {
    const stmt = this.db.prepare(`
      INSERT INTO subject_grades (
        id, studentId, subjectId, assessmentId, semester, academicYear,
        gradeType, score, maxScore, weight, notes, enteredBy, enteredAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = this.db.transaction(() => {
      for (const grade of grades) {
        stmt.run(
          grade.id,
          grade.studentId,
          grade.subjectId,
          grade.assessmentId,
          grade.semester,
          grade.academicYear,
          grade.gradeType,
          grade.score,
          grade.maxScore,
          grade.weight,
          grade.notes,
          grade.enteredBy,
          grade.enteredAt
        );
      }
    });

    insertMany();
  }
}
