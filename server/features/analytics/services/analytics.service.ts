import { loadStudents } from '../../students/repository/students.repository.js';
import { getExamResultsByStudent } from '../../exams/repository/exams.repository.js';
import { getAttendanceByStudent } from '../../attendance/repository/attendance.repository.js';
import { getStudentSessionStats } from '../../counseling-sessions/services/analytics.service.js';
import { getCachedData, setCachedData, cleanupExpiredCache } from '../repository/cache.repository.js';

interface StudentAnalytics {
  studentId: string;
  studentName: string;
  className: string;
  riskScore: number;
  riskLevel: 'Düşük' | 'Orta' | 'Yüksek' | 'Kritik';
  successProbability: number;
  attendanceRate: number;
  academicTrend: number;
  studyConsistency: number;
  earlyWarnings: EarlyWarning[];
}

interface EarlyWarning {
  studentName: string;
  warningType: 'attendance' | 'academic' | 'behavioral';
  severity: 'düşük' | 'orta' | 'yüksek' | 'kritik';
  message: string;
  priority: number;
}

interface ReportsOverview {
  totalStudents: number;
  riskDistribution: {
    düşük: number;
    orta: number;
    yüksek: number;
    kritik: number;
  };
  classComparisons: ClassComparison[];
  topWarnings: EarlyWarning[];
  studentAnalytics: StudentAnalytics[];
}

interface ClassComparison {
  className: string;
  studentCount: number;
  averageGPA: number;
  attendanceRate: number;
  riskDistribution: { düşük: number; orta: number; yüksek: number };
}

function calculateAttendanceRate(studentId: string): number {
  const attendance = getAttendanceByStudent(studentId);
  if (attendance.length === 0) return 100;
  
  const present = attendance.filter(a => a.status === 'Var').length;
  return Math.round((present / attendance.length) * 100);
}

function calculateAcademicTrend(exams: any[]): number {
  if (exams.length < 2) return 0;
  
  const scores = exams.map(e => e.score || 0).slice(0, 5);
  
  let trend = 0;
  for (let i = 1; i < scores.length; i++) {
    trend += scores[i] - scores[i - 1];
  }
  
  return Math.round(trend / (scores.length - 1));
}

function calculateRiskScore(attendanceRate: number, academicTrend: number, sessionCount: number): number {
  let risk = 0;
  
  if (attendanceRate < 70) risk += 40;
  else if (attendanceRate < 85) risk += 20;
  else if (attendanceRate < 95) risk += 5;
  
  if (academicTrend < -10) risk += 30;
  else if (academicTrend < -5) risk += 15;
  else if (academicTrend < 0) risk += 5;
  
  if (sessionCount > 5) risk += 20;
  else if (sessionCount > 3) risk += 10;
  
  return Math.min(100, risk);
}

function getRiskLevel(riskScore: number): 'Düşük' | 'Orta' | 'Yüksek' | 'Kritik' {
  if (riskScore >= 70) return 'Kritik';
  if (riskScore >= 50) return 'Yüksek';
  if (riskScore >= 30) return 'Orta';
  return 'Düşük';
}

function generateEarlyWarnings(
  studentName: string,
  attendanceRate: number,
  academicTrend: number,
  sessionCount: number
): EarlyWarning[] {
  const warnings: EarlyWarning[] = [];
  
  if (attendanceRate < 70) {
    warnings.push({
      studentName,
      warningType: 'attendance',
      severity: 'kritik',
      message: 'Devamsızlık oranı kritik seviyede',
      priority: 10
    });
  } else if (attendanceRate < 85) {
    warnings.push({
      studentName,
      warningType: 'attendance',
      severity: 'yüksek',
      message: 'Devamsızlık oranı yüksek',
      priority: 7
    });
  }
  
  if (academicTrend < -10) {
    warnings.push({
      studentName,
      warningType: 'academic',
      severity: 'kritik',
      message: 'Akademik performansta ciddi düşüş',
      priority: 9
    });
  } else if (academicTrend < -5) {
    warnings.push({
      studentName,
      warningType: 'academic',
      severity: 'yüksek',
      message: 'Akademik performansta düşüş',
      priority: 6
    });
  }
  
  if (sessionCount > 5) {
    warnings.push({
      studentName,
      warningType: 'behavioral',
      severity: 'yüksek',
      message: 'Sık görüşme ihtiyacı',
      priority: 5
    });
  }
  
  return warnings;
}

