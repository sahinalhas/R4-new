import * as repository from '../repository/behavior.repository.js';
import { sanitizeString } from '../../../middleware/validation.js';
import type { BehaviorIncident } from '../types/index.js';

export function getBehaviorIncidentsByStudent(studentId: string): BehaviorIncident[] {
  const sanitizedId = sanitizeString(studentId);
  return repository.getBehaviorIncidentsByStudent(sanitizedId);
}

export function getBehaviorIncidentsByDateRange(studentId: string, startDate?: string, endDate?: string): BehaviorIncident[] {
  const sanitizedId = sanitizeString(studentId);
  return repository.getBehaviorIncidentsByDateRange(sanitizedId, startDate, endDate);
}

export function getBehaviorStatsByStudent(studentId: string): any {
  const sanitizedId = sanitizeString(studentId);
  return repository.getBehaviorStatsByStudent(sanitizedId);
}

export function createBehaviorIncident(data: any): { success: boolean; id: string } {
  const incident: BehaviorIncident = {
    id: data.id,
    studentId: sanitizeString(data.studentId),
    incidentDate: data.incidentDate,
    incidentTime: data.incidentTime,
    location: data.location ? sanitizeString(data.location) : undefined,
    behaviorType: data.behaviorType ? sanitizeString(data.behaviorType) : undefined,
    behaviorCategory: data.behaviorCategory ? sanitizeString(data.behaviorCategory) : undefined,
    description: data.description ? sanitizeString(data.description) : undefined,
    antecedent: data.antecedent ? sanitizeString(data.antecedent) : undefined,
    consequence: data.consequence ? sanitizeString(data.consequence) : undefined,
    duration: data.duration,
    intensity: data.intensity ? sanitizeString(data.intensity) : undefined,
    frequency: data.frequency ? sanitizeString(data.frequency) : undefined,
    witnessedBy: data.witnessedBy ? sanitizeString(data.witnessedBy) : undefined,
    othersInvolved: data.othersInvolved ? sanitizeString(data.othersInvolved) : undefined,
    interventionUsed: data.interventionUsed ? sanitizeString(data.interventionUsed) : undefined,
    interventionEffectiveness: data.interventionEffectiveness ? sanitizeString(data.interventionEffectiveness) : undefined,
    parentNotified: data.parentNotified,
    parentNotificationMethod: data.parentNotificationMethod ? sanitizeString(data.parentNotificationMethod) : undefined,
    parentResponse: data.parentResponse ? sanitizeString(data.parentResponse) : undefined,
    followUpRequired: data.followUpRequired,
    followUpDate: data.followUpDate,
    followUpNotes: data.followUpNotes ? sanitizeString(data.followUpNotes) : undefined,
    adminNotified: data.adminNotified,
    consequenceGiven: data.consequenceGiven ? sanitizeString(data.consequenceGiven) : undefined,
    supportProvided: data.supportProvided ? sanitizeString(data.supportProvided) : undefined,
    triggerAnalysis: data.triggerAnalysis ? sanitizeString(data.triggerAnalysis) : undefined,
    patternNotes: data.patternNotes ? sanitizeString(data.patternNotes) : undefined,
    positiveAlternative: data.positiveAlternative ? sanitizeString(data.positiveAlternative) : undefined,
    status: data.status ? sanitizeString(data.status) : 'AÇIK',
    recordedBy: data.recordedBy ? sanitizeString(data.recordedBy) : undefined,
    notes: data.notes ? sanitizeString(data.notes) : undefined
  };
  
  repository.insertBehaviorIncident(incident);
  return { success: true, id: incident.id };
}

export function updateBehaviorIncident(id: string, updates: any): { success: boolean } {
  const sanitizedUpdates: any = {};
  
  if (updates.incidentDate) sanitizedUpdates.incidentDate = updates.incidentDate;
  if (updates.incidentTime !== undefined) sanitizedUpdates.incidentTime = updates.incidentTime;
  if (updates.location) sanitizedUpdates.location = sanitizeString(updates.location);
  if (updates.behaviorType) sanitizedUpdates.behaviorType = sanitizeString(updates.behaviorType);
  if (updates.behaviorCategory) sanitizedUpdates.behaviorCategory = sanitizeString(updates.behaviorCategory);
  if (updates.description) sanitizedUpdates.description = sanitizeString(updates.description);
  if (updates.antecedent) sanitizedUpdates.antecedent = sanitizeString(updates.antecedent);
  if (updates.consequence) sanitizedUpdates.consequence = sanitizeString(updates.consequence);
  if (updates.duration !== undefined) sanitizedUpdates.duration = updates.duration;
  if (updates.intensity) sanitizedUpdates.intensity = sanitizeString(updates.intensity);
  if (updates.frequency) sanitizedUpdates.frequency = sanitizeString(updates.frequency);
  if (updates.witnessedBy) sanitizedUpdates.witnessedBy = sanitizeString(updates.witnessedBy);
  if (updates.othersInvolved) sanitizedUpdates.othersInvolved = sanitizeString(updates.othersInvolved);
  if (updates.interventionUsed) sanitizedUpdates.interventionUsed = sanitizeString(updates.interventionUsed);
  if (updates.interventionEffectiveness) sanitizedUpdates.interventionEffectiveness = sanitizeString(updates.interventionEffectiveness);
  if (updates.parentNotified !== undefined) sanitizedUpdates.parentNotified = updates.parentNotified ? 1 : 0;
  if (updates.parentNotificationMethod) sanitizedUpdates.parentNotificationMethod = sanitizeString(updates.parentNotificationMethod);
  if (updates.parentResponse) sanitizedUpdates.parentResponse = sanitizeString(updates.parentResponse);
  if (updates.followUpRequired !== undefined) sanitizedUpdates.followUpRequired = updates.followUpRequired ? 1 : 0;
  if (updates.followUpDate) sanitizedUpdates.followUpDate = updates.followUpDate;
  if (updates.followUpNotes) sanitizedUpdates.followUpNotes = sanitizeString(updates.followUpNotes);
  if (updates.adminNotified !== undefined) sanitizedUpdates.adminNotified = updates.adminNotified ? 1 : 0;
  if (updates.consequenceGiven) sanitizedUpdates.consequenceGiven = sanitizeString(updates.consequenceGiven);
  if (updates.supportProvided) sanitizedUpdates.supportProvided = sanitizeString(updates.supportProvided);
  if (updates.triggerAnalysis) sanitizedUpdates.triggerAnalysis = sanitizeString(updates.triggerAnalysis);
  if (updates.patternNotes) sanitizedUpdates.patternNotes = sanitizeString(updates.patternNotes);
  if (updates.positiveAlternative) sanitizedUpdates.positiveAlternative = sanitizeString(updates.positiveAlternative);
  if (updates.status) sanitizedUpdates.status = sanitizeString(updates.status);
  if (updates.notes) sanitizedUpdates.notes = sanitizeString(updates.notes);
  
  repository.updateBehaviorIncident(id, sanitizedUpdates);
  return { success: true };
}

export function deleteBehaviorIncident(id: string): { success: boolean } {
  repository.deleteBehaviorIncident(id);
  return { success: true };
}
