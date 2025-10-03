import { RequestHandler } from 'express';
import * as healthService from '../services/health.service.js';

export const getHealthInfoByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const healthInfo = healthService.getHealthInfoByStudent(studentId);
    res.json(healthInfo);
  } catch (error) {
    console.error('Error fetching health info:', error);
    res.status(500).json({ error: 'Sağlık bilgileri yüklenemedi' });
  }
};

export const createOrUpdateHealthInfo: RequestHandler = (req, res) => {
  try {
    const result = healthService.createOrUpdateHealthInfo(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error saving health info:', error);
    res.status(500).json({ error: 'Sağlık bilgileri kaydedilemedi' });
  }
};

export const deleteHealthInfo: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const result = healthService.deleteHealthInfo(studentId);
    res.json(result);
  } catch (error) {
    console.error('Error deleting health info:', error);
    res.status(500).json({ error: 'Sağlık bilgileri silinemedi' });
  }
};
