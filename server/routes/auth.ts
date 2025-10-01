import { Request, Response } from 'express';
import {
  getUserSession,
  upsertUserSession,
  updateUserSessionActivity,
  deleteUserSession
} from '../lib/db-service.js';

export function getSession(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const session = getUserSession(userId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      userData: JSON.parse(session.userData),
      demoNoticeSeen: session.demoNoticeSeen
    });
  } catch (error) {
    console.error('Error getting session:', error);
    res.status(500).json({ error: 'Failed to get session' });
  }
}

export function saveSession(req: Request, res: Response) {
  try {
    const { userId, userData, demoNoticeSeen } = req.body;

    if (!userId || !userData) {
      return res.status(400).json({ 
        error: 'userId and userData are required' 
      });
    }

    upsertUserSession(
      userId,
      JSON.stringify(userData),
      Boolean(demoNoticeSeen)
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving session:', error);
    res.status(500).json({ error: 'Failed to save session' });
  }
}

export function updateSessionActivity(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    updateUserSessionActivity(userId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating session activity:', error);
    res.status(500).json({ error: 'Failed to update session activity' });
  }
}

export function deleteSession(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    deleteUserSession(userId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
}
