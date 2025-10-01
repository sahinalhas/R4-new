import {
  Student,
  AcademicRecord,
  AttendanceRecord,
  TopicProgress,
  StudySession,
  SurveyResult,
  Achievement,
  SmartGoal,
  SelfAssessment,
  loadStudents,
  getAcademicsByStudent,
  getAttendanceByStudent,
  getProgressByStudent,
  getSessionsByStudent,
  getSurveyResultsByStudent,
  getAchievementsByStudent,
  getSmartGoalsByStudent,
  getSelfAssessmentsByStudent,
} from "./storage";

import {
  analyticsCache,
  memoize,
  performanceMonitor,
} from "./analytics-cache";

// =================== TYP TANIMLARI ===================

export interface StudentAnalytics {
  studentId: string;
  academicTrend: number; // -1 to 1 (düşüş/yükseliş)
  attendanceRate: number; // 0 to 1
  studyConsistency: number; // 0 to 1
  riskScore: number; // 0 to 1 (yüksek=riskli)
  predictedSuccess: number; // 0 to 1
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface ClassComparison {
  className: string;
  studentCount: number;
  averageGPA: number;
  attendanceRate: number;
  riskDistribution: { düşük: number; orta: number; yüksek: number };
  topPerformers: string[];
  atRiskStudents: string[];
}

export interface ProgressTrend {
  date: string;
  value: number;
  type: 'academic' | 'attendance' | 'study' | 'wellbeing';
}

export interface EarlyWarning {
  studentId: string;
  studentName: string;
  warningType: 'attendance' | 'academic' | 'behavioral' | 'wellbeing';
  severity: 'düşük' | 'orta' | 'yüksek' | 'kritik';
  message: string;
  recommendations: string[];
  since: string;
  priority: number;
}

// =================== İSTATİSTİKSEL HESAPLAMALAR ===================

export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

export function calculateStandardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = calculateMean(values);
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  return Math.sqrt(calculateMean(squaredDiffs));
}

