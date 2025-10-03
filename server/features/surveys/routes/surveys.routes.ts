import { RequestHandler } from "express";
import * as surveyService from '../services/surveys.service.js';
import * as repository from '../repository/surveys.repository.js';

export const getSurveyTemplates: RequestHandler = (req, res) => {
  try {
    const templates = surveyService.getAllTemplates();
    res.json(templates);
  } catch (error) {
    console.error('Error fetching survey templates:', error);
    res.status(500).json({ success: false, error: 'Anket şablonları yüklenemedi' });
  }
};

export const getSurveyTemplateById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const template = surveyService.getTemplateById(id);
    
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
    
    if (!template.title || !template.type) {
      return res.status(400).json({ 
        success: false, 
        error: 'Başlık ve tür alanları gereklidir' 
      });
    }

    surveyService.createTemplate(template);
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
    
    surveyService.updateTemplate(id, template);
    res.json({ success: true, message: 'Anket şablonu başarıyla güncellendi' });
  } catch (error) {
    console.error('Error updating survey template:', error);
    res.status(500).json({ success: false, error: 'Anket şablonu güncellenemedi' });
  }
};

export const deleteSurveyTemplateHandler: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    surveyService.deleteTemplate(id);
    res.json({ success: true, message: 'Anket şablonu başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting survey template:', error);
    res.status(500).json({ success: false, error: 'Anket şablonu silinemedi' });
  }
};

export const getQuestionsByTemplateId: RequestHandler = (req, res) => {
  try {
    const { templateId } = req.params;
    const questions = surveyService.getTemplateQuestions(templateId);
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ success: false, error: 'Sorular yüklenemedi' });
  }
};

export const createSurveyQuestion: RequestHandler = (req, res) => {
  try {
    const question = req.body;
    
    if (!question.templateId || !question.questionText || !question.questionType) {
      return res.status(400).json({ 
        success: false, 
        error: 'Şablon ID, soru metni ve soru türü gereklidir' 
      });
    }

    surveyService.createQuestion(question);
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
    
    surveyService.updateQuestion(id, question);
    res.json({ success: true, message: 'Soru başarıyla güncellendi' });
  } catch (error) {
    console.error('Error updating survey question:', error);
    res.status(500).json({ success: false, error: 'Soru güncellenemedi' });
  }
};

export const deleteSurveyQuestionHandler: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    surveyService.deleteQuestion(id);
    res.json({ success: true, message: 'Soru başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting survey question:', error);
    res.status(500).json({ success: false, error: 'Soru silinemedi' });
  }
};

export const deleteQuestionsByTemplateHandler: RequestHandler = (req, res) => {
  try {
    const { templateId } = req.params;
    surveyService.deleteTemplateQuestions(templateId);
    res.json({ success: true, message: 'Şablon soruları başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting template questions:', error);
    res.status(500).json({ success: false, error: 'Şablon soruları silinemedi' });
  }
};

export const getSurveyDistributions: RequestHandler = (req, res) => {
  try {
    const distributions = surveyService.getAllDistributions();
    res.json(distributions);
  } catch (error) {
    console.error('Error fetching survey distributions:', error);
    res.status(500).json({ success: false, error: 'Anket dağıtımları yüklenemedi' });
  }
};

export const getSurveyDistributionById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const distribution = surveyService.getDistributionById(id);
    
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
    const distribution = surveyService.getDistributionByPublicLink(publicLink);
    
    if (!distribution) {
      return res.status(404).json({ success: false, error: 'Anket bulunamadı' });
    }
    
    try {
      surveyService.validateDistributionStatus(distribution);
    } catch (error: any) {
      return res.status(403).json({ success: false, error: error.message });
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
    
    if (!distribution.templateId || !distribution.title || !distribution.distributionType) {
      return res.status(400).json({ 
        success: false, 
        error: 'Şablon ID, başlık ve dağıtım türü gereklidir' 
      });
    }

    surveyService.createDistribution(distribution);
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
    
    surveyService.updateDistribution(id, distribution);
    res.json({ success: true, message: 'Anket dağıtımı başarıyla güncellendi' });
  } catch (error) {
    console.error('Error updating survey distribution:', error);
    res.status(500).json({ success: false, error: 'Anket dağıtımı güncellenemedi' });
  }
};

export const deleteSurveyDistributionHandler: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    surveyService.deleteDistribution(id);
    res.json({ success: true, message: 'Anket dağıtımı başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting survey distribution:', error);
    res.status(500).json({ success: false, error: 'Anket dağıtımı silinemedi' });
  }
};

