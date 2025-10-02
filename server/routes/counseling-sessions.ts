import { Router, RequestHandler } from 'express';
import getDatabase from '../lib/database.js';

const router = Router();

export const getAllCounselingSessions: RequestHandler = (req, res) => {
  try {
    const db = getDatabase();
    
    const sessions = db.prepare(`
      SELECT * FROM counseling_sessions 
      ORDER BY sessionDate DESC, entryTime DESC
    `).all();
    
    const sessionsWithStudents = sessions.map((session: any) => {
      if (session.sessionType === 'group') {
        const students = db.prepare(`
          SELECT s.* FROM students s
          INNER JOIN counseling_session_students css ON s.id = css.studentId
          WHERE css.sessionId = ?
        `).all(session.id);
        return { ...session, students };
      } else {
        const student = db.prepare(`
          SELECT s.* FROM students s
          INNER JOIN counseling_session_students css ON s.id = css.studentId
          WHERE css.sessionId = ?
          LIMIT 1
        `).get(session.id);
        return { ...session, student };
      }
    });
    
    res.json(sessionsWithStudents);
  } catch (error) {
    console.error('Error fetching counseling sessions:', error);
    res.status(500).json({ error: 'Görüşmeler yüklenemedi' });
  }
};

export const getActiveCounselingSessions: RequestHandler = (req, res) => {
  try {
    const db = getDatabase();
    
    const sessions = db.prepare(`
      SELECT * FROM counseling_sessions 
      WHERE completed = 0
      ORDER BY sessionDate DESC, entryTime DESC
    `).all();
    
    const sessionsWithStudents = sessions.map((session: any) => {
      if (session.sessionType === 'group') {
        const students = db.prepare(`
          SELECT s.* FROM students s
          INNER JOIN counseling_session_students css ON s.id = css.studentId
          WHERE css.sessionId = ?
        `).all(session.id);
        return { ...session, students };
      } else {
        const student = db.prepare(`
          SELECT s.* FROM students s
          INNER JOIN counseling_session_students css ON s.id = css.studentId
          WHERE css.sessionId = ?
          LIMIT 1
        `).get(session.id);
        return { ...session, student };
      }
    });
    
    res.json(sessionsWithStudents);
  } catch (error) {
    console.error('Error fetching active counseling sessions:', error);
    res.status(500).json({ error: 'Aktif görüşmeler yüklenemedi' });
  }
};

export const getCounselingSessionById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    const session: any = db.prepare('SELECT * FROM counseling_sessions WHERE id = ?').get(id);
    
    if (!session) {
      return res.status(404).json({ error: 'Görüşme bulunamadı' });
    }
    
    if (session.sessionType === 'group') {
      const students = db.prepare(`
        SELECT s.* FROM students s
        INNER JOIN counseling_session_students css ON s.id = css.studentId
        WHERE css.sessionId = ?
      `).all(id);
      return res.json({ ...session, students });
    } else {
      const student = db.prepare(`
        SELECT s.* FROM students s
        INNER JOIN counseling_session_students css ON s.id = css.studentId
        WHERE css.sessionId = ?
        LIMIT 1
      `).get(id);
      return res.json({ ...session, student });
    }
  } catch (error) {
    console.error('Error fetching counseling session:', error);
    res.status(500).json({ error: 'Görüşme yüklenemedi' });
  }
};

