import { Router, RequestHandler } from 'express';
import getDatabase from '../lib/database.js';

const router = Router();

// ====================
// ACADEMIC GOALS
// ====================

export const getAcademicGoals: RequestHandler = (req, res) => {
  try {
    const db = getDatabase();
    const goals = db.prepare('SELECT * FROM academic_goals ORDER BY created_at DESC').all();
    res.json(goals);
  } catch (error) {
    console.error('Error fetching academic goals:', error);
    res.status(500).json({ error: 'Akademik hedefler yüklenemedi' });
  }
};

export const getAcademicGoalsByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const goals = db.prepare('SELECT * FROM academic_goals WHERE studentId = ? ORDER BY deadline').all(studentId);
    res.json(goals);
  } catch (error) {
    console.error('Error fetching student academic goals:', error);
    res.status(500).json({ error: 'Öğrenci akademik hedefleri yüklenemedi' });
  }
};

export const createAcademicGoal: RequestHandler = (req, res) => {
  try {
    const db = getDatabase();
    const { id, studentId, title, description, targetScore, currentScore, examType, deadline, status } = req.body;
    
    db.prepare(`
      INSERT INTO academic_goals (id, studentId, title, description, targetScore, currentScore, examType, deadline, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, studentId, title, description, targetScore, currentScore, examType, deadline, status || 'active');
    
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error creating academic goal:', error);
    res.status(500).json({ error: 'Akademik hedef kaydedilemedi' });
  }
};

export const updateAcademicGoal: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const updates = req.body;
    
    // Whitelist of allowed columns to prevent SQL injection
    const allowedFields = ['title', 'description', 'targetScore', 'currentScore', 'examType', 'deadline', 'status'];
    const fields = Object.keys(updates).filter(key => allowedFields.includes(key));
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updates[field]);
    values.push(id);
    
    db.prepare(`UPDATE academic_goals SET ${setClause} WHERE id = ?`).run(...values);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating academic goal:', error);
    res.status(500).json({ error: 'Akademik hedef güncellenemedi' });
  }
};

export const deleteAcademicGoal: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    db.prepare('DELETE FROM academic_goals WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting academic goal:', error);
    res.status(500).json({ error: 'Akademik hedef silinemedi' });
  }
};

// ====================
// MULTIPLE INTELLIGENCE
// ====================

export const getMultipleIntelligenceByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const records = db.prepare('SELECT * FROM multiple_intelligence WHERE studentId = ? ORDER BY assessmentDate DESC').all(studentId);
    res.json(records);
  } catch (error) {
    console.error('Error fetching multiple intelligence:', error);
    res.status(500).json({ error: 'Çoklu zeka verileri yüklenemedi' });
  }
};

export const createMultipleIntelligence: RequestHandler = (req, res) => {
  try {
    const db = getDatabase();
    const { id, studentId, assessmentDate, linguisticVerbal, logicalMathematical, visualSpatial, 
            bodilyKinesthetic, musicalRhythmic, interpersonal, intrapersonal, naturalistic, notes } = req.body;
    
    db.prepare(`
      INSERT INTO multiple_intelligence (id, studentId, assessmentDate, linguisticVerbal, logicalMathematical, 
                                        visualSpatial, bodilyKinesthetic, musicalRhythmic, interpersonal, 
                                        intrapersonal, naturalistic, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, studentId, assessmentDate, linguisticVerbal, logicalMathematical, visualSpatial, 
           bodilyKinesthetic, musicalRhythmic, interpersonal, intrapersonal, naturalistic, notes);
    
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error creating multiple intelligence:', error);
    res.status(500).json({ error: 'Çoklu zeka değerlendirmesi kaydedilemedi' });
  }
};

// ====================
// LEARNING STYLES
// ====================

export const getLearningStylesByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const records = db.prepare('SELECT * FROM learning_styles WHERE studentId = ? ORDER BY assessmentDate DESC').all(studentId);
    res.json(records);
  } catch (error) {
    console.error('Error fetching learning styles:', error);
    res.status(500).json({ error: 'Öğrenme stilleri yüklenemedi' });
  }
};

