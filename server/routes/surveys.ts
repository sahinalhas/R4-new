import { RequestHandler } from "express";
import { 
  loadSurveyTemplates, 
  saveSurveyTemplate,
  getSurveyTemplate,
  updateSurveyTemplate,
  deleteSurveyTemplate,
  getQuestionsByTemplate,
  saveSurveyQuestion,
  updateSurveyQuestion,
  deleteSurveyQuestion,
  deleteQuestionsByTemplate,
  loadSurveyDistributions,
  saveSurveyDistribution,
  getSurveyDistribution,
  getSurveyDistributionByLink,
  updateSurveyDistribution,
  deleteSurveyDistribution,
  loadSurveyResponses,
  saveSurveyResponse,
  updateSurveyResponse,
  deleteSurveyResponse
} from "../lib/db-service.js";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/errors.js";
import { sanitizeString } from "../middleware/validation.js";
import * as XLSX from 'xlsx';

// Survey Templates Routes
export const getSurveyTemplates: RequestHandler = (req, res) => {
  try {
    const templates = loadSurveyTemplates();
    res.json(templates);
  } catch (error) {
    console.error('Error fetching survey templates:', error);
    res.status(500).json({ success: false, error: 'Anket şablonları yüklenemedi' });
  }
};

export const getSurveyTemplateById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const template = getSurveyTemplate(id);
    
    if (!template) {
      return res.status(404).json({ success: false, error: 'Anket şablonu bulunamadı' });
    }
    
    res.json(template);
  } catch (error) {
    console.error('Error fetching survey template:', error);
    res.status(500).json({ success: false, error: 'Anket şablonu yüklenemedi' });
  }
};

export const createSurveyTemplate: RequestHandler = (req, res) => {
  try {
    const template = req.body;
    
    // Validate required fields
    if (!template.title || !template.type) {
      return res.status(400).json({ 
        success: false, 
        error: 'Başlık ve tür alanları gereklidir' 
      });
    }

    // Sanitize user-generated content to prevent XSS (not IDs)
    const sanitizedTemplate = {
      ...template,
      title: sanitizeString(template.title),
      description: template.description ? sanitizeString(template.description) : undefined,
      instructions: template.instructions ? sanitizeString(template.instructions) : undefined
    };

    saveSurveyTemplate(sanitizedTemplate);
    res.json({ success: true, message: 'Anket şablonu başarıyla oluşturuldu' });
  } catch (error) {
    console.error('Error creating survey template:', error);
    res.status(500).json({ success: false, error: 'Anket şablonu oluşturulamadı' });
  }
};

export const updateSurveyTemplateHandler: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const template = req.body;
    
    // Sanitize string fields to prevent XSS
    const sanitizedTemplate = {
      ...template,
      title: template.title ? sanitizeString(template.title) : undefined,
      description: template.description ? sanitizeString(template.description) : undefined,
      instructions: template.instructions ? sanitizeString(template.instructions) : undefined
    };
    
    updateSurveyTemplate(id, sanitizedTemplate);
    res.json({ success: true, message: 'Anket şablonu başarıyla güncellendi' });
  } catch (error) {
    console.error('Error updating survey template:', error);
    res.status(500).json({ success: false, error: 'Anket şablonu güncellenemedi' });
  }
};

export const deleteSurveyTemplateHandler: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    deleteSurveyTemplate(id);
    res.json({ success: true, message: 'Anket şablonu başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting survey template:', error);
    res.status(500).json({ success: false, error: 'Anket şablonu silinemedi' });
  }
};

// Survey Questions Routes
export const getQuestionsByTemplateId: RequestHandler = (req, res) => {
  try {
    const { templateId } = req.params;
    const questions = getQuestionsByTemplate(templateId);
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ success: false, error: 'Sorular yüklenemedi' });
  }
};