export const createCounselingSession: RequestHandler = (req, res) => {
  try {
    const db = getDatabase();
    const {
      id,
      sessionType,
      groupName,
      studentIds,
      counselorId,
      sessionDate,
      entryTime,
      entryClassHourId,
      topic,
      participantType,
      relationshipType,
      otherParticipants,
      sessionMode,
      sessionLocation,
      disciplineStatus,
      institutionalCooperation,
      sessionDetails
    } = req.body;
    
    if (!id || !sessionType || !counselorId || !sessionDate || !entryTime || !topic) {
      return res.status(400).json({ error: 'Zorunlu alanlar eksik' });
    }
    
    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ error: 'En az bir öğrenci seçilmelidir' });
    }
    
    const transaction = db.transaction(() => {
      db.prepare(`
        INSERT INTO counseling_sessions (
          id, sessionType, groupName, counselorId, sessionDate, entryTime, entryClassHourId,
          topic, participantType, relationshipType, otherParticipants, sessionMode,
          sessionLocation, disciplineStatus, institutionalCooperation, sessionDetails,
          completed
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, sessionType, groupName || null, counselorId, sessionDate, entryTime, 
        entryClassHourId || null, topic, participantType, relationshipType || null,
        otherParticipants || null, sessionMode, sessionLocation,
        disciplineStatus || null, institutionalCooperation || null,
        sessionDetails || null, 0
      );
      
      const insertStudent = db.prepare(`
        INSERT INTO counseling_session_students (sessionId, studentId)
        VALUES (?, ?)
      `);
      
      for (const studentId of studentIds) {
        insertStudent.run(id, studentId);
      }
    });
    
    transaction();
    
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error creating counseling session:', error);
    res.status(500).json({ error: 'Görüşme kaydedilemedi' });
  }
};

export const completeCounselingSession: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const { exitTime, exitClassHourId, detailedNotes, autoCompleted } = req.body;
    
    if (!exitTime) {
      return res.status(400).json({ error: 'Çıkış saati gereklidir' });
    }
    
    const result = db.prepare(`
      UPDATE counseling_sessions 
      SET exitTime = ?, exitClassHourId = ?, detailedNotes = ?, 
          autoCompleted = ?, completed = 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(exitTime, exitClassHourId || null, detailedNotes || null, autoCompleted ? 1 : 0, id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Görüşme bulunamadı' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error completing counseling session:', error);
    res.status(500).json({ error: 'Görüşme tamamlanamadı' });
  }
};

export const extendCounselingSession: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    const result = db.prepare(`
      UPDATE counseling_sessions 
      SET extensionGranted = 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Görüşme bulunamadı' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error extending counseling session:', error);
    res.status(500).json({ error: 'Görüşme uzatılamadı' });
  }
};

export const autoCompleteCounselingSessions: RequestHandler = (req, res) => {
  try {
    const db = getDatabase();
    
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    const sessionsToComplete = db.prepare(`
      SELECT * FROM counseling_sessions 
      WHERE completed = 0 
      AND (
        (sessionDate < ? )
        OR (sessionDate = ? AND (
          (extensionGranted = 0 AND 
           CAST((julianday(?) - julianday(entryTime)) * 24 * 60 AS INTEGER) >= 60)
          OR 
          (extensionGranted = 1 AND 
           CAST((julianday(?) - julianday(entryTime)) * 24 * 60 AS INTEGER) >= 75)
        ))
      )
    `).all(currentDate, currentDate, currentTime, currentTime);
    
    const completedCount = sessionsToComplete.length;
    
    if (completedCount > 0) {
      const completeStmt = db.prepare(`
        UPDATE counseling_sessions 
        SET exitTime = ?, completed = 1, autoCompleted = 1, 
            detailedNotes = COALESCE(detailedNotes, '') || '\n\n⚠️ Bu görüşme otomatik olarak tamamlanmıştır.',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      
      const transaction = db.transaction(() => {
        for (const session of sessionsToComplete as any[]) {
          completeStmt.run(currentTime, session.id);
        }
      });
      
      transaction();
    }
    
    res.json({ success: true, completedCount });
  } catch (error) {
    console.error('Error auto-completing counseling sessions:', error);
    res.status(500).json({ error: 'Otomatik tamamlama başarısız' });
  }
};

export const deleteCounselingSession: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    const result = db.prepare('DELETE FROM counseling_sessions WHERE id = ?').run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Görüşme bulunamadı' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting counseling session:', error);
    res.status(500).json({ error: 'Görüşme silinemedi' });
  }
};

export const getClassHours: RequestHandler = async (req, res) => {
  try {
    const db = getDatabase();
    const settingsRow: any = db.prepare('SELECT settings FROM app_settings WHERE id = 1').get();
    
    if (!settingsRow || !settingsRow.settings) {
      return res.json([]);
    }
    
    const settings = JSON.parse(settingsRow.settings);
    const periods = settings?.school?.periods || [];
    
    const classHours = periods.map((period: any, index: number) => ({
      id: index + 1,
      name: `${index + 1}. Ders`,
      startTime: period.start,
      endTime: period.end
    }));
    
    res.json(classHours);
  } catch (error) {
    console.error('Error fetching class hours:', error);
    res.status(500).json({ error: 'Ders saatleri yüklenemedi' });
  }
};

export const getCounselingTopics: RequestHandler = async (req, res) => {
  try {
    const db = getDatabase();
    const settingsRow: any = db.prepare('SELECT settings FROM app_settings WHERE id = 1').get();
    
    if (!settingsRow || !settingsRow.settings) {
      return res.json([]);
    }
    
    const settings = JSON.parse(settingsRow.settings);
    const presentationSystem = settings?.presentationSystem || [];
    
    const topics: any[] = [];
    
    function extractTopics(categories: any[], parentTitle = '') {
      for (const category of categories) {
        const fullTitle = parentTitle ? `${parentTitle} > ${category.title}` : category.title;
        
        if (category.items && category.items.length > 0) {
          for (const item of category.items) {
            topics.push({
              id: item.id,
              title: item.title,
              category: fullTitle,
              fullPath: `${fullTitle} > ${item.title}`
            });
          }
        }
        
        if (category.children && category.children.length > 0) {
          extractTopics(category.children, fullTitle);
        }
      }
    }
    
    for (const tab of presentationSystem) {
      if (tab.categories && tab.categories.length > 0) {
        extractTopics(tab.categories, tab.title);
      }
    }
    
    res.json(topics);
  } catch (error) {
    console.error('Error fetching counseling topics:', error);
    res.status(500).json({ error: 'Görüşme konuları yüklenemedi' });
  }
};

router.get('/', getAllCounselingSessions);
router.get('/active', getActiveCounselingSessions);
router.get('/:id', getCounselingSessionById);
router.post('/', createCounselingSession);
router.put('/:id/complete', completeCounselingSession);
router.put('/:id/extend', extendCounselingSession);
router.post('/auto-complete', autoCompleteCounselingSessions);
router.delete('/:id', deleteCounselingSession);

export default router;
