import getDatabase from '../../../lib/database.js';
import type { RiskFactors } from '../../../../shared/types.js';

let statements: any = null;
let isInitialized = false;

function ensureInitialized(): void {
  if (isInitialized && statements) return;
  
  const db = getDatabase();
  
  statements = {
    getRiskFactorsByStudent: db.prepare('SELECT * FROM risk_factors WHERE studentId = ? ORDER BY assessmentDate DESC'),
    getLatestRiskFactorsByStudent: db.prepare('SELECT * FROM risk_factors WHERE studentId = ? ORDER BY assessmentDate DESC LIMIT 1'),
    getAllHighRiskStudents: db.prepare(`
      SELECT rf.*, s.name, s.className 
      FROM risk_factors rf
      JOIN students s ON rf.studentId = s.id
      WHERE rf.overallRiskScore >= 70 OR 
            rf.academicRiskLevel IN ('YÜKSEK', 'KRİTİK') OR
            rf.behavioralRiskLevel IN ('YÜKSEK', 'KRİTİK')
      ORDER BY rf.overallRiskScore DESC, rf.assessmentDate DESC
    `),
    insertRiskFactors: db.prepare(`
      INSERT INTO risk_factors (id, studentId, assessmentDate, academicRiskLevel, behavioralRiskLevel,
                               attendanceRiskLevel, socialEmotionalRiskLevel, dropoutRisk, academicFactors,
                               behavioralFactors, attendanceFactors, socialFactors, familyFactors,
                               protectiveFactors, interventionsNeeded, alertsGenerated, followUpActions,
                               assignedCounselor, parentNotified, parentNotificationDate, overallRiskScore,
                               status, nextAssessmentDate, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    deleteRiskFactors: db.prepare('DELETE FROM risk_factors WHERE id = ?')
  };
  
  isInitialized = true;
}

export function getRiskFactorsByStudent(studentId: string): RiskFactors[] {
  try {
    ensureInitialized();
    return statements.getRiskFactorsByStudent.all(studentId) as RiskFactors[];
  } catch (error) {
    console.error('Database error in getRiskFactorsByStudent:', error);
    throw error;
  }
}

export function getLatestRiskFactorsByStudent(studentId: string): RiskFactors | null {
  try {
    ensureInitialized();
    const result = statements.getLatestRiskFactorsByStudent.get(studentId);
    return result || null;
  } catch (error) {
    console.error('Database error in getLatestRiskFactorsByStudent:', error);
    throw error;
  }
}

export function getAllHighRiskStudents(): any[] {
  try {
    ensureInitialized();
    return statements.getAllHighRiskStudents.all();
  } catch (error) {
    console.error('Database error in getAllHighRiskStudents:', error);
    throw error;
  }
}

export function insertRiskFactors(record: RiskFactors): void {
  try {
    ensureInitialized();
    statements.insertRiskFactors.run(
      record.id,
      record.studentId,
      record.assessmentDate,
      record.academicRiskLevel || null,
      record.behavioralRiskLevel || null,
      record.attendanceRiskLevel || null,
      record.socialEmotionalRiskLevel || null,
      record.dropoutRisk || null,
      record.academicFactors || null,
      record.behavioralFactors || null,
      record.attendanceFactors || null,
      record.socialFactors || null,
      record.familyFactors || null,
      record.protectiveFactors || null,
      record.interventionsNeeded || null,
      record.alertsGenerated || null,
      record.followUpActions || null,
      record.assignedCounselor || null,
      record.parentNotified ? 1 : 0,
      record.parentNotificationDate || null,
      record.overallRiskScore || null,
      record.status || 'DEVAM_EDEN',
      record.nextAssessmentDate || null,
      record.notes || null
    );
  } catch (error) {
    console.error('Database error in insertRiskFactors:', error);
    throw error;
  }
}

export function updateRiskFactors(id: string, updates: any): void {
  try {
    ensureInitialized();
    const db = getDatabase();
    
    const allowedFields = ['assessmentDate', 'academicRiskLevel', 'behavioralRiskLevel', 'attendanceRiskLevel',
                          'socialEmotionalRiskLevel', 'dropoutRisk', 'academicFactors', 'behavioralFactors',
                          'attendanceFactors', 'socialFactors', 'familyFactors', 'protectiveFactors',
                          'interventionsNeeded', 'alertsGenerated', 'followUpActions', 'assignedCounselor',
                          'parentNotified', 'parentNotificationDate', 'overallRiskScore', 'status',
                          'nextAssessmentDate', 'notes'];
    
    const fields = Object.keys(updates).filter(key => allowedFields.includes(key));
    
    if (fields.length > 0) {
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => updates[field]);
      values.push(id);
      
      db.prepare(`UPDATE risk_factors SET ${setClause} WHERE id = ?`).run(...values);
    }
  } catch (error) {
    console.error('Database error in updateRiskFactors:', error);
    throw error;
  }
}

export function deleteRiskFactors(id: string): void {
  try {
    ensureInitialized();
    statements.deleteRiskFactors.run(id);
  } catch (error) {
    console.error('Database error in deleteRiskFactors:', error);
    throw error;
  }
}
