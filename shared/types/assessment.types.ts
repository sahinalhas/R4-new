/**
 * Assessment System Types
 * Comprehensive types for all assessment functionality
 */

// ============= ENUMS =============

export type AssessmentCategory =
  | 'DERS_NOTU'          // School subject grades
  | 'DENEME_SINAVI'      // Mock exams (TYT/AYT/LGS)
  | 'KONU_TARAMA'        // Topic/outcome tests
  | 'PERFORMANS_GOREVI'  // Performance tasks/projects
  | 'STANDART_TEST'      // Standard tests (central exams)
  | 'OLCEK'              // Assessment scales
  | 'DIGER';             // Other

export type ExamType =
  | 'TYT'
  | 'AYT-SAY'      // AYT Sayısal
  | 'AYT-SOZ'      // AYT Sözel
  | 'AYT-EA'       // AYT Eşit Ağırlık
  | 'LGS'
  | 'YDT'          // Yabancı Dil Testi
  | 'KPSS'
  | 'ALES'
  | 'DGS'
  | 'YDS'
  | 'DIGER';

export type GradeType =
  | 'YAZILI'       // Written exam
  | 'SOZLU'        // Oral exam
  | 'PERFORMANS'   // Performance grade
  | 'PROJE'        // Project
  | 'DAVRANIS'     // Behavior
  | 'DEVAMSIZLIK'  // Attendance
  | 'ORTALAMA';    // Average

export type AnalysisType =
  | 'PERFORMANCE_DROP'   // Performans düşüşü
  | 'WEAK_TOPICS'        // Zayıf konular
  | 'TREND_ANALYSIS'     // Trend analizi
  | 'PEER_COMPARISON'    // Akran karşılaştırması
  | 'TARGET_GAP'         // Hedef-gerçekleşen farkı
  | 'AI_INSIGHTS';       // AI önerileri

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// ============= BASE TYPES =============

export interface AssessmentType {
  id: string;
  name: string;
  category: AssessmentCategory;
  subCategory: string | null;
  description: string | null;
  isActive: boolean;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: string;
  assessmentTypeId: string;
  title: string;
  description: string | null;
  assessmentDate: string;
  semester: string | null;
  academicYear: string | null;
  className: string | null;
  subjectId: string | null;
  maxScore: number | null;
  passingScore: number | null;
  weight: number;
  metadata: Record<string, any> | null;
  createdBy: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  studentId: string;
  score: number | null;
  percentage: number | null;
  grade: string | null;
  rank: number | null;
  classAverage: number | null;
  schoolAverage: number | null;
  notes: string | null;
  submittedAt: string | null;
  gradedAt: string | null;
  gradedBy: string | null;
  created_at: string;
  updated_at: string;
}

// ============= MOCK EXAM TYPES =============

export interface MockExamSection {
  name: string;
  questionCount: number;
  timeAllowed: number; // minutes
  subjects?: string[];
}

export interface MockExam {
  id: string;
  assessmentId: string;
  examType: ExamType;
  examProvider: string | null;
  examNumber: string | null;
  totalQuestions: number | null;
  totalTime: number | null;
  sections: MockExamSection[] | null;
  created_at: string;
  updated_at: string;
}

export interface MockExamSectionResult {
  sectionName: string;
  correct: number;
  wrong: number;
  empty: number;
  net: number;
  targetNet?: number;
}

export interface TopicPerformance {
  topicId: string;
  topicName: string;
  correct: number;
  wrong: number;
  empty: number;
  totalQuestions: number;
  successRate: number;
}

export interface MockExamResult {
  id: string;
  mockExamId: string;
  studentId: string;
  assessmentResultId: string;
  totalCorrect: number;
  totalWrong: number;
  totalEmpty: number;
  netScore: number | null;
  targetNet: number | null;
  sectionResults: MockExamSectionResult[] | null;
  topicResults: TopicPerformance[] | null;
  timeSpent: number | null;
  created_at: string;
  updated_at: string;
}

// ============= SUBJECT GRADE TYPES =============

