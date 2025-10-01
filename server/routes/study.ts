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
    const transformed = slots.map(slot => ({
      id: slot.id,
      studentId: slot.studentId,
      day: slot.day,
      start: slot.startTime,
      end: slot.endTime,
      subjectId: slot.subjectId
    }));
    res.json(transformed);
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
    const transformed = slots.map(slot => ({
      id: slot.id,
      studentId: slot.studentId,
      day: slot.day,
      start: slot.startTime,
      end: slot.endTime,
      subjectId: slot.subjectId
    }));
    res.json(transformed);
  } catch (error) {
    console.error('Error fetching weekly slots:', error);
    res.status(500).json({ success: false, error: 'Haftalık program getirilirken hata oluştu' });
  }
};

export const saveWeeklySlotHandler: RequestHandler = (req, res) => {
  try {
    const data = req.body;
    
    if (!data) {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz program verisi" 
      });
    }
    
    const slots = Array.isArray(data) ? data : [data];
    
    for (const slot of slots) {
      if (!slot || typeof slot !== 'object') {
        return res.status(400).json({ 
          success: false, 
          error: "Geçersiz program verisi" 
        });
      }
      
      const startTime = slot.startTime || slot.start;
      const endTime = slot.endTime || slot.end;
      
      if (!slot.id || !slot.studentId || !slot.day || !startTime || !endTime || !slot.subjectId) {
        return res.status(400).json({ 
          success: false, 
          error: "Zorunlu alanlar eksik" 
        });
      }
      
      insertWeeklySlot(
        slot.id,
        slot.studentId,
        slot.day,
        startTime,
        endTime,
        slot.subjectId
      );
    }
    
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
    const body = req.body;
    
    if (!id || typeof id !== 'string' || id.length > 50) {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz program ID" 
      });
    }
    
    const startTime = body.startTime || body.start;
    const endTime = body.endTime || body.end;
    
    if (!body.day || typeof body.day !== 'number' || body.day < 1 || body.day > 7) {
      return res.status(400).json({
        success: false,
        error: "Geçersiz gün değeri"
      });
    }
    
    if (!startTime || typeof startTime !== 'string') {
      return res.status(400).json({
        success: false,
        error: "Başlangıç saati gerekli"
      });
    }
    
    if (!endTime || typeof endTime !== 'string') {
      return res.status(400).json({
        success: false,
        error: "Bitiş saati gerekli"
      });
    }
    
    if (!body.subjectId || typeof body.subjectId !== 'string') {
      return res.status(400).json({
        success: false,
        error: "Ders ID gerekli"
      });
    }
    
    updateWeeklySlot(id, body.day, startTime, endTime, body.subjectId);
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
