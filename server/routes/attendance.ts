import { RequestHandler } from 'express';
import { 
  getAttendanceByStudent,
  insertAttendance
} from '../lib/db-service.js';
import { randomUUID } from 'crypto';

// Get attendance records for a specific student
export const getAttendanceByStudentHandler: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    
    if (!studentId || typeof studentId !== 'string' || studentId.length > 50) {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz öğrenci ID" 
      });
    }
    
    const records = getAttendanceByStudent(studentId);
    // Map database 'notes' field to client 'reason' field for compatibility
    const attendance = records.map((record: any) => ({
      ...record,
      reason: record.notes,
      notes: undefined // Remove notes to avoid confusion
    }));
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ success: false, error: 'Devam kayıtları getirilirken hata oluştu' });
  }
};

// Get all attendance records
export const getAllAttendance: RequestHandler = (req, res) => {
  try {
    // Return empty array since we don't need a global attendance endpoint
    // Individual student attendance should use /api/attendance/:studentId
    res.json([]);
  } catch (error) {
    console.error('Error fetching all attendance:', error);
    res.status(500).json({ success: false, error: 'Devam kayıtları getirilirken hata oluştu' });
  }
};

// Create new attendance record
export const saveAttendanceHandler: RequestHandler = (req, res) => {
  try {
    const attendance = req.body;
    
    // Validate required fields
    if (!attendance.studentId || !attendance.date || !attendance.status) {
      return res.status(400).json({ 
        success: false, 
        error: "Öğrenci ID, tarih ve durum alanları gereklidir" 
      });
    }
    
    // Validate date format
    if (isNaN(Date.parse(attendance.date))) {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz tarih formatı" 
      });
    }
    
    // Validate status
    if (!['Devamsız', 'Geç', 'Var'].includes(attendance.status)) {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz devam durumu" 
      });
    }
    
    // Generate ID if not provided
    if (!attendance.id) {
      attendance.id = randomUUID();
    }
    
    insertAttendance(
      attendance.id,
      attendance.studentId,
      attendance.date,
      attendance.status,
      attendance.reason || attendance.notes || null
    );
    
    res.json({ success: true, message: 'Devam kaydı başarıyla eklendi' });
  } catch (error) {
    console.error('Error saving attendance:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ 
      success: false, 
      error: `Devam kaydı eklenemedi: ${errorMessage}` 
    });
  }
};