export const createLearningStyle: RequestHandler = (req, res) => {
  try {
    const db = getDatabase();
    const { id, studentId, assessmentDate, visual, auditory, kinesthetic, reading, notes } = req.body;
    
    db.prepare(`
      INSERT INTO learning_styles (id, studentId, assessmentDate, visual, auditory, kinesthetic, reading, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, studentId, assessmentDate, visual, auditory, kinesthetic, reading, notes);
    
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error creating learning style:', error);
    res.status(500).json({ error: 'Öğrenme stili kaydedilemedi' });
  }
};

// ====================
// SMART GOALS
// ====================

export const getSmartGoalsByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const goals = db.prepare('SELECT * FROM smart_goals WHERE studentId = ? ORDER BY created_at DESC').all(studentId);
    res.json(goals);
  } catch (error) {
    console.error('Error fetching smart goals:', error);
    res.status(500).json({ error: 'SMART hedefler yüklenemedi' });
  }
};

export const createSmartGoal: RequestHandler = (req, res) => {
  try {
    const db = getDatabase();
    const { id, studentId, title, specific, measurable, achievable, relevant, timeBound, 
            category, status, progress, startDate, targetDate, notes } = req.body;
    
    db.prepare(`
      INSERT INTO smart_goals (id, studentId, title, specific, measurable, achievable, relevant, 
                              timeBound, category, status, progress, startDate, targetDate, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, studentId, title, specific, measurable, achievable, relevant, timeBound, 
           category, status || 'active', progress || 0, startDate, targetDate, notes);
    
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error creating smart goal:', error);
    res.status(500).json({ error: 'SMART hedef kaydedilemedi' });
  }
};

export const updateSmartGoal: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const updates = req.body;
    
    // Whitelist of allowed columns to prevent SQL injection
    const allowedFields = ['title', 'specific', 'measurable', 'achievable', 'relevant', 'timeBound', 
                          'category', 'status', 'progress', 'startDate', 'targetDate', 'notes'];
    const fields = Object.keys(updates).filter(key => allowedFields.includes(key));
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updates[field]);
    values.push(id);
    
    db.prepare(`UPDATE smart_goals SET ${setClause} WHERE id = ?`).run(...values);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating smart goal:', error);
    res.status(500).json({ error: 'SMART hedef güncellenemedi' });
  }
};

// ====================
// COACHING RECOMMENDATIONS
// ====================

export const getCoachingRecommendationsByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const recs = db.prepare('SELECT * FROM coaching_recommendations WHERE studentId = ? ORDER BY created_at DESC').all(studentId);
    
    // Parse implementationSteps from JSON string
    const parsed = recs.map((rec: any) => ({
      ...rec,
      implementationSteps: rec.implementationSteps ? JSON.parse(rec.implementationSteps) : []
    }));
    
    res.json(parsed);
  } catch (error) {
    console.error('Error fetching coaching recommendations:', error);
    res.status(500).json({ error: 'Koçluk önerileri yüklenemedi' });
  }
};

