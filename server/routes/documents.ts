import { RequestHandler } from "express";
import { 
  getDocumentsByStudent, 
  saveDocument,
  deleteDocument
} from "../lib/db-service.js";

export const getDocuments: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    
    if (!studentId || typeof studentId !== 'string' || studentId.length > 50) {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz öğrenci ID" 
      });
    }
    
    const documents = getDocumentsByStudent(studentId);
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ success: false, error: 'Dokümanlar getirilirken hata oluştu' });
  }
};

export const saveDocumentHandler: RequestHandler = (req, res) => {
  try {
    const document = req.body;
    
    if (!document || typeof document !== 'object') {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz doküman verisi" 
      });
    }
    
    if (!document.id || !document.studentId || !document.name || !document.type || !document.dataUrl) {
      return res.status(400).json({ 
        success: false, 
        error: "Zorunlu alanlar eksik" 
      });
    }
    
    saveDocument(document);
    res.json({ success: true, message: 'Doküman kaydedildi' });
  } catch (error) {
    console.error('Error saving document:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ 
      success: false, 
      error: `Doküman kaydedilemedi: ${errorMessage}` 
    });
  }
};

export const deleteDocumentHandler: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || typeof id !== 'string' || id.length > 50) {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz doküman ID" 
      });
    }
    
    deleteDocument(id);
    res.json({ success: true, message: 'Doküman silindi' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ success: false, error: 'Doküman silinemedi' });
  }
};