export function calculateTrend(values: number[]): number {
  if (values.length < 2) return 0;
  
  const n = values.length;
  const x = Array.from({length: n}, (_, i) => i + 1);
  const y = values;
  
  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = y.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
  const sumXX = x.reduce((sum, val) => sum + val * val, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  
  // Normalleştir (-1 ile 1 arasında)
  return Math.max(-1, Math.min(1, slope / Math.max(...values)));
}

export function calculatePercentile(values: number[], percentile: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = (percentile / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  
  if (lower === upper) return sorted[lower];
  
  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

// =================== VERİ İŞLEME FONKSİYONLARI ===================

export function getStudentPerformanceData(studentId: string) {
  const academics = getAcademicsByStudent(studentId);
  const attendance = getAttendanceByStudent(studentId);
  const topicProgress = getProgressByStudent(studentId);
  const studySessions = getSessionsByStudent(studentId);
  const surveys = getSurveyResultsByStudent(studentId);
  const achievements = getAchievementsByStudent(studentId);
  const goals = getSmartGoalsByStudent(studentId);
  const assessments = getSelfAssessmentsByStudent(studentId);

  return {
    academics,
    attendance,
    topicProgress,
    studySessions,
    surveys,
    achievements,
    goals,
    assessments,
  };
}

export function calculateAttendanceRate(attendance: AttendanceRecord[]): number {
  if (attendance.length === 0) return 1;
  const presentCount = attendance.filter(a => a.status === "Var").length;
  return presentCount / attendance.length;
}

export function calculateAcademicTrend(academics: AcademicRecord[]): number {
  if (academics.length < 2) return 0;
  
  const gpaValues = academics
    .filter(a => a.gpa !== undefined)
    .sort((a, b) => a.term.localeCompare(b.term))
    .map(a => a.gpa!);
    
  return calculateTrend(gpaValues);
}

export function calculateStudyConsistency(sessions: StudySession[]): number {
  if (sessions.length === 0) return 0;

  // Son 30 gün için çalışma tutarlılığını hesapla
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentSessions = sessions.filter(s => 
    new Date(s.date) >= thirtyDaysAgo
  );

  if (recentSessions.length === 0) return 0;

  // Günlük çalışma süreleri
  const dailyStudyTime = new Map<string, number>();
  
  recentSessions.forEach(session => {
    const date = session.date.split('T')[0];
    const current = dailyStudyTime.get(date) || 0;
    dailyStudyTime.set(date, current + (session.minutes || 0));
  });

  const studyDays = dailyStudyTime.size;
  const totalDays = 30;
  
  // Tutarlılık = çalışılan gün sayısı / toplam gün sayısı
  return Math.min(1, studyDays / totalDays);
}

// =================== RİSK DEĞERLENDİRMESİ ===================

// Optimized version with caching
function _calculateRiskScore(studentId: string): number {
  const data = getStudentPerformanceData(studentId);
  const student = loadStudents().find(s => s.id === studentId);
  
  if (!student) return 0;

  let riskScore = 0;
  let factors = 0;

  // Devamsızlık riski
  const attendanceRate = calculateAttendanceRate(data.attendance);
  if (attendanceRate < 0.8) {
    riskScore += (0.8 - attendanceRate) * 1.5; // %80 altı kritik
    factors++;
  }

  // Akademik performans riski
  const academicTrend = calculateAcademicTrend(data.academics);
  if (academicTrend < -0.3) {
    riskScore += Math.abs(academicTrend) * 1.2;
    factors++;
  }

  // Çalışma tutarlılığı riski
  const studyConsistency = calculateStudyConsistency(data.studySessions);
  if (studyConsistency < 0.5) {
    riskScore += (0.5 - studyConsistency) * 1.0;
    factors++;
  }

  // Mevcut risk seviyesi
  if (student.risk) {
    const riskMap = { "Düşük": 0.2, "Orta": 0.5, "Yüksek": 0.8 };
    riskScore += riskMap[student.risk] || 0;
    factors++;
  }

  // Son anket sonuçları (düşük puanlar risk faktörü)
  const recentSurveys = data.surveys.slice(-3);
  const lowScores = recentSurveys.filter(s => s.score && s.score < 50);
  if (lowScores.length > 0) {
    riskScore += (lowScores.length / recentSurveys.length) * 0.5;
    factors++;
  }

  // Normalleştir
  return factors > 0 ? Math.min(1, riskScore / factors) : 0;
}

// =================== PREDİKTİF ANALİZ ===================

// Optimized version with caching
function _predictStudentSuccess(studentId: string): number {
  const data = getStudentPerformanceData(studentId);
  const student = loadStudents().find(s => s.id === studentId);
  
  if (!student) return 0.5;

  let successScore = 0.5; // Başlangıç değeri
  let weightedFactors = 0;

  // Akademik performans trendi (ağırlık: 0.3)
  const academicTrend = calculateAcademicTrend(data.academics);
  successScore += academicTrend * 0.3;
  weightedFactors += 0.3;

  // Devamsızlık oranı (ağırlık: 0.25)
  const attendanceRate = calculateAttendanceRate(data.attendance);
  successScore += attendanceRate * 0.25;
  weightedFactors += 0.25;

  // Çalışma tutarlılığı (ağırlık: 0.2)
  const studyConsistency = calculateStudyConsistency(data.studySessions);
  successScore += studyConsistency * 0.2;
  weightedFactors += 0.2;

  // Başarı oranı (tamamlanan konular) (ağırlık: 0.15)
  const completedTopics = data.topicProgress.filter(tp => tp.completed).length;
  const totalTopics = data.topicProgress.length;
  const completionRate = totalTopics > 0 ? completedTopics / totalTopics : 0.5;
  successScore += completionRate * 0.15;
  weightedFactors += 0.15;

  // Hedef belirleme ve takip (ağırlık: 0.1)
  const activeGoals = data.goals.filter(g => 
    g.status === "Başladı" || g.status === "Devam"
  ).length;
  const goalFactor = Math.min(1, activeGoals / 3); // 3+ aktif hedef ideal
  successScore += goalFactor * 0.1;
  weightedFactors += 0.1;

  // Normalleştir ve 0-1 arasında tut
  return Math.max(0, Math.min(1, successScore));
}

// =================== SINIF KARŞILAŞTIRMALARI ===================

// Optimized version with caching
function _generateClassComparisons(): ClassComparison[] {
  const students = loadStudents();
  const classGroups = new Map<string, Student[]>();

  // Öğrencileri sınıfa göre grupla
  students.forEach(student => {
    const className = student.sinif || "Belirtilmemiş";
    if (!classGroups.has(className)) {
      classGroups.set(className, []);
    }
    classGroups.get(className)!.push(student);
  });

  const comparisons: ClassComparison[] = [];

  classGroups.forEach((classStudents, className) => {
    const studentIds = classStudents.map(s => s.id);
    
    // GPA ortalaması hesapla
    const allGPAs: number[] = [];
    studentIds.forEach(id => {
      const academics = getAcademicsByStudent(id);
      const recentGPA = academics
        .filter(a => a.gpa !== undefined)
        .sort((a, b) => b.term.localeCompare(a.term))[0];
      if (recentGPA) allGPAs.push(recentGPA.gpa!);
    });

    // Devamsızlık oranı hesapla
    const attendanceRates = studentIds.map(id => 
      calculateAttendanceRate(getAttendanceByStudent(id))
    );
    const avgAttendance = calculateMean(attendanceRates);

    // Risk dağılımı
    const riskCounts = { düşük: 0, orta: 0, yüksek: 0 };
    classStudents.forEach(student => {
      const risk = student.risk || "Düşük";
      riskCounts[risk.toLowerCase() as keyof typeof riskCounts]++;
    });

    // En başarılı öğrenciler
    const studentScores = studentIds.map(id => ({
      id,
      name: classStudents.find(s => s.id === id)!.ad + " " + 
            classStudents.find(s => s.id === id)!.soyad,
      score: predictStudentSuccess(id)
    }));

    const topPerformers = studentScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(s => s.name);

    const atRiskStudents = studentScores
      .filter(s => s.score < 0.4)
      .sort((a, b) => a.score - b.score)
      .slice(0, 5)
      .map(s => s.name);

    comparisons.push({
      className,
      studentCount: classStudents.length,
      averageGPA: calculateMean(allGPAs),
      attendanceRate: avgAttendance,
      riskDistribution: riskCounts,
      topPerformers,
      atRiskStudents,
    });
  });

  return comparisons.sort((a, b) => a.className.localeCompare(b.className));
}

// =================== ERKEN UYARI SİSTEMİ ===================

// Optimized version with caching  
function _generateEarlyWarnings(): EarlyWarning[] {
  const students = loadStudents();
  const warnings: EarlyWarning[] = [];

  students.forEach(student => {
    const data = getStudentPerformanceData(student.id);
    const fullName = `${student.ad} ${student.soyad}`;

    // Devamsızlık uyarıları
    const attendanceRate = calculateAttendanceRate(data.attendance);
    if (attendanceRate < 0.7) {
      warnings.push({
        studentId: student.id,
        studentName: fullName,
        warningType: 'attendance',
        severity: attendanceRate < 0.5 ? 'kritik' : 'yüksek',
        message: `Devamsızlık oranı %${Math.round((1-attendanceRate) * 100)}`,
        recommendations: [
          'Veli ile acil görüşme planla',
          'Devamsızlık sebeplerini araştır',
          'Okula uyum programı değerlendir'
        ],
        since: new Date().toISOString(),
        priority: attendanceRate < 0.5 ? 1 : 2
      });
    }

    // Akademik performans uyarıları
    const academicTrend = calculateAcademicTrend(data.academics);
    if (academicTrend < -0.4) {
      warnings.push({
        studentId: student.id,
        studentName: fullName,
        warningType: 'academic',
        severity: academicTrend < -0.7 ? 'kritik' : 'yüksek',
        message: `Akademik performansta ciddi düşüş`,
        recommendations: [
          'Bireysel akademik destek planla',
          'Öğrenme güçlüklerini değerlendir',
          'Ders programını gözden geçir'
        ],
        since: new Date().toISOString(),
        priority: academicTrend < -0.7 ? 1 : 2
      });
    }

    // Çalışma tutarlılığı uyarıları
    const studyConsistency = calculateStudyConsistency(data.studySessions);
    if (studyConsistency < 0.3) {
      warnings.push({
        studentId: student.id,
        studentName: fullName,
        warningType: 'behavioral',
        severity: studyConsistency < 0.1 ? 'yüksek' : 'orta',
        message: `Çalışma rutini tutarsız`,
        recommendations: [
          'Çalışma planı oluştur',
          'Motivasyon artırıcı etkinlikler',
          'Zaman yönetimi eğitimi'
        ],
        since: new Date().toISOString(),
        priority: studyConsistency < 0.1 ? 2 : 3
      });
    }

    // Genel risk değerlendirmesi
    const riskScore = calculateRiskScore(student.id);
    if (riskScore > 0.7) {
      warnings.push({
        studentId: student.id,
        studentName: fullName,
        warningType: 'wellbeing',
        severity: 'kritik',
        message: `Çoklu risk faktörleri tespit edildi`,
        recommendations: [
          'Kapsamlı değerlendirme yap',
          'Multidisipliner ekip toplantısı',
          'Acil müdahale planı oluştur'
        ],
        since: new Date().toISOString(),
        priority: 1
      });
    }
  });

  return warnings.sort((a, b) => a.priority - b.priority);
}

// =================== OPTIMIZED EXPORTS ===================

// Memoized versions of expensive functions
export const generateClassComparisons = memoize(
  _generateClassComparisons,
  () => "class_comparisons"
);

export const generateEarlyWarnings = memoize(
  _generateEarlyWarnings,
  () => "early_warnings"
);

export const predictStudentSuccess = memoize(
  _predictStudentSuccess,
  (studentId: string) => `student_success_${studentId}`
);

export const calculateRiskScore = memoize(
  _calculateRiskScore,
  (studentId: string) => `risk_score_${studentId}`
);

// =================== İLERLEME TAKİBİ ===================

export function generateProgressTimeline(studentId: string, days: number = 90): ProgressTrend[] {
  const data = getStudentPerformanceData(studentId);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const timeline: ProgressTrend[] = [];

  // Akademik ilerleme
  data.academics.forEach(academic => {
    if (academic.gpa && new Date(academic.term) >= startDate) {
      timeline.push({
        date: academic.term,
        value: academic.gpa / 4.0, // 0-1 normalize
        type: 'academic'
      });
    }
  });

  // Devamsızlık trendi
  const weeklyAttendance = new Map<string, {present: number, total: number}>();
  data.attendance.forEach(att => {
    if (new Date(att.date) >= startDate) {
      const week = getWeekKey(new Date(att.date));
      if (!weeklyAttendance.has(week)) {
        weeklyAttendance.set(week, {present: 0, total: 0});
      }
      const weekData = weeklyAttendance.get(week)!;
      weekData.total++;
      if (att.status === "Var") weekData.present++;
    }
  });

  weeklyAttendance.forEach((data, week) => {
    timeline.push({
      date: week,
      value: data.present / data.total,
      type: 'attendance'
    });
  });

  // Çalışma aktivitesi
  const weeklyStudy = new Map<string, number>();
  data.studySessions.forEach(session => {
    if (new Date(session.date) >= startDate) {
      const week = getWeekKey(new Date(session.date));
      const current = weeklyStudy.get(week) || 0;
      weeklyStudy.set(week, current + (session.minutes || 0));
    }
  });

  weeklyStudy.forEach((minutes, week) => {
    timeline.push({
      date: week,
      value: Math.min(1, minutes / 1200), // 1200 dakika (20 saat) = %100
      type: 'study'
    });
  });

  return timeline.sort((a, b) => a.date.localeCompare(b.date));
}

function getWeekKey(date: Date): string {
  const year = date.getFullYear();
  const week = Math.ceil(((date.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

// =================== VERİ İHRACAT FONKSİYONLARI ===================

export function exportAnalyticsData(
  format: 'json' | 'csv' = 'json',
  options: {
    includePersonalData?: boolean;
    maxRecords?: number;
    filterByClass?: string;
    filterByRisk?: string;
  } = {}
) {
  const students = loadStudents();
  let filteredStudents = students;
  
  // Apply filters
  if (options.filterByClass) {
    filteredStudents = filteredStudents.filter(s => s.sinif === options.filterByClass);
  }
  
  if (options.maxRecords) {
    filteredStudents = filteredStudents.slice(0, options.maxRecords);
  }
  
  const analytics = filteredStudents.map(student => ({
    studentId: student.id,
    name: options.includePersonalData ? `${student.ad} ${student.soyad}` : `Öğrenci ${student.id.slice(-4)}`,
    class: student.sinif,
    risk: student.risk,
    attendanceRate: calculateAttendanceRate(getAttendanceByStudent(student.id)),
    academicTrend: calculateAcademicTrend(getAcademicsByStudent(student.id)),
    studyConsistency: calculateStudyConsistency(getSessionsByStudent(student.id)),
    riskScore: calculateRiskScore(student.id),
    predictedSuccess: predictStudentSuccess(student.id),
  }));

  if (format === 'json') {
    return JSON.stringify(analytics, null, 2);
  } else {
    // CSV format
    const headers = Object.keys(analytics[0]).join(',');
    const rows = analytics.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  }
}