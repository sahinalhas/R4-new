import { toast } from "sonner";
import type { StudentDoc } from "../types/common.types";

export async function getDocsByStudent(studentId: string): Promise<StudentDoc[]> {
  try {
    const response = await fetch(`/api/documents/${studentId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch documents: ${response.status}`);
    }
    const docs = await response.json();
    return Array.isArray(docs) ? docs : [];
  } catch (error) {
    console.error('Error fetching documents:', error);
    toast.error('Dokümanlar yüklenirken hata oluştu');
    return [];
  }
}

export async function addDoc(doc: StudentDoc): Promise<void> {
  try {
    const response = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save document');
    }
    
    toast.success('Doküman kaydedildi');
  } catch (error) {
    console.error('Error saving document:', error);
    toast.error('Doküman kaydedilemedi');
    throw error;
  }
}

export async function removeDoc(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/documents/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete document');
    }
    
    toast.success('Doküman silindi');
  } catch (error) {
    console.error('Error deleting document:', error);
    toast.error('Doküman silinemedi');
    throw error;
  }
}