export const createSurveyQuestion: RequestHandler = (req, res) => {
  try {
    const question = req.body;
    
    // Validate required fields
    if (!question.templateId || !question.questionText || !question.questionType) {
      return res.status(400).json({ 
        success: false, 
        error: 'Şablon ID, soru metni ve soru türü gereklidir' 
      });
    }

    // Sanitize user-generated content to prevent XSS (not IDs)
    const sanitizedQuestion = {
      ...question,
      questionText: sanitizeString(question.questionText),
      helpText: question.helpText ? sanitizeString(question.helpText) : undefined,
      placeholder: question.placeholder ? sanitizeString(question.placeholder) : undefined,
      options: question.options ? question.options.map((opt: any) => ({
        ...opt,
        text: opt.text ? sanitizeString(opt.text) : opt.text,
        value: opt.value ? sanitizeString(opt.value) : opt.value
      })) : undefined
    };

    saveSurveyQuestion(sanitizedQuestion);
    res.json({ success: true, message: 'Soru başarıyla oluşturuldu' });
  } catch (error) {
    console.error('Error creating survey question:', error);
    res.status(500).json({ success: false, error: 'Soru oluşturulamadı' });
  }
};

export const updateSurveyQuestionHandler: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const question = req.body;
    
    // Sanitize string fields to prevent XSS
    const sanitizedQuestion = {
      ...question,
      questionText: question.questionText ? sanitizeString(question.questionText) : undefined,
      helpText: question.helpText ? sanitizeString(question.helpText) : undefined,
      placeholder: question.placeholder ? sanitizeString(question.placeholder) : undefined,
      options: question.options ? question.options.map((opt: any) => ({
        ...opt,
        text: opt.text ? sanitizeString(opt.text) : undefined,
        value: opt.value ? sanitizeString(opt.value) : undefined
      })) : undefined
    };
    
    updateSurveyQuestion(id, sanitizedQuestion);
    res.json({ success: true, message: 'Soru başarıyla güncellendi' });
  } catch (error) {
    console.error('Error updating survey question:', error);
    res.status(500).json({ success: false, error: 'Soru güncellenemedi' });
  }
};

export const deleteSurveyQuestionHandler: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    deleteSurveyQuestion(id);
    res.json({ success: true, message: 'Soru başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting survey question:', error);
    res.status(500).json({ success: false, error: 'Soru silinemedi' });
  }
};

export const deleteQuestionsByTemplateHandler: RequestHandler = (req, res) => {
  try {
    const { templateId } = req.params;
    deleteQuestionsByTemplate(templateId);
    res.json({ success: true, message: 'Şablon soruları başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting template questions:', error);
    res.status(500).json({ success: false, error: 'Şablon soruları silinemedi' });
  }
};

// Survey Distributions Routes
export const getSurveyDistributions: RequestHandler = (req, res) => {
  try {
    const distributions = loadSurveyDistributions();
    res.json(distributions);
  } catch (error) {
    console.error('Error fetching survey distributions:', error);
    res.status(500).json({ success: false, error: 'Anket dağıtımları yüklenemedi' });
  }
};

export const getSurveyDistributionById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const distribution = getSurveyDistribution(id);
    
    if (!distribution) {
      return res.status(404).json({ success: false, error: 'Anket dağıtımı bulunamadı' });
    }
    
    res.json(distribution);
  } catch (error) {
    console.error('Error fetching survey distribution:', error);
    res.status(500).json({ success: false, error: 'Anket dağıtımı yüklenemedi' });
  }
};

export const getSurveyDistributionByPublicLink: RequestHandler = (req, res) => {
  try {
    const { publicLink } = req.params;
    const distribution = getSurveyDistributionByLink(publicLink);
    
    if (!distribution) {
      return res.status(404).json({ success: false, error: 'Anket bulunamadı' });
    }
    
    // Check if distribution is active and within date range
    if (distribution.status !== 'ACTIVE') {
      return res.status(403).json({ success: false, error: 'Anket artık aktif değil' });
    }

    const now = new Date();
    if (distribution.startDate && new Date(distribution.startDate) > now) {
      return res.status(403).json({ success: false, error: 'Anket henüz başlamamış' });
    }

    if (distribution.endDate && new Date(distribution.endDate) < now) {
      return res.status(403).json({ success: false, error: 'Anket süresi dolmuş' });
    }
    
    res.json(distribution);
  } catch (error) {
    console.error('Error fetching survey distribution by link:', error);
    res.status(500).json({ success: false, error: 'Anket yüklenemedi' });
  }
};

