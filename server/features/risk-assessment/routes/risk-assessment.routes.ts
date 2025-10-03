import { RequestHandler } from 'express';
import * as riskAssessmentService from '../services/risk-assessment.service.js';

export const getRiskFactorsByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const records = riskAssessmentService.getRiskFactorsByStudent(studentId);
    res.json(records);
  } catch (error) {
    console.error('Error fetching risk factors:', error);
    res.status(500).json({ error: 'Risk faktörleri yüklenemedi' });
  }
};

export const getLatestRiskFactorsByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const record = riskAssessmentService.getLatestRiskFactorsByStudent(studentId);
    res.json(record);
  } catch (error) {
    console.error('Error fetching latest risk factors:', error);
    res.status(500).json({ error: 'En son risk faktörleri yüklenemedi' });
  }
};

export const getAllHighRiskStudents: RequestHandler = (req, res) => {
  try {
    const records = riskAssessmentService.getAllHighRiskStudents();
    res.json(records);
  } catch (error) {
    console.error('Error fetching high risk students:', error);
    res.status(500).json({ error: 'Yüksek riskli öğrenciler yüklenemedi' });
  }
};

export const createRiskFactors: RequestHandler = (req, res) => {
  try {
    const result = riskAssessmentService.createRiskFactors(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error creating risk factors:', error);
    res.status(500).json({ error: 'Risk faktörleri kaydedilemedi' });
  }
};

export const updateRiskFactors: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const result = riskAssessmentService.updateRiskFactors(id, req.body);
    res.json(result);
  } catch (error) {
    console.error('Error updating risk factors:', error);
    res.status(500).json({ error: 'Risk faktörleri güncellenemedi' });
  }
};

export const deleteRiskFactors: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const result = riskAssessmentService.deleteRiskFactors(id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting risk factors:', error);
    res.status(500).json({ error: 'Risk faktörleri silinemedi' });
  }
};
