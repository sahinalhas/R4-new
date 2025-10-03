import getDatabase from '../../../lib/database.js';
import type { BehaviorIncident } from '../types/index.js';

let statements: any = null;
let isInitialized = false;

function ensureInitialized(): void {
  if (isInitialized && statements) return;
  
  const db = getDatabase();
  
  statements = {
    getBehaviorIncidentsByStudent: db.prepare('SELECT * FROM behavior_incidents WHERE studentId = ? ORDER BY incidentDate DESC, incidentTime DESC'),
    getOverallStats: db.prepare(`
      SELECT 
        COUNT(*) as totalIncidents,
        SUM(CASE WHEN behaviorType = 'OLUMLU' THEN 1 ELSE 0 END) as positiveCount,
        SUM(CASE WHEN behaviorType IN ('CİDDİ', 'ÇOK_CİDDİ') THEN 1 ELSE 0 END) as seriousCount
      FROM behavior_incidents
      WHERE studentId = ?
    `),
    getCategoryStats: db.prepare(`
      SELECT 
        behaviorCategory,
        COUNT(*) as categoryCount
      FROM behavior_incidents
      WHERE studentId = ?
      GROUP BY behaviorCategory
    `),
    insertBehaviorIncident: db.prepare(`
      INSERT INTO behavior_incidents (id, studentId, incidentDate, incidentTime, location, behaviorType,
                                     behaviorCategory, description, antecedent, consequence, duration,
                                     intensity, frequency, witnessedBy, othersInvolved, interventionUsed,
                                     interventionEffectiveness, parentNotified, parentNotificationMethod,
                                     parentResponse, followUpRequired, followUpDate, followUpNotes,
                                     adminNotified, consequenceGiven, supportProvided, triggerAnalysis,
                                     patternNotes, positiveAlternative, status, recordedBy, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    deleteBehaviorIncident: db.prepare('DELETE FROM behavior_incidents WHERE id = ?')
  };
  
  isInitialized = true;
}

export function getBehaviorIncidentsByStudent(studentId: string): BehaviorIncident[] {
  try {
    ensureInitialized();
    return statements.getBehaviorIncidentsByStudent.all(studentId) as BehaviorIncident[];
  } catch (error) {
    console.error('Database error in getBehaviorIncidentsByStudent:', error);
    throw error;
  }
}

export function getBehaviorIncidentsByDateRange(studentId: string, startDate?: string, endDate?: string): BehaviorIncident[] {
  try {
    ensureInitialized();
    const db = getDatabase();
    
    let query = 'SELECT * FROM behavior_incidents WHERE studentId = ?';
    const params: any[] = [studentId];
    
    if (startDate) {
      query += ' AND incidentDate >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND incidentDate <= ?';
      params.push(endDate);
    }
    
    query += ' ORDER BY incidentDate DESC, incidentTime DESC';
    
    return db.prepare(query).all(...params) as BehaviorIncident[];
  } catch (error) {
    console.error('Database error in getBehaviorIncidentsByDateRange:', error);
    throw error;
  }
}

export function getBehaviorStatsByStudent(studentId: string): any {
  try {
    ensureInitialized();
    const overallStats = statements.getOverallStats.get(studentId);
    const categoryStats = statements.getCategoryStats.all(studentId);
    
    return {
      overall: overallStats,
      byCategory: categoryStats
    };
  } catch (error) {
    console.error('Database error in getBehaviorStatsByStudent:', error);
    throw error;
  }
}

export function insertBehaviorIncident(incident: BehaviorIncident): void {
  try {
    ensureInitialized();
    statements.insertBehaviorIncident.run(
      incident.id,
      incident.studentId,
      incident.incidentDate,
      incident.incidentTime || null,
      incident.location || null,
      incident.behaviorType || null,
      incident.behaviorCategory || null,
      incident.description || null,
      incident.antecedent || null,
      incident.consequence || null,
      incident.duration || null,
      incident.intensity || null,
      incident.frequency || null,
      incident.witnessedBy || null,
      incident.othersInvolved || null,
      incident.interventionUsed || null,
      incident.interventionEffectiveness || null,
      incident.parentNotified ? 1 : 0,
      incident.parentNotificationMethod || null,
      incident.parentResponse || null,
      incident.followUpRequired ? 1 : 0,
      incident.followUpDate || null,
      incident.followUpNotes || null,
      incident.adminNotified ? 1 : 0,
      incident.consequenceGiven || null,
      incident.supportProvided || null,
      incident.triggerAnalysis || null,
      incident.patternNotes || null,
      incident.positiveAlternative || null,
      incident.status || 'AÇIK',
      incident.recordedBy || null,
      incident.notes || null
    );
  } catch (error) {
    console.error('Database error in insertBehaviorIncident:', error);
    throw error;
  }
}

export function updateBehaviorIncident(id: string, updates: any): void {
  try {
    ensureInitialized();
    const db = getDatabase();
    
    const allowedFields = ['incidentDate', 'incidentTime', 'location', 'behaviorType', 'behaviorCategory',
                          'description', 'antecedent', 'consequence', 'duration', 'intensity', 'frequency',
                          'witnessedBy', 'othersInvolved', 'interventionUsed', 'interventionEffectiveness',
                          'parentNotified', 'parentNotificationMethod', 'parentResponse', 'followUpRequired',
                          'followUpDate', 'followUpNotes', 'adminNotified', 'consequenceGiven', 'supportProvided',
                          'triggerAnalysis', 'patternNotes', 'positiveAlternative', 'status', 'notes'];
    
    const fields = Object.keys(updates).filter(key => allowedFields.includes(key));
    
    if (fields.length > 0) {
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => updates[field]);
      values.push(id);
      
      db.prepare(`UPDATE behavior_incidents SET ${setClause} WHERE id = ?`).run(...values);
    }
  } catch (error) {
    console.error('Database error in updateBehaviorIncident:', error);
    throw error;
  }
}

export function deleteBehaviorIncident(id: string): void {
  try {
    ensureInitialized();
    statements.deleteBehaviorIncident.run(id);
  } catch (error) {
    console.error('Database error in deleteBehaviorIncident:', error);
    throw error;
  }
}
