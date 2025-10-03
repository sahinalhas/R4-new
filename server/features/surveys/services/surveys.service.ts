import * as repository from '../repository/surveys.repository.js';
import { sanitizeString } from '../../../middleware/validation.js';
import type { 
  SurveyTemplate, 
  SurveyQuestion, 
  SurveyDistribution, 
  SurveyResponse,
  SurveyAnalytics,
  QuestionAnalytics,
  OptionCount,
  RatingDistribution,
  SentimentAnalysis,
  DistributionStatistics
} from '../types/surveys.types.js';

export function getAllTemplates() {
  return repository.loadSurveyTemplates();
}

export function getTemplateById(id: string) {
  return repository.getSurveyTemplate(id);
}

export function createTemplate(template: SurveyTemplate) {
  const sanitizedTemplate = {
    ...template,
    title: sanitizeString(template.title),
    description: template.description ? sanitizeString(template.description) : undefined
  };
  
  repository.saveSurveyTemplate(sanitizedTemplate as SurveyTemplate);
}

export function updateTemplate(id: string, template: Partial<SurveyTemplate>) {
  const sanitizedTemplate = {
    ...template,
    title: template.title ? sanitizeString(template.title) : undefined,
    description: template.description ? sanitizeString(template.description) : undefined
  };
  
  repository.updateSurveyTemplate(id, sanitizedTemplate);
}

export function deleteTemplate(id: string) {
  repository.deleteSurveyTemplate(id);
}

export function getTemplateQuestions(templateId: string) {
  return repository.getQuestionsByTemplate(templateId);
}

export function createQuestion(question: any) {
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
  
  repository.saveSurveyQuestion(sanitizedQuestion);
}

export function updateQuestion(id: string, question: any) {
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
  
  repository.updateSurveyQuestion(id, sanitizedQuestion);
}

export function deleteQuestion(id: string) {
  repository.deleteSurveyQuestion(id);
}

export function deleteTemplateQuestions(templateId: string) {
  repository.deleteQuestionsByTemplate(templateId);
}

export function getAllDistributions() {
  return repository.loadSurveyDistributions();
}

export function getDistributionById(id: string) {
  return repository.getSurveyDistribution(id);
}

export function getDistributionByPublicLink(publicLink: string) {
  return repository.getSurveyDistributionByLink(publicLink);
}

export function createDistribution(distribution: any) {
  const sanitizedDistribution = {
    ...distribution,
    title: sanitizeString(distribution.title),
    description: distribution.description ? sanitizeString(distribution.description) : undefined
  };
  
  repository.saveSurveyDistribution(sanitizedDistribution);
}

export function updateDistribution(id: string, distribution: any) {
  const sanitizedDistribution = {
    ...distribution,
    title: distribution.title ? sanitizeString(distribution.title) : undefined,
    description: distribution.description ? sanitizeString(distribution.description) : undefined
  };
  
  repository.updateSurveyDistribution(id, sanitizedDistribution);
}

export function deleteDistribution(id: string) {
  repository.deleteSurveyDistribution(id);
}

export function getResponses(filters?: { distributionId?: string; studentId?: string }) {
  return repository.loadSurveyResponses(filters);
}

export function createResponse(response: any) {
  repository.saveSurveyResponse(response);
}

export function updateResponse(id: string, response: any) {
  repository.updateSurveyResponse(id, response);
}

export function deleteResponse(id: string) {
  repository.deleteSurveyResponse(id);
}

export function validateDistributionStatus(distribution: SurveyDistribution) {
  if (distribution.status !== 'ACTIVE') {
    throw new Error('Anket artık aktif değil');
  }

  const now = new Date();
  if (distribution.startDate && new Date(distribution.startDate) > now) {
    throw new Error('Anket henüz başlamamış');
  }

  if (distribution.endDate && new Date(distribution.endDate) < now) {
    throw new Error('Anket süresi dolmuş');
  }
}

export function validateResponseData(distribution: SurveyDistribution, questions: SurveyQuestion[], responseData: any, studentInfo?: any) {
  if (!distribution.allowAnonymous) {
    if (!studentInfo?.name || !studentInfo?.class || !studentInfo?.number) {
      throw new Error('Öğrenci bilgileri zorunludur (ad, sınıf, numara)');
    }
  }

  for (const question of questions) {
    if (question.required) {
      const answer = responseData?.[question.id];
      if (!answer || answer === '' || answer === null || answer === undefined) {
        throw new Error(`Soru ${question.orderIndex + 1} zorunludur ve yanıtlanmamış`);
      }
    }
  }
}

export function calculateSurveyAnalytics(
  distribution: SurveyDistribution, 
  template: SurveyTemplate, 
  questions: SurveyQuestion[], 
  responses: SurveyResponse[]
): SurveyAnalytics {
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

export function calculateQuestionAnalytics(question: SurveyQuestion, responses: SurveyResponse[]): QuestionAnalytics {
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

function calculateAverageCompletionTime(responses: SurveyResponse[]): number | string {
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

export function getResponsesByDay(responses: any[]) {
  const byDay: { [key: string]: number } = {};
  responses.forEach(response => {
    const date = new Date(response.created_at).toISOString().split('T')[0];
    byDay[date] = (byDay[date] || 0) + 1;
  });
  return byDay;
}

export function getDemographicBreakdown(responses: any[]) {
  const breakdown: any = {
    byClass: {},
    byGender: { E: 0, K: 0, unknown: 0 }
  };
  
  responses.forEach(response => {
    const studentInfo = response.studentInfo;
    if (studentInfo?.class) {
      breakdown.byClass[studentInfo.class] = (breakdown.byClass[studentInfo.class] || 0) + 1;
    }
    
    breakdown.byGender.unknown++;
  });
  
  return breakdown;
}

export function getSubmissionTypeBreakdown(responses: any[]) {
  const breakdown: { [key: string]: number } = {};
  responses.forEach(response => {
    const type = response.submissionType || 'ONLINE';
    breakdown[type] = (breakdown[type] || 0) + 1;
  });
  return breakdown;
}

export function calculateDistributionStatistics(distribution: SurveyDistribution, responses: SurveyResponse[]): DistributionStatistics {
  return {
    totalResponses: responses.length,
    completionRate: distribution.maxResponses ? 
      (responses.length / distribution.maxResponses * 100).toFixed(1) + '%' : 
      'Sınırsız',
    responsesByDay: getResponsesByDay(responses),
    demographicBreakdown: getDemographicBreakdown(responses),
    submissionTypes: getSubmissionTypeBreakdown(responses)
  };
}