export const getSurveyResponses: RequestHandler = (req, res) => {
  try {
    const { distributionId, studentId } = req.query;
    
    let responses;
    if (distributionId) {
      responses = surveyService.getResponses({ distributionId: distributionId as string });
    } else if (studentId) {
      responses = surveyService.getResponses({ studentId: studentId as string });
    } else {
      responses = surveyService.getResponses();
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
    
    if (!response.distributionId || !response.responseData) {
      return res.status(400).json({ 
        success: false, 
        error: 'Dağıtım ID ve yanıt verisi gereklidir' 
      });
    }

    const distribution = surveyService.getDistributionById(response.distributionId);
    if (!distribution) {
      return res.status(404).json({ 
        success: false, 
        error: 'Anket dağıtımı bulunamadı' 
      });
    }

    const template = surveyService.getTemplateById(distribution.templateId);
    if (!template) {
      return res.status(404).json({ 
        success: false, 
        error: 'Anket şablonu bulunamadı' 
      });
    }

    const questions = surveyService.getTemplateQuestions(distribution.templateId);
    
    try {
      surveyService.validateResponseData(distribution, questions, response.responseData, response.studentInfo);
    } catch (error: any) {
      return res.status(400).json({ 
        success: false, 
        error: error.message 
      });
    }

    surveyService.createResponse(response);
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
    
    surveyService.updateResponse(id, response);
    res.json({ success: true, message: 'Anket yanıtı başarıyla güncellendi' });
  } catch (error) {
    console.error('Error updating survey response:', error);
    res.status(500).json({ success: false, error: 'Anket yanıtı güncellenemedi' });
  }
};

export const deleteSurveyResponseHandler: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    surveyService.deleteResponse(id);
    res.json({ success: true, message: 'Anket yanıtı başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting survey response:', error);
    res.status(500).json({ success: false, error: 'Anket yanıtı silinemedi' });
  }
};

export const getSurveyAnalytics: RequestHandler = (req, res) => {
  try {
    const { distributionId } = req.params;
    
    if (!distributionId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Dağıtım ID gereklidir' 
      });
    }

    const distribution = surveyService.getDistributionById(distributionId);
    if (!distribution) {
      return res.status(404).json({ success: false, error: 'Anket dağıtımı bulunamadı' });
    }

    const template = surveyService.getTemplateById(distribution.templateId);
    if (!template) {
      return res.status(404).json({ success: false, error: 'Anket şablonu bulunamadı' });
    }

    const questions = surveyService.getTemplateQuestions(distribution.templateId);
    const responses = surveyService.getResponses({ distributionId });

    const analytics = surveyService.calculateSurveyAnalytics(distribution, template, questions, responses);
    
    res.json(analytics);
  } catch (error) {
    console.error('Error getting survey analytics:', error);
    res.status(500).json({ success: false, error: 'Anket analizleri yüklenemedi' });
  }
};

export const getSurveyQuestionAnalytics: RequestHandler = (req, res) => {
  try {
    const { distributionId, questionId } = req.params;
    
    const distribution = surveyService.getDistributionById(distributionId);
    if (!distribution) {
      return res.status(404).json({ success: false, error: 'Anket dağıtımı bulunamadı' });
    }

    const questions = surveyService.getTemplateQuestions(distribution.templateId);
    const question = questions.find(q => q.id === questionId);
    if (!question) {
      return res.status(404).json({ success: false, error: 'Soru bulunamadı' });
    }

    const responses = surveyService.getResponses({ distributionId });
    
    const analytics = surveyService.calculateQuestionAnalytics(question, responses);
    
    res.json(analytics);
  } catch (error) {
    console.error('Error getting question analytics:', error);
    res.status(500).json({ success: false, error: 'Soru analizleri yüklenemedi' });
  }
};

export const getDistributionStatistics: RequestHandler = (req, res) => {
  try {
    const { distributionId } = req.params;
    
    const distribution = surveyService.getDistributionById(distributionId);
    if (!distribution) {
      return res.status(404).json({ success: false, error: 'Anket dağıtımı bulunamadı' });
    }

    const responses = surveyService.getResponses({ distributionId });
    
    const stats = surveyService.calculateDistributionStatistics(distribution, responses);
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting distribution statistics:', error);
    res.status(500).json({ success: false, error: 'Dağıtım istatistikleri yüklenemedi' });
  }
};