export const createSurveyDistribution: RequestHandler = (req, res) => {
  try {
    const distribution = req.body;
    
    // Validate required fields
    if (!distribution.templateId || !distribution.title || !distribution.distributionType) {
      return res.status(400).json({ 
        success: false, 
        error: 'Şablon ID, başlık ve dağıtım türü gereklidir' 
      });
    }

    // Sanitize user-generated content to prevent XSS (not IDs)
    const sanitizedDistribution = {
      ...distribution,
      title: sanitizeString(distribution.title),
      description: distribution.description ? sanitizeString(distribution.description) : undefined,
      instructions: distribution.instructions ? sanitizeString(distribution.instructions) : undefined
    };

    saveSurveyDistribution(sanitizedDistribution);
    res.json({ success: true, message: 'Anket dağıtımı başarıyla oluşturuldu' });
  } catch (error) {
    console.error('Error creating survey distribution:', error);
    res.status(500).json({ success: false, error: 'Anket dağıtımı oluşturulamadı' });
  }
};

export const updateSurveyDistributionHandler: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const distribution = req.body;
    
    // Sanitize string fields to prevent XSS
    const sanitizedDistribution = {
      ...distribution,
      title: distribution.title ? sanitizeString(distribution.title) : undefined,
      description: distribution.description ? sanitizeString(distribution.description) : undefined,
      instructions: distribution.instructions ? sanitizeString(distribution.instructions) : undefined
    };
    
    updateSurveyDistribution(id, sanitizedDistribution);
    res.json({ success: true, message: 'Anket dağıtımı başarıyla güncellendi' });
  } catch (error) {
    console.error('Error updating survey distribution:', error);
    res.status(500).json({ success: false, error: 'Anket dağıtımı güncellenemedi' });
  }
};

export const deleteSurveyDistributionHandler: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    deleteSurveyDistribution(id);
    res.json({ success: true, message: 'Anket dağıtımı başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting survey distribution:', error);
    res.status(500).json({ success: false, error: 'Anket dağıtımı silinemedi' });
  }
};

// Survey Responses Routes
export const getSurveyResponses: RequestHandler = (req, res) => {
  try {
    const { distributionId, studentId } = req.query;
    
    let responses;
    if (distributionId) {
      responses = loadSurveyResponses({ distributionId: distributionId as string });
    } else if (studentId) {
      responses = loadSurveyResponses({ studentId: studentId as string });
    } else {
      responses = loadSurveyResponses();
    }
    
    res.json(responses);
  } catch (error) {
    console.error('Error fetching survey responses:', error);
    res.status(500).json({ success: false, error: 'Anket yanıtları yüklenemedi' });
  }
};

export const createSurveyResponse: RequestHandler = (req, res) => {
  try {
    const response = req.body;
    
    // Validate required fields
    if (!response.distributionId || !response.responseData) {
      return res.status(400).json({ 
        success: false, 
        error: 'Dağıtım ID ve yanıt verisi gereklidir' 
      });
    }

    // Get distribution and template to validate required questions
    const distribution = getSurveyDistribution(response.distributionId);
    if (!distribution) {
      return res.status(404).json({ 
        success: false, 
        error: 'Anket dağıtımı bulunamadı' 
      });
    }

    const template = getSurveyTemplate(distribution.templateId);
    if (!template) {
      return res.status(404).json({ 
        success: false, 
        error: 'Anket şablonu bulunamadı' 
      });
    }

    const questions = getQuestionsByTemplate(distribution.templateId);
    
    // Validate student info if not anonymous
    if (!distribution.allowAnonymous) {
      const studentInfo = response.studentInfo;
      if (!studentInfo?.name || !studentInfo?.class || !studentInfo?.number) {
        return res.status(400).json({ 
          success: false, 
          error: 'Öğrenci bilgileri zorunludur (ad, sınıf, numara)' 
        });
      }
    }

    // Validate all required questions are answered
    for (const question of questions) {
      if (question.required) {
        const answer = response.responseData?.[question.id];
        if (!answer || answer === '' || answer === null || answer === undefined) {
          return res.status(400).json({ 
            success: false, 
            error: `Soru ${question.orderIndex + 1} zorunludur ve yanıtlanmamış` 
          });
        }
      }
    }

    saveSurveyResponse(response);
    res.json({ success: true, message: 'Anket yanıtı başarıyla kaydedildi' });
  } catch (error) {
    console.error('Error creating survey response:', error);
    res.status(500).json({ success: false, error: 'Anket yanıtı kaydedilemedi' });
  }
};

