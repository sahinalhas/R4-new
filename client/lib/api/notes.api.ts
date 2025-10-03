import { toast } from "sonner";
import type { MeetingNote } from "../types/common.types";

export async function getNotesByStudent(studentId: string): Promise<MeetingNote[]> {
  try {
    const response = await fetch(`/api/meeting-notes/${studentId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch meeting notes: ${response.status}`);
    }
    const notes = await response.json();
    return Array.isArray(notes) ? notes : [];
  } catch (error) {
    console.error('Error fetching meeting notes:', error);
    toast.error('Görüşme notları yüklenirken hata oluştu');
    return [];
  }
}

export async function addNote(note: MeetingNote): Promise<void> {
  try {
    const response = await fetch('/api/meeting-notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save meeting note');
    }
    
    toast.success('Görüşme notu kaydedildi');
  } catch (error) {
    console.error('Error saving meeting note:', error);
    toast.error('Görüşme notu kaydedilemedi');
    throw error;
  }
}

export async function updateNote(id: string, note: Partial<MeetingNote>): Promise<void> {
  try {
    const response = await fetch(`/api/meeting-notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update meeting note');
    }
    
    toast.success('Görüşme notu güncellendi');
  } catch (error) {
    console.error('Error updating meeting note:', error);
    toast.error('Görüşme notu güncellenemedi');
    throw error;
  }
}

export async function deleteNote(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/meeting-notes/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete meeting note');
    }
    
    toast.success('Görüşme notu silindi');
  } catch (error) {
    console.error('Error deleting meeting note:', error);
    toast.error('Görüşme notu silinemedi');
    throw error;
  }
}
