import { RequestHandler } from 'express';
import * as coachingService from '../services/coaching.service.js';

export const getAcademicGoals: RequestHandler = (req, res) => {
  try {
    const goals = coachingService.getAllAcademicGoals();
    res.json(goals);
  } catch (error) {
    console.error('Error fetching academic goals:', error);
    res.status(500).json({ error: 'Akademik hedefler yüklenemedi' });
  }
};

export const getAcademicGoalsByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const goals = coachingService.getStudentAcademicGoals(studentId);
    res.json(goals);
  } catch (error) {
    console.error('Error fetching student academic goals:', error);
    res.status(500).json({ error: 'Öğrenci akademik hedefleri yüklenemedi' });
  }
};

export const createAcademicGoal: RequestHandler = (req, res) => {
  try {
    const result = coachingService.createAcademicGoal(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error creating academic goal:', error);
    res.status(500).json({ error: 'Akademik hedef kaydedilemedi' });
  }
};

export const updateAcademicGoal: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const result = coachingService.updateAcademicGoal(id, req.body);
    res.json(result);
  } catch (error) {
    console.error('Error updating academic goal:', error);
    res.status(500).json({ error: 'Akademik hedef güncellenemedi' });
  }
};

export const deleteAcademicGoal: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const result = coachingService.deleteAcademicGoal(id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting academic goal:', error);
    res.status(500).json({ error: 'Akademik hedef silinemedi' });
  }
};

export const getMultipleIntelligenceByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const records = coachingService.getStudentMultipleIntelligence(studentId);
    res.json(records);
  } catch (error) {
    console.error('Error fetching multiple intelligence:', error);
    res.status(500).json({ error: 'Çoklu zeka verileri yüklenemedi' });
  }
};

export const createMultipleIntelligence: RequestHandler = (req, res) => {
  try {
    const result = coachingService.createMultipleIntelligence(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error creating multiple intelligence:', error);
    res.status(500).json({ error: 'Çoklu zeka değerlendirmesi kaydedilemedi' });
  }
};

export const getLearningStylesByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const records = coachingService.getStudentLearningStyles(studentId);
    res.json(records);
  } catch (error) {
    console.error('Error fetching learning styles:', error);
    res.status(500).json({ error: 'Öğrenme stilleri yüklenemedi' });
  }
};

export const createLearningStyle: RequestHandler = (req, res) => {
  try {
    const result = coachingService.createLearningStyle(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error creating learning style:', error);
    res.status(500).json({ error: 'Öğrenme stili kaydedilemedi' });
  }
};

export const getSmartGoalsByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const goals = coachingService.getStudentSmartGoals(studentId);
    res.json(goals);
  } catch (error) {
    console.error('Error fetching smart goals:', error);
    res.status(500).json({ error: 'SMART hedefler yüklenemedi' });
  }
};

export const createSmartGoal: RequestHandler = (req, res) => {
  try {
    const result = coachingService.createSmartGoal(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error creating smart goal:', error);
    res.status(500).json({ error: 'SMART hedef kaydedilemedi' });
  }
};

export const updateSmartGoal: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const result = coachingService.updateSmartGoal(id, req.body);
    res.json(result);
  } catch (error) {
    console.error('Error updating smart goal:', error);
    res.status(500).json({ error: 'SMART hedef güncellenemedi' });
  }
};

export const getCoachingRecommendationsByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const recs = coachingService.getStudentCoachingRecommendations(studentId);
    res.json(recs);
  } catch (error) {
    console.error('Error fetching coaching recommendations:', error);
    res.status(500).json({ error: 'Koçluk önerileri yüklenemedi' });
  }
};

export const createCoachingRecommendation: RequestHandler = (req, res) => {
  try {
    const result = coachingService.createCoachingRecommendation(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error creating coaching recommendation:', error);
    res.status(500).json({ error: 'Koçluk önerisi kaydedilemedi' });
  }
};

export const updateCoachingRecommendation: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const result = coachingService.updateCoachingRecommendation(id, req.body);
    res.json(result);
  } catch (error) {
    console.error('Error updating coaching recommendation:', error);
    res.status(500).json({ error: 'Koçluk önerisi güncellenemedi' });
  }
};