export const updateSurveyResponseHandler: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const response = req.body;
    
    updateSurveyResponse(id, response);
    res.json({ success: true, message: 'Anket yanıtı başarıyla güncellendi' });
  } catch (error) {
    console.error('Error updating survey response:', error);
    res.status(500).json({ success: false, error: 'Anket yanıtı güncellenemedi' });
  }
};

export const deleteSurveyResponseHandler: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    deleteSurveyResponse(id);
    res.json({ success: true, message: 'Anket yanıtı başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting survey response:', error);
    res.status(500).json({ success: false, error: 'Anket yanıtı silinemedi' });
  }
};

// Survey Analytics Routes
export const getSurveyAnalytics: RequestHandler = (req, res) => {
  try {
    const { distributionId } = req.params;
    
    if (!distributionId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Dağıtım ID gereklidir' 
      });
    }

    // Get distribution and template info
    const distribution = getSurveyDistribution(distributionId);
    if (!distribution) {
      return res.status(404).json({ success: false, error: 'Anket dağıtımı bulunamadı' });
    }

    const template = getSurveyTemplate(distribution.templateId);
    if (!template) {
      return res.status(404).json({ success: false, error: 'Anket şablonu bulunamadı' });
    }

    const questions = getQuestionsByTemplate(distribution.templateId);
    const responses = loadSurveyResponses({ distributionId });

    // Calculate analytics
    const analytics = calculateSurveyAnalytics(distribution, template, questions, responses);
    
    res.json(analytics);
  } catch (error) {
    console.error('Error getting survey analytics:', error);
    res.status(500).json({ success: false, error: 'Anket analizleri yüklenemedi' });
  }
};

export const getSurveyQuestionAnalytics: RequestHandler = (req, res) => {
  try {
    const { distributionId, questionId } = req.params;
    
    const distribution = getSurveyDistribution(distributionId);
    if (!distribution) {
      return res.status(404).json({ success: false, error: 'Anket dağıtımı bulunamadı' });
    }

    const questions = getQuestionsByTemplate(distribution.templateId);
    const question = questions.find(q => q.id === questionId);
    if (!question) {
      return res.status(404).json({ success: false, error: 'Soru bulunamadı' });
    }

    const responses = loadSurveyResponses({ distributionId });
    
    // Calculate question-specific analytics
    const analytics = calculateQuestionAnalytics(question, responses);
    
    res.json(analytics);
  } catch (error) {
    console.error('Error getting question analytics:', error);
    res.status(500).json({ success: false, error: 'Soru analizleri yüklenemedi' });
  }
};

