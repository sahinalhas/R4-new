import { RequestHandler } from "express";
import {
  getStudyAssignmentsByStudent,
  insertStudyAssignment,
  updateStudyAssignment,
  deleteStudyAssignment,
  getAllWeeklySlots,
  getWeeklySlotsByStudent,
  insertWeeklySlot,
  updateWeeklySlot,
  deleteWeeklySlot
} from "../lib/db-service.js";

// Study Assignments
export const getStudyAssignments: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    
    if (!studentId || typeof studentId !== 'string' || studentId.length > 50) {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz öğrenci ID" 
      });
    }
    
    const assignments = getStudyAssignmentsByStudent(studentId);
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching study assignments:', error);
    res.status(500).json({ success: false, error: 'Çalışma ödevleri getirilirken hata oluştu' });
  }
};

export const saveStudyAssignmentHandler: RequestHandler = (req, res) => {
  try {
    const assignment = req.body;
    
    if (!assignment || typeof assignment !== 'object') {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz ödev verisi" 
      });
    }
    
    if (!assignment.id || !assignment.studentId || !assignment.topicId || !assignment.dueDate) {
      return res.status(400).json({ 
        success: false, 
        error: "Zorunlu alanlar eksik" 
      });
    }
    
    insertStudyAssignment(
      assignment.id, 
      assignment.studentId, 
      assignment.topicId, 
      assignment.dueDate,
      assignment.status || 'pending',
      assignment.notes
    );
    
    res.json({ success: true, message: 'Çalışma ödevi kaydedildi' });
  } catch (error) {
    console.error('Error saving study assignment:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ 
      success: false, 
      error: `Çalışma ödevi kaydedilemedi: ${errorMessage}` 
    });
  }
};

export const updateStudyAssignmentHandler: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    if (!id || typeof id !== 'string' || id.length > 50) {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz ödev ID" 
      });
    }
    
    updateStudyAssignment(id, status, notes);
    res.json({ success: true, message: 'Çalışma ödevi güncellendi' });
  } catch (error) {
    console.error('Error updating study assignment:', error);
    res.status(500).json({ success: false, error: 'Çalışma ödevi güncellenemedi' });
  }
};

export const deleteStudyAssignmentHandler: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || typeof id !== 'string' || id.length > 50) {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz ödev ID" 
      });
    }
    
    deleteStudyAssignment(id);
    res.json({ success: true, message: 'Çalışma ödevi silindi' });
  } catch (error) {
    console.error('Error deleting study assignment:', error);
    res.status(500).json({ success: false, error: 'Çalışma ödevi silinemedi' });
  }
};

// Weekly Slots
export const getAllWeeklySlotsHandler: RequestHandler = (req, res) => {
  try {
    const slots = getAllWeeklySlots();
    res.json(slots);
  } catch (error) {
    console.error('Error fetching all weekly slots:', error);
    res.status(500).json({ success: false, error: 'Haftalık program getirilirken hata oluştu' });
  }
};

export const getWeeklySlots: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    
    if (!studentId || typeof studentId !== 'string' || studentId.length > 50) {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz öğrenci ID" 
      });
    }
    
    const slots = getWeeklySlotsByStudent(studentId);
    res.json(slots);
  } catch (error) {
    console.error('Error fetching weekly slots:', error);
    res.status(500).json({ success: false, error: 'Haftalık program getirilirken hata oluştu' });
  }
};

export const saveWeeklySlotHandler: RequestHandler = (req, res) => {
  try {
    const slot = req.body;
    
    if (!slot || typeof slot !== 'object') {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz program verisi" 
      });
    }
    
    if (!slot.id || !slot.studentId || !slot.day || !slot.startTime || !slot.endTime || !slot.subjectId) {
      return res.status(400).json({ 
        success: false, 
        error: "Zorunlu alanlar eksik" 
      });
    }
    
    insertWeeklySlot(
      slot.id,
      slot.studentId,
      slot.day,
      slot.startTime,
      slot.endTime,
      slot.subjectId
    );
    
    res.json({ success: true, message: 'Haftalık program kaydedildi' });
  } catch (error) {
    console.error('Error saving weekly slot:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ 
      success: false, 
      error: `Haftalık program kaydedilemedi: ${errorMessage}` 
    });
  }
};

export const updateWeeklySlotHandler: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { day, startTime, endTime, subjectId } = req.body;
    
    if (!id || typeof id !== 'string' || id.length > 50) {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz program ID" 
      });
    }
    
    updateWeeklySlot(id, day, startTime, endTime, subjectId);
    res.json({ success: true, message: 'Haftalık program güncellendi' });
  } catch (error) {
    console.error('Error updating weekly slot:', error);
    res.status(500).json({ success: false, error: 'Haftalık program güncellenemedi' });
  }
};

export const deleteWeeklySlotHandler: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || typeof id !== 'string' || id.length > 50) {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz program ID" 
      });
    }
    
    deleteWeeklySlot(id);
    res.json({ success: true, message: 'Haftalık program silindi' });
  } catch (error) {
    console.error('Error deleting weekly slot:', error);
    res.status(500).json({ success: false, error: 'Haftalık program silinemedi' });
  }
};
