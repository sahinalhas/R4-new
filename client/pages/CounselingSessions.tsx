import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

import { 
  Plus, 
  Users, 
  User, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Search,
  ChevronDown,
  Check,
  X,
  Loader2,
  Calendar,
  Timer,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

const individualSessionSchema = z.object({
  studentId: z.string().min(1, "Öğrenci seçilmelidir"),
  topic: z.string().min(1, "Konu seçilmelidir"),
  participantType: z.string(),
  relationshipType: z.string().optional(),
  sessionMode: z.string(),
  sessionLocation: z.string(),
  sessionDetails: z.string().optional(),
});

const groupSessionSchema = z.object({
  groupName: z.string().optional(),
  studentIds: z.array(z.string()).min(1, "En az bir öğrenci seçilmelidir"),
  topic: z.string().min(1, "Konu seçilmelidir"),
  participantType: z.string(),
  sessionMode: z.string(),
  sessionLocation: z.string(),
  sessionDetails: z.string().optional(),
});

const completeSessionSchema = z.object({
  exitTime: z.string(),
  detailedNotes: z.string().optional(),
});

type IndividualSessionFormValues = z.infer<typeof individualSessionSchema>;
type GroupSessionFormValues = z.infer<typeof groupSessionSchema>;
type CompleteSessionFormValues = z.infer<typeof completeSessionSchema>;

interface Student {
  id: string;
  name: string;
  className: string;
}

interface ClassHour {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
}

interface CounselingTopic {
  id: string;
  title: string;
  category: string;
  fullPath: string;
}

interface CounselingSession {
  id: string;
  sessionType: 'individual' | 'group';
  groupName?: string;
  counselorId: string;
  sessionDate: string;
  entryTime: string;
  entryClassHourId?: number;
  exitTime?: string;
  exitClassHourId?: number;
  topic: string;
  participantType: string;
  relationshipType?: string;
  otherParticipants?: string;
  sessionMode: string;
  sessionLocation: string;
  disciplineStatus?: string;
  institutionalCooperation?: string;
  sessionDetails?: string;
  detailedNotes?: string;
  autoCompleted: boolean;
  extensionGranted: boolean;
  completed: boolean;
  created_at: string;
  updated_at: string;
  student?: Student;
  students?: Student[];
}

export default function CounselingSessions() {
  const [activeTab, setActiveTab] = useState("active");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sessionType, setSessionType] = useState<'individual' | 'group'>('individual');
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<CounselingSession | null>(null);
  const [studentSearchOpen, setStudentSearchOpen] = useState(false);
  const [topicSearchOpen, setTopicSearchOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  
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

  const getCurrentClassHour = () => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    return classHours.find(hour => 
      currentTime >= hour.startTime && currentTime <= hour.endTime
    );
  };

  const individualForm = useForm<IndividualSessionFormValues>({
    resolver: zodResolver(individualSessionSchema),
    defaultValues: {
      studentId: "",
      topic: "",
      participantType: "öğrenci",
      relationshipType: "",
      sessionMode: "yüz_yüze",
      sessionLocation: "Rehberlik Servisi",
      sessionDetails: "",
    },
  });

  const groupForm = useForm<GroupSessionFormValues>({
    resolver: zodResolver(groupSessionSchema),
    defaultValues: {
      groupName: "",
      studentIds: [],
      topic: "",
      participantType: "öğrenci",
      sessionMode: "yüz_yüze",
      sessionLocation: "Rehberlik Servisi",
      sessionDetails: "",
    },
  });

  const completeForm = useForm<CompleteSessionFormValues>({
    resolver: zodResolver(completeSessionSchema),
    defaultValues: {
      exitTime: new Date().toTimeString().slice(0, 5),
      detailedNotes: "",
    },
  });

  const createSessionMutation = useMutation({
    mutationFn: async (data: IndividualSessionFormValues | GroupSessionFormValues) => {
      const now = new Date();
      const currentClassHour = getCurrentClassHour();
      
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
      individualForm.reset();
      groupForm.reset();
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
      const currentClassHour = getCurrentClassHour();
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
      completeForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: IndividualSessionFormValues | GroupSessionFormValues) => {
    createSessionMutation.mutate(data);
  };

  const onCompleteSubmit = (data: CompleteSessionFormValues) => {
    if (!selectedSession) return;
    completeSessionMutation.mutate({ id: selectedSession.id, data });
  };

  const getElapsedTime = (entryTime: string, sessionDate: string) => {
    const entry = new Date(`${sessionDate}T${entryTime}`);
    const now = new Date();
    const diff = Math.floor((now.getTime() - entry.getTime()) / 1000 / 60);
    return diff;
  };

  const getTimerColor = (minutes: number, extensionGranted: boolean) => {
    const limit = extensionGranted ? 75 : 60;
    if (minutes >= limit - 5) return 'text-red-600';
    if (minutes >= limit - 15) return 'text-orange-600';
    if (minutes >= limit - 30) return 'text-yellow-600';
    return 'text-green-600';
  };

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

  const [remindedSessions, setRemindedSessions] = useState<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['/api/counseling-sessions'] });

      activeSessions.forEach(session => {
        const elapsed = getElapsedTime(session.entryTime, session.sessionDate);
        const limit = session.extensionGranted ? 75 : 60;
        const sessionKey = session.id;
        const sessionName = session.sessionType === 'individual' ? session.student?.name : session.groupName;

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
          {sessionsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : activeSessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">Aktif görüşme bulunmuyor</p>
                <p className="text-sm text-muted-foreground">Yeni görüşme başlatmak için yukarıdaki butonu kullanın</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {activeSessions.map((session) => {
                const elapsed = getElapsedTime(session.entryTime, session.sessionDate);
                const timerColor = getTimerColor(elapsed, session.extensionGranted);
                
                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {session.sessionType === 'individual' ? (
                                <User className="h-5 w-5 text-blue-600" />
                              ) : (
                                <Users className="h-5 w-5 text-purple-600" />
                              )}
                              <CardTitle className="text-lg">
                                {session.sessionType === 'individual' 
                                  ? session.student?.name 
                                  : session.groupName || 'Grup Görüşmesi'}
                              </CardTitle>
                              <Badge variant={session.sessionType === 'individual' ? 'default' : 'secondary'}>
                                {session.sessionType === 'individual' ? 'Bireysel' : 'Grup'}
                              </Badge>
                            </div>
                            {session.sessionType === 'group' && session.students && (
                              <p className="text-sm text-muted-foreground">
                                {session.students.map(s => s.name).join(', ')}
                              </p>
                            )}
                          </div>
                          <div className="text-right space-y-1">
                            <div className={cn("text-2xl font-bold tabular-nums", timerColor)}>
                              <Timer className="h-4 w-4 inline mr-1" />
                              {elapsed} dk
                            </div>
                            {elapsed >= 30 && (
                              <Badge variant="outline" className="text-xs">
                                <Bell className="h-3 w-3 mr-1" />
                                {elapsed >= (session.extensionGranted ? 75 : 60) 
                                  ? `${session.extensionGranted ? '75' : '60'}+ dakika` 
                                  : `${(session.extensionGranted ? 75 : 60) - elapsed} dk kaldı`}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(session.sessionDate).toLocaleDateString('tr-TR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {session.entryTime}
                          </span>
                          <span>•</span>
                          <span>{session.topic}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-end gap-2">
                          {elapsed >= 55 && !session.extensionGranted && (
                            <Button
                              variant="secondary"
                              onClick={() => extendSessionMutation.mutate(session.id)}
                              disabled={extendSessionMutation.isPending}
                              className="gap-2"
                            >
                              {extendSessionMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
                              15 Dakika Uzat
                            </Button>
                          )}
                          {session.extensionGranted && (
                            <Badge variant="outline" className="mr-2">
                              <Clock className="h-3 w-3 mr-1" />
                              Uzatıldı (+15 dk)
                            </Badge>
                          )}
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedSession(session);
                              setCompleteDialogOpen(true);
                            }}
                          >
                            Görüşmeyi Tamamla
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Tamamlanan Görüşmeler</CardTitle>
              <CardDescription>Geçmiş görüşme kayıtlarını görüntüleyin</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Tamamlanan görüşmeler burada görüntülenecek
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journal">
          <Card>
            <CardHeader>
              <CardTitle>Görüşme Defteri</CardTitle>
              <CardDescription>Tüm görüşmelerin tablo görünümü</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Görüşme defteri burada görüntülenecek
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Yeni Görüşme Başlat</DialogTitle>
            <DialogDescription>
              Rehberlik görüşmesi kaydı oluşturun
            </DialogDescription>
          </DialogHeader>

          <Tabs value={sessionType} onValueChange={(v) => setSessionType(v as 'individual' | 'group')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="individual">
                <User className="h-4 w-4 mr-2" />
                Bireysel Görüşme
              </TabsTrigger>
              <TabsTrigger value="group">
                <Users className="h-4 w-4 mr-2" />
                Grup Görüşmesi
              </TabsTrigger>
            </TabsList>

            <TabsContent value="individual">
              <Form {...individualForm}>
                <form onSubmit={individualForm.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={individualForm.control}
                    name="studentId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Öğrenci *</FormLabel>
                        <Popover open={studentSearchOpen} onOpenChange={setStudentSearchOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? students.find((s) => s.id === field.value)?.name
                                  : "Öğrenci seçin"}
                                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0">
                            <Command>
                              <CommandInput placeholder="Öğrenci ara..." />
                              <CommandList>
                                <CommandEmpty>Öğrenci bulunamadı.</CommandEmpty>
                                <CommandGroup>
                                  {students.map((student) => (
                                    <CommandItem
                                      key={student.id}
                                      value={student.name}
                                      onSelect={() => {
                                        field.onChange(student.id);
                                        setStudentSearchOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value === student.id ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      <div>
                                        <p className="font-medium">{student.name}</p>
                                        <p className="text-sm text-muted-foreground">{student.className}</p>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={individualForm.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Görüşme Konusu *</FormLabel>
                        <Popover open={topicSearchOpen} onOpenChange={setTopicSearchOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value || "Konu seçin"}
                                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[500px] p-0">
                            <Command>
                              <CommandInput placeholder="Konu ara..." />
                              <CommandList>
                                <CommandEmpty>Konu bulunamadı.</CommandEmpty>
                                <CommandGroup>
                                  {topics.map((topic) => (
                                    <CommandItem
                                      key={topic.id}
                                      value={topic.fullPath}
                                      onSelect={() => {
                                        field.onChange(topic.title);
                                        setTopicSearchOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value === topic.title ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      <div>
                                        <p className="font-medium">{topic.title}</p>
                                        <p className="text-xs text-muted-foreground">{topic.category}</p>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={individualForm.control}
                      name="sessionMode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Görüşme Şekli</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="yüz_yüze">Yüz Yüze</SelectItem>
                              <SelectItem value="telefon">Telefon</SelectItem>
                              <SelectItem value="online">Online</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={individualForm.control}
                      name="sessionLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Konum</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Rehberlik Servisi" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={individualForm.control}
                    name="sessionDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notlar (Opsiyonel)</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Görüşme hakkında ek notlar..."
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setDialogOpen(false)}
                    >
                      İptal
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createSessionMutation.isPending}
                    >
                      {createSessionMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Görüşmeyi Başlat
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="group">
              <Form {...groupForm}>
                <form onSubmit={groupForm.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={groupForm.control}
                    name="groupName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grup Adı (Opsiyonel)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Örn: 9-A Sınıfı Akran Arabuluculuğu" />
                        </FormControl>
                        <FormDescription>
                          Grup görüşmesini tanımlayan bir ad verin
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={groupForm.control}
                    name="studentIds"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Öğrenciler * ({selectedStudents.length} seçili)</FormLabel>
                        <Popover open={studentSearchOpen} onOpenChange={setStudentSearchOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between",
                                  selectedStudents.length === 0 && "text-muted-foreground"
                                )}
                              >
                                {selectedStudents.length > 0
                                  ? `${selectedStudents.length} öğrenci seçildi`
                                  : "Öğrenci seçin"}
                                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0">
                            <Command>
                              <CommandInput placeholder="Öğrenci ara..." />
                              <CommandList>
                                <CommandEmpty>Öğrenci bulunamadı.</CommandEmpty>
                                <CommandGroup>
                                  {students.map((student) => {
                                    const isSelected = selectedStudents.some(s => s.id === student.id);
                                    return (
                                      <CommandItem
                                        key={student.id}
                                        value={student.name}
                                        onSelect={() => {
                                          if (isSelected) {
                                            const updated = selectedStudents.filter(s => s.id !== student.id);
                                            setSelectedStudents(updated);
                                            field.onChange(updated.map(s => s.id));
                                          } else {
                                            const updated = [...selectedStudents, student];
                                            setSelectedStudents(updated);
                                            field.onChange(updated.map(s => s.id));
                                          }
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            isSelected ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        <div>
                                          <p className="font-medium">{student.name}</p>
                                          <p className="text-sm text-muted-foreground">{student.className}</p>
                                        </div>
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {selectedStudents.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedStudents.map((student) => (
                              <Badge key={student.id} variant="secondary" className="gap-1">
                                {student.name}
                                <X
                                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                                  onClick={() => {
                                    const updated = selectedStudents.filter(s => s.id !== student.id);
                                    setSelectedStudents(updated);
                                    field.onChange(updated.map(s => s.id));
                                  }}
                                />
                              </Badge>
                            ))}
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={groupForm.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Görüşme Konusu *</FormLabel>
                        <Popover open={topicSearchOpen} onOpenChange={setTopicSearchOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value || "Konu seçin"}
                                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[500px] p-0">
                            <Command>
                              <CommandInput placeholder="Konu ara..." />
                              <CommandList>
                                <CommandEmpty>Konu bulunamadı.</CommandEmpty>
                                <CommandGroup>
                                  {topics.map((topic) => (
                                    <CommandItem
                                      key={topic.id}
                                      value={topic.fullPath}
                                      onSelect={() => {
                                        field.onChange(topic.title);
                                        setTopicSearchOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value === topic.title ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      <div className="flex-1">
                                        <p className="font-medium">{topic.title}</p>
                                        <p className="text-sm text-muted-foreground">{topic.fullPath}</p>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={groupForm.control}
                      name="participantType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Katılımcı Tipi</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="öğrenci">Öğrenci</SelectItem>
                              <SelectItem value="veli">Veli</SelectItem>
                              <SelectItem value="öğretmen">Öğretmen</SelectItem>
                              <SelectItem value="diğer">Diğer</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={groupForm.control}
                      name="sessionMode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Görüşme Şekli</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="yüz_yüze">Yüz Yüze</SelectItem>
                              <SelectItem value="online">Online</SelectItem>
                              <SelectItem value="telefon">Telefon</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={groupForm.control}
                    name="sessionLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Görüşme Yeri</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Rehberlik Servisi" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={groupForm.control}
                    name="sessionDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notlar (Opsiyonel)</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Grup görüşmesi hakkında ek notlar..."
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setDialogOpen(false)}
                    >
                      İptal
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createSessionMutation.isPending}
                    >
                      {createSessionMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Grup Görüşmesini Başlat
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Görüşmeyi Tamamla</DialogTitle>
            <DialogDescription>
              Görüşme özetini yazın ve kaydı kapatın
            </DialogDescription>
          </DialogHeader>

          <Form {...completeForm}>
            <form onSubmit={completeForm.handleSubmit(onCompleteSubmit)} className="space-y-4">
              <FormField
                control={completeForm.control}
                name="exitTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Çıkış Saati</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={completeForm.control}
                name="detailedNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Görüşme Özeti</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Görüşmede neler konuşuldu, ne tür kararlar alındı..."
                        rows={6}
                      />
                    </FormControl>
                    <FormDescription>
                      Görüşmenin detaylı özetini yazın
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCompleteDialogOpen(false)}
                >
                  İptal
                </Button>
                <Button 
                  type="submit" 
                  disabled={completeSessionMutation.isPending}
                >
                  {completeSessionMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Tamamla
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