export const getDistributionStatistics: RequestHandler = (req, res) => {
  try {
    const { distributionId } = req.params;
    
    const distribution = getSurveyDistribution(distributionId);
    if (!distribution) {
      return res.status(404).json({ success: false, error: 'Anket dağıtımı bulunamadı' });
    }

    const responses = loadSurveyResponses({ distributionId });
    
    // Calculate basic statistics
    const stats = {
      totalResponses: responses.length,
      completionRate: distribution.maxResponses ? 
        (responses.length / distribution.maxResponses * 100).toFixed(1) + '%' : 
        'Sınırsız',
      responsesByDay: getResponsesByDay(responses),
      demographicBreakdown: getDemographicBreakdown(responses),
      submissionTypes: getSubmissionTypeBreakdown(responses)
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting distribution statistics:', error);
    res.status(500).json({ success: false, error: 'Dağıtım istatistikleri yüklenemedi' });
  }
};

import { SurveyDistribution, SurveyTemplate, SurveyQuestion, SurveyResponse, SurveyAnalytics, QuestionAnalytics, OptionCount, RatingDistribution, SentimentAnalysis } from '../types/survey-types.js';

// Helper functions for analytics calculations
function calculateSurveyAnalytics(distribution: SurveyDistribution, template: SurveyTemplate, questions: SurveyQuestion[], responses: SurveyResponse[]): SurveyAnalytics {
  const questionAnalytics = questions.map(question => 
    calculateQuestionAnalytics(question, responses)
  );

  return {
    distributionInfo: {
      id: distribution.id,
      title: distribution.title,
      templateTitle: template.title,
      status: distribution.status,
      totalTargets: distribution.targetStudents?.length || 0,
      totalResponses: responses.length,
      responseRate: distribution.targetStudents?.length ? 
        (responses.length / distribution.targetStudents.length * 100).toFixed(1) + '%' : 
        'N/A'
    },
    overallStats: {
      averageCompletionTime: calculateAverageCompletionTime(responses),
      mostSkippedQuestion: findMostSkippedQuestion(questions, responses),
      satisfactionScore: calculateOverallSatisfaction(questionAnalytics)
    },
    questionAnalytics
  };
}

function calculateQuestionAnalytics(question: SurveyQuestion, responses: SurveyResponse[]): QuestionAnalytics {
  const questionResponses = responses
    .map(r => r.responseData?.[question.id])
    .filter(answer => answer !== undefined && answer !== null && answer !== '');

  const analytics: QuestionAnalytics = {
    questionId: question.id,
    questionText: question.questionText,
    questionType: question.questionType,
    totalResponses: questionResponses.length,
    responseRate: responses.length > 0 ? 
      (questionResponses.length / responses.length * 100).toFixed(1) + '%' : '0%'
  };

  switch (question.questionType) {
    case 'MULTIPLE_CHOICE':
    case 'DROPDOWN':
      analytics.optionCounts = calculateOptionCounts(question.options || [], questionResponses);
      break;
    
    case 'LIKERT':
    case 'RATING':
      analytics.averageRating = calculateAverageRating(questionResponses);
      analytics.distribution = calculateRatingDistribution(questionResponses);
      break;
    
    case 'YES_NO':
      analytics.yesCount = questionResponses.filter(r => r === 'Evet' || r === 'yes' || r === true).length;
      analytics.noCount = questionResponses.filter(r => r === 'Hayır' || r === 'no' || r === false).length;
      break;
    
    case 'OPEN_ENDED':
      analytics.responses = questionResponses;
      analytics.averageLength = questionResponses.reduce((sum: number, r: string) => 
        sum + (r?.toString().length || 0), 0) / questionResponses.length;
      analytics.sentiment = analyzeSentiment(questionResponses);
      break;
  }

  return analytics;
}

function calculateOptionCounts(options: string[], responses: any[]): OptionCount[] {
  const counts = options.map(option => ({
    option,
    count: responses.filter(r => r === option).length,
    percentage: responses.length > 0 ? 
      (responses.filter(r => r === option).length / responses.length * 100).toFixed(1) : '0'
  }));
  
  return counts.sort((a, b) => b.count - a.count);
}

function calculateAverageRating(responses: any[]): number {
  const numericResponses = responses
    .map(r => typeof r === 'number' ? r : parseFloat(r))
    .filter(r => !isNaN(r));
  
  return numericResponses.length > 0 ? 
    numericResponses.reduce((sum, r) => sum + r, 0) / numericResponses.length : 0;
}

function calculateRatingDistribution(responses: any[]): RatingDistribution {
  const distribution: RatingDistribution = {};
  responses.forEach(response => {
    const rating = response.toString();
    distribution[rating] = (distribution[rating] || 0) + 1;
  });
  return distribution;
}

function analyzeSentiment(responses: any[]): SentimentAnalysis {
  // Simple sentiment analysis based on keywords
  const positiveKeywords = ['iyi', 'güzel', 'memnun', 'başarılı', 'harika', 'excellent', 'good', 'great'];
  const negativeKeywords = ['kötü', 'berbat', 'memnun değil', 'başarısız', 'poor', 'bad', 'terrible'];
  
  let positive = 0, negative = 0, neutral = 0;
  
  responses.forEach(response => {
    const text = response.toString().toLowerCase();
    const hasPositive = positiveKeywords.some(keyword => text.includes(keyword));
    const hasNegative = negativeKeywords.some(keyword => text.includes(keyword));
    
    if (hasPositive && !hasNegative) positive++;
    else if (hasNegative && !hasPositive) negative++;
    else neutral++;
  });
  
  return {
    positive,
    negative,
    neutral,
    overall: positive > negative ? 'positive' : negative > positive ? 'negative' : 'neutral'
  };
}

function getResponsesByDay(responses: any[]) {
  const byDay: { [key: string]: number } = {};
  responses.forEach(response => {
    const date = new Date(response.created_at).toISOString().split('T')[0];
    byDay[date] = (byDay[date] || 0) + 1;
  });
  return byDay;
}

function getDemographicBreakdown(responses: any[]) {
  const breakdown: any = {
    byClass: {},
    byGender: { E: 0, K: 0, unknown: 0 }
  };
  
  responses.forEach(response => {
    const studentInfo = response.studentInfo;
    if (studentInfo?.class) {
      breakdown.byClass[studentInfo.class] = (breakdown.byClass[studentInfo.class] || 0) + 1;
    }
    
    // Gender breakdown would need to be added based on student data
    // This is a placeholder
    breakdown.byGender.unknown++;
  });
  
  return breakdown;
}

function getSubmissionTypeBreakdown(responses: any[]) {
  const breakdown: { [key: string]: number } = {};
  responses.forEach(response => {
    const type = response.submissionType || 'ONLINE';
    breakdown[type] = (breakdown[type] || 0) + 1;
  });
  return breakdown;
}

function calculateAverageCompletionTime(responses: SurveyResponse[]): number | string {
  // This would require start/end timestamps
  // Placeholder implementation - would calculate actual completion time if timestamps available
  const responsesWithTime = responses.filter(r => r.completionTime && typeof r.completionTime === 'number');
  
  if (responsesWithTime.length === 0) return 'N/A';
  
  const avgTime = responsesWithTime.reduce((sum, r) => sum + (r.completionTime || 0), 0) / responsesWithTime.length;
  return Math.round(avgTime);
}

function findMostSkippedQuestion(questions: SurveyQuestion[], responses: SurveyResponse[]): string | null {
  let maxSkipped = 0;
  let mostSkippedQuestion: string | null = null;
  
  questions.forEach(question => {
    const skipped = responses.filter(r => 
      !r.responseData?.[question.id] || 
      r.responseData[question.id] === '' || 
      r.responseData[question.id] === null
    ).length;
    
    if (skipped > maxSkipped) {
      maxSkipped = skipped;
      mostSkippedQuestion = question.questionText;
    }
  });
  
  return mostSkippedQuestion;
}

function calculateOverallSatisfaction(questionAnalytics: QuestionAnalytics[]): string | number {
  const ratingQuestions = questionAnalytics.filter(q => 
    q.questionType === 'LIKERT' || q.questionType === 'RATING'
  );
  
  if (ratingQuestions.length === 0) return 'N/A';
  
  const avgRating = ratingQuestions.reduce((sum, q) => 
    sum + (typeof q.averageRating === 'number' ? q.averageRating : parseFloat(q.averageRating as string)), 0) / ratingQuestions.length;
  
  return Number(avgRating.toFixed(2));
}