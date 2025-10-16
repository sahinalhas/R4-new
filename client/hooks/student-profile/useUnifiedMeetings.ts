/**
 * Unified Meetings Hook
 * Tüm görüşme kayıtlarını tek bir yerden sağlar
 * - Veli görüşmeleri (counseling sessions API'den)
 * - Bireysel görüşmeler (local storage notes)
 * - Grup görüşmeleri
 */

import { useQuery } from "@tanstack/react-query";
import { MeetingNote } from "@/lib/storage";

export interface UnifiedMeeting {
  id: string;
  date: string;
  time?: string;
  type: "veli" | "bireysel" | "grup";
  participantType?: string;
  sessionType?: string;
  topic?: string;
  note: string;
  plan?: string;
  location?: string;
  outcome?: string;
  followUpRequired?: boolean;
  source: "counseling-sessions" | "local-notes";
  metadata?: any;
}

export function useUnifiedMeetings(studentId: string) {
  return useQuery<UnifiedMeeting[]>({
    queryKey: ['unified-meetings', studentId],
    queryFn: async () => {
      const allMeetings: UnifiedMeeting[] = [];
      
      // 1. Counseling Sessions API'den veli görüşmelerini al
      try {
        const sessionsResponse = await fetch('/api/counseling-sessions');
        if (sessionsResponse.ok) {
          const allSessions = await sessionsResponse.json();
          
          // Bu öğrencinin veli görüşmelerini filtrele
          const studentSessions = allSessions.filter((session: any) => {
            const isParentMeeting = session.participantType === 'veli';
            const includesStudent = session.sessionType === 'individual' 
              ? session.student?.id === studentId
              : session.students?.some((s: any) => s.id === studentId);
            return isParentMeeting && includesStudent;
          });
          
          // Unified format'a çevir
          studentSessions.forEach((session: any) => {
            allMeetings.push({
              id: session.id,
              date: session.sessionDate,
              time: session.entryTime,
              type: "veli",
              participantType: session.participantType,
              sessionType: session.sessionType,
              topic: session.topic,
              note: session.notes || '',
              plan: session.actionPlan || '',
              location: session.sessionLocation,
              outcome: session.outcome,
              followUpRequired: session.followUpRequired,
              source: "counseling-sessions",
              metadata: {
                duration: session.duration,
                attendees: session.attendees,
                tags: session.tags
              }
            });
          });
        }
      } catch (error) {
        console.error('Counseling sessions fetch error:', error);
      }
      
      // 2. Bireysel görüşmeleri counseling sessions'dan al
      try {
        const sessionsResponse = await fetch('/api/counseling-sessions');
        if (sessionsResponse.ok) {
          const allSessions = await sessionsResponse.json();
          
          // Bu öğrencinin bireysel görüşmelerini filtrele
          const individualSessions = allSessions.filter((session: any) => {
            const isIndividual = session.participantType === 'ogrenci';
            const includesStudent = session.sessionType === 'individual' 
              ? session.student?.id === studentId
              : session.students?.some((s: any) => s.id === studentId);
            return isIndividual && includesStudent;
          });
          
          individualSessions.forEach((session: any) => {
            allMeetings.push({
              id: session.id,
              date: session.sessionDate,
              time: session.entryTime,
              type: "bireysel",
              participantType: session.participantType,
              sessionType: session.sessionType,
              topic: session.topic,
              note: session.notes || '',
              plan: session.actionPlan || '',
              location: session.sessionLocation,
              outcome: session.outcome,
              followUpRequired: session.followUpRequired,
              source: "counseling-sessions",
              metadata: {
                duration: session.duration,
                mood: session.mood,
                tags: session.tags
              }
            });
          });
        }
      } catch (error) {
        console.error('Individual sessions fetch error:', error);
      }
      
      // 3. Local storage'dan manuel notları al (geriye dönük uyumluluk için)
      try {
        const notesResponse = await fetch(`/api/notes?studentId=${studentId}`);
        if (notesResponse.ok) {
          const localNotes: MeetingNote[] = await notesResponse.json();
          
          localNotes.forEach((note) => {
            // Sadece counseling sessions'da olmayan notları ekle
            const alreadyExists = allMeetings.some(m => 
              m.date === note.date.split('T')[0] && 
              m.time === note.date.split('T')[1] &&
              m.note === note.note
            );
            
            if (!alreadyExists) {
              const noteType = note.type === "Veli" ? "veli" : 
                             note.type === "Grup" ? "grup" : "bireysel";
              
              allMeetings.push({
                id: note.id,
                date: note.date.split('T')[0],
                time: note.date.split('T')[1],
                type: noteType,
                note: note.note,
                plan: note.plan,
                source: "local-notes",
              });
            }
          });
        }
      } catch (error) {
        console.error('Local notes fetch error:', error);
      }
      
      // Tarihe göre sırala (en yeni en başta)
      allMeetings.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
        const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
        return dateB.getTime() - dateA.getTime();
      });
      
      return allMeetings;
    },
    staleTime: 2 * 60 * 1000, // 2 dakika
    enabled: !!studentId,
  });
}

// Görüşme tipine göre filtrele
export function useFilteredMeetings(
  studentId: string, 
  type?: "veli" | "bireysel" | "grup"
) {
  const { data: allMeetings, ...rest } = useUnifiedMeetings(studentId);
  
  const filteredMeetings = type 
    ? allMeetings?.filter(m => m.type === type) 
    : allMeetings;
  
  return {
    data: filteredMeetings,
    ...rest
  };
}

// Görüşme istatistikleri
export function useMeetingStats(studentId: string) {
  const { data: meetings } = useUnifiedMeetings(studentId);
  
  if (!meetings) {
    return {
      total: 0,
      byType: { veli: 0, bireysel: 0, grup: 0 },
      recentCount: 0,
      followUpPending: 0
    };
  }
  
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  return {
    total: meetings.length,
    byType: {
      veli: meetings.filter(m => m.type === "veli").length,
      bireysel: meetings.filter(m => m.type === "bireysel").length,
      grup: meetings.filter(m => m.type === "grup").length,
    },
    recentCount: meetings.filter(m => 
      new Date(m.date) >= thirtyDaysAgo
    ).length,
    followUpPending: meetings.filter(m => m.followUpRequired).length
  };
}
