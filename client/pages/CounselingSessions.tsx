import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Plus, Clock, CheckCircle2, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ActiveSessionsGrid from "@/components/counseling/ActiveSessionsGrid";
import CompletedSessionsList from "@/components/counseling/CompletedSessionsList";
import SessionsTable from "@/components/counseling/SessionsTable";
import NewSessionDialog from "@/components/counseling/NewSessionDialog";
import CompleteSessionDialog from "@/components/counseling/CompleteSessionDialog";

import { getCurrentClassHour, getElapsedTime, getSessionName } from "@/components/counseling/utils/sessionHelpers";
import { exportSessionsToExcel } from "@/components/counseling/utils/sessionExport";
import type {
  CounselingSession,
  Student,
  ClassHour,
  CounselingTopic,
  IndividualSessionFormValues,
  GroupSessionFormValues,
  CompleteSessionFormValues,
} from "@/components/counseling/types";

export default function CounselingSessions() {
  const [activeTab, setActiveTab] = useState("active");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sessionType, setSessionType] = useState<'individual' | 'group'>('individual');
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<CounselingSession | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [remindedSessions, setRemindedSessions] = useState<Set<string>>(new Set());
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery<CounselingSession[]>({
    queryKey: ['/api/counseling-sessions'],
    queryFn: async () => {
      const response = await fetch('/api/counseling-sessions');
      if (!response.ok) throw new Error('Failed to fetch sessions');
      return response.json();
    },
  });

  const { data: students = [] } = useQuery<Student[]>({
    queryKey: ['/api/students'],
    queryFn: async () => {
      const response = await fetch('/api/students');
      if (!response.ok) throw new Error('Failed to fetch students');
      return response.json();
    },
  });

  const { data: classHours = [] } = useQuery<ClassHour[]>({
    queryKey: ['/api/class-hours'],
    queryFn: async () => {
      const response = await fetch('/api/class-hours');
      if (!response.ok) throw new Error('Failed to fetch class hours');
      return response.json();
    },
  });

  const { data: topics = [] } = useQuery<CounselingTopic[]>({
    queryKey: ['/api/counseling-topics'],
    queryFn: async () => {
      const response = await fetch('/api/counseling-topics');
      if (!response.ok) throw new Error('Failed to fetch topics');
      return response.json();
    },
  });

  const activeSessions = sessions.filter(s => !s.completed);
  const completedSessions = sessions.filter(s => s.completed);

  const createSessionMutation = useMutation({
    mutationFn: async (data: IndividualSessionFormValues | GroupSessionFormValues) => {
      const now = new Date();
      const currentClassHour = getCurrentClassHour(classHours);
      
      const payload = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sessionType,
        counselorId: "user_1",
        sessionDate: now.toISOString().split('T')[0],
        entryTime: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
        entryClassHourId: currentClassHour?.id,
        ...data,
        studentIds: sessionType === 'individual' 
          ? [(data as IndividualSessionFormValues).studentId]
          : (data as GroupSessionFormValues).studentIds,
      };

      const response = await fetch('/api/counseling-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Görüşme oluşturulamadı');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/counseling-sessions'] });
      toast({
        title: "✅ Görüşme başlatıldı",
        description: "Rehberlik görüşmesi başarıyla kaydedildi.",
      });
      setDialogOpen(false);
      setSelectedStudents([]);
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const completeSessionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CompleteSessionFormValues }) => {
      const currentClassHour = getCurrentClassHour(classHours);
      const payload = {
        ...data,
        exitClassHourId: currentClassHour?.id,
      };

      const response = await fetch(`/api/counseling-sessions/${id}/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Görüşme tamamlanamadı');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/counseling-sessions'] });
      toast({
        title: "✅ Görüşme tamamlandı",
        description: "Rehberlik görüşmesi başarıyla kapatıldı.",
      });
      setCompleteDialogOpen(false);
      setSelectedSession(null);
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const extendSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await fetch(`/api/counseling-sessions/${sessionId}/extend`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Görüşme uzatılamadı');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/counseling-sessions'] });
      toast({
        title: "✅ Görüşme uzatıldı",
        description: "15 dakika ek süre tanındı.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['/api/counseling-sessions'] });

      activeSessions.forEach(session => {
        const elapsed = getElapsedTime(session.entryTime, session.sessionDate);
        const limit = session.extensionGranted ? 75 : 60;
        const sessionKey = session.id;
        const sessionName = getSessionName(session);

        if (elapsed === 30 && !remindedSessions.has(`${sessionKey}-30`)) {
          toast({
            title: "⏰ 30 Dakika Geçti",
            description: `${sessionName} - Görüşme 30 dakikadır devam ediyor`,
          });
          setRemindedSessions(prev => new Set(prev).add(`${sessionKey}-30`));
        }

        if (elapsed === 45 && !remindedSessions.has(`${sessionKey}-45`)) {
          toast({
            title: "⚠️ 45 Dakika Geçti",
            description: `${sessionName} - ${limit - elapsed} dakika sonra otomatik tamamlanacak`,
            variant: "default",
          });
          setRemindedSessions(prev => new Set(prev).add(`${sessionKey}-45`));
        }

        if (elapsed === 55 && !remindedSessions.has(`${sessionKey}-55`)) {
          toast({
            title: "🔔 55 Dakika Geçti",
            description: `${sessionName} - ${limit - elapsed} dakika sonra otomatik tamamlanacak`,
            variant: "destructive",
          });
          setRemindedSessions(prev => new Set(prev).add(`${sessionKey}-55`));
        }

        if (session.extensionGranted && elapsed === 70 && !remindedSessions.has(`${sessionKey}-70`)) {
          toast({
            title: "🚨 70 Dakika Geçti (Uzatılmış)",
            description: `${sessionName} - 5 dakika sonra otomatik tamamlanacak`,
            variant: "destructive",
          });
          setRemindedSessions(prev => new Set(prev).add(`${sessionKey}-70`));
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [activeSessions, remindedSessions, toast, queryClient]);

  useEffect(() => {
    const autoCompleteInterval = setInterval(async () => {
      try {
        await fetch('/api/counseling-sessions/auto-complete', { method: 'POST' });
        queryClient.invalidateQueries({ queryKey: ['/api/counseling-sessions'] });
      } catch (error) {
        console.error('Auto-complete error:', error);
      }
    }, 60000);

    return () => clearInterval(autoCompleteInterval);
  }, [queryClient]);

  const handleExport = () => {
    const count = exportSessionsToExcel(sessions);
    toast({
      title: "✅ Excel dosyası oluşturuldu",
      description: `${count} görüşme kaydı başarıyla dışa aktarıldı.`,
    });
  };

  const handleCompleteSession = (session: CounselingSession) => {
    setSelectedSession(session);
    setCompleteDialogOpen(true);
  };

  const handleCompleteSubmit = (data: CompleteSessionFormValues) => {
    if (!selectedSession) return;
    completeSessionMutation.mutate({ id: selectedSession.id, data });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rehberlik Görüşmeleri</h1>
          <p className="text-muted-foreground mt-1">
            Öğrenci görüşmelerini yönetin ve takip edin
          </p>
        </div>
        <Button 
          onClick={() => setDialogOpen(true)}
          size="lg"
          className="gap-2"
        >
          <Plus className="h-5 w-5" />
          Yeni Görüşme
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active" className="gap-2">
            <Clock className="h-4 w-4" />
            Aktif Görüşmeler
            {activeSessions.length > 0 && (
              <Badge variant="secondary" className="ml-2">{activeSessions.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Tamamlanan
          </TabsTrigger>
          <TabsTrigger value="journal" className="gap-2">
            <FileText className="h-4 w-4" />
            Görüşme Defteri
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <ActiveSessionsGrid
            sessions={activeSessions}
            isLoading={sessionsLoading}
            onCompleteSession={handleCompleteSession}
            onExtendSession={(id) => extendSessionMutation.mutate(id)}
            extendingSessionId={extendSessionMutation.variables as string | undefined}
          />
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <CompletedSessionsList sessions={completedSessions} />
        </TabsContent>

        <TabsContent value="journal" className="space-y-4">
          <SessionsTable sessions={sessions} onExport={handleExport} />
        </TabsContent>
      </Tabs>

      <NewSessionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        sessionType={sessionType}
        onSessionTypeChange={setSessionType}
        students={students}
        topics={topics}
        selectedStudents={selectedStudents}
        onSelectedStudentsChange={setSelectedStudents}
        onSubmit={(data) => createSessionMutation.mutate(data)}
        isPending={createSessionMutation.isPending}
      />

      <CompleteSessionDialog
        open={completeDialogOpen}
        onOpenChange={setCompleteDialogOpen}
        session={selectedSession}
        onSubmit={handleCompleteSubmit}
        isPending={completeSessionMutation.isPending}
      />
    </div>
  );
}
