import { Router, RequestHandler } from 'express';
import getDatabase from '../lib/database.js';

const router = Router();

export const getBehaviorIncidentsByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const incidents = db.prepare('SELECT * FROM behavior_incidents WHERE studentId = ? ORDER BY incidentDate DESC, incidentTime DESC').all(studentId);
    res.json(incidents);
  } catch (error) {
    console.error('Error fetching behavior incidents:', error);
    res.status(500).json({ error: 'Davranış kayıtları yüklenemedi' });
  }
};

export const getBehaviorIncidentsByDateRange: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;
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
    
    const incidents = db.prepare(query).all(...params);
    res.json(incidents);
  } catch (error) {
    console.error('Error fetching behavior incidents by date range:', error);
    res.status(500).json({ error: 'Davranış kayıtları yüklenemedi' });
  }
};

export const getBehaviorStatsByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    
    const overallStats: any = db.prepare(`
      SELECT 
        COUNT(*) as totalIncidents,
        SUM(CASE WHEN behaviorType = 'OLUMLU' THEN 1 ELSE 0 END) as positiveCount,
        SUM(CASE WHEN behaviorType IN ('CİDDİ', 'ÇOK_CİDDİ') THEN 1 ELSE 0 END) as seriousCount
      FROM behavior_incidents
      WHERE studentId = ?
    `).get(studentId);
    
    const categoryStats = db.prepare(`
      SELECT 
        behaviorCategory,
        COUNT(*) as categoryCount
      FROM behavior_incidents
      WHERE studentId = ?
      GROUP BY behaviorCategory
    `).all(studentId);
    
    res.json({
      overall: overallStats,
      byCategory: categoryStats
    });
  } catch (error) {
    console.error('Error fetching behavior stats:', error);
    res.status(500).json({ error: 'Davranış istatistikleri yüklenemedi' });
  }
};

export const createBehaviorIncident: RequestHandler = (req, res) => {
  try {
    const db = getDatabase();
    const { id, studentId, incidentDate, incidentTime, location, behaviorType, behaviorCategory,
            description, antecedent, consequence, duration, intensity, frequency, witnessedBy,
            othersInvolved, interventionUsed, interventionEffectiveness, parentNotified,
            parentNotificationMethod, parentResponse, followUpRequired, followUpDate, followUpNotes,
            adminNotified, consequenceGiven, supportProvided, triggerAnalysis, patternNotes,
            positiveAlternative, status, recordedBy, notes } = req.body;
    
    db.prepare(`
      INSERT INTO behavior_incidents (id, studentId, incidentDate, incidentTime, location, behaviorType,
                                     behaviorCategory, description, antecedent, consequence, duration,
                                     intensity, frequency, witnessedBy, othersInvolved, interventionUsed,
                                     interventionEffectiveness, parentNotified, parentNotificationMethod,
                                     parentResponse, followUpRequired, followUpDate, followUpNotes,
                                     adminNotified, consequenceGiven, supportProvided, triggerAnalysis,
                                     patternNotes, positiveAlternative, status, recordedBy, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, studentId, incidentDate, incidentTime, location, behaviorType, behaviorCategory,
           description, antecedent, consequence, duration, intensity, frequency, witnessedBy,
           othersInvolved, interventionUsed, interventionEffectiveness, parentNotified ? 1 : 0,
           parentNotificationMethod, parentResponse, followUpRequired ? 1 : 0, followUpDate,
           followUpNotes, adminNotified ? 1 : 0, consequenceGiven, supportProvided, triggerAnalysis,
           patternNotes, positiveAlternative, status || 'AÇIK', recordedBy, notes);
    
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error creating behavior incident:', error);
    res.status(500).json({ error: 'Davranış kaydı oluşturulamadı' });
  }
};

export const updateBehaviorIncident: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const updates = { ...req.body };
    
    if (updates.parentNotified !== undefined) {
      updates.parentNotified = updates.parentNotified ? 1 : 0;
    }
    if (updates.followUpRequired !== undefined) {
      updates.followUpRequired = updates.followUpRequired ? 1 : 0;
    }
    if (updates.adminNotified !== undefined) {
      updates.adminNotified = updates.adminNotified ? 1 : 0;
    }
    
    const allowedFields = ['incidentDate', 'incidentTime', 'location', 'behaviorType', 'behaviorCategory',
                          'description', 'antecedent', 'consequence', 'duration', 'intensity', 'frequency',
                          'witnessedBy', 'othersInvolved', 'interventionUsed', 'interventionEffectiveness',
                          'parentNotified', 'parentNotificationMethod', 'parentResponse', 'followUpRequired',
                          'followUpDate', 'followUpNotes', 'adminNotified', 'consequenceGiven', 'supportProvided',
                          'triggerAnalysis', 'patternNotes', 'positiveAlternative', 'status', 'notes'];
    const fields = Object.keys(updates).filter(key => allowedFields.includes(key));
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updates[field]);
    values.push(id);
    
    db.prepare(`UPDATE behavior_incidents SET ${setClause} WHERE id = ?`).run(...values);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating behavior incident:', error);
    res.status(500).json({ error: 'Davranış kaydı güncellenemedi' });
  }
};

export const deleteBehaviorIncident: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    db.prepare('DELETE FROM behavior_incidents WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting behavior incident:', error);
    res.status(500).json({ error: 'Davranış kaydı silinemedi' });
  }
};

router.get('/behavior/:studentId', getBehaviorIncidentsByStudent);
router.get('/behavior/:studentId/range', getBehaviorIncidentsByDateRange);
router.get('/behavior/:studentId/stats', getBehaviorStatsByStudent);
router.post('/behavior', createBehaviorIncident);
router.put('/behavior/:id', updateBehaviorIncident);
router.delete('/behavior/:id', deleteBehaviorIncident);

export default router;