export async function getReportsOverview(): Promise<ReportsOverview> {
  cleanupExpiredCache();
  
  const cacheKey = 'reports_overview';
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    return JSON.parse(cached.data);
  }
  
  const students = loadStudents();
  const studentAnalytics: StudentAnalytics[] = [];
  const classMap = new Map<string, { students: StudentAnalytics[]; totalGPA: number; totalAttendance: number }>();
  
  const riskDistribution = { düşük: 0, orta: 0, yüksek: 0, kritik: 0 };
  const allWarnings: EarlyWarning[] = [];
  
  for (const student of students) {
    const exams = getExamResultsByStudent(student.id);
    const attendanceRate = calculateAttendanceRate(student.id);
    const academicTrend = calculateAcademicTrend(exams);
    const sessionStats = getStudentSessionStats(student.id);
    
    const riskScore = calculateRiskScore(attendanceRate, academicTrend, sessionStats.totalSessions);
    const riskLevel = getRiskLevel(riskScore);
    const earlyWarnings = generateEarlyWarnings(student.name, attendanceRate, academicTrend, sessionStats.totalSessions);
    
    const avgScore = exams.length > 0 ? exams.reduce((sum, e) => sum + (e.score || 0), 0) / exams.length : 0;
    
    const analytics: StudentAnalytics = {
      studentId: student.id,
      studentName: student.name,
      className: student.className || 'Belirtilmemiş',
      riskScore,
      riskLevel,
      successProbability: Math.max(0, 100 - riskScore),
      attendanceRate,
      academicTrend,
      studyConsistency: sessionStats.totalSessions > 0 ? 70 : 50,
      earlyWarnings
    };
    
    studentAnalytics.push(analytics);
    
    riskDistribution[riskLevel.toLowerCase() as keyof typeof riskDistribution]++;
    allWarnings.push(...earlyWarnings);
    
    if (student.className) {
      if (!classMap.has(student.className)) {
        classMap.set(student.className, { students: [], totalGPA: 0, totalAttendance: 0 });
      }
      const classData = classMap.get(student.className)!;
      classData.students.push(analytics);
      classData.totalGPA += avgScore;
      classData.totalAttendance += attendanceRate;
    }
  }
  
  const classComparisons: ClassComparison[] = Array.from(classMap.entries()).map(([className, data]) => ({
    className,
    studentCount: data.students.length,
    averageGPA: Math.round((data.totalGPA / data.students.length) * 100) / 100,
    attendanceRate: Math.round(data.totalAttendance / data.students.length),
    riskDistribution: {
      düşük: data.students.filter(s => s.riskLevel === 'Düşük').length,
      orta: data.students.filter(s => s.riskLevel === 'Orta').length,
      yüksek: data.students.filter(s => s.riskLevel === 'Yüksek' || s.riskLevel === 'Kritik').length
    }
  }));
  
  const topWarnings = allWarnings
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 10);
  
  const result: ReportsOverview = {
    totalStudents: students.length,
    riskDistribution,
    classComparisons,
    topWarnings,
    studentAnalytics
  };
  
  setCachedData(cacheKey, 'reports_overview', result, { ttlMinutes: 30 });
  
  return result;
}

export async function getStudentAnalytics(studentId: string): Promise<StudentAnalytics | null> {
  const cacheKey = `student_analytics_${studentId}`;
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    return JSON.parse(cached.data);
  }
  
  const students = loadStudents();
  const student = students.find(s => s.id === studentId);
  
  if (!student) return null;
  
  const exams = getExamResultsByStudent(student.id);
  const attendanceRate = calculateAttendanceRate(student.id);
  const academicTrend = calculateAcademicTrend(exams);
  const sessionStats = getStudentSessionStats(student.id);
  
  const riskScore = calculateRiskScore(attendanceRate, academicTrend, sessionStats.totalSessions);
  const riskLevel = getRiskLevel(riskScore);
  const earlyWarnings = generateEarlyWarnings(student.name, attendanceRate, academicTrend, sessionStats.totalSessions);
  
  const analytics: StudentAnalytics = {
    studentId: student.id,
    studentName: student.name,
    className: student.className || 'Belirtilmemiş',
    riskScore,
    riskLevel,
    successProbability: Math.max(0, 100 - riskScore),
    attendanceRate,
    academicTrend,
    studyConsistency: sessionStats.totalSessions > 0 ? 70 : 50,
    earlyWarnings
  };
  
  setCachedData(cacheKey, 'student_analytics', analytics, { ttlMinutes: 15 });
  
  return analytics;
}

export function invalidateAnalyticsCache(): void {
  const { invalidateCache } = require('../repository/cache.repository.js');
  invalidateCache();
}
