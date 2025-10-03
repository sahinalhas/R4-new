import { toast } from "sonner";
import type { ParentMeeting, HomeVisit, FamilyParticipation } from "../types/family.types";

export async function loadParentMeetings(): Promise<ParentMeeting[]> {
  console.warn('loadParentMeetings deprecated. Use getParentMeetingsByStudent instead.');
  return [];
}

export async function saveParentMeetings(list: ParentMeeting[]): Promise<void> {
  console.warn('saveParentMeetings deprecated. Use addParentMeeting instead.');
}

export async function getParentMeetingsByStudent(studentId: string): Promise<ParentMeeting[]> {
  try {
    const response = await fetch(`/api/coaching/parent-meetings/student/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch parent meetings');
    return await response.json();
  } catch (error) {
    console.error('Error loading parent meetings:', error);
    toast.error('Veli görüşmeleri yüklenirken hata oluştu');
    return [];
  }
}

export async function addParentMeeting(meeting: ParentMeeting): Promise<void> {
  try {
    const response = await fetch('/api/coaching/parent-meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meeting)
    });
    if (!response.ok) throw new Error('Failed to add parent meeting');
    toast.success('Veli görüşmesi eklendi');
  } catch (error) {
    console.error('Error adding parent meeting:', error);
    toast.error('Veli görüşmesi eklenemedi');
    throw error;
  }
}

export async function updateParentMeeting(id: string, updates: Partial<ParentMeeting>): Promise<void> {
  try {
    const response = await fetch(`/api/coaching/parent-meetings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update parent meeting');
    toast.success('Veli görüşmesi güncellendi');
  } catch (error) {
    console.error('Error updating parent meeting:', error);
    toast.error('Veli görüşmesi güncellenemedi');
    throw error;
  }
}

export async function loadHomeVisits(): Promise<HomeVisit[]> {
  console.warn('loadHomeVisits deprecated. Use getHomeVisitsByStudent instead.');
  return [];
}

export async function saveHomeVisits(list: HomeVisit[]): Promise<void> {
  console.warn('saveHomeVisits deprecated. Use addHomeVisit instead.');
}

export async function getHomeVisitsByStudent(studentId: string): Promise<HomeVisit[]> {
  try {
    const response = await fetch(`/api/coaching/home-visits/student/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch home visits');
    return await response.json();
  } catch (error) {
    console.error('Error loading home visits:', error);
    toast.error('Ev ziyaretleri yüklenirken hata oluştu');
    return [];
  }
}

export async function addHomeVisit(visit: HomeVisit): Promise<void> {
  try {
    const response = await fetch('/api/coaching/home-visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(visit)
    });
    if (!response.ok) throw new Error('Failed to add home visit');
    toast.success('Ev ziyareti eklendi');
  } catch (error) {
    console.error('Error adding home visit:', error);
    toast.error('Ev ziyareti eklenemedi');
    throw error;
  }
}

export async function updateHomeVisit(id: string, updates: Partial<HomeVisit>): Promise<void> {
  try {
    const response = await fetch(`/api/coaching/home-visits/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update home visit');
    toast.success('Ev ziyareti güncellendi');
  } catch (error) {
    console.error('Error updating home visit:', error);
    toast.error('Ev ziyareti güncellenemedi');
    throw error;
  }
}

export async function loadFamilyParticipations(): Promise<FamilyParticipation[]> {
  console.warn('loadFamilyParticipations deprecated. Use getFamilyParticipationsByStudent instead.');
  return [];
}

export async function saveFamilyParticipations(list: FamilyParticipation[]): Promise<void> {
  console.warn('saveFamilyParticipations deprecated. Use addFamilyParticipation instead.');
}

export async function getFamilyParticipationsByStudent(studentId: string): Promise<FamilyParticipation[]> {
  try {
    const response = await fetch(`/api/coaching/family-participations/student/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch family participations');
    return await response.json();
  } catch (error) {
    console.error('Error loading family participations:', error);
    toast.error('Aile katılım kayıtları yüklenirken hata oluştu');
    return [];
  }
}

export async function addFamilyParticipation(participation: FamilyParticipation): Promise<void> {
  try {
    const response = await fetch('/api/coaching/family-participations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(participation)
    });
    if (!response.ok) throw new Error('Failed to add family participation');
    toast.success('Aile katılım kaydı eklendi');
  } catch (error) {
    console.error('Error adding family participation:', error);
    toast.error('Aile katılım kaydı eklenemedi');
    throw error;
  }
}

export async function updateFamilyParticipation(id: string, updates: Partial<FamilyParticipation>): Promise<void> {
  try {
    const response = await fetch(`/api/coaching/family-participations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update family participation');
    toast.success('Aile katılım kaydı güncellendi');
  } catch (error) {
    console.error('Error updating family participation:', error);
    toast.error('Aile katılım kaydı güncellenemedi');
    throw error;
  }
}
