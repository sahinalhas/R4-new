import { Request, Response } from 'express';
import {
  getStudySessionsByStudent,
  insertStudySession
} from '../lib/db-service.js';

export function getStudySessions(req: Request, res: Response) {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ error: 'studentId is required' });
    }

    const sessions = getStudySessionsByStudent(studentId);
    res.json(sessions);
  } catch (error) {
    console.error('Error getting study sessions:', error);
    res.status(500).json({ error: 'Failed to get study sessions' });
  }
}

export function saveStudySession(req: Request, res: Response) {
  try {
    const { id, studentId, topicId, startTime, endTime, duration, notes, efficiency } = req.body;

    if (!id || !studentId || !topicId || !startTime) {
      return res.status(400).json({ 
        error: 'id, studentId, topicId, and startTime are required' 
      });
    }

    insertStudySession(id, studentId, topicId, startTime, endTime, duration, notes, efficiency);
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving study session:', error);
    res.status(500).json({ error: 'Failed to save study session' });
  }
}