export const createCoachingRecommendation: RequestHandler = (req, res) => {
  try {
    const db = getDatabase();
    const { id, studentId, type, title, description, priority, status, automated, 
            implementationSteps, createdAt } = req.body;
    
    // Stringify implementationSteps array
    const stepsJson = JSON.stringify(implementationSteps || []);
    
    db.prepare(`
      INSERT INTO coaching_recommendations (id, studentId, type, title, description, priority, 
                                           status, automated, implementationSteps, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, studentId, type, title, description, priority, status || 'Öneri', 
           automated ? 1 : 0, stepsJson, createdAt);
    
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error creating coaching recommendation:', error);
    res.status(500).json({ error: 'Koçluk önerisi kaydedilemedi' });
  }
};

export const updateCoachingRecommendation: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const updates = { ...req.body };
    
    // Stringify implementationSteps if provided
    if (updates.implementationSteps) {
      updates.implementationSteps = JSON.stringify(updates.implementationSteps);
    }
    
    // Whitelist of allowed columns to prevent SQL injection
    const allowedFields = ['type', 'title', 'description', 'priority', 'status', 'implementationSteps'];
    const fields = Object.keys(updates).filter(key => allowedFields.includes(key));
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updates[field]);
    values.push(id);
    
    db.prepare(`UPDATE coaching_recommendations SET ${setClause} WHERE id = ?`).run(...values);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating coaching recommendation:', error);
    res.status(500).json({ error: 'Koçluk önerisi güncellenemedi' });
  }
};

// ====================
// 360 EVALUATIONS
// ====================

export const getEvaluations360ByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const evals = db.prepare('SELECT * FROM evaluations_360 WHERE studentId = ? ORDER BY evaluationDate DESC').all(studentId);
    
    // Parse JSON fields
    const parsed = evals.map((ev: any) => ({
      ...ev,
      selfEvaluation: ev.selfEvaluation ? JSON.parse(ev.selfEvaluation) : {},
      teacherEvaluation: ev.teacherEvaluation ? JSON.parse(ev.teacherEvaluation) : {},
      peerEvaluation: ev.peerEvaluation ? JSON.parse(ev.peerEvaluation) : {},
      parentEvaluation: ev.parentEvaluation ? JSON.parse(ev.parentEvaluation) : {},
      strengths: ev.strengths ? JSON.parse(ev.strengths) : [],
      areasForImprovement: ev.areasForImprovement ? JSON.parse(ev.areasForImprovement) : [],
      actionPlan: ev.actionPlan ? JSON.parse(ev.actionPlan) : []
    }));
    
    res.json(parsed);
  } catch (error) {
    console.error('Error fetching 360 evaluations:', error);
    res.status(500).json({ error: '360 değerlendirmeler yüklenemedi' });
  }
};

export const createEvaluation360: RequestHandler = (req, res) => {
  try {
    const db = getDatabase();
    const { id, studentId, evaluationDate, selfEvaluation, teacherEvaluation, peerEvaluation, 
            parentEvaluation, strengths, areasForImprovement, actionPlan, notes } = req.body;
    
    // Stringify objects and arrays
    const selfEvalJson = JSON.stringify(selfEvaluation || {});
    const teacherEvalJson = JSON.stringify(teacherEvaluation || {});
    const peerEvalJson = JSON.stringify(peerEvaluation || {});
    const parentEvalJson = JSON.stringify(parentEvaluation || {});
    const strengthsJson = JSON.stringify(strengths || []);
    const areasJson = JSON.stringify(areasForImprovement || []);
    const actionPlanJson = JSON.stringify(actionPlan || []);
    
    db.prepare(`
      INSERT INTO evaluations_360 (id, studentId, evaluationDate, selfEvaluation, teacherEvaluation, 
                                   peerEvaluation, parentEvaluation, strengths, areasForImprovement, 
                                   actionPlan, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, studentId, evaluationDate, selfEvalJson, teacherEvalJson, peerEvalJson, 
           parentEvalJson, strengthsJson, areasJson, actionPlanJson, notes);
    
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error creating 360 evaluation:', error);
    res.status(500).json({ error: '360 değerlendirme kaydedilemedi' });
  }
};

// ====================
// ACHIEVEMENTS
// ====================

export const getAchievementsByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const achievements = db.prepare('SELECT * FROM achievements WHERE studentId = ? ORDER BY earnedAt DESC').all(studentId);
    res.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Başarılar yüklenemedi' });
  }
};

