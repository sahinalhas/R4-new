import { RequestHandler } from "express";
import * as surveyService from '../../services/surveys.service.js';

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
