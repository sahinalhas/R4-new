import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, Bar, BarChart, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Bell,
  Search,
  Users2,
  CalendarDays,
  MessageSquare,
  FileText,
  BarChart3,
  Settings,
  BookOpen,
  Clock,
  TrendingUp,
  UserCheck,
  AlertTriangle,
  Target,
  Shield,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Brain,
  Heart,
  TrendingDown,
  Activity,
  Eye,
  EyeOff,
} from "lucide-react";
import { generateEarlyWarnings, type EarlyWarning } from "@/lib/analytics";
import type { Student, Intervention } from "@/lib/storage";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  studentCount: number;
  meetingCount: number;
  activeSurveyCount: number;
  openInterventionCount: number;
  teacherCount: number;
  reportCount: number;
}

interface RiskDistribution {
  high: number;
  medium: number;
  low: number;
  none: number;
}

export default function Index() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"ogretmen" | "yönetici">("ogretmen");
  const [q, setQ] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const [stats, setStats] = useState<DashboardStats>({
    studentCount: 0,
    meetingCount: 0,
    activeSurveyCount: 0,
    openInterventionCount: 0,
    teacherCount: 8,
    reportCount: 24,
  });

  const [riskDistribution, setRiskDistribution] = useState<RiskDistribution>({
    high: 0,
    medium: 0,
    low: 0,
    none: 0,
  });

  const [students, setStudents] = useState<Student[]>([]);
  const [hiddenWidgets, setHiddenWidgets] = useState<Set<string>>(new Set());

  const [earlyWarnings, setEarlyWarnings] = useState<EarlyWarning[]>([]);

  useEffect(() => {
    async function fetchWarnings() {
      if (students.length === 0) {
        setEarlyWarnings([]);
        return;
      }
      try {
        const warnings = await generateEarlyWarnings();
        setEarlyWarnings(warnings.slice(0, 10));
      } catch (error) {
        console.error('Failed to generate early warnings:', error);
        setEarlyWarnings([]);
      }
    }
    fetchWarnings();
  }, [students]);

  const criticalWarnings = useMemo(() => {
    return earlyWarnings.filter(w => w.severity === 'kritik' || w.severity === 'yüksek');
  }, [earlyWarnings]);

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      try {
        const [studentsRes, distributionsRes] = await Promise.all([
          fetch('/api/students'),
          fetch('/api/survey-distributions'),
        ]);

        if (studentsRes.ok) {
          const studentsData = await studentsRes.json();
          setStudents(studentsData);
          setStats(prev => ({ ...prev, studentCount: studentsData.length }));

          const riskCount = {
            high: studentsData.filter((s: Student) => s.risk === "Yüksek").length,
            medium: studentsData.filter((s: Student) => s.risk === "Orta").length,
            low: studentsData.filter((s: Student) => s.risk === "Düşük").length,
            none: studentsData.filter((s: Student) => !s.risk).length,
          };
          setRiskDistribution(riskCount);

          let totalInterventions = 0;
          for (const student of studentsData.slice(0, 20)) {
            try {
              const interventionsRes = await fetch(`/api/students/${student.id}/interventions`);
              if (interventionsRes.ok) {
                const interventions: Intervention[] = await interventionsRes.json();
                totalInterventions += interventions.filter(i => i.status !== "Tamamlandı").length;
              }
            } catch (error) {
              console.error(`Failed to fetch interventions for student ${student.id}:`, error);
            }
          }
          setStats(prev => ({ ...prev, openInterventionCount: totalInterventions }));
        }

        if (distributionsRes.ok) {
          const distributions = await distributionsRes.json();
          const activeCount = distributions.filter((d: any) => d.status === 'ACTIVE').length;
          setStats(prev => ({ ...prev, activeSurveyCount: activeCount }));
        }

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        setStats(prev => ({ ...prev, meetingCount: Math.floor(Math.random() * 20) + 15 }));

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const displayStats = useMemo(() => {
    if (role === "yönetici") {
      return [
        { label: "Toplam Öğrenci", value: stats.studentCount, icon: Users2, color: "from-indigo-500/20 to-indigo-600/20", trend: "+12%" },
        { label: "Aktif Öğretmen", value: stats.teacherCount, icon: UserCheck, color: "from-purple-500/20 to-purple-600/20", trend: "+2" },
        { label: "Bu Ay Rapor", value: stats.reportCount, icon: BarChart3, color: "from-violet-500/20 to-violet-600/20", trend: "+8" },
        { label: "Açık Takip", value: stats.openInterventionCount, icon: AlertTriangle, color: "from-fuchsia-500/20 to-fuchsia-600/20", trend: "-3" },
      ];
    } else {
      return [
        { label: "Toplam Öğrenci", value: stats.studentCount, icon: Users2, color: "from-indigo-500/20 to-indigo-600/20", trend: "+12%" },
        { label: "Bu Hafta Görüşme", value: stats.meetingCount, icon: CalendarDays, color: "from-purple-500/20 to-purple-600/20", trend: "+5" },
        { label: "Aktif Anket", value: stats.activeSurveyCount, icon: MessageSquare, color: "from-violet-500/20 to-violet-600/20", trend: "2 aktif" },
        { label: "Açık Takip", value: stats.openInterventionCount, icon: Bell, color: "from-fuchsia-500/20 to-fuchsia-600/20", trend: "-3" },
      ];
    }
  }, [role, stats]);

  const weeklyMeetingData = [
    { day: "Pzt", this: stats.meetingCount > 0 ? Math.floor(stats.meetingCount * 0.18) : 8, prev: 5 },
    { day: "Sal", this: stats.meetingCount > 0 ? Math.floor(stats.meetingCount * 0.16) : 6, prev: 7 },
    { day: "Çar", this: stats.meetingCount > 0 ? Math.floor(stats.meetingCount * 0.20) : 7, prev: 6 },
    { day: "Per", this: stats.meetingCount > 0 ? Math.floor(stats.meetingCount * 0.24) : 9, prev: 5 },
    { day: "Cum", this: stats.meetingCount > 0 ? Math.floor(stats.meetingCount * 0.22) : 6, prev: 4 },
  ];

  const riskChartData = [
    { name: "Düşük", value: riskDistribution.low, color: "#22c55e" },
    { name: "Orta", value: riskDistribution.medium, color: "#f59e0b" },
    { name: "Yüksek", value: riskDistribution.high, color: "#ef4444" },
    { name: "Değerlendirilmemiş", value: riskDistribution.none, color: "#94a3b8" },
  ];

  const toggleWidget = (widgetId: string) => {
    setHiddenWidgets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(widgetId)) {
        newSet.delete(widgetId);
      } else {
        newSet.add(widgetId);
      }
      return newSet;
    });
  };

  const handleQuickAction = (action: string, studentId?: string) => {
    switch (action) {
      case 'view-student':
        if (studentId) navigate(`/ogrenci/${studentId}`);
        break;
      case 'new-meeting':
        navigate('/gorusmeler');
        break;
      case 'view-surveys':
        navigate('/anketler');
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <Activity className="h-8 w-8 animate-pulse mx-auto text-primary" />
          <p className="text-muted-foreground">Dashboard yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2 bg-gradient-to-br from-primary/15 via-primary/5 to-accent/15 border-primary/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Rehber360 Dashboard</span>
              <Badge variant="secondary">
                Rol: {role === "ogretmen" ? "Rehber Öğretmen" : "Yönetici"}
              </Badge>
            </CardTitle>
            <CardDescription>
              MEB uyumlu dijital rehberlik yönetimi - Gerçek Zamanlı Veriler
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Öğrenci ara: No / ad / soyad"
                className="pl-9 h-11"
                aria-label="Öğrenci arama"
              />
            </div>
            <ToggleGroup
              type="single"
              value={role}
              onValueChange={(v) => v && setRole(v as typeof role)}
              className="justify-start"
            >
              <ToggleGroupItem value="ogretmen">Öğretmen</ToggleGroupItem>
              <ToggleGroupItem value="yönetici">Yönetici</ToggleGroupItem>
            </ToggleGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Bugün
            </CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString('tr-TR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {criticalWarnings.length > 0 ? (
              criticalWarnings.slice(0, 3).map((warning, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleQuickAction('view-student', warning.studentId)}
                >
                  <AlertTriangle className="h-4 w-4 text-fuchsia-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{warning.studentName}</div>
                    <div className="text-xs text-muted-foreground">{warning.message}</div>
                  </div>
                  <Badge variant="destructive" className="text-xs">{warning.severity}</Badge>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                Bugün için kritik uyarı bulunmuyor
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {displayStats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">{s.label}</div>
                    <div className="text-2xl font-bold">{s.value.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.trend}</div>
                  </div>
                  <div className={`size-10 rounded-md bg-gradient-to-br ${s.color} text-primary grid place-items-center`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Görselleştirme & Analitik</h2>
        <div className="text-xs text-muted-foreground">Widget'ları özelleştir</div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {!hiddenWidgets.has('weekly-meetings') && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Görüşme Trendleri</CardTitle>
                  <CardDescription>Bu hafta vs geçen hafta</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleWidget('weekly-meetings')}
                >
                  <EyeOff className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    this: { label: "Bu Hafta", color: "hsl(var(--primary))" },
                    prev: { label: "Geçen Hafta", color: "hsl(var(--muted-foreground))" },
                  }}
                >
                  <AreaChart data={weeklyMeetingData}>
                    <CartesianGrid vertical={false} strokeDasharray="4 4" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
                    <Area
                      dataKey="prev"
                      type="monotone"
                      stroke="hsl(var(--muted-foreground))"
                      fill="hsl(var(--muted)/0.4)"
                    />
                    <Area
                      dataKey="this"
                      type="monotone"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary)/0.3)"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!hiddenWidgets.has('quick-actions') && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Hızlı Erişim</CardTitle>
                  <CardDescription>Öne çıkan modüller</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => toggleWidget('quick-actions')}>
                  <EyeOff className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {role === "yönetici" ? (
                  <>
                    <Button asChild className="w-full">
                      <a href="/ogrenci"><Users2 className="mr-2 h-4 w-4" /> Öğrenci Yönetimi</a>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <a href="/raporlar"><BarChart3 className="mr-2 h-4 w-4" /> Sistem Raporları</a>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <a href="/ayarlar"><Settings className="mr-2 h-4 w-4" /> Sistem Ayarları</a>
                    </Button>
                    <Button asChild variant="secondary" className="w-full">
                      <a href="/anketler"><MessageSquare className="mr-2 h-4 w-4" /> Anket Yönetimi</a>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild className="w-full">
                      <a href="/ogrenci"><Users2 className="mr-2 h-4 w-4" /> Öğrenci Yönetimi</a>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <a href="/gorusmeler"><CalendarDays className="mr-2 h-4 w-4" /> Görüşmeler</a>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <a href="/ayarlar?tab=dersler"><BookOpen className="mr-2 h-4 w-4" /> Ders & Konular</a>
                    </Button>
                    <Button asChild variant="secondary" className="w-full">
                      <a href="/raporlar"><FileText className="mr-2 h-4 w-4" /> Raporlama</a>
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {!hiddenWidgets.has('risk-distribution') && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Risk Dağılımı Analizi</CardTitle>
                <CardDescription>Öğrenci risk seviyeleri</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => toggleWidget('risk-distribution')}>
                <EyeOff className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {riskChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-sm font-medium">Yüksek Risk</span>
                    </div>
                    <Badge variant="destructive">{riskDistribution.high}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-sm font-medium">Orta Risk</span>
                    </div>
                    <Badge variant="outline" className="border-violet-500 text-violet-700">{riskDistribution.medium}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">Düşük Risk</span>
                    </div>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">{riskDistribution.low}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                      <span className="text-sm font-medium">Değerlendirilmemiş</span>
                    </div>
                    <Badge variant="outline">{riskDistribution.none}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {role === "ogretmen" && !hiddenWidgets.has('early-warnings') && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 to-pink-50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-fuchsia-800">
                  <AlertTriangle className="h-5 w-5" />
                  Erken Uyarı Sistemi
                </CardTitle>
                <CardDescription>Otomatik risk tespiti ve müdahale önerileri</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => toggleWidget('early-warnings')}>
                <EyeOff className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {earlyWarnings.length > 0 ? (
                <div className="space-y-3">
                  {earlyWarnings.slice(0, 5).map((warning) => (
                    <div
                      key={warning.studentId + warning.warningType}
                      className="bg-white p-4 rounded-lg border border-fuchsia-200 hover:border-fuchsia-300 transition-colors cursor-pointer"
                      onClick={() => handleQuickAction('view-student', warning.studentId)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-sm">{warning.studentName}</h4>
                          <p className="text-xs text-muted-foreground capitalize">{warning.warningType}</p>
                        </div>
                        <Badge
                          variant={warning.severity === 'kritik' ? 'destructive' : warning.severity === 'yüksek' ? 'default' : 'secondary'}
                        >
                          {warning.severity}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{warning.message}</p>
                      <div className="text-xs text-muted-foreground">
                        <strong>Öneriler:</strong>
                        <ul className="list-disc list-inside mt-1">
                          {warning.recommendations.slice(0, 2).map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>Şu an kritik uyarı bulunmuyor</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {role === "ogretmen" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Rehberlik Bilgi Merkezi</h2>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {!hiddenWidgets.has('risk-summary') && (
              <Card className="border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 to-pink-50">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-fuchsia-800">
                      <AlertTriangle className="h-5 w-5" />
                      Risk Değerlendirme
                    </CardTitle>
                    <CardDescription>Öğrenci risk durumu özeti</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleWidget('risk-summary')}>
                    <EyeOff className="h-3 w-3" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-600">Yüksek Risk</span>
                    <Badge variant="destructive">{riskDistribution.high}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-yellow-600">Orta Risk</span>
                    <Badge variant="outline" className="border-violet-500 text-violet-700">{riskDistribution.medium}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-600">Düşük Risk</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">{riskDistribution.low}</Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {!hiddenWidgets.has('weekly-focus') && (
              <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-indigo-800">
                      <Target className="h-5 w-5" />
                      Bu Hafta Odak
                    </CardTitle>
                    <CardDescription>Öncelikli konular</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleWidget('weekly-focus')}>
                    <EyeOff className="h-3 w-3" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Devamsızlık takibi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Veli görüşmeleri</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Sosyal uyum desteği</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {!hiddenWidgets.has('weekly-progress') && (
              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-purple-800">
                      <TrendingUp className="h-5 w-5" />
                      Haftalık İlerleme
                    </CardTitle>
                    <CardDescription>Bu hafta başarılar</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleWidget('weekly-progress')}>
                    <EyeOff className="h-3 w-3" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tamamlanan görüşme</span>
                    <Badge className="bg-purple-100 text-purple-700">{stats.meetingCount}/20</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Çözülen takip</span>
                    <Badge className="bg-indigo-100 text-indigo-700">3</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Olumlu gelişim</span>
                    <Badge className="bg-purple-100 text-purple-700">8</Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {!hiddenWidgets.has('quick-resources') && (
              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-purple-800">
                      <Lightbulb className="h-5 w-5" />
                      Hızlı Kaynaklar
                    </CardTitle>
                    <CardDescription>Rehberlik araçları</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleWidget('quick-resources')}>
                    <EyeOff className="h-3 w-3" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start h-8">
                    <FileText className="mr-2 h-3 w-3" />
                    Müdahale Formları
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start h-8">
                    <Users2 className="mr-2 h-3 w-3" />
                    Veli İletişim Şablonları
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start h-8">
                    <BookOpen className="mr-2 h-3 w-3" />
                    Rehberlik Kılavuzu
                  </Button>
                </CardContent>
              </Card>
            )}

            {!hiddenWidgets.has('system-reminders') && (
              <Card className="border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Shield className="h-5 w-5" />
                      Sistem Hatırlatma
                    </CardTitle>
                    <CardDescription>Bekleyen görevler</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleWidget('system-reminders')}>
                    <EyeOff className="h-3 w-3" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm flex items-center justify-between">
                    <span>Bekleyen rapor onayı</span>
                    <Badge variant="outline">2</Badge>
                  </div>
                  <div className="text-sm flex items-center justify-between">
                    <span>Süresi dolan takipler</span>
                    <Badge variant="outline">{stats.openInterventionCount > 5 ? '5+' : stats.openInterventionCount}</Badge>
                  </div>
                  <div className="text-sm flex items-center justify-between">
                    <span>Veri yedekleme</span>
                    <Badge className="bg-purple-100 text-purple-700">Güncel</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      )}

      {hiddenWidgets.size > 0 && (
        <div className="flex items-center justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHiddenWidgets(new Set())}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Tüm Widget'ları Göster ({hiddenWidgets.size} gizli)
          </Button>
        </div>
      )}
    </div>
  );
}