export const createAchievement: RequestHandler = (req, res) => {
  try {
    const db = getDatabase();
    const { id, studentId, title, description, category, earnedAt, points } = req.body;
    
    db.prepare(`
      INSERT INTO achievements (id, studentId, title, description, category, earnedAt, points)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, studentId, title, description, category, earnedAt, points || 0);
    
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error creating achievement:', error);
    res.status(500).json({ error: 'Başarı kaydedilemedi' });
  }
};

// ====================
// SELF ASSESSMENTS
// ====================

export const getSelfAssessmentsByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const assessments = db.prepare('SELECT * FROM self_assessments WHERE studentId = ? ORDER BY assessmentDate DESC').all(studentId);
    res.json(assessments);
  } catch (error) {
    console.error('Error fetching self assessments:', error);
    res.status(500).json({ error: 'Öz değerlendirmeler yüklenemedi' });
  }
};

export const createSelfAssessment: RequestHandler = (req, res) => {
  try {
    const db = getDatabase();
    const { id, studentId, moodRating, motivationLevel, stressLevel, confidenceLevel, 
            studyDifficulty, socialInteraction, sleepQuality, physicalActivity, dailyGoalsAchieved,
            todayHighlight, todayChallenge, tomorrowGoal, notes, assessmentDate } = req.body;
    
    db.prepare(`
      INSERT INTO self_assessments (id, studentId, moodRating, motivationLevel, stressLevel, 
                                    confidenceLevel, studyDifficulty, socialInteraction, sleepQuality, 
                                    physicalActivity, dailyGoalsAchieved, todayHighlight, todayChallenge, 
                                    tomorrowGoal, notes, assessmentDate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, studentId, moodRating, motivationLevel, stressLevel, confidenceLevel, 
           studyDifficulty, socialInteraction, sleepQuality, physicalActivity, dailyGoalsAchieved,
           todayHighlight, todayChallenge, tomorrowGoal, notes, assessmentDate);
    
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error creating self assessment:', error);
    res.status(500).json({ error: 'Öz değerlendirme kaydedilemedi' });
  }
};

// ====================
// PARENT MEETINGS
// ====================

export const getParentMeetingsByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const meetings = db.prepare('SELECT * FROM parent_meetings WHERE studentId = ? ORDER BY date DESC').all(studentId);
    
    // Parse JSON arrays
    const parsed = meetings.map((m: any) => ({
      ...m,
      participants: m.participants ? JSON.parse(m.participants) : [],
      mainTopics: m.mainTopics ? JSON.parse(m.mainTopics) : []
    }));
    
    res.json(parsed);
  } catch (error) {
    console.error('Error fetching parent meetings:', error);
    res.status(500).json({ error: 'Veli görüşmeleri yüklenemedi' });
  }
};

