import { Router, RequestHandler } from 'express';
import getDatabase from '../lib/database.js';

const router = Router();

export const getExamResultsByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const results = db.prepare('SELECT * FROM exam_results WHERE studentId = ? ORDER BY examDate DESC').all(studentId);
    
    const parsed = results.map((result: any) => ({
      ...result,
      subjectBreakdown: result.subjectBreakdown ? JSON.parse(result.subjectBreakdown) : null,
      topicAnalysis: result.topicAnalysis ? JSON.parse(result.topicAnalysis) : null,
      strengthAreas: result.strengthAreas ? JSON.parse(result.strengthAreas) : [],
      weaknessAreas: result.weaknessAreas ? JSON.parse(result.weaknessAreas) : []
    }));
    
    res.json(parsed);
  } catch (error) {
    console.error('Error fetching exam results:', error);
    res.status(500).json({ error: 'Sınav sonuçları yüklenemedi' });
  }
};

export const getExamResultsByType: RequestHandler = (req, res) => {
  try {
    const { studentId, examType } = req.params;
    const db = getDatabase();
    const results = db.prepare('SELECT * FROM exam_results WHERE studentId = ? AND examType = ? ORDER BY examDate DESC').all(studentId, examType);
    
    const parsed = results.map((result: any) => ({
      ...result,
      subjectBreakdown: result.subjectBreakdown ? JSON.parse(result.subjectBreakdown) : null,
      topicAnalysis: result.topicAnalysis ? JSON.parse(result.topicAnalysis) : null,
      strengthAreas: result.strengthAreas ? JSON.parse(result.strengthAreas) : [],
      weaknessAreas: result.weaknessAreas ? JSON.parse(result.weaknessAreas) : []
    }));
    
    res.json(parsed);
  } catch (error) {
    console.error('Error fetching exam results by type:', error);
    res.status(500).json({ error: 'Sınav sonuçları yüklenemedi' });
  }
};

export const getLatestExamResult: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const { examType } = req.query;
    const db = getDatabase();
    
    let query = 'SELECT * FROM exam_results WHERE studentId = ?';
    const params: any[] = [studentId];
    
    if (examType) {
      query += ' AND examType = ?';
      params.push(examType);
    }
    
    query += ' ORDER BY examDate DESC LIMIT 1';
    
    const result: any = db.prepare(query).get(...params);
    
    if (result) {
      const parsed = {
        ...result,
        subjectBreakdown: result.subjectBreakdown ? JSON.parse(result.subjectBreakdown) : null,
        topicAnalysis: result.topicAnalysis ? JSON.parse(result.topicAnalysis) : null,
        strengthAreas: result.strengthAreas ? JSON.parse(result.strengthAreas) : [],
        weaknessAreas: result.weaknessAreas ? JSON.parse(result.weaknessAreas) : []
      };
      res.json(parsed);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error('Error fetching latest exam result:', error);
    res.status(500).json({ error: 'En son sınav sonucu yüklenemedi' });
  }
};

export const getExamProgressAnalysis: RequestHandler = (req, res) => {
  try {
    const { studentId, examType } = req.params;
    const db = getDatabase();
    
    const results = db.prepare(`
      SELECT examDate, examName, totalScore, totalNet, percentileRank
      FROM exam_results 
      WHERE studentId = ? AND examType = ?
      ORDER BY examDate ASC
    `).all(studentId, examType);
    
    res.json(results);
  } catch (error) {
    console.error('Error fetching exam progress analysis:', error);
    res.status(500).json({ error: 'Sınav gelişim analizi yüklenemedi' });
  }
};

