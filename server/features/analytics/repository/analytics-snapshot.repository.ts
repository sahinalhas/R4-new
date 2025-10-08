import { getDatabase } from '../../../lib/database/connection.js';
import type { StudentAnalytics, EarlyWarning } from '../services/analytics.service.js';

export interface SnapshotData {
  student_id: string;
  student_name: string;
  class_name: string | null;
  risk_score: number;
  risk_level: string;
  success_probability: number;
  attendance_rate: number;
  academic_trend: number;
  study_consistency: number;
  avg_exam_score: number;
  total_sessions: number;
  early_warnings: string | null;
  last_updated: string;
}

export function refreshAnalyticsSnapshot(): number {
  const db = getDatabase();
  
  const query = `
    WITH student_exams AS (
      SELECT 
        s.id as student_id,
        AVG(CAST(json_extract(exam.value, '$.score') AS REAL)) as avg_score,
        COUNT(*) as exam_count,
        json_group_array(
          json_object(
            'score', CAST(json_extract(exam.value, '$.score') AS REAL),
            'date', json_extract(exam.value, '$.date')
          )
        ) as exam_data
      FROM students s
      LEFT JOIN academic_records ar ON s.id = ar.studentId
      LEFT JOIN json_each(ar.exams) exam ON exam.value IS NOT NULL
      GROUP BY s.id
    ),
    student_attendance AS (
      SELECT 
        studentId as student_id,
        COUNT(*) as total_records,
        SUM(CASE WHEN status = 'Var' THEN 1 ELSE 0 END) as present_count
      FROM attendance
      GROUP BY studentId
    ),
    student_sessions AS (
      SELECT 
        css.studentId as student_id,
        COUNT(DISTINCT cs.id) as session_count
      FROM counseling_session_students css
      JOIN counseling_sessions cs ON css.sessionId = cs.id
      GROUP BY css.studentId
    )
    SELECT 
      s.id as student_id,
      s.name as student_name,
      s.className as class_name,
      COALESCE(se.avg_score, 0) as avg_exam_score,
      COALESCE(se.exam_count, 0) as exam_count,
      se.exam_data,
      COALESCE(sa.total_records, 0) as attendance_total,
      COALESCE(sa.present_count, 0) as attendance_present,
      COALESCE(ss.session_count, 0) as total_sessions
    FROM students s
    LEFT JOIN student_exams se ON s.id = se.student_id
    LEFT JOIN student_attendance sa ON s.id = sa.student_id
    LEFT JOIN student_sessions ss ON s.id = ss.student_id
  `;
  
  const rows = db.prepare(query).all() as any[];
  
  const upsertStmt = db.prepare(`
    INSERT OR REPLACE INTO student_analytics_snapshot (
      student_id, student_name, class_name, risk_score, risk_level,
      success_probability, attendance_rate, academic_trend, study_consistency,
      avg_exam_score, total_sessions, early_warnings, last_updated
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);
  
  let updatedCount = 0;
  
  for (const row of rows) {
    const attendanceRate = row.attendance_total > 0 
      ? Math.round((row.attendance_present / row.attendance_total) * 100) 
      : 100;
    
    const academicTrend = calculateAcademicTrend(row.exam_data);
    const riskScore = calculateRiskScore(attendanceRate, academicTrend, row.total_sessions);
    const riskLevel = getRiskLevel(riskScore);
    const earlyWarnings = generateEarlyWarnings(row.student_name, attendanceRate, academicTrend, row.total_sessions);
    
    upsertStmt.run(
      row.student_id,
      row.student_name,
      row.class_name,
      riskScore,
      riskLevel,
      Math.max(0, 100 - riskScore),
      attendanceRate,
      academicTrend,
      row.total_sessions > 0 ? 70 : 50,
      row.avg_exam_score || 0,
      row.total_sessions,
      JSON.stringify(earlyWarnings)
    );
    
    updatedCount++;
  }
  
  return updatedCount;
}

export function getSnapshotData(studentId?: string): SnapshotData[] {
  const db = getDatabase();
  
  if (studentId) {
    const row = db.prepare(`
      SELECT * FROM student_analytics_snapshot WHERE student_id = ?
    `).get(studentId) as SnapshotData | undefined;
    
    return row ? [row] : [];
  }
  
  return db.prepare(`
    SELECT * FROM student_analytics_snapshot ORDER BY risk_score DESC
  `).all() as SnapshotData[];
}

export function snapshotToStudentAnalytics(snapshot: SnapshotData): StudentAnalytics {
  return {
    studentId: snapshot.student_id,
    studentName: snapshot.student_name,
    className: snapshot.class_name || 'Belirtilmemiş',
    riskScore: snapshot.risk_score,
    riskLevel: snapshot.risk_level as any,
    successProbability: snapshot.success_probability,
    attendanceRate: snapshot.attendance_rate,
    academicTrend: snapshot.academic_trend,
    studyConsistency: snapshot.study_consistency,
    earlyWarnings: snapshot.early_warnings ? JSON.parse(snapshot.early_warnings) : []
  };
}

function calculateAcademicTrend(examDataJson: string | null): number {
  if (!examDataJson) return 0;
  
  try {
    const exams = JSON.parse(examDataJson);
    if (!Array.isArray(exams) || exams.length < 2) return 0;
    
    const scores = exams
      .filter((e: any) => e && e.score != null)
      .map((e: any) => e.score)
      .slice(0, 5);
    
    if (scores.length < 2) return 0;
    
    let trend = 0;
    for (let i = 1; i < scores.length; i++) {
      trend += scores[i] - scores[i - 1];
    }
    
    return Math.round(trend / (scores.length - 1));
  } catch {
    return 0;
  }
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

function getRiskLevel(riskScore: number): string {
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