export const createParentMeeting: RequestHandler = (req, res) => {
  try {
    const db = getDatabase();
    const { id, studentId, date, time, type, participants, mainTopics, concerns, decisions, 
            actionPlan, nextMeetingDate, parentSatisfaction, followUpRequired, notes, 
            createdBy, createdAt } = req.body;
    
    // Stringify arrays
    const participantsJson = JSON.stringify(participants || []);
    const topicsJson = JSON.stringify(mainTopics || []);
    
    db.prepare(`
      INSERT INTO parent_meetings (id, studentId, date, time, type, participants, mainTopics, 
                                   concerns, decisions, actionPlan, nextMeetingDate, parentSatisfaction, 
                                   followUpRequired, notes, createdBy, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, studentId, date, time, type, participantsJson, topicsJson, concerns, decisions, 
           actionPlan, nextMeetingDate, parentSatisfaction, followUpRequired ? 1 : 0, notes, 
           createdBy, createdAt);
    
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error creating parent meeting:', error);
    res.status(500).json({ error: 'Veli görüşmesi kaydedilemedi' });
  }
};

export const updateParentMeeting: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const updates = { ...req.body };
    
    // Stringify arrays if provided
    if (updates.participants) {
      updates.participants = JSON.stringify(updates.participants);
    }
    if (updates.mainTopics) {
      updates.mainTopics = JSON.stringify(updates.mainTopics);
    }
    if (updates.followUpRequired !== undefined) {
      updates.followUpRequired = updates.followUpRequired ? 1 : 0;
    }
    
    // Whitelist of allowed columns to prevent SQL injection
    const allowedFields = ['date', 'time', 'type', 'participants', 'mainTopics', 'concerns', 
                          'decisions', 'actionPlan', 'nextMeetingDate', 'parentSatisfaction', 
                          'followUpRequired', 'notes'];
    const fields = Object.keys(updates).filter(key => allowedFields.includes(key));
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updates[field]);
    values.push(id);
    
    db.prepare(`UPDATE parent_meetings SET ${setClause} WHERE id = ?`).run(...values);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating parent meeting:', error);
    res.status(500).json({ error: 'Veli görüşmesi güncellenemedi' });
  }
};

// ====================
// HOME VISITS
// ====================

export const getHomeVisitsByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const visits = db.prepare('SELECT * FROM home_visits WHERE studentId = ? ORDER BY date DESC').all(studentId);
    
    // Parse JSON arrays
    const parsed = visits.map((v: any) => ({
      ...v,
      visitors: v.visitors ? JSON.parse(v.visitors) : [],
      familyPresent: v.familyPresent ? JSON.parse(v.familyPresent) : []
    }));
    
    res.json(parsed);
  } catch (error) {
    console.error('Error fetching home visits:', error);
    res.status(500).json({ error: 'Ev ziyaretleri yüklenemedi' });
  }
};

export const createHomeVisit: RequestHandler = (req, res) => {
  try {
    const db = getDatabase();
    const { id, studentId, date, time, visitDuration, visitors, familyPresent, homeEnvironment, 
            familyInteraction, observations, recommendations, concerns, resources, followUpActions, 
            nextVisitPlanned, notes, createdBy, createdAt } = req.body;
    
    // Stringify arrays
    const visitorsJson = JSON.stringify(visitors || []);
    const familyPresentJson = JSON.stringify(familyPresent || []);
    
    db.prepare(`
      INSERT INTO home_visits (id, studentId, date, time, visitDuration, visitors, familyPresent, 
                              homeEnvironment, familyInteraction, observations, recommendations, 
                              concerns, resources, followUpActions, nextVisitPlanned, notes, 
                              createdBy, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, studentId, date, time, visitDuration, visitorsJson, familyPresentJson, 
           homeEnvironment, familyInteraction, observations, recommendations, concerns, 
           resources, followUpActions, nextVisitPlanned, notes, createdBy, createdAt);
    
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error creating home visit:', error);
    res.status(500).json({ error: 'Ev ziyareti kaydedilemedi' });
  }
};

export const updateHomeVisit: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const updates = { ...req.body };
    
    // Stringify arrays if provided
    if (updates.visitors) {
      updates.visitors = JSON.stringify(updates.visitors);
    }
    if (updates.familyPresent) {
      updates.familyPresent = JSON.stringify(updates.familyPresent);
    }
    
    // Whitelist of allowed columns to prevent SQL injection
    const allowedFields = ['date', 'time', 'visitDuration', 'visitors', 'familyPresent', 
                          'homeEnvironment', 'familyInteraction', 'observations', 'recommendations', 
                          'concerns', 'resources', 'followUpActions', 'nextVisitPlanned', 'notes'];
    const fields = Object.keys(updates).filter(key => allowedFields.includes(key));
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updates[field]);
    values.push(id);
    
    db.prepare(`UPDATE home_visits SET ${setClause} WHERE id = ?`).run(...values);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating home visit:', error);
    res.status(500).json({ error: 'Ev ziyareti güncellenemedi' });
  }
};

// ====================
// FAMILY PARTICIPATION
// ====================

export const getFamilyParticipationByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const records = db.prepare('SELECT * FROM family_participation WHERE studentId = ? ORDER BY eventDate DESC').all(studentId);
    
    // Parse JSON arrays
    const parsed = records.map((r: any) => ({
      ...r,
      participants: r.participants ? JSON.parse(r.participants) : []
    }));
    
    res.json(parsed);
  } catch (error) {
    console.error('Error fetching family participation:', error);
    res.status(500).json({ error: 'Aile katılım durumu yüklenemedi' });
  }
};

