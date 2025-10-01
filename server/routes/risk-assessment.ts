import { Router, RequestHandler } from 'express';
import getDatabase from '../lib/database.js';

const router = Router();

export const getRiskFactorsByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const records = db.prepare('SELECT * FROM risk_factors WHERE studentId = ? ORDER BY assessmentDate DESC').all(studentId);
    res.json(records);
  } catch (error) {
    console.error('Error fetching risk factors:', error);
    res.status(500).json({ error: 'Risk faktörleri yüklenemedi' });
  }
};

export const getLatestRiskFactorsByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const record = db.prepare('SELECT * FROM risk_factors WHERE studentId = ? ORDER BY assessmentDate DESC LIMIT 1').get(studentId);
    res.json(record || null);
  } catch (error) {
    console.error('Error fetching latest risk factors:', error);
    res.status(500).json({ error: 'En son risk faktörleri yüklenemedi' });
  }
};

export const getAllHighRiskStudents: RequestHandler = (req, res) => {
  try {
    const db = getDatabase();
    const records = db.prepare(`
      SELECT rf.*, s.name, s.className 
      FROM risk_factors rf
      JOIN students s ON rf.studentId = s.id
      WHERE rf.overallRiskScore >= 70 OR 
            rf.academicRiskLevel IN ('YÜKSEK', 'KRİTİK') OR
            rf.behavioralRiskLevel IN ('YÜKSEK', 'KRİTİK')
      ORDER BY rf.overallRiskScore DESC, rf.assessmentDate DESC
    `).all();
    res.json(records);
  } catch (error) {
    console.error('Error fetching high risk students:', error);
    res.status(500).json({ error: 'Yüksek riskli öğrenciler yüklenemedi' });
  }
};

export const createRiskFactors: RequestHandler = (req, res) => {
  try {
    const db = getDatabase();
    const { id, studentId, assessmentDate, academicRiskLevel, behavioralRiskLevel, attendanceRiskLevel,
            socialEmotionalRiskLevel, dropoutRisk, academicFactors, behavioralFactors, attendanceFactors,
            socialFactors, familyFactors, protectiveFactors, interventionsNeeded, alertsGenerated,
            followUpActions, assignedCounselor, parentNotified, parentNotificationDate, overallRiskScore,
            status, nextAssessmentDate, notes } = req.body;
    
    db.prepare(`
      INSERT INTO risk_factors (id, studentId, assessmentDate, academicRiskLevel, behavioralRiskLevel,
                               attendanceRiskLevel, socialEmotionalRiskLevel, dropoutRisk, academicFactors,
                               behavioralFactors, attendanceFactors, socialFactors, familyFactors,
                               protectiveFactors, interventionsNeeded, alertsGenerated, followUpActions,
                               assignedCounselor, parentNotified, parentNotificationDate, overallRiskScore,
                               status, nextAssessmentDate, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, studentId, assessmentDate, academicRiskLevel, behavioralRiskLevel, attendanceRiskLevel,
           socialEmotionalRiskLevel, dropoutRisk, academicFactors, behavioralFactors, attendanceFactors,
           socialFactors, familyFactors, protectiveFactors, interventionsNeeded, alertsGenerated,
           followUpActions, assignedCounselor, parentNotified ? 1 : 0, parentNotificationDate,
           overallRiskScore, status || 'DEVAM_EDEN', nextAssessmentDate, notes);
    
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error creating risk factors:', error);
    res.status(500).json({ error: 'Risk faktörleri kaydedilemedi' });
  }
};

export const updateRiskFactors: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const updates = { ...req.body };
    
    if (updates.parentNotified !== undefined) {
      updates.parentNotified = updates.parentNotified ? 1 : 0;
    }
    
    const allowedFields = ['assessmentDate', 'academicRiskLevel', 'behavioralRiskLevel', 'attendanceRiskLevel',
                          'socialEmotionalRiskLevel', 'dropoutRisk', 'academicFactors', 'behavioralFactors',
                          'attendanceFactors', 'socialFactors', 'familyFactors', 'protectiveFactors',
                          'interventionsNeeded', 'alertsGenerated', 'followUpActions', 'assignedCounselor',
                          'parentNotified', 'parentNotificationDate', 'overallRiskScore', 'status',
                          'nextAssessmentDate', 'notes'];
    const fields = Object.keys(updates).filter(key => allowedFields.includes(key));
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updates[field]);
    values.push(id);
    
    db.prepare(`UPDATE risk_factors SET ${setClause} WHERE id = ?`).run(...values);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating risk factors:', error);
    res.status(500).json({ error: 'Risk faktörleri güncellenemedi' });
  }
};

export const deleteRiskFactors: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    db.prepare('DELETE FROM risk_factors WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting risk factors:', error);
    res.status(500).json({ error: 'Risk faktörleri silinemedi' });
  }
};

router.get('/risk-factors/:studentId', getRiskFactorsByStudent);
router.get('/risk-factors/:studentId/latest', getLatestRiskFactorsByStudent);
router.get('/high-risk-students', getAllHighRiskStudents);
router.post('/risk-factors', createRiskFactors);
router.put('/risk-factors/:id', updateRiskFactors);
router.delete('/risk-factors/:id', deleteRiskFactors);

export default router;
