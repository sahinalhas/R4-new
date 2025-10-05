import getDatabase from '../../../lib/database.js';
import type { HomeVisit } from '../types/index.js';

let statements: any = null;
let isInitialized = false;

function ensureInitialized(): void {
  if (isInitialized && statements) return;
  
  const db = getDatabase();
  
  statements = {
    getHomeVisitsByStudent: db.prepare('SELECT * FROM home_visits WHERE studentId = ? ORDER BY date DESC'),
    insertHomeVisit: db.prepare(`
      INSERT INTO home_visits (id, studentId, date, time, visitDuration, visitors, familyPresent, 
                              homeEnvironment, familyInteraction, observations, recommendations, 
                              concerns, resources, followUpActions, nextVisitPlanned, notes, 
                              createdBy, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
  };
  
  isInitialized = true;
}

export function getHomeVisitsByStudent(studentId: string): any[] {
  try {
    ensureInitialized();
    const visits = statements.getHomeVisitsByStudent.all(studentId);
    
    return visits.map((v: any) => ({
      ...v,
      visitors: v.visitors ? JSON.parse(v.visitors) : [],
      familyPresent: v.familyPresent ? JSON.parse(v.familyPresent) : []
    }));
  } catch (error) {
    console.error('Database error in getHomeVisitsByStudent:', error);
    throw error;
  }
}

export function insertHomeVisit(visit: HomeVisit): void {
  try {
    ensureInitialized();
    
    const visitorsJson = JSON.stringify(visit.visitors || []);
    const familyPresentJson = JSON.stringify(visit.familyPresent || []);
    
    statements.insertHomeVisit.run(
      visit.id,
      visit.studentId,
      visit.date,
      visit.time,
      visit.visitDuration,
      visitorsJson,
      familyPresentJson,
      visit.homeEnvironment,
      visit.familyInteraction,
      visit.observations,
      visit.recommendations,
      visit.concerns,
      visit.resources,
      visit.followUpActions,
      visit.nextVisitPlanned,
      visit.notes,
      visit.createdBy,
      visit.createdAt
    );
  } catch (error) {
    console.error('Error inserting home visit:', error);
    throw error;
  }
}

export function updateHomeVisit(id: string, updates: any): void {
  try {
    ensureInitialized();
    const db = getDatabase();
    
    const updatesWithStringifiedArrays = { ...updates };
    if (updates.visitors) {
      updatesWithStringifiedArrays.visitors = JSON.stringify(updates.visitors);
    }
    if (updates.familyPresent) {
      updatesWithStringifiedArrays.familyPresent = JSON.stringify(updates.familyPresent);
    }
    
    const allowedFields = ['date', 'time', 'visitDuration', 'visitors', 'familyPresent', 
                          'homeEnvironment', 'familyInteraction', 'observations', 'recommendations', 
                          'concerns', 'resources', 'followUpActions', 'nextVisitPlanned', 'notes'];
    const fields = Object.keys(updatesWithStringifiedArrays).filter(key => allowedFields.includes(key));
    
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updatesWithStringifiedArrays[field]);
    values.push(id);
    
    db.prepare(`UPDATE home_visits SET ${setClause} WHERE id = ?`).run(...values);
  } catch (error) {
    console.error('Error updating home visit:', error);
    throw error;
  }
}
