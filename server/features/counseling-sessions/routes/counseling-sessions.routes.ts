import { Request, Response } from 'express';
import * as service from '../services/counseling-sessions.service.js';

export function getAllCounselingSessions(req: Request, res: Response) {
  try {
    const sessions = service.getAllSessionsWithStudents();
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching counseling sessions:', error);
    res.status(500).json({ error: 'Görüşmeler yüklenemedi' });
  }
}

export function getActiveCounselingSessions(req: Request, res: Response) {
  try {
    const sessions = service.getActiveSessionsWithStudents();
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching active counseling sessions:', error);
    res.status(500).json({ error: 'Aktif görüşmeler yüklenemedi' });
  }
}

export function getCounselingSessionById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const session = service.getSessionByIdWithStudents(id);
    
    if (!session) {
      return res.status(404).json({ error: 'Görüşme bulunamadı' });
    }
    
    res.json(session);
  } catch (error) {
    console.error('Error fetching counseling session:', error);
    res.status(500).json({ error: 'Görüşme yüklenemedi' });
  }
}

export function createCounselingSession(req: Request, res: Response) {
  try {
    const { id, sessionType, counselorId, sessionDate, entryTime, topic, studentIds } = req.body;
    
    if (!id || !sessionType || !counselorId || !sessionDate || !entryTime || !topic) {
      return res.status(400).json({ error: 'Zorunlu alanlar eksik' });
    }
    
    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ error: 'En az bir öğrenci seçilmelidir' });
    }
    
    const result = service.createCounselingSession(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error creating counseling session:', error);
    res.status(500).json({ error: 'Görüşme kaydedilemedi' });
  }
}

export function completeCounselingSession(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { exitTime, exitClassHourId, detailedNotes, autoCompleted } = req.body;
    
    if (!exitTime) {
      return res.status(400).json({ error: 'Çıkış saati gereklidir' });
    }
    
    const result = service.completeCounselingSession(
      id,
      exitTime,
      exitClassHourId || null,
      detailedNotes || null,
      autoCompleted || false
    );
    
    if (result.notFound) {
      return res.status(404).json({ error: 'Görüşme bulunamadı' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error completing counseling session:', error);
    res.status(500).json({ error: 'Görüşme tamamlanamadı' });
  }
}

export function extendCounselingSession(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = service.extendCounselingSession(id);
    
    if (result.notFound) {
      return res.status(404).json({ error: 'Görüşme bulunamadı' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error extending counseling session:', error);
    res.status(500).json({ error: 'Görüşme uzatılamadı' });
  }
}

export function autoCompleteCounselingSessions(req: Request, res: Response) {
  try {
    const result = service.autoCompleteSessions();
    res.json(result);
  } catch (error) {
    console.error('Error auto-completing counseling sessions:', error);
    res.status(500).json({ error: 'Otomatik tamamlama başarısız' });
  }
}

export function deleteCounselingSession(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = service.deleteCounselingSession(id);
    
    if (result.notFound) {
      return res.status(404).json({ error: 'Görüşme bulunamadı' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting counseling session:', error);
    res.status(500).json({ error: 'Görüşme silinemedi' });
  }
}

export function getClassHours(req: Request, res: Response) {
  try {
    const classHours = service.getClassHours();
    res.json(classHours);
  } catch (error) {
    console.error('Error fetching class hours:', error);
    res.status(500).json({ error: 'Ders saatleri yüklenemedi' });
  }
}

export function getCounselingTopics(req: Request, res: Response) {
  try {
    const topics = service.getCounselingTopics();
    res.json(topics);
  } catch (error) {
    console.error('Error fetching counseling topics:', error);
    res.status(500).json({ error: 'Görüşme konuları yüklenemedi' });
  }
}