export const getEvaluations360ByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const evals = coachingService.getStudent360Evaluations(studentId);
    res.json(evals);
  } catch (error) {
    console.error('Error fetching 360 evaluations:', error);
    res.status(500).json({ error: '360 değerlendirmeler yüklenemedi' });
  }
};

export const createEvaluation360: RequestHandler = (req, res) => {
  try {
    const result = coachingService.create360Evaluation(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error creating 360 evaluation:', error);
    res.status(500).json({ error: '360 değerlendirme kaydedilemedi' });
  }
};

export const getAchievementsByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const achievements = coachingService.getStudentAchievements(studentId);
    res.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Başarılar yüklenemedi' });
  }
};

export const createAchievement: RequestHandler = (req, res) => {
  try {
    const result = coachingService.createAchievement(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error creating achievement:', error);
    res.status(500).json({ error: 'Başarı kaydedilemedi' });
  }
};

export const getSelfAssessmentsByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const assessments = coachingService.getStudentSelfAssessments(studentId);
    res.json(assessments);
  } catch (error) {
    console.error('Error fetching self assessments:', error);
    res.status(500).json({ error: 'Öz değerlendirmeler yüklenemedi' });
  }
};

export const createSelfAssessment: RequestHandler = (req, res) => {
  try {
    const result = coachingService.createSelfAssessment(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error creating self assessment:', error);
    res.status(500).json({ error: 'Öz değerlendirme kaydedilemedi' });
  }
};

export const getParentMeetingsByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const meetings = coachingService.getStudentParentMeetings(studentId);
    res.json(meetings);
  } catch (error) {
    console.error('Error fetching parent meetings:', error);
    res.status(500).json({ error: 'Veli görüşmeleri yüklenemedi' });
  }
};

export const createParentMeeting: RequestHandler = (req, res) => {
  try {
    const result = coachingService.createParentMeeting(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error creating parent meeting:', error);
    res.status(500).json({ error: 'Veli görüşmesi kaydedilemedi' });
  }
};

export const updateParentMeeting: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const result = coachingService.updateParentMeeting(id, req.body);
    res.json(result);
  } catch (error) {
    console.error('Error updating parent meeting:', error);
    res.status(500).json({ error: 'Veli görüşmesi güncellenemedi' });
  }
};

export const getHomeVisitsByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const visits = coachingService.getStudentHomeVisits(studentId);
    res.json(visits);
  } catch (error) {
    console.error('Error fetching home visits:', error);
    res.status(500).json({ error: 'Ev ziyaretleri yüklenemedi' });
  }
};

export const createHomeVisit: RequestHandler = (req, res) => {
  try {
    const result = coachingService.createHomeVisit(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error creating home visit:', error);
    res.status(500).json({ error: 'Ev ziyareti kaydedilemedi' });
  }
};

export const updateHomeVisit: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const result = coachingService.updateHomeVisit(id, req.body);
    res.json(result);
  } catch (error) {
    console.error('Error updating home visit:', error);
    res.status(500).json({ error: 'Ev ziyareti güncellenemedi' });
  }
};

export const getFamilyParticipationByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const records = coachingService.getStudentFamilyParticipation(studentId);
    res.json(records);
  } catch (error) {
    console.error('Error fetching family participation:', error);
    res.status(500).json({ error: 'Aile katılım durumu yüklenemedi' });
  }
};

export const createFamilyParticipation: RequestHandler = (req, res) => {
  try {
    const result = coachingService.createFamilyParticipation(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error creating family participation:', error);
    res.status(500).json({ error: 'Aile katılım durumu kaydedilemedi' });
  }
};

export const updateFamilyParticipation: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const result = coachingService.updateFamilyParticipation(id, req.body);
    res.json(result);
  } catch (error) {
    console.error('Error updating family participation:', error);
    res.status(500).json({ error: 'Aile katılım durumu güncellenemedi' });
  }
};
