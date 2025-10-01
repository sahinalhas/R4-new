import { Router, RequestHandler } from 'express';
import getDatabase from '../lib/database.js';

const router = Router();

export const getHealthInfoByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const healthInfo = db.prepare('SELECT * FROM health_info WHERE studentId = ?').get(studentId);
    res.json(healthInfo || null);
  } catch (error) {
    console.error('Error fetching health info:', error);
    res.status(500).json({ error: 'Sağlık bilgileri yüklenemedi' });
  }
};

export const createOrUpdateHealthInfo: RequestHandler = (req, res) => {
  try {
    const db = getDatabase();
    const { id, studentId, bloodType, chronicDiseases, allergies, medications, specialNeeds,
            medicalHistory, emergencyContact1Name, emergencyContact1Phone, emergencyContact1Relation,
            emergencyContact2Name, emergencyContact2Phone, emergencyContact2Relation,
            physicianName, physicianPhone, insuranceInfo, vaccinations, dietaryRestrictions,
            physicalLimitations, mentalHealthNotes, lastHealthCheckup, notes } = req.body;
    
    const existing = db.prepare('SELECT id FROM health_info WHERE studentId = ?').get(studentId);
    
    if (existing) {
      const updates = req.body;
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
      
      res.json({ success: true, id: (existing as any).id });
    } else {
      db.prepare(`
        INSERT INTO health_info (id, studentId, bloodType, chronicDiseases, allergies, medications, 
                                specialNeeds, medicalHistory, emergencyContact1Name, emergencyContact1Phone,
                                emergencyContact1Relation, emergencyContact2Name, emergencyContact2Phone,
                                emergencyContact2Relation, physicianName, physicianPhone, insuranceInfo,
                                vaccinations, dietaryRestrictions, physicalLimitations, mentalHealthNotes,
                                lastHealthCheckup, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, studentId, bloodType, chronicDiseases, allergies, medications, specialNeeds,
             medicalHistory, emergencyContact1Name, emergencyContact1Phone, emergencyContact1Relation,
             emergencyContact2Name, emergencyContact2Phone, emergencyContact2Relation,
             physicianName, physicianPhone, insuranceInfo, vaccinations, dietaryRestrictions,
             physicalLimitations, mentalHealthNotes, lastHealthCheckup, notes);
      
      res.json({ success: true, id });
    }
  } catch (error) {
    console.error('Error saving health info:', error);
    res.status(500).json({ error: 'Sağlık bilgileri kaydedilemedi' });
  }
};

export const deleteHealthInfo: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    db.prepare('DELETE FROM health_info WHERE studentId = ?').run(studentId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting health info:', error);
    res.status(500).json({ error: 'Sağlık bilgileri silinemedi' });
  }
};

router.get('/health/:studentId', getHealthInfoByStudent);
router.post('/health', createOrUpdateHealthInfo);
router.delete('/health/:studentId', deleteHealthInfo);

export default router;
