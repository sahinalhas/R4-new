import { RequestHandler } from "express";
import { 
  getMeetingNotesByStudent, 
  saveMeetingNote,
  updateMeetingNote,
  deleteMeetingNote
} from "../lib/db-service.js";

export const getMeetingNotes: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    
    if (!studentId || typeof studentId !== 'string' || studentId.length > 50) {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz öğrenci ID" 
      });
    }
    
    const notes = getMeetingNotesByStudent(studentId);
    res.json(notes);
  } catch (error) {
    console.error('Error fetching meeting notes:', error);
    res.status(500).json({ success: false, error: 'Görüşme notları getirilirken hata oluştu' });
  }
};

export const saveMeetingNoteHandler: RequestHandler = (req, res) => {
  try {
    const note = req.body;
    
    if (!note || typeof note !== 'object') {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz not verisi" 
      });
    }
    
    if (!note.id || !note.studentId || !note.date || !note.type || !note.note) {
      return res.status(400).json({ 
        success: false, 
        error: "Zorunlu alanlar eksik" 
      });
    }
    
    saveMeetingNote(note);
    res.json({ success: true, message: 'Görüşme notu kaydedildi' });
  } catch (error) {
    console.error('Error saving meeting note:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ 
      success: false, 
      error: `Görüşme notu kaydedilemedi: ${errorMessage}` 
    });
  }
};

export const updateMeetingNoteHandler: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const note = req.body;
    
    if (!id || typeof id !== 'string' || id.length > 50) {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz not ID" 
      });
    }
    
    if (!note || typeof note !== 'object') {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz not verisi" 
      });
    }
    
    if (!note.date || typeof note.date !== 'string' || note.date.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: "Tarih alanı zorunludur" 
      });
    }
    
    if (!note.type || !['Bireysel', 'Grup', 'Veli'].includes(note.type)) {
      return res.status(400).json({ 
        success: false, 
        error: "Geçerli bir görüşme tipi belirtilmelidir" 
      });
    }
    
    if (!note.note || typeof note.note !== 'string' || note.note.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: "Not içeriği zorunludur" 
      });
    }
    
    updateMeetingNote(id, note);
    res.json({ success: true, message: 'Görüşme notu güncellendi' });
  } catch (error) {
    console.error('Error updating meeting note:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ 
      success: false, 
      error: `Görüşme notu güncellenemedi: ${errorMessage}` 
    });
  }
};

export const deleteMeetingNoteHandler: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || typeof id !== 'string' || id.length > 50) {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz not ID" 
      });
    }
    
    deleteMeetingNote(id);
    res.json({ success: true, message: 'Görüşme notu silindi' });
  } catch (error) {
    console.error('Error deleting meeting note:', error);
    res.status(500).json({ success: false, error: 'Görüşme notu silinemedi' });
  }
};