export const createExamResult: RequestHandler = (req, res) => {
  try {
    const db = getDatabase();
    const { id, studentId, examType, examName, examDate, examProvider, totalScore, percentileRank,
            turkishScore, mathScore, scienceScore, socialScore, foreignLanguageScore,
            turkishNet, mathNet, scienceNet, socialNet, foreignLanguageNet, totalNet,
            correctAnswers, wrongAnswers, emptyAnswers, totalQuestions,
            subjectBreakdown, topicAnalysis, strengthAreas, weaknessAreas, improvementSuggestions,
            comparedToGoal, comparedToPrevious, comparedToClassAverage, schoolRank, classRank,
            isOfficial, certificateUrl, answerKeyUrl, detailedReportUrl, goalsMet, parentNotified,
            counselorNotes, actionPlan, notes } = req.body;
    
    const subjectBreakdownJson = JSON.stringify(subjectBreakdown || null);
    const topicAnalysisJson = JSON.stringify(topicAnalysis || null);
    const strengthAreasJson = JSON.stringify(strengthAreas || []);
    const weaknessAreasJson = JSON.stringify(weaknessAreas || []);
    
    db.prepare(`
      INSERT INTO exam_results (id, studentId, examType, examName, examDate, examProvider, totalScore,
                               percentileRank, turkishScore, mathScore, scienceScore, socialScore,
                               foreignLanguageScore, turkishNet, mathNet, scienceNet, socialNet,
                               foreignLanguageNet, totalNet, correctAnswers, wrongAnswers, emptyAnswers,
                               totalQuestions, subjectBreakdown, topicAnalysis, strengthAreas, weaknessAreas,
                               improvementSuggestions, comparedToGoal, comparedToPrevious, comparedToClassAverage,
                               schoolRank, classRank, isOfficial, certificateUrl, answerKeyUrl, detailedReportUrl,
                               goalsMet, parentNotified, counselorNotes, actionPlan, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, studentId, examType, examName, examDate, examProvider, totalScore, percentileRank,
           turkishScore, mathScore, scienceScore, socialScore, foreignLanguageScore,
           turkishNet, mathNet, scienceNet, socialNet, foreignLanguageNet, totalNet,
           correctAnswers, wrongAnswers, emptyAnswers, totalQuestions,
           subjectBreakdownJson, topicAnalysisJson, strengthAreasJson, weaknessAreasJson,
           improvementSuggestions, comparedToGoal, comparedToPrevious, comparedToClassAverage,
           schoolRank, classRank, isOfficial ? 1 : 0, certificateUrl, answerKeyUrl, detailedReportUrl,
           goalsMet ? 1 : 0, parentNotified ? 1 : 0, counselorNotes, actionPlan, notes);
    
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error creating exam result:', error);
    res.status(500).json({ error: 'Sınav sonucu kaydedilemedi' });
  }
};

export const updateExamResult: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const updates = { ...req.body };
    
    if (updates.subjectBreakdown) {
      updates.subjectBreakdown = JSON.stringify(updates.subjectBreakdown);
    }
    if (updates.topicAnalysis) {
      updates.topicAnalysis = JSON.stringify(updates.topicAnalysis);
    }
    if (updates.strengthAreas) {
      updates.strengthAreas = JSON.stringify(updates.strengthAreas);
    }
    if (updates.weaknessAreas) {
      updates.weaknessAreas = JSON.stringify(updates.weaknessAreas);
    }
    if (updates.isOfficial !== undefined) {
      updates.isOfficial = updates.isOfficial ? 1 : 0;
    }
    if (updates.goalsMet !== undefined) {
      updates.goalsMet = updates.goalsMet ? 1 : 0;
    }
    if (updates.parentNotified !== undefined) {
      updates.parentNotified = updates.parentNotified ? 1 : 0;
    }
    
    const allowedFields = ['examType', 'examName', 'examDate', 'examProvider', 'totalScore', 'percentileRank',
                          'turkishScore', 'mathScore', 'scienceScore', 'socialScore', 'foreignLanguageScore',
                          'turkishNet', 'mathNet', 'scienceNet', 'socialNet', 'foreignLanguageNet', 'totalNet',
                          'correctAnswers', 'wrongAnswers', 'emptyAnswers', 'totalQuestions', 'subjectBreakdown',
                          'topicAnalysis', 'strengthAreas', 'weaknessAreas', 'improvementSuggestions',
                          'comparedToGoal', 'comparedToPrevious', 'comparedToClassAverage', 'schoolRank',
                          'classRank', 'isOfficial', 'certificateUrl', 'answerKeyUrl', 'detailedReportUrl',
                          'goalsMet', 'parentNotified', 'counselorNotes', 'actionPlan', 'notes'];
    const fields = Object.keys(updates).filter(key => allowedFields.includes(key));
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updates[field]);
    values.push(id);
    
    db.prepare(`UPDATE exam_results SET ${setClause} WHERE id = ?`).run(...values);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating exam result:', error);
    res.status(500).json({ error: 'Sınav sonucu güncellenemedi' });
  }
};

export const deleteExamResult: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    db.prepare('DELETE FROM exam_results WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting exam result:', error);
    res.status(500).json({ error: 'Sınav sonucu silinemedi' });
  }
};

router.get('/exams/:studentId', getExamResultsByStudent);
router.get('/exams/:studentId/type/:examType', getExamResultsByType);
router.get('/exams/:studentId/latest', getLatestExamResult);
router.get('/exams/:studentId/progress/:examType', getExamProgressAnalysis);
router.post('/exams', createExamResult);
router.put('/exams/:id', updateExamResult);
router.delete('/exams/:id', deleteExamResult);

export default router;
