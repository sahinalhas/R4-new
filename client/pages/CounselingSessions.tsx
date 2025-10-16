import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Plus, Clock, CheckCircle2, FileText, Bell, BarChart3, Download } from "lucide-react";
import { format } from "date-fns";
import { SESSION_MODE_LABELS } from "@shared/constants/common.constants";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ActiveSessionsGrid from "@/components/counseling/ActiveSessionsGrid";
import SessionsTable from "@/components/counseling/SessionsTable";
import SessionFiltersComponent from "@/components/counseling/SessionFilters";
import NewSessionDialog from "@/components/counseling/NewSessionDialog";
import EnhancedCompleteSessionDialog from "@/components/counseling/enhanced/EnhancedCompleteSessionDialog";
import ReminderDialog from "@/components/counseling/ReminderDialog";
import FollowUpDialog from "@/components/counseling/FollowUpDialog";
import SessionOutcomeDialog from "@/components/counseling/SessionOutcomeDialog";
import RemindersTab from "@/components/counseling/RemindersTab";
import OutcomesTab from "@/components/counseling/OutcomesTab";
import SessionAnalytics from "@/components/counseling/SessionAnalytics";

import { getCurrentClassHour, getElapsedTime, getSessionName } from "@/components/counseling/utils/sessionHelpers";
import { exportSessionsToExcel } from "@/components/counseling/utils/sessionExport";
import { generateSessionsPDF, generateOutcomesPDF, generateComprehensiveReport } from "@/components/counseling/utils/sessionReports";
import ReportGenerationDialog, { type ReportOptions } from "@/components/counseling/ReportGenerationDialog";
import type {
  CounselingSession,
  Student,
  ClassHour,
  CounselingTopic,
  IndividualSessionFormValues,
  GroupSessionFormValues,
  CompleteSessionFormValues,
  CounselingReminder,
  CounselingFollowUp,
  CounselingOutcome,
  ReminderFormValues,
  FollowUpFormValues,
  OutcomeFormValues,
  SessionFilters,
} from "@/components/counseling/types";
import { apiClient } from "@/lib/api/api-client";
import { COUNSELING_ENDPOINTS, STUDENT_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { buildUrl } from "@/lib/constants/api-endpoints";

export default function CounselingSessions() {
  const [activeTab, setActiveTab] = useState("active");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sessionType, setSessionType] = useState<'individual' | 'group'>('individual');
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<CounselingSession | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [remindedSessions, setRemindedSessions] = useState<Set<string>>(new Set());
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);
  const [outcomeDialogOpen, setOutcomeDialogOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<CounselingReminder | null>(null);
  const [selectedFollowUp, setSelectedFollowUp] = useState<CounselingFollowUp | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<(CounselingOutcome & { session?: CounselingSession }) | null>(null);
  const [filters, setFilters] = useState<SessionFilters>({ status: 'all', sessionType: 'all' });
  const [appliedFilters, setAppliedFilters] = useState<SessionFilters>({});
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery<CounselingSession[]>({
    queryKey: [COUNSELING_ENDPOINTS.BASE, appliedFilters],
    queryFn: () => apiClient.get<CounselingSession[]>(
      buildUrl(COUNSELING_ENDPOINTS.BASE, appliedFilters as any),
      { showErrorToast: false }
    ),
  });

  const { data: students = [] } = useQuery<Student[]>({
    queryKey: [STUDENT_ENDPOINTS.BASE],
    queryFn: () => apiClient.get<Student[]>(STUDENT_ENDPOINTS.BASE, { showErrorToast: false }),
  });

  const { data: classHours = [] } = useQuery<ClassHour[]>({
    queryKey: ['/api/counseling-sessions/class-hours'],
    queryFn: () => apiClient.get<ClassHour[]>('/api/counseling-sessions/class-hours', { showErrorToast: false }),
  });

  const { data: topics = [] } = useQuery<CounselingTopic[]>({
    queryKey: [COUNSELING_ENDPOINTS.TOPICS],
    queryFn: () => apiClient.get<CounselingTopic[]>(COUNSELING_ENDPOINTS.TOPICS, { showErrorToast: false }),
  });

  const { data: reminders = [] } = useQuery<CounselingReminder[]>({
    queryKey: ['/api/counseling-sessions/reminders'],
    queryFn: async () => {
      const response = await fetch('/api/counseling-sessions/reminders');
      if (!response.ok) throw new Error('Failed to fetch reminders');
      return response.json();
    },
  });

  const { data: followUps = [] } = useQuery<CounselingFollowUp[]>({
    queryKey: ['/api/counseling-sessions/follow-ups'],
    queryFn: async () => {
      const response = await fetch('/api/counseling-sessions/follow-ups');
      if (!response.ok) throw new Error('Failed to fetch follow-ups');
      return response.json();
    },
  });

  const { data: outcomes = [] } = useQuery<(CounselingOutcome & { session?: CounselingSession })[]>({
    queryKey: ['/api/counseling-sessions/outcomes'],
    queryFn: async () => {
      const response = await fetch('/api/counseling-sessions/outcomes');
      if (!response.ok) throw new Error('Failed to fetch outcomes');
      return response.json();
    },
  });

  const activeSessions = sessions.filter(s => !s.completed);

  const createSessionMutation = useMutation({
    mutationFn: async (data: IndividualSessionFormValues | GroupSessionFormValues) => {
      const currentClassHour = getCurrentClassHour(classHours);
      
      const sessionDate = data.sessionDate instanceof Date 
        ? format(data.sessionDate, 'yyyy-MM-dd')
        : data.sessionDate;
      
      const { sessionDate: _, sessionTime: __, ...restData } = data;
      
      const payload = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sessionType,
        counselorId: "user_1",
        sessionDate,
        entryTime: data.sessionTime,
        entryClassHourId: currentClassHour?.id,
        ...restData,
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
        description: "Görüşme Defteri'nde tamamlanan görüşmeyi görüntüleyebilirsiniz.",
      });
      setCompleteDialogOpen(false);
      setSelectedSession(null);
      setActiveTab("journal");
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

  const createReminderMutation = useMutation({
    mutationFn: async (data: ReminderFormValues) => {
      const reminderDate = data.reminderDate instanceof Date 
        ? format(data.reminderDate, 'yyyy-MM-dd')
        : data.reminderDate;
      
      const payload = {
        ...data,
        reminderDate,
        studentIds: JSON.stringify(data.studentIds),
      };

      const response = await fetch('/api/counseling-sessions/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Hatırlatma oluşturulamadı');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/counseling-sessions/reminders'] });
      toast({
        title: "✅ Hatırlatma oluşturuldu",
        description: "Hatırlatma başarıyla kaydedildi.",
      });
      setReminderDialogOpen(false);
      setSelectedReminder(null);
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateReminderMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ReminderFormValues }) => {
      const reminderDate = data.reminderDate instanceof Date 
        ? format(data.reminderDate, 'yyyy-MM-dd')
        : data.reminderDate;
      
      const payload = {
        ...data,
        reminderDate,
        studentIds: JSON.stringify(data.studentIds),
      };

      const response = await fetch(`/api/counseling-sessions/reminders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Hatırlatma güncellenemedi');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/counseling-sessions/reminders'] });
      toast({
        title: "✅ Hatırlatma güncellendi",
        description: "Hatırlatma başarıyla güncellendi.",
      });
      setReminderDialogOpen(false);
      setSelectedReminder(null);
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateReminderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'pending' | 'completed' | 'cancelled' }) => {
      const response = await fetch(`/api/counseling-sessions/reminders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Hatırlatma durumu güncellenemedi');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/counseling-sessions/reminders'] });
      const statusLabels = {
        completed: 'tamamlandı',
        cancelled: 'iptal edildi',
        pending: 'beklemede',
      };
      toast({
        title: "✅ Durum güncellendi",
        description: `Hatırlatma ${statusLabels[variables.status]} olarak işaretlendi.`,
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

  const createFollowUpMutation = useMutation({
    mutationFn: async (data: FollowUpFormValues) => {
      const followUpDate = data.followUpDate instanceof Date 
        ? format(data.followUpDate, 'yyyy-MM-dd')
        : data.followUpDate;
      
      const payload = {
        ...data,
        followUpDate,
      };

      const response = await fetch('/api/counseling-sessions/follow-ups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Takip oluşturulamadı');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/counseling-sessions/follow-ups'] });
      toast({
        title: "✅ Takip oluşturuldu",
        description: "Takip görevi başarıyla kaydedildi.",
      });
      setFollowUpDialogOpen(false);
      setSelectedFollowUp(null);
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateFollowUpMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FollowUpFormValues }) => {
      const followUpDate = data.followUpDate instanceof Date 
        ? format(data.followUpDate, 'yyyy-MM-dd')
        : data.followUpDate;
      
      const payload = {
        ...data,
        followUpDate,
      };

      const response = await fetch(`/api/counseling-sessions/follow-ups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Takip güncellenemedi');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/counseling-sessions/follow-ups'] });
      toast({
        title: "✅ Takip güncellendi",
        description: "Takip görevi başarıyla güncellendi.",
      });
      setFollowUpDialogOpen(false);
      setSelectedFollowUp(null);
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateFollowUpStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'pending' | 'in_progress' | 'completed' }) => {
      const response = await fetch(`/api/counseling-sessions/follow-ups/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Takip durumu güncellenemedi');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/counseling-sessions/follow-ups'] });
      const statusLabels = {
        pending: 'beklemede',
        in_progress: 'devam ediyor',
        completed: 'tamamlandı',
      };
      toast({
        title: "✅ Durum güncellendi",
        description: `Takip ${statusLabels[variables.status]} olarak işaretlendi.`,
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

  const createOutcomeMutation = useMutation({
    mutationFn: async (data: OutcomeFormValues) => {
      const followUpDate = data.followUpDate instanceof Date 
        ? format(data.followUpDate, 'yyyy-MM-dd')
        : data.followUpDate;
      
      const payload = {
        id: `outcome_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...data,
        followUpDate,
      };

      const response = await fetch('/api/counseling-sessions/outcomes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Sonuç kaydedilemedi');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/counseling-sessions/outcomes'] });
      toast({
        title: "✅ Sonuç kaydedildi",
        description: "Görüşme sonucu başarıyla kaydedildi.",
      });
      setOutcomeDialogOpen(false);
      setSelectedOutcome(null);
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateOutcomeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: OutcomeFormValues }) => {
      const followUpDate = data.followUpDate instanceof Date 
        ? format(data.followUpDate, 'yyyy-MM-dd')
        : data.followUpDate;
      
      const payload = {
        ...data,
        followUpDate,
      };

      const response = await fetch(`/api/counseling-sessions/outcomes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Sonuç güncellenemedi');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/counseling-sessions/outcomes'] });
      toast({
        title: "✅ Sonuç güncellendi",
        description: "Görüşme sonucu başarıyla güncellendi.",
      });
      setOutcomeDialogOpen(false);
      setSelectedOutcome(null);
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteOutcomeMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/counseling-sessions/outcomes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Sonuç silinemedi');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/counseling-sessions/outcomes'] });
      toast({
        title: "✅ Sonuç silindi",
        description: "Görüşme sonucu başarıyla silindi.",
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

  const handleCreateReminder = () => {
    setSelectedReminder(null);
    setReminderDialogOpen(true);
  };

  const handleEditReminder = (reminder: CounselingReminder) => {
    setSelectedReminder(reminder);
    setReminderDialogOpen(true);
  };

  const handleReminderSubmit = (data: ReminderFormValues) => {
    if (selectedReminder) {
      updateReminderMutation.mutate({ id: selectedReminder.id, data });
    } else {
      createReminderMutation.mutate(data);
    }
  };

  const handleCreateFollowUp = () => {
    setSelectedFollowUp(null);
    setFollowUpDialogOpen(true);
  };

  const handleEditFollowUp = (followUp: CounselingFollowUp) => {
    setSelectedFollowUp(followUp);
    setFollowUpDialogOpen(true);
  };

  const handleFollowUpSubmit = (data: FollowUpFormValues) => {
    if (selectedFollowUp) {
      updateFollowUpMutation.mutate({ id: selectedFollowUp.id, data });
    } else {
      createFollowUpMutation.mutate(data);
    }
  };

  const handleCreateOutcome = () => {
    setSelectedOutcome(null);
    setOutcomeDialogOpen(true);
  };

  const handleEditOutcome = (outcome: CounselingOutcome & { session?: CounselingSession }) => {
    setSelectedOutcome(outcome);
    setOutcomeDialogOpen(true);
  };

  const handleOutcomeSubmit = (data: OutcomeFormValues) => {
    if (selectedOutcome) {
      updateOutcomeMutation.mutate({ id: selectedOutcome.id, data });
    } else {
      createOutcomeMutation.mutate(data);
    }
  };

  const handleDeleteOutcome = (id: string) => {
    if (confirm('Bu sonucu silmek istediğinizden emin misiniz?')) {
      deleteOutcomeMutation.mutate(id);
    }
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    toast({ 
      title: "Filtreler uygulandı",
      description: "Görüşmeler filtrelendi.",
    });
  };

  const handleClearFilters = () => {
    setFilters({ status: 'all', sessionType: 'all' });
    setAppliedFilters({});
    toast({ 
      title: "Filtreler temizlendi",
      description: "Tüm filtreler kaldırıldı.",
    });
  };

  const handleGenerateReport = async (options: ReportOptions) => {
    try {
      let filteredSessions = sessions;
      let filteredOutcomes = outcomes;

      if (options.dateRange) {
        const { start, end } = options.dateRange;
        filteredSessions = sessions.filter(session => {
          const sessionDate = new Date(session.sessionDate);
          return sessionDate >= start && sessionDate <= end;
        });

        const sessionIds = new Set(filteredSessions.map(s => s.id));
        filteredOutcomes = outcomes.filter(outcome => sessionIds.has(outcome.sessionId));
      }

      let result;
      if (options.format === 'pdf') {
        if (options.includeSessions && options.includeOutcomes) {
          result = generateComprehensiveReport(filteredSessions, filteredOutcomes);
        } else if (options.includeSessions) {
          result = generateSessionsPDF(filteredSessions, [], { includeOutcomes: false });
        } else if (options.includeOutcomes) {
          result = generateOutcomesPDF(filteredOutcomes);
        }
      } else {
        const exportedCount = exportSessionsToExcel(filteredSessions);
        result = { success: true, sessionCount: exportedCount };
      }

      if (result?.success) {
        toast({
          title: "Rapor oluşturuldu",
          description: `${options.format.toUpperCase()} raporu başarıyla indirildi.`,
        });
      }
    } catch (error) {
      console.error('Report generation error:', error);
      toast({
        title: "Hata",
        description: "Rapor oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    }
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
        <div className="flex gap-2">
          <Button 
            onClick={() => setReportDialogOpen(true)}
            size="lg"
            variant="outline"
            className="gap-2"
          >
            <Download className="h-5 w-5" />
            Rapor Oluştur
          </Button>
          <Button 
            onClick={() => setDialogOpen(true)}
            size="lg"
            className="gap-2"
          >
            <Plus className="h-5 w-5" />
            Yeni Görüşme
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 min-h-[2.5rem]">
          <TabsTrigger value="active" className="flex items-center gap-2 justify-center">
            <Clock className="h-4 w-4" />
            Aktif Görüşmeler
            {activeSessions.length > 0 && (
              <Badge variant="secondary" className="ml-2">{activeSessions.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="reminders" className="flex items-center gap-2 justify-center">
            <Bell className="h-4 w-4" />
            Hatırlatmalar
          </TabsTrigger>
          <TabsTrigger value="outcomes" className="flex items-center gap-2 justify-center">
            <CheckCircle2 className="h-4 w-4" />
            Sonuçlar
            {outcomes.length > 0 && (
              <Badge variant="secondary" className="ml-2">{outcomes.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2 justify-center">
            <BarChart3 className="h-4 w-4" />
            İstatistikler
          </TabsTrigger>
          <TabsTrigger value="journal" className="flex items-center gap-2 justify-center">
            <FileText className="h-4 w-4" />
            Görüşme Defteri
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 min-h-[400px]">
          <ActiveSessionsGrid
            sessions={activeSessions}
            isLoading={sessionsLoading}
            onCompleteSession={handleCompleteSession}
            onExtendSession={(id) => extendSessionMutation.mutate(id)}
            extendingSessionId={extendSessionMutation.variables as string | undefined}
          />
        </TabsContent>

        <TabsContent value="reminders" className="space-y-4 min-h-[400px]">
          <RemindersTab
            reminders={reminders}
            followUps={followUps}
            onCreateReminder={handleCreateReminder}
            onCreateFollowUp={handleCreateFollowUp}
            onEditReminder={handleEditReminder}
            onEditFollowUp={handleEditFollowUp}
            onCompleteReminder={(id) => updateReminderStatusMutation.mutate({ id, status: 'completed' })}
            onCancelReminder={(id) => updateReminderStatusMutation.mutate({ id, status: 'cancelled' })}
            onCompleteFollowUp={(id) => updateFollowUpStatusMutation.mutate({ id, status: 'completed' })}
            onProgressFollowUp={(id) => updateFollowUpStatusMutation.mutate({ id, status: 'in_progress' })}
          />
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-4 min-h-[400px]">
          <OutcomesTab
            outcomes={outcomes}
            onCreateOutcome={handleCreateOutcome}
            onEditOutcome={handleEditOutcome}
            onDeleteOutcome={handleDeleteOutcome}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 min-h-[400px]">
          <SessionAnalytics />
        </TabsContent>

        <TabsContent value="journal" className="space-y-4 min-h-[400px]">
          <SessionFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
            topics={topics}
            isApplying={sessionsLoading}
          />
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

      <EnhancedCompleteSessionDialog
        open={completeDialogOpen}
        onOpenChange={setCompleteDialogOpen}
        session={selectedSession}
        onSubmit={handleCompleteSubmit}
        isPending={completeSessionMutation.isPending}
      />

      <ReminderDialog
        open={reminderDialogOpen}
        onOpenChange={setReminderDialogOpen}
        students={students}
        onSubmit={handleReminderSubmit}
        isPending={createReminderMutation.isPending || updateReminderMutation.isPending}
        initialData={selectedReminder ? {
          id: selectedReminder.id,
          reminderType: selectedReminder.reminderType,
          reminderDate: new Date(selectedReminder.reminderDate),
          reminderTime: selectedReminder.reminderTime,
          title: selectedReminder.title,
          description: selectedReminder.description,
          studentIds: JSON.parse(selectedReminder.studentIds),
        } : undefined}
      />

      <FollowUpDialog
        open={followUpDialogOpen}
        onOpenChange={setFollowUpDialogOpen}
        onSubmit={handleFollowUpSubmit}
        isPending={createFollowUpMutation.isPending || updateFollowUpMutation.isPending}
        initialData={selectedFollowUp ? {
          id: selectedFollowUp.id,
          followUpDate: new Date(selectedFollowUp.followUpDate),
          assignedTo: selectedFollowUp.assignedTo,
          priority: selectedFollowUp.priority,
          actionItems: selectedFollowUp.actionItems,
          notes: selectedFollowUp.notes,
        } : undefined}
      />

      <SessionOutcomeDialog
        open={outcomeDialogOpen}
        onOpenChange={setOutcomeDialogOpen}
        session={selectedOutcome?.session || null}
        onSubmit={handleOutcomeSubmit}
        isPending={createOutcomeMutation.isPending || updateOutcomeMutation.isPending}
        initialData={selectedOutcome ? {
          id: selectedOutcome.id,
          sessionId: selectedOutcome.sessionId,
          effectivenessRating: selectedOutcome.effectivenessRating,
          progressNotes: selectedOutcome.progressNotes,
          goalsAchieved: selectedOutcome.goalsAchieved,
          nextSteps: selectedOutcome.nextSteps,
          recommendations: selectedOutcome.recommendations,
          followUpRequired: selectedOutcome.followUpRequired,
          followUpDate: selectedOutcome.followUpDate ? new Date(selectedOutcome.followUpDate) : undefined,
        } : undefined}
      />

      <ReportGenerationDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        onGenerate={handleGenerateReport}
        sessionCount={sessions.length}
        outcomeCount={outcomes.length}
      />
    </div>
  );
}
