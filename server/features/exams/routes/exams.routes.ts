import { RequestHandler } from 'express';
import * as examsService from '../services/exams.service.js';

export const getExamResultsByStudent: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const results = examsService.getStudentExamResults(studentId);
    res.json(results);
  } catch (error) {
    console.error('Error fetching exam results:', error);
    res.status(500).json({ error: 'Sınav sonuçları yüklenemedi' });
  }
};

export const getExamResultsByType: RequestHandler = (req, res) => {
  try {
    const { studentId, examType } = req.params;
    const results = examsService.getStudentExamResultsByType(studentId, examType);
    res.json(results);
  } catch (error) {
    console.error('Error fetching exam results by type:', error);
    res.status(500).json({ error: 'Sınav sonuçları yüklenemedi' });
  }
};

export const getLatestExamResult: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const { examType } = req.query;
    const result = examsService.getStudentLatestExamResult(studentId, examType as string | undefined);
    res.json(result);
  } catch (error) {
    console.error('Error fetching latest exam result:', error);
    res.status(500).json({ error: 'En son sınav sonucu yüklenemedi' });
  }
};

export const getExamProgressAnalysis: RequestHandler = (req, res) => {
  try {
    const { studentId, examType } = req.params;
    const results = examsService.getStudentExamProgress(studentId, examType);
    res.json(results);
  } catch (error) {
    console.error('Error fetching exam progress analysis:', error);
    res.status(500).json({ error: 'Sınav gelişim analizi yüklenemedi' });
  }
};

export const createExamResult: RequestHandler = (req, res) => {
  try {
    const result = examsService.createExamResult(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error creating exam result:', error);
    res.status(500).json({ error: 'Sınav sonucu kaydedilemedi' });
  }
};

export const updateExamResult: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const result = examsService.updateExamResult(id, req.body);
    res.json(result);
  } catch (error) {
    console.error('Error updating exam result:', error);
    res.status(500).json({ error: 'Sınav sonucu güncellenemedi' });
  }
};

export const deleteExamResult: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const result = examsService.deleteExamResult(id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting exam result:', error);
    res.status(500).json({ error: 'Sınav sonucu silinemedi' });
  }
};
