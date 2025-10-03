import { RequestHandler } from 'express';
import * as behaviorService from '../services/behavior.service.js';

export const getBehaviorIncidentsByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const incidents = behaviorService.getBehaviorIncidentsByStudent(studentId);
    res.json(incidents);
  } catch (error) {
    console.error('Error fetching behavior incidents:', error);
    res.status(500).json({ error: 'Davranış kayıtları yüklenemedi' });
  }
};

export const getBehaviorIncidentsByDateRange: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;
    const incidents = behaviorService.getBehaviorIncidentsByDateRange(
      studentId,
      startDate as string | undefined,
      endDate as string | undefined
    );
    res.json(incidents);
  } catch (error) {
    console.error('Error fetching behavior incidents by date range:', error);
    res.status(500).json({ error: 'Davranış kayıtları yüklenemedi' });
  }
};

export const getBehaviorStatsByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const stats = behaviorService.getBehaviorStatsByStudent(studentId);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching behavior stats:', error);
    res.status(500).json({ error: 'Davranış istatistikleri yüklenemedi' });
  }
};

export const createBehaviorIncident: RequestHandler = (req, res) => {
  try {
    const result = behaviorService.createBehaviorIncident(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error creating behavior incident:', error);
    res.status(500).json({ error: 'Davranış kaydı oluşturulamadı' });
  }
};

export const updateBehaviorIncident: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const result = behaviorService.updateBehaviorIncident(id, req.body);
    res.json(result);
  } catch (error) {
    console.error('Error updating behavior incident:', error);
    res.status(500).json({ error: 'Davranış kaydı güncellenemedi' });
  }
};

export const deleteBehaviorIncident: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const result = behaviorService.deleteBehaviorIncident(id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting behavior incident:', error);
    res.status(500).json({ error: 'Davranış kaydı silinemedi' });
  }
};
