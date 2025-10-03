import { toast } from "sonner";
import type {
  AcademicGoal,
  MultipleIntelligence,
  LearningStyle,
  SmartGoal,
  CoachingRecommendation,
  Evaluation360,
  Achievement,
  SelfAssessment
} from "../types/coaching.types";
import { loadStudents } from "./students.api";
import { getAttendanceByStudent } from "./attendance.api";

export async function loadAcademicGoals(): Promise<AcademicGoal[]> {
  try {
    const response = await fetch('/api/coaching/academic-goals');
    if (!response.ok) throw new Error('Failed to fetch academic goals');
    return await response.json();
  } catch (error) {
    console.error('Error loading academic goals:', error);
    toast.error('Akademik hedefler yüklenirken hata oluştu');
    return [];
  }
}

export async function getAcademicGoalsByStudent(studentId: string): Promise<AcademicGoal[]> {
  try {
    const response = await fetch(`/api/coaching/academic-goals/student/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch student academic goals');
    return await response.json();
  } catch (error) {
    console.error('Error loading student academic goals:', error);
    toast.error('Öğrenci akademik hedefleri yüklenirken hata oluştu');
    return [];
  }
}

export async function addAcademicGoal(goal: AcademicGoal): Promise<void> {
  try {
    const response = await fetch('/api/coaching/academic-goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goal)
    });
    if (!response.ok) throw new Error('Failed to add academic goal');
    toast.success('Akademik hedef eklendi');
  } catch (error) {
    console.error('Error adding academic goal:', error);
    toast.error('Akademik hedef eklenemedi');
    throw error;
  }
}

export async function updateAcademicGoal(id: string, updates: Partial<AcademicGoal>): Promise<void> {
  try {
    const response = await fetch(`/api/coaching/academic-goals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update academic goal');
    toast.success('Akademik hedef güncellendi');
  } catch (error) {
    console.error('Error updating academic goal:', error);
    toast.error('Akademik hedef güncellenemedi');
    throw error;
  }
}

export async function getMultipleIntelligenceByStudent(studentId: string): Promise<MultipleIntelligence | undefined> {
  try {
    const response = await fetch(`/api/coaching/multiple-intelligence/student/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch multiple intelligence');
    const records = await response.json();
    return records[0];
  } catch (error) {
    console.error('Error loading multiple intelligence:', error);
    toast.error('Çoklu zeka verileri yüklenirken hata oluştu');
    return undefined;
  }
}

export async function addMultipleIntelligence(mi: MultipleIntelligence): Promise<void> {
  try {
    const response = await fetch('/api/coaching/multiple-intelligence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mi)
    });
    if (!response.ok) throw new Error('Failed to add multiple intelligence');
    toast.success('Çoklu zeka değerlendirmesi eklendi');
  } catch (error) {
    console.error('Error adding multiple intelligence:', error);
    toast.error('Çoklu zeka değerlendirmesi eklenemedi');
    throw error;
  }
}

export async function getLearningStyleByStudent(studentId: string): Promise<LearningStyle | undefined> {
  try {
    const response = await fetch(`/api/coaching/learning-styles/student/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch learning styles');
    const records = await response.json();
    return records[0];
  } catch (error) {
    console.error('Error loading learning styles:', error);
    toast.error('Öğrenme stilleri yüklenirken hata oluştu');
    return undefined;
  }
}

export async function addLearningStyle(ls: LearningStyle): Promise<void> {
  try {
    const response = await fetch('/api/coaching/learning-styles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ls)
    });
    if (!response.ok) throw new Error('Failed to add learning style');
    toast.success('Öğrenme stili eklendi');
  } catch (error) {
    console.error('Error adding learning style:', error);
    toast.error('Öğrenme stili eklenemedi');
    throw error;
  }
}

export async function getSmartGoalsByStudent(studentId: string): Promise<SmartGoal[]> {
  try {
    const response = await fetch(`/api/coaching/smart-goals/student/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch smart goals');
    return await response.json();
  } catch (error) {
    console.error('Error loading smart goals:', error);
    toast.error('SMART hedefler yüklenirken hata oluştu');
    return [];
  }
}

export async function addSmartGoal(goal: SmartGoal): Promise<void> {
  try {
    const response = await fetch('/api/coaching/smart-goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goal)
    });
    if (!response.ok) throw new Error('Failed to add smart goal');
    toast.success('SMART hedef eklendi');
  } catch (error) {
    console.error('Error adding smart goal:', error);
    toast.error('SMART hedef eklenemedi');
    throw error;
  }
}

export async function updateSmartGoal(id: string, updates: Partial<SmartGoal>): Promise<void> {
  try {
    const response = await fetch(`/api/coaching/smart-goals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update smart goal');
    toast.success('SMART hedef güncellendi');
  } catch (error) {
    console.error('Error updating smart goal:', error);
    toast.error('SMART hedef güncellenemedi');
    throw error;
  }
}

export async function getCoachingRecommendationsByStudent(studentId: string): Promise<CoachingRecommendation[]> {
  try {
    const response = await fetch(`/api/coaching/coaching-recommendations/student/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch coaching recommendations');
    return await response.json();
  } catch (error) {
    console.error('Error loading coaching recommendations:', error);
    toast.error('Koçluk önerileri yüklenirken hata oluştu');
    return [];
  }
}

export async function addCoachingRecommendation(rec: CoachingRecommendation): Promise<void> {
  try {
    const response = await fetch('/api/coaching/coaching-recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rec)
    });
    if (!response.ok) throw new Error('Failed to add coaching recommendation');
    toast.success('Koçluk önerisi eklendi');
  } catch (error) {
    console.error('Error adding coaching recommendation:', error);
    toast.error('Koçluk önerisi eklenemedi');
    throw error;
  }
}

export async function updateCoachingRecommendation(id: string, updates: Partial<CoachingRecommendation>): Promise<void> {
  try {
    const response = await fetch(`/api/coaching/coaching-recommendations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update coaching recommendation');
    toast.success('Koçluk önerisi güncellendi');
  } catch (error) {
    console.error('Error updating coaching recommendation:', error);
    toast.error('Koçluk önerisi güncellenemedi');
    throw error;
  }
}

export async function getEvaluations360ByStudent(studentId: string): Promise<Evaluation360[]> {
  try {
    const response = await fetch(`/api/coaching/evaluations-360/student/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch 360 evaluations');
    return await response.json();
  } catch (error) {
    console.error('Error loading 360 evaluations:', error);
    toast.error('360 değerlendirmeler yüklenirken hata oluştu');
    return [];
  }
}

export async function addEvaluation360(evaluation: Evaluation360): Promise<void> {
  try {
    const response = await fetch('/api/coaching/evaluations-360', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evaluation)
    });
    if (!response.ok) throw new Error('Failed to add 360 evaluation');
    toast.success('360 değerlendirme eklendi');
  } catch (error) {
    console.error('Error adding 360 evaluation:', error);
    toast.error('360 değerlendirme eklenemedi');
    throw error;
  }
}

export async function getAchievementsByStudent(studentId: string): Promise<Achievement[]> {
  try {
    const response = await fetch(`/api/coaching/achievements/student/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch achievements');
    return await response.json();
  } catch (error) {
    console.error('Error loading achievements:', error);
    toast.error('Başarılar yüklenirken hata oluştu');
    return [];
  }
}

export async function addAchievement(achievement: Achievement): Promise<void> {
  try {
    const response = await fetch('/api/coaching/achievements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(achievement)
    });
    if (!response.ok) throw new Error('Failed to add achievement');
    toast.success('Başarı eklendi');
  } catch (error) {
    console.error('Error adding achievement:', error);
    toast.error('Başarı eklenemedi');
    throw error;
  }
}

export async function getSelfAssessmentsByStudent(studentId: string): Promise<SelfAssessment[]> {
  try {
    const response = await fetch(`/api/coaching/self-assessments/student/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch self assessments');
    return await response.json();
  } catch (error) {
    console.error('Error loading self assessments:', error);
    toast.error('Öz değerlendirmeler yüklenirken hata oluştu');
    return [];
  }
}

export async function addSelfAssessment(assessment: SelfAssessment): Promise<void> {
  try {
    const response = await fetch('/api/coaching/self-assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assessment)
    });
    if (!response.ok) throw new Error('Failed to add self assessment');
    toast.success('Öz değerlendirme eklendi');
  } catch (error) {
    console.error('Error adding self assessment:', error);
    toast.error('Öz değerlendirme eklenemedi');
    throw error;
  }
}

export async function getTodaysSelfAssessment(studentId: string): Promise<SelfAssessment | undefined> {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const assessments = await getSelfAssessmentsByStudent(studentId);
    return assessments.find(sa => sa.assessmentDate === today);
  } catch (error) {
    console.error('Error getting today\'s self assessment:', error);
    return undefined;
  }
}

export async function generateAutoRecommendations(studentId: string): Promise<CoachingRecommendation[]> {
  const recommendations: CoachingRecommendation[] = [];
  const now = new Date().toISOString();
  
  const students = loadStudents();
  const student = students.find(s => s.id === studentId);
  if (!student) return recommendations;

  if (student.risk === "Yüksek") {
    recommendations.push({
      id: crypto.randomUUID(),
      studentId,
      type: "MOTIVASYON",
      title: "Acil Motivasyon Desteği",
      description: "Yüksek risk seviyesinde olan öğrenci için özel motivasyon stratejileri uygulanmalı.",
      priority: "Yüksek",
      automated: true,
      implementationSteps: [
        "Bireysel görüşme planla",
        "Öğrencinin ilgi alanlarını tespit et",
        "Kısa vadeli başarılabilir hedefler belirle",
        "Düzenli takip planı oluştur"
      ],
      status: "Öneri",
      createdAt: now
    });
  }

  const attendance = await getAttendanceByStudent(studentId);
  const recentAbsences = attendance.filter(a => 
    a.status === "Devamsız" && 
    Date.now() - new Date(a.date).getTime() <= 7 * 24 * 60 * 60 * 1000
  ).length;

  if (recentAbsences >= 2) {
    recommendations.push({
      id: crypto.randomUUID(),
      studentId,
      type: "SOSYAL",
      title: "Devamsızlık Takip Programı",
      description: "Son hafta içinde 2 veya daha fazla devamsızlık tespit edildi.",
      priority: "Yüksek",
      automated: true,
      implementationSteps: [
        "Devamsızlık sebeplerini araştır",
        "Veli ile iletişime geç",
        "Okula uyum programı planla"
      ],
      status: "Öneri",
      createdAt: now
    });
  }

  return recommendations;
}