export interface SubjectGrade {
  id: string;
  studentId: string;
  subjectId: string;
  assessmentId: string | null;
  semester: string;
  academicYear: string;
  gradeType: GradeType;
  score: number;
  maxScore: number;
  weight: number;
  notes: string | null;
  enteredBy: string | null;
  enteredAt: string;
  created_at: string;
  updated_at: string;
}

// ============= TOPIC ASSESSMENT TYPES =============

export interface TopicAssessment {
  id: string;
  assessmentId: string;
  studentId: string;
  topicId: string;
  outcome: string | null;
  score: number | null;
  maxScore: number | null;
  mastered: boolean;
  attempts: number;
  lastAttemptDate: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ============= PERFORMANCE TASK TYPES =============

export interface RubricCriterion {
  name: string;
  description: string;
  maxScore: number;
  levels: {
    level: number;
    label: string;
    description: string;
  }[];
}

export interface PerformanceTask {
  id: string;
  assessmentId: string;
  taskType: string | null;
  criteria: RubricCriterion[];
  maxCriteriaScore: number | null;
  created_at: string;
  updated_at: string;
}

export interface CriterionScore {
  criterionName: string;
  score: number;
  feedback?: string;
}

export interface PerformanceTaskResult {
  id: string;
  performanceTaskId: string;
  studentId: string;
  assessmentResultId: string;
  criteriaScores: CriterionScore[] | null;
  feedback: string | null;
  strengths: string[] | null;
  improvements: string[] | null;
  created_at: string;
  updated_at: string;
}

// ============= ANALYSIS TYPES =============

export interface AssessmentAnalysisFindings {
  summary: string;
  details: string[];
  metrics?: Record<string, number>;
  comparisonData?: any;
}

export interface AssessmentRecommendation {
  action: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  reason: string;
  expectedOutcome?: string;
}

export interface AssessmentAnalysis {
  id: string;
  assessmentId: string | null;
  studentId: string | null;
  analysisType: AnalysisType;
  severity: SeverityLevel | null;
  findings: AssessmentAnalysisFindings;
  recommendations: AssessmentRecommendation[] | null;
  generatedBy: string | null;
  generatedAt: string;
  acknowledgedBy: string | null;
  acknowledgedAt: string | null;
  created_at: string;
}

// ============= COMPOSITE TYPES (for API responses) =============

export interface AssessmentWithType extends Assessment {
  assessmentType?: AssessmentType;
  mockExam?: MockExam;
  performanceTask?: PerformanceTask;
}

export interface AssessmentResultWithDetails extends AssessmentResult {
  assessment?: AssessmentWithType;
  mockExamResult?: MockExamResult;
  performanceTaskResult?: PerformanceTaskResult;
  topicAssessments?: TopicAssessment[];
}

export interface StudentAssessmentSummary {
  studentId: string;
  studentName: string;
  totalAssessments: number;
  averageScore: number;
  averagePercentage: number;
  recentTrend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  weakTopics: string[];
  strongTopics: string[];
  riskLevel: SeverityLevel;
}

// ============= BULK UPLOAD TYPES =============

export interface BulkAssessmentUpload {
  assessmentId: string;
  results: {
    studentId: string;
    score: number;
    notes?: string;
  }[];
}

export interface MockExamBulkUpload {
  examType: ExamType;
  examProvider: string;
  examNumber: string;
  examDate: string;
  className: string;
  results: {
    studentId: string;
    sectionResults: MockExamSectionResult[];
    topicResults?: TopicPerformance[];
  }[];
}

export interface SubjectGradeBulkUpload {
  subjectId: string;
  semester: string;
  academicYear: string;
  gradeType: GradeType;
  className: string;
  grades: {
    studentId: string;
    score: number;
    notes?: string;
  }[];
}

// ============= FILTER/QUERY TYPES =============

export interface AssessmentFilters {
  studentId?: string;
  assessmentTypeId?: string;
  category?: AssessmentCategory;
  className?: string;
  subjectId?: string;
  semester?: string;
  academicYear?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface AssessmentAnalysisFilters {
  studentId?: string;
  assessmentId?: string;
  analysisType?: AnalysisType;
  severity?: SeverityLevel;
  acknowledged?: boolean;
}