export const createFamilyParticipation: RequestHandler = (req, res) => {
  try {
    const db = getDatabase();
    const { id, studentId, eventType, eventName, eventDate, participationStatus, participants, 
            engagementLevel, communicationFrequency, preferredContactMethod, parentAvailability, 
            notes, recordedBy, recordedAt } = req.body;
    
    // Stringify array
    const participantsJson = JSON.stringify(participants || []);
    
    db.prepare(`
      INSERT INTO family_participation (id, studentId, eventType, eventName, eventDate, participationStatus, 
                                       participants, engagementLevel, communicationFrequency, preferredContactMethod, 
                                       parentAvailability, notes, recordedBy, recordedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, studentId, eventType, eventName, eventDate, participationStatus, participantsJson, 
           engagementLevel, communicationFrequency, preferredContactMethod, parentAvailability, 
           notes, recordedBy, recordedAt);
    
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error creating family participation:', error);
    res.status(500).json({ error: 'Aile katılım durumu kaydedilemedi' });
  }
};

export const updateFamilyParticipation: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const updates = { ...req.body };
    
    // Stringify array if provided
    if (updates.participants) {
      updates.participants = JSON.stringify(updates.participants);
    }
    
    // Whitelist of allowed columns to prevent SQL injection
    const allowedFields = ['eventType', 'eventName', 'eventDate', 'participationStatus', 
                          'participants', 'engagementLevel', 'communicationFrequency', 
                          'preferredContactMethod', 'parentAvailability', 'notes'];
    const fields = Object.keys(updates).filter(key => allowedFields.includes(key));
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updates[field]);
    values.push(id);
    
    db.prepare(`UPDATE family_participation SET ${setClause} WHERE id = ?`).run(...values);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating family participation:', error);
    res.status(500).json({ error: 'Aile katılım durumu güncellenemedi' });
  }
};

// ====================
// ROUTER CONFIGURATION
// ====================

router.get('/academic-goals', getAcademicGoals);
router.get('/academic-goals/student/:studentId', getAcademicGoalsByStudent);
router.post('/academic-goals', createAcademicGoal);
router.put('/academic-goals/:id', updateAcademicGoal);
router.delete('/academic-goals/:id', deleteAcademicGoal);

router.get('/multiple-intelligence/student/:studentId', getMultipleIntelligenceByStudent);
router.post('/multiple-intelligence', createMultipleIntelligence);

router.get('/learning-styles/student/:studentId', getLearningStylesByStudent);
router.post('/learning-styles', createLearningStyle);

router.get('/smart-goals/student/:studentId', getSmartGoalsByStudent);
router.post('/smart-goals', createSmartGoal);
router.put('/smart-goals/:id', updateSmartGoal);

router.get('/coaching-recommendations/student/:studentId', getCoachingRecommendationsByStudent);
router.post('/coaching-recommendations', createCoachingRecommendation);
router.put('/coaching-recommendations/:id', updateCoachingRecommendation);

router.get('/evaluations-360/student/:studentId', getEvaluations360ByStudent);
router.post('/evaluations-360', createEvaluation360);

router.get('/achievements/student/:studentId', getAchievementsByStudent);
router.post('/achievements', createAchievement);

router.get('/self-assessments/student/:studentId', getSelfAssessmentsByStudent);
router.post('/self-assessments', createSelfAssessment);

router.get('/parent-meetings/student/:studentId', getParentMeetingsByStudent);
router.post('/parent-meetings', createParentMeeting);
router.put('/parent-meetings/:id', updateParentMeeting);

router.get('/home-visits/student/:studentId', getHomeVisitsByStudent);
router.post('/home-visits', createHomeVisit);
router.put('/home-visits/:id', updateHomeVisit);

router.get('/family-participation/student/:studentId', getFamilyParticipationByStudent);
router.post('/family-participation', createFamilyParticipation);
router.put('/family-participation/:id', updateFamilyParticipation);

export default router;
