import * as repository from '../../repository/surveys.repository.js';
import { sanitizeString } from '../../../../middleware/validation.js';

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
