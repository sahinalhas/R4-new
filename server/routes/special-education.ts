import { Router, RequestHandler } from 'express';
import getDatabase from '../lib/database.js';

const router = Router();

export const getSpecialEducationByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const records = db.prepare('SELECT * FROM special_education WHERE studentId = ? ORDER BY created_at DESC').all(studentId);
    res.json(records);
  } catch (error) {
    console.error('Error fetching special education records:', error);
    res.status(500).json({ error: 'Özel eğitim kayıtları yüklenemedi' });
  }
};

export const createSpecialEducation: RequestHandler = (req, res) => {
  try {
    const db = getDatabase();
    const { id, studentId, hasIEP, iepStartDate, iepEndDate, iepGoals, diagnosis, ramReportDate,
            ramReportSummary, supportServices, accommodations, modifications, progressNotes,
            evaluationSchedule, specialistContacts, parentInvolvement, transitionPlan,
            assistiveTechnology, behavioralSupport, status, nextReviewDate, notes } = req.body;
    
    db.prepare(`
      INSERT INTO special_education (id, studentId, hasIEP, iepStartDate, iepEndDate, iepGoals, 
                                    diagnosis, ramReportDate, ramReportSummary, supportServices, 
                                    accommodations, modifications, progressNotes, evaluationSchedule,
                                    specialistContacts, parentInvolvement, transitionPlan, 
                                    assistiveTechnology, behavioralSupport, status, nextReviewDate, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, studentId, hasIEP ? 1 : 0, iepStartDate, iepEndDate, iepGoals, diagnosis, 
           ramReportDate, ramReportSummary, supportServices, accommodations, modifications, 
           progressNotes, evaluationSchedule, specialistContacts, parentInvolvement, transitionPlan,
           assistiveTechnology, behavioralSupport, status || 'AKTİF', nextReviewDate, notes);
    
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error creating special education record:', error);
    res.status(500).json({ error: 'Özel eğitim kaydı oluşturulamadı' });
  }
};

export const updateSpecialEducation: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const updates = { ...req.body };
    
    if (updates.hasIEP !== undefined) {
      updates.hasIEP = updates.hasIEP ? 1 : 0;
    }
    
    const allowedFields = ['hasIEP', 'iepStartDate', 'iepEndDate', 'iepGoals', 'diagnosis', 
                          'ramReportDate', 'ramReportSummary', 'supportServices', 'accommodations',
                          'modifications', 'progressNotes', 'evaluationSchedule', 'specialistContacts',
                          'parentInvolvement', 'transitionPlan', 'assistiveTechnology', 'behavioralSupport',
                          'status', 'nextReviewDate', 'notes'];
    const fields = Object.keys(updates).filter(key => allowedFields.includes(key));
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updates[field]);
    values.push(id);
    
    db.prepare(`UPDATE special_education SET ${setClause} WHERE id = ?`).run(...values);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating special education record:', error);
    res.status(500).json({ error: 'Özel eğitim kaydı güncellenemedi' });
  }
};

export const deleteSpecialEducation: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    db.prepare('DELETE FROM special_education WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting special education record:', error);
    res.status(500).json({ error: 'Özel eğitim kaydı silinemedi' });
  }
};

router.get('/special-education/:studentId', getSpecialEducationByStudent);
router.post('/special-education', createSpecialEducation);
router.put('/special-education/:id', updateSpecialEducation);
router.delete('/special-education/:id', deleteSpecialEducation);

export default router;
