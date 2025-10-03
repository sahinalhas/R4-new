import getDatabase from '../../../lib/database.js';
import type { SurveyTemplate, SurveyQuestion, SurveyDistribution, SurveyResponse } from '../types/surveys.types.js';

let statements: any = null;
let isInitialized = false;

function ensureInitialized(): void {
  if (isInitialized && statements) return;
  
  const db = getDatabase();
  
  statements = {
    getSurveyTemplates: db.prepare('SELECT * FROM survey_templates WHERE isActive = TRUE ORDER BY created_at DESC'),
    getSurveyTemplate: db.prepare('SELECT * FROM survey_templates WHERE id = ?'),
    insertSurveyTemplate: db.prepare(`
      INSERT INTO survey_templates (id, title, description, type, mebCompliant, isActive, createdBy, tags, estimatedDuration, targetGrades)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    updateSurveyTemplate: db.prepare(`
      UPDATE survey_templates SET title = ?, description = ?, type = ?, mebCompliant = ?, isActive = ?, 
                                 tags = ?, estimatedDuration = ?, targetGrades = ?
      WHERE id = ?
    `),
    deleteSurveyTemplate: db.prepare('UPDATE survey_templates SET isActive = FALSE WHERE id = ?'),
    
    getQuestionsByTemplate: db.prepare('SELECT * FROM survey_questions WHERE templateId = ? ORDER BY orderIndex'),
    insertSurveyQuestion: db.prepare(`
      INSERT INTO survey_questions (id, templateId, questionText, questionType, required, orderIndex, options, validation)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `),
    updateSurveyQuestion: db.prepare(`
      UPDATE survey_questions SET questionText = ?, questionType = ?, required = ?, orderIndex = ?, options = ?, validation = ?
      WHERE id = ?
    `),
    deleteSurveyQuestion: db.prepare('DELETE FROM survey_questions WHERE id = ?'),
    deleteQuestionsByTemplate: db.prepare('DELETE FROM survey_questions WHERE templateId = ?'),
    
    getSurveyDistributions: db.prepare('SELECT * FROM survey_distributions ORDER BY created_at DESC'),
    getSurveyDistribution: db.prepare('SELECT * FROM survey_distributions WHERE id = ?'),
    getSurveyDistributionByLink: db.prepare('SELECT * FROM survey_distributions WHERE publicLink = ?'),
    insertSurveyDistribution: db.prepare(`
      INSERT INTO survey_distributions (id, templateId, title, description, targetClasses, targetStudents, 
                                       distributionType, excelTemplate, publicLink, startDate, endDate, 
                                       allowAnonymous, maxResponses, status, createdBy)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    updateSurveyDistribution: db.prepare(`
      UPDATE survey_distributions SET title = ?, description = ?, targetClasses = ?, targetStudents = ?,
                                     distributionType = ?, startDate = ?, endDate = ?, allowAnonymous = ?,
                                     maxResponses = ?, status = ?
      WHERE id = ?
    `),
    deleteSurveyDistribution: db.prepare('DELETE FROM survey_distributions WHERE id = ?'),
    
    getSurveyResponses: db.prepare('SELECT * FROM survey_responses ORDER BY created_at DESC'),
    getSurveyResponsesByDistribution: db.prepare('SELECT * FROM survey_responses WHERE distributionId = ? ORDER BY created_at DESC'),
    getSurveyResponsesByStudent: db.prepare('SELECT * FROM survey_responses WHERE studentId = ? ORDER BY created_at DESC'),
    getSurveyResponse: db.prepare('SELECT * FROM survey_responses WHERE id = ?'),
    insertSurveyResponse: db.prepare(`
      INSERT INTO survey_responses (id, distributionId, studentId, studentInfo, responseData, submissionType, 
                                   isComplete, submittedAt, ipAddress, userAgent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    updateSurveyResponse: db.prepare(`
      UPDATE survey_responses SET responseData = ?, isComplete = ?, submittedAt = ?
      WHERE id = ?
    `),
    deleteSurveyResponse: db.prepare('DELETE FROM survey_responses WHERE id = ?'),
  };
  
  isInitialized = true;
}

export function loadSurveyTemplates(): SurveyTemplate[] {
  try {
    ensureInitialized();
    const templates = statements.getSurveyTemplates.all() as (SurveyTemplate & { tags: string | null; targetGrades: string | null })[];
    return templates.map(template => ({
      ...template,
      tags: template.tags ? JSON.parse(template.tags) : [],
      targetGrades: template.targetGrades ? JSON.parse(template.targetGrades) : []
    }));
  } catch (error) {
    console.error('Error loading survey templates:', error);
    return [];
  }
}

export function getSurveyTemplate(id: string): SurveyTemplate | null {
  try {
    ensureInitialized();
    const template = statements.getSurveyTemplate.get(id) as (SurveyTemplate & { tags: string | null; targetGrades: string | null }) | undefined;
    if (!template) return null;
    
    return {
      ...template,
      tags: template.tags ? JSON.parse(template.tags) : [],
      targetGrades: template.targetGrades ? JSON.parse(template.targetGrades) : []
    };
  } catch (error) {
    console.error('Error getting survey template:', error);
    return null;
  }
}

export function saveSurveyTemplate(template: SurveyTemplate): void {
  try {
    ensureInitialized();
    statements.insertSurveyTemplate.run(
      template.id,
      template.title,
      template.description || null,
      template.type,
      (template.mebCompliant || false) ? 1 : 0,
      (template.isActive ?? true) ? 1 : 0,
      template.createdBy || null,
      template.tags ? JSON.stringify(template.tags) : null,
      template.estimatedDuration || null,
      template.targetGrades ? JSON.stringify(template.targetGrades) : null
    );
  } catch (error) {
    console.error('Error saving survey template:', error);
    throw error;
  }
}

export function updateSurveyTemplate(id: string, template: Partial<SurveyTemplate>): void {
  try {
    ensureInitialized();
    statements.updateSurveyTemplate.run(
      template.title,
      template.description || null,
      template.type,
      (template.mebCompliant || false) ? 1 : 0,
      (template.isActive ?? true) ? 1 : 0,
      template.tags ? JSON.stringify(template.tags) : null,
      template.estimatedDuration || null,
      template.targetGrades ? JSON.stringify(template.targetGrades) : null,
      id
    );
  } catch (error) {
    console.error('Error updating survey template:', error);
    throw error;
  }
}

export function deleteSurveyTemplate(id: string): void {
  try {
    ensureInitialized();
    statements.deleteSurveyTemplate.run(id);
  } catch (error) {
    console.error('Error deleting survey template:', error);
    throw error;
  }
}

export function getQuestionsByTemplate(templateId: string): SurveyQuestion[] {
  try {
    ensureInitialized();
    const questions = statements.getQuestionsByTemplate.all(templateId) as any[];
    return questions.map(question => ({
      ...question,
      options: question.options ? JSON.parse(question.options) : null,
      validation: question.validation ? JSON.parse(question.validation) : null
    }));
  } catch (error) {
    console.error('Error getting questions by template:', error);
    return [];
  }
}

export function saveSurveyQuestion(question: any): void {
  try {
    ensureInitialized();
    statements.insertSurveyQuestion.run(
      question.id,
      question.templateId,
      question.questionText,
      question.questionType,
      (question.required || false) ? 1 : 0,
      question.orderIndex || 0,
      question.options ? JSON.stringify(question.options) : null,
      question.validation ? JSON.stringify(question.validation) : null
    );
  } catch (error) {
    console.error('Error saving survey question:', error);
    throw error;
  }
}

export function updateSurveyQuestion(id: string, question: any): void {
  try {
    ensureInitialized();
    statements.updateSurveyQuestion.run(
      question.questionText,
      question.questionType,
      (question.required || false) ? 1 : 0,
      question.orderIndex || 0,
      question.options ? JSON.stringify(question.options) : null,
      question.validation ? JSON.stringify(question.validation) : null,
      id
    );
  } catch (error) {
    console.error('Error updating survey question:', error);
    throw error;
  }
}

export function deleteSurveyQuestion(id: string): void {
  try {
    ensureInitialized();
    statements.deleteSurveyQuestion.run(id);
  } catch (error) {
    console.error('Error deleting survey question:', error);
    throw error;
  }
}

export function deleteQuestionsByTemplate(templateId: string): void {
  try {
    ensureInitialized();
    statements.deleteQuestionsByTemplate.run(templateId);
  } catch (error) {
    console.error('Error deleting questions by template:', error);
    throw error;
  }
}

export function loadSurveyDistributions(): SurveyDistribution[] {
  try {
    ensureInitialized();
    const distributions = statements.getSurveyDistributions.all() as any[];
    return distributions.map(distribution => ({
      ...distribution,
      targetClasses: distribution.targetClasses ? JSON.parse(distribution.targetClasses) : [],
      targetStudents: distribution.targetStudents ? JSON.parse(distribution.targetStudents) : []
    }));
  } catch (error) {
    console.error('Error loading survey distributions:', error);
    return [];
  }
}

export function getSurveyDistribution(id: string): SurveyDistribution | null {
  try {
    ensureInitialized();
    const distribution = statements.getSurveyDistribution.get(id) as any;
    if (!distribution) return null;
    
    return {
      ...distribution,
      targetClasses: distribution.targetClasses ? JSON.parse(distribution.targetClasses) : [],
      targetStudents: distribution.targetStudents ? JSON.parse(distribution.targetStudents) : []
    };
  } catch (error) {
    console.error('Error getting survey distribution:', error);
    return null;
  }
}

export function getSurveyDistributionByLink(publicLink: string): SurveyDistribution | null {
  try {
    ensureInitialized();
    const distribution = statements.getSurveyDistributionByLink.get(publicLink) as any;
    if (!distribution) return null;
    
    return {
      ...distribution,
      targetClasses: distribution.targetClasses ? JSON.parse(distribution.targetClasses) : [],
      targetStudents: distribution.targetStudents ? JSON.parse(distribution.targetStudents) : []
    };
  } catch (error) {
    console.error('Error getting survey distribution by link:', error);
    return null;
  }
}

export function saveSurveyDistribution(distribution: any): void {
  try {
    ensureInitialized();
    statements.insertSurveyDistribution.run(
      distribution.id,
      distribution.templateId,
      distribution.title,
      distribution.description || null,
      distribution.targetClasses ? JSON.stringify(distribution.targetClasses) : null,
      distribution.targetStudents ? JSON.stringify(distribution.targetStudents) : null,
      distribution.distributionType,
      distribution.excelTemplate || null,
      distribution.publicLink || null,
      distribution.startDate || null,
      distribution.endDate || null,
      (distribution.allowAnonymous || false) ? 1 : 0,
      distribution.maxResponses || null,
      distribution.status || 'DRAFT',
      distribution.createdBy || null
    );
  } catch (error) {
    console.error('Error saving survey distribution:', error);
    throw error;
  }
}

export function updateSurveyDistribution(id: string, distribution: any): void {
  try {
    ensureInitialized();
    statements.updateSurveyDistribution.run(
      distribution.title,
      distribution.description || null,
      distribution.targetClasses ? JSON.stringify(distribution.targetClasses) : null,
      distribution.targetStudents ? JSON.stringify(distribution.targetStudents) : null,
      distribution.distributionType,
      distribution.startDate || null,
      distribution.endDate || null,
      (distribution.allowAnonymous || false) ? 1 : 0,
      distribution.maxResponses || null,
      distribution.status || 'DRAFT',
      id
    );
  } catch (error) {
    console.error('Error updating survey distribution:', error);
    throw error;
  }
}

export function deleteSurveyDistribution(id: string): void {
  try {
    ensureInitialized();
    statements.deleteSurveyDistribution.run(id);
  } catch (error) {
    console.error('Error deleting survey distribution:', error);
    throw error;
  }
}

export function loadSurveyResponses(filters?: { distributionId?: string; studentId?: string }): SurveyResponse[] {
  try {
    ensureInitialized();
    let responses: any[];
    
    if (filters?.distributionId) {
      responses = statements.getSurveyResponsesByDistribution.all(filters.distributionId) as any[];
    } else if (filters?.studentId) {
      responses = statements.getSurveyResponsesByStudent.all(filters.studentId) as any[];
    } else {
      responses = statements.getSurveyResponses.all() as any[];
    }
    
    return responses.map(response => ({
      ...response,
      responseData: response.responseData ? JSON.parse(response.responseData) : {},
      studentInfo: response.studentInfo ? JSON.parse(response.studentInfo) : null
    }));
  } catch (error) {
    console.error('Error loading survey responses:', error);
    return [];
  }
}

export function saveSurveyResponse(response: any): void {
  try {
    ensureInitialized();
    statements.insertSurveyResponse.run(
      response.id,
      response.distributionId,
      response.studentId || null,
      response.studentInfo ? JSON.stringify(response.studentInfo) : null,
      response.responseData ? JSON.stringify(response.responseData) : '{}',
      response.submissionType || 'ONLINE',
      (response.isComplete || false) ? 1 : 0,
      response.submittedAt || null,
      response.ipAddress || null,
      response.userAgent || null
    );
  } catch (error) {
    console.error('Error saving survey response:', error);
    throw error;
  }
}

export function updateSurveyResponse(id: string, response: any): void {
  try {
    ensureInitialized();
    statements.updateSurveyResponse.run(
      response.responseData ? JSON.stringify(response.responseData) : '{}',
      (response.isComplete || false) ? 1 : 0,
      response.submittedAt || null,
      id
    );
  } catch (error) {
    console.error('Error updating survey response:', error);
    throw error;
  }
}

export function deleteSurveyResponse(id: string): void {
  try {
    ensureInitialized();
    statements.deleteSurveyResponse.run(id);
  } catch (error) {
    console.error('Error deleting survey response:', error);
    throw error;
  }
}
