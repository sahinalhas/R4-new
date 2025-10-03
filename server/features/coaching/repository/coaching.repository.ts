import getDatabase from '../../../lib/database.js';
import type {
  AcademicGoal,
  MultipleIntelligence,
  LearningStyle,
  SmartGoal,
  CoachingRecommendation,
  Evaluation360,
  Achievement,
  SelfAssessment,
  ParentMeeting,
  HomeVisit,
  FamilyParticipation
} from '../types/index.js';

let statements: any = null;
let isInitialized = false;

function ensureInitialized(): void {
  if (isInitialized && statements) return;
  
  const db = getDatabase();
  
  statements = {
    getAllAcademicGoals: db.prepare('SELECT * FROM academic_goals ORDER BY created_at DESC'),
    getAcademicGoalsByStudent: db.prepare('SELECT * FROM academic_goals WHERE studentId = ? ORDER BY deadline'),
    insertAcademicGoal: db.prepare(`
      INSERT INTO academic_goals (id, studentId, title, description, targetScore, currentScore, examType, deadline, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    updateAcademicGoal: db.prepare('UPDATE academic_goals SET {FIELDS} WHERE id = ?'),
    deleteAcademicGoal: db.prepare('DELETE FROM academic_goals WHERE id = ?'),
    
    getMultipleIntelligenceByStudent: db.prepare('SELECT * FROM multiple_intelligence WHERE studentId = ? ORDER BY assessmentDate DESC'),
    insertMultipleIntelligence: db.prepare(`
      INSERT INTO multiple_intelligence (id, studentId, assessmentDate, linguisticVerbal, logicalMathematical, 
                                        visualSpatial, bodilyKinesthetic, musicalRhythmic, interpersonal, 
                                        intrapersonal, naturalistic, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    
    getLearningStylesByStudent: db.prepare('SELECT * FROM learning_styles WHERE studentId = ? ORDER BY assessmentDate DESC'),
    insertLearningStyle: db.prepare(`
      INSERT INTO learning_styles (id, studentId, assessmentDate, visual, auditory, kinesthetic, reading, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `),
    
    getSmartGoalsByStudent: db.prepare('SELECT * FROM smart_goals WHERE studentId = ? ORDER BY created_at DESC'),
    insertSmartGoal: db.prepare(`
      INSERT INTO smart_goals (id, studentId, title, specific, measurable, achievable, relevant, 
                              timeBound, category, status, progress, startDate, targetDate, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    updateSmartGoal: db.prepare('UPDATE smart_goals SET {FIELDS} WHERE id = ?'),
    
    getCoachingRecommendationsByStudent: db.prepare('SELECT * FROM coaching_recommendations WHERE studentId = ? ORDER BY created_at DESC'),
    insertCoachingRecommendation: db.prepare(`
      INSERT INTO coaching_recommendations (id, studentId, type, title, description, priority, 
                                           status, automated, implementationSteps, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    updateCoachingRecommendation: db.prepare('UPDATE coaching_recommendations SET {FIELDS} WHERE id = ?'),
    
    getEvaluations360ByStudent: db.prepare('SELECT * FROM evaluations_360 WHERE studentId = ? ORDER BY evaluationDate DESC'),
    insertEvaluation360: db.prepare(`
      INSERT INTO evaluations_360 (id, studentId, evaluationDate, selfEvaluation, teacherEvaluation, 
                                   peerEvaluation, parentEvaluation, strengths, areasForImprovement, 
                                   actionPlan, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    
    getAchievementsByStudent: db.prepare('SELECT * FROM achievements WHERE studentId = ? ORDER BY earnedAt DESC'),
    insertAchievement: db.prepare(`
      INSERT INTO achievements (id, studentId, title, description, category, earnedAt, points)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `),
    
    getSelfAssessmentsByStudent: db.prepare('SELECT * FROM self_assessments WHERE studentId = ? ORDER BY assessmentDate DESC'),
    insertSelfAssessment: db.prepare(`
      INSERT INTO self_assessments (id, studentId, moodRating, motivationLevel, stressLevel, 
                                    confidenceLevel, studyDifficulty, socialInteraction, sleepQuality, 
                                    physicalActivity, dailyGoalsAchieved, todayHighlight, todayChallenge, 
                                    tomorrowGoal, notes, assessmentDate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    
    getParentMeetingsByStudent: db.prepare('SELECT * FROM parent_meetings WHERE studentId = ? ORDER BY date DESC'),
    insertParentMeeting: db.prepare(`
      INSERT INTO parent_meetings (id, studentId, date, time, type, participants, mainTopics, 
                                   concerns, decisions, actionPlan, nextMeetingDate, parentSatisfaction, 
                                   followUpRequired, notes, createdBy, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    updateParentMeeting: db.prepare('UPDATE parent_meetings SET {FIELDS} WHERE id = ?'),
    
    getHomeVisitsByStudent: db.prepare('SELECT * FROM home_visits WHERE studentId = ? ORDER BY date DESC'),
    insertHomeVisit: db.prepare(`
      INSERT INTO home_visits (id, studentId, date, time, visitDuration, visitors, familyPresent, 
                              homeEnvironment, familyInteraction, observations, recommendations, 
                              concerns, resources, followUpActions, nextVisitPlanned, notes, 
                              createdBy, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    updateHomeVisit: db.prepare('UPDATE home_visits SET {FIELDS} WHERE id = ?'),
    
    getFamilyParticipationByStudent: db.prepare('SELECT * FROM family_participation WHERE studentId = ? ORDER BY eventDate DESC'),
    insertFamilyParticipation: db.prepare(`
      INSERT INTO family_participation (id, studentId, eventType, eventName, eventDate, participationStatus, 
                                       participants, engagementLevel, communicationFrequency, preferredContactMethod, 
                                       parentAvailability, notes, recordedBy, recordedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    updateFamilyParticipation: db.prepare('UPDATE family_participation SET {FIELDS} WHERE id = ?'),
  };
  
  isInitialized = true;
}

export function getAllAcademicGoals(): AcademicGoal[] {
  try {
    ensureInitialized();
    return statements.getAllAcademicGoals.all() as AcademicGoal[];
  } catch (error) {
    console.error('Database error in getAllAcademicGoals:', error);
    throw error;
  }
}

export function getAcademicGoalsByStudent(studentId: string): AcademicGoal[] {
  try {
    ensureInitialized();
    return statements.getAcademicGoalsByStudent.all(studentId) as AcademicGoal[];
  } catch (error) {
    console.error('Database error in getAcademicGoalsByStudent:', error);
    throw error;
  }
}

export function insertAcademicGoal(goal: AcademicGoal): void {
  try {
    ensureInitialized();
    statements.insertAcademicGoal.run(
      goal.id,
      goal.studentId,
      goal.title,
      goal.description,
      goal.targetScore,
      goal.currentScore,
      goal.examType,
      goal.deadline,
      goal.status || 'active'
    );
  } catch (error) {
    console.error('Error inserting academic goal:', error);
    throw error;
  }
}

export function updateAcademicGoal(id: string, updates: Partial<AcademicGoal>): void {
  try {
    ensureInitialized();
    const db = getDatabase();
    
    const allowedFields = ['title', 'description', 'targetScore', 'currentScore', 'examType', 'deadline', 'status'];
    const fields = Object.keys(updates).filter(key => allowedFields.includes(key));
    
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => (updates as any)[field]);
    values.push(id);
    
    db.prepare(`UPDATE academic_goals SET ${setClause} WHERE id = ?`).run(...values);
  } catch (error) {
    console.error('Error updating academic goal:', error);
    throw error;
  }
}

export function deleteAcademicGoal(id: string): void {
  try {
    ensureInitialized();
    statements.deleteAcademicGoal.run(id);
  } catch (error) {
    console.error('Error deleting academic goal:', error);
    throw error;
  }
}

export function getMultipleIntelligenceByStudent(studentId: string): MultipleIntelligence[] {
  try {
    ensureInitialized();
    return statements.getMultipleIntelligenceByStudent.all(studentId) as MultipleIntelligence[];
  } catch (error) {
    console.error('Database error in getMultipleIntelligenceByStudent:', error);
    throw error;
  }
}

export function insertMultipleIntelligence(record: MultipleIntelligence): void {
  try {
    ensureInitialized();
    statements.insertMultipleIntelligence.run(
      record.id,
      record.studentId,
      record.assessmentDate,
      record.linguisticVerbal,
      record.logicalMathematical,
      record.visualSpatial,
      record.bodilyKinesthetic,
      record.musicalRhythmic,
      record.interpersonal,
      record.intrapersonal,
      record.naturalistic,
      record.notes
    );
  } catch (error) {
    console.error('Error inserting multiple intelligence:', error);
    throw error;
  }
}

export function getLearningStylesByStudent(studentId: string): LearningStyle[] {
  try {
    ensureInitialized();
    return statements.getLearningStylesByStudent.all(studentId) as LearningStyle[];
  } catch (error) {
    console.error('Database error in getLearningStylesByStudent:', error);
    throw error;
  }
}

export function insertLearningStyle(record: LearningStyle): void {
  try {
    ensureInitialized();
    statements.insertLearningStyle.run(
      record.id,
      record.studentId,
      record.assessmentDate,
      record.visual,
      record.auditory,
      record.kinesthetic,
      record.reading,
      record.notes
    );
  } catch (error) {
    console.error('Error inserting learning style:', error);
    throw error;
  }
}

export function getSmartGoalsByStudent(studentId: string): SmartGoal[] {
  try {
    ensureInitialized();
    return statements.getSmartGoalsByStudent.all(studentId) as SmartGoal[];
  } catch (error) {
    console.error('Database error in getSmartGoalsByStudent:', error);
    throw error;
  }
}

export function insertSmartGoal(goal: SmartGoal): void {
  try {
    ensureInitialized();
    statements.insertSmartGoal.run(
      goal.id,
      goal.studentId,
      goal.title,
      goal.specific,
      goal.measurable,
      goal.achievable,
      goal.relevant,
      goal.timeBound,
      goal.category,
      goal.status || 'active',
      goal.progress || 0,
      goal.startDate,
      goal.targetDate,
      goal.notes
    );
  } catch (error) {
    console.error('Error inserting smart goal:', error);
    throw error;
  }
}

export function updateSmartGoal(id: string, updates: Partial<SmartGoal>): void {
  try {
    ensureInitialized();
    const db = getDatabase();
    
    const allowedFields = ['title', 'specific', 'measurable', 'achievable', 'relevant', 'timeBound', 
                          'category', 'status', 'progress', 'startDate', 'targetDate', 'notes'];
    const fields = Object.keys(updates).filter(key => allowedFields.includes(key));
    
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => (updates as any)[field]);
    values.push(id);
    
    db.prepare(`UPDATE smart_goals SET ${setClause} WHERE id = ?`).run(...values);
  } catch (error) {
    console.error('Error updating smart goal:', error);
    throw error;
  }
}

export function getCoachingRecommendationsByStudent(studentId: string): any[] {
  try {
    ensureInitialized();
    const recs = statements.getCoachingRecommendationsByStudent.all(studentId);
    
    return recs.map((rec: any) => ({
      ...rec,
      implementationSteps: rec.implementationSteps ? JSON.parse(rec.implementationSteps) : []
    }));
  } catch (error) {
    console.error('Database error in getCoachingRecommendationsByStudent:', error);
    throw error;
  }
}

export function insertCoachingRecommendation(rec: CoachingRecommendation): void {
  try {
    ensureInitialized();
    const stepsJson = JSON.stringify(rec.implementationSteps || []);
    
    statements.insertCoachingRecommendation.run(
      rec.id,
      rec.studentId,
      rec.type,
      rec.title,
      rec.description,
      rec.priority,
      rec.status || 'Öneri',
      rec.automated ? 1 : 0,
      stepsJson,
      rec.createdAt
    );
  } catch (error) {
    console.error('Error inserting coaching recommendation:', error);
    throw error;
  }
}

export function updateCoachingRecommendation(id: string, updates: any): void {
  try {
    ensureInitialized();
    const db = getDatabase();
    
    const updatesWithStringifiedArrays = { ...updates };
    if (updates.implementationSteps) {
      updatesWithStringifiedArrays.implementationSteps = JSON.stringify(updates.implementationSteps);
    }
    
    const allowedFields = ['type', 'title', 'description', 'priority', 'status', 'implementationSteps'];
    const fields = Object.keys(updatesWithStringifiedArrays).filter(key => allowedFields.includes(key));
    
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updatesWithStringifiedArrays[field]);
    values.push(id);
    
    db.prepare(`UPDATE coaching_recommendations SET ${setClause} WHERE id = ?`).run(...values);
  } catch (error) {
    console.error('Error updating coaching recommendation:', error);
    throw error;
  }
}

export function getEvaluations360ByStudent(studentId: string): any[] {
  try {
    ensureInitialized();
    const evals = statements.getEvaluations360ByStudent.all(studentId);
    
    return evals.map((ev: any) => ({
      ...ev,
      selfEvaluation: ev.selfEvaluation ? JSON.parse(ev.selfEvaluation) : {},
      teacherEvaluation: ev.teacherEvaluation ? JSON.parse(ev.teacherEvaluation) : {},
      peerEvaluation: ev.peerEvaluation ? JSON.parse(ev.peerEvaluation) : {},
      parentEvaluation: ev.parentEvaluation ? JSON.parse(ev.parentEvaluation) : {},
      strengths: ev.strengths ? JSON.parse(ev.strengths) : [],
      areasForImprovement: ev.areasForImprovement ? JSON.parse(ev.areasForImprovement) : [],
      actionPlan: ev.actionPlan ? JSON.parse(ev.actionPlan) : []
    }));
  } catch (error) {
    console.error('Database error in getEvaluations360ByStudent:', error);
    throw error;
  }
}

export function insertEvaluation360(evaluation: Evaluation360): void {
  try {
    ensureInitialized();
    
    const selfEvalJson = JSON.stringify(evaluation.selfEvaluation || {});
    const teacherEvalJson = JSON.stringify(evaluation.teacherEvaluation || {});
    const peerEvalJson = JSON.stringify(evaluation.peerEvaluation || {});
    const parentEvalJson = JSON.stringify(evaluation.parentEvaluation || {});
    const strengthsJson = JSON.stringify(evaluation.strengths || []);
    const areasJson = JSON.stringify(evaluation.areasForImprovement || []);
    const actionPlanJson = JSON.stringify(evaluation.actionPlan || []);
    
    statements.insertEvaluation360.run(
      evaluation.id,
      evaluation.studentId,
      evaluation.evaluationDate,
      selfEvalJson,
      teacherEvalJson,
      peerEvalJson,
      parentEvalJson,
      strengthsJson,
      areasJson,
      actionPlanJson,
      evaluation.notes
    );
  } catch (error) {
    console.error('Error inserting 360 evaluation:', error);
    throw error;
  }
}

export function getAchievementsByStudent(studentId: string): Achievement[] {
  try {
    ensureInitialized();
    return statements.getAchievementsByStudent.all(studentId) as Achievement[];
  } catch (error) {
    console.error('Database error in getAchievementsByStudent:', error);
    throw error;
  }
}

export function insertAchievement(achievement: Achievement): void {
  try {
    ensureInitialized();
    statements.insertAchievement.run(
      achievement.id,
      achievement.studentId,
      achievement.title,
      achievement.description,
      achievement.category,
      achievement.earnedAt,
      achievement.points || 0
    );
  } catch (error) {
    console.error('Error inserting achievement:', error);
    throw error;
  }
}

export function getSelfAssessmentsByStudent(studentId: string): SelfAssessment[] {
  try {
    ensureInitialized();
    return statements.getSelfAssessmentsByStudent.all(studentId) as SelfAssessment[];
  } catch (error) {
    console.error('Database error in getSelfAssessmentsByStudent:', error);
    throw error;
  }
}

export function insertSelfAssessment(assessment: SelfAssessment): void {
  try {
    ensureInitialized();
    statements.insertSelfAssessment.run(
      assessment.id,
      assessment.studentId,
      assessment.moodRating,
      assessment.motivationLevel,
      assessment.stressLevel,
      assessment.confidenceLevel,
      assessment.studyDifficulty,
      assessment.socialInteraction,
      assessment.sleepQuality,
      assessment.physicalActivity,
      assessment.dailyGoalsAchieved,
      assessment.todayHighlight,
      assessment.todayChallenge,
      assessment.tomorrowGoal,
      assessment.notes,
      assessment.assessmentDate
    );
  } catch (error) {
    console.error('Error inserting self assessment:', error);
    throw error;
  }
}

export function getParentMeetingsByStudent(studentId: string): any[] {
  try {
    ensureInitialized();
    const meetings = statements.getParentMeetingsByStudent.all(studentId);
    
    return meetings.map((m: any) => ({
      ...m,
      participants: m.participants ? JSON.parse(m.participants) : [],
      mainTopics: m.mainTopics ? JSON.parse(m.mainTopics) : []
    }));
  } catch (error) {
    console.error('Database error in getParentMeetingsByStudent:', error);
    throw error;
  }
}

export function insertParentMeeting(meeting: ParentMeeting): void {
  try {
    ensureInitialized();
    
    const participantsJson = JSON.stringify(meeting.participants || []);
    const topicsJson = JSON.stringify(meeting.mainTopics || []);
    
    statements.insertParentMeeting.run(
      meeting.id,
      meeting.studentId,
      meeting.date,
      meeting.time,
      meeting.type,
      participantsJson,
      topicsJson,
      meeting.concerns,
      meeting.decisions,
      meeting.actionPlan,
      meeting.nextMeetingDate,
      meeting.parentSatisfaction,
      meeting.followUpRequired ? 1 : 0,
      meeting.notes,
      meeting.createdBy,
      meeting.createdAt
    );
  } catch (error) {
    console.error('Error inserting parent meeting:', error);
    throw error;
  }
}

export function updateParentMeeting(id: string, updates: any): void {
  try {
    ensureInitialized();
    const db = getDatabase();
    
    const updatesWithStringifiedArrays = { ...updates };
    if (updates.participants) {
      updatesWithStringifiedArrays.participants = JSON.stringify(updates.participants);
    }
    if (updates.mainTopics) {
      updatesWithStringifiedArrays.mainTopics = JSON.stringify(updates.mainTopics);
    }
    if (updates.followUpRequired !== undefined) {
      updatesWithStringifiedArrays.followUpRequired = updates.followUpRequired ? 1 : 0;
    }
    
    const allowedFields = ['date', 'time', 'type', 'participants', 'mainTopics', 'concerns', 
                          'decisions', 'actionPlan', 'nextMeetingDate', 'parentSatisfaction', 
                          'followUpRequired', 'notes'];
    const fields = Object.keys(updatesWithStringifiedArrays).filter(key => allowedFields.includes(key));
    
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updatesWithStringifiedArrays[field]);
    values.push(id);
    
    db.prepare(`UPDATE parent_meetings SET ${setClause} WHERE id = ?`).run(...values);
  } catch (error) {
    console.error('Error updating parent meeting:', error);
    throw error;
  }
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

export function getFamilyParticipationByStudent(studentId: string): any[] {
  try {
    ensureInitialized();
    const records = statements.getFamilyParticipationByStudent.all(studentId);
    
    return records.map((r: any) => ({
      ...r,
      participants: r.participants ? JSON.parse(r.participants) : []
    }));
  } catch (error) {
    console.error('Database error in getFamilyParticipationByStudent:', error);
    throw error;
  }
}

export function insertFamilyParticipation(record: FamilyParticipation): void {
  try {
    ensureInitialized();
    
    const participantsJson = JSON.stringify(record.participants || []);
    
    statements.insertFamilyParticipation.run(
      record.id,
      record.studentId,
      record.eventType,
      record.eventName,
      record.eventDate,
      record.participationStatus,
      participantsJson,
      record.engagementLevel,
      record.communicationFrequency,
      record.preferredContactMethod,
      record.parentAvailability,
      record.notes,
      record.recordedBy,
      record.recordedAt
    );
  } catch (error) {
    console.error('Error inserting family participation:', error);
    throw error;
  }
}

export function updateFamilyParticipation(id: string, updates: any): void {
  try {
    ensureInitialized();
    const db = getDatabase();
    
    const updatesWithStringifiedArrays = { ...updates };
    if (updates.participants) {
      updatesWithStringifiedArrays.participants = JSON.stringify(updates.participants);
    }
    
    const allowedFields = ['eventType', 'eventName', 'eventDate', 'participationStatus', 
                          'participants', 'engagementLevel', 'communicationFrequency', 
                          'preferredContactMethod', 'parentAvailability', 'notes'];
    const fields = Object.keys(updatesWithStringifiedArrays).filter(key => allowedFields.includes(key));
    
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updatesWithStringifiedArrays[field]);
    values.push(id);
    
    db.prepare(`UPDATE family_participation SET ${setClause} WHERE id = ?`).run(...values);
  } catch (error) {
    console.error('Error updating family participation:', error);
    throw error;
  }
}
