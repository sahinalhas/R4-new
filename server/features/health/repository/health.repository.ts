import getDatabase from '../../../lib/database.js';
import type { HealthInfo } from '../../../../shared/types.js';

let statements: any = null;
let isInitialized = false;

function ensureInitialized(): void {
  if (isInitialized && statements) return;
  
  const db = getDatabase();
  
  statements = {
    getHealthInfoByStudent: db.prepare('SELECT * FROM health_info WHERE studentId = ?'),
    checkExistingByStudent: db.prepare('SELECT id FROM health_info WHERE studentId = ?'),
    insertHealthInfo: db.prepare(`
      INSERT INTO health_info (id, studentId, bloodType, chronicDiseases, allergies, medications, 
                              specialNeeds, medicalHistory, emergencyContact1Name, emergencyContact1Phone,
                              emergencyContact1Relation, emergencyContact2Name, emergencyContact2Phone,
                              emergencyContact2Relation, physicianName, physicianPhone, insuranceInfo,
                              vaccinations, dietaryRestrictions, physicalLimitations, mentalHealthNotes,
                              lastHealthCheckup, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    deleteHealthInfo: db.prepare('DELETE FROM health_info WHERE studentId = ?')
  };
  
  isInitialized = true;
}

export function getHealthInfoByStudent(studentId: string): HealthInfo | null {
  try {
    ensureInitialized();
    const result = statements.getHealthInfoByStudent.get(studentId);
    return result || null;
  } catch (error) {
    console.error('Database error in getHealthInfoByStudent:', error);
    throw error;
  }
}

export function checkExistingHealthInfo(studentId: string): any | null {
  try {
    ensureInitialized();
    return statements.checkExistingByStudent.get(studentId);
  } catch (error) {
    console.error('Database error in checkExistingHealthInfo:', error);
    throw error;
  }
}

export function insertHealthInfo(healthInfo: HealthInfo): void {
  try {
    ensureInitialized();
    statements.insertHealthInfo.run(
      healthInfo.id,
      healthInfo.studentId,
      healthInfo.bloodType || null,
      healthInfo.chronicDiseases || null,
      healthInfo.allergies || null,
      healthInfo.medications || null,
      healthInfo.specialNeeds || null,
      healthInfo.medicalHistory || null,
      healthInfo.emergencyContact1Name || null,
      healthInfo.emergencyContact1Phone || null,
      healthInfo.emergencyContact1Relation || null,
      healthInfo.emergencyContact2Name || null,
      healthInfo.emergencyContact2Phone || null,
      healthInfo.emergencyContact2Relation || null,
      healthInfo.physicianName || null,
      healthInfo.physicianPhone || null,
      healthInfo.insuranceInfo || null,
      healthInfo.vaccinations || null,
      healthInfo.dietaryRestrictions || null,
      healthInfo.physicalLimitations || null,
      healthInfo.mentalHealthNotes || null,
      healthInfo.lastHealthCheckup || null,
      healthInfo.notes || null
    );
  } catch (error) {
    console.error('Database error in insertHealthInfo:', error);
    throw error;
  }
}

export function updateHealthInfo(studentId: string, updates: any): void {
  try {
    ensureInitialized();
    const db = getDatabase();
    
    const allowedFields = ['bloodType', 'chronicDiseases', 'allergies', 'medications', 'specialNeeds',
                          'medicalHistory', 'emergencyContact1Name', 'emergencyContact1Phone', 
                          'emergencyContact1Relation', 'emergencyContact2Name', 'emergencyContact2Phone',
                          'emergencyContact2Relation', 'physicianName', 'physicianPhone', 'insuranceInfo',
                          'vaccinations', 'dietaryRestrictions', 'physicalLimitations', 'mentalHealthNotes',
                          'lastHealthCheckup', 'notes'];
    
    const fields = Object.keys(updates).filter(key => allowedFields.includes(key));
    
    if (fields.length > 0) {
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => updates[field]);
      values.push(studentId);
      
      db.prepare(`UPDATE health_info SET ${setClause} WHERE studentId = ?`).run(...values);
    }
  } catch (error) {
    console.error('Database error in updateHealthInfo:', error);
    throw error;
  }
}

export function deleteHealthInfo(studentId: string): void {
  try {
    ensureInitialized();
    statements.deleteHealthInfo.run(studentId);
  } catch (error) {
    console.error('Database error in deleteHealthInfo:', error);
    throw error;
  }
}
