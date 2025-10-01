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
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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
} from "lucide-react";

export default function Index() {
  const [role, setRole] = useState<"ogretmen" | "yönetici">("ogretmen");
  const [q, setQ] = useState("");

  const [studentCount, setStudentCount] = useState(4);

  useEffect(() => {
    async function fetchStudentCount() {
      try {
        const response = await fetch('/api/students');
        if (response.ok) {
          const students = await response.json();
          setStudentCount(students.length);
        }
      } catch (error) {
        console.error('Failed to fetch student count:', error);
      }
    }
    fetchStudentCount();
  }, []);

  const stats = useMemo(() => {
    if (role === "yönetici") {
      return [
        { label: "Toplam Öğrenci", value: studentCount, icon: Users2, color: "from-blue-500/20 to-blue-600/20" },
        { label: "Aktif Öğretmen", value: 8, icon: UserCheck, color: "from-green-500/20 to-green-600/20" },
        { label: "Bu Ay Rapor", value: 24, icon: BarChart3, color: "from-purple-500/20 to-purple-600/20" },
        { label: "Sistem Performansı", value: 98, icon: TrendingUp, color: "from-orange-500/20 to-orange-600/20" },
      ];
    } else {
      return [
        { label: "Toplam Öğrenci", value: studentCount, icon: Users2, color: "from-blue-500/20 to-blue-600/20" },
        { label: "Bu Hafta Görüşme", value: 36, icon: CalendarDays, color: "from-green-500/20 to-green-600/20" },
        { label: "Aktif Anket", value: 5, icon: MessageSquare, color: "from-purple-500/20 to-purple-600/20" },
        { label: "Açık Takip", value: 12, icon: Bell, color: "from-orange-500/20 to-orange-600/20" },
      ];
    }
  }, [role, studentCount]);

  const data = [
    { day: "Pzt", this: 8, prev: 5 },
    { day: "Sal", this: 6, prev: 7 },
    { day: "Çar", this: 7, prev: 6 },
    { day: "Per", this: 9, prev: 5 },
    { day: "Cum", this: 6, prev: 4 },
  ];

  const reminders = [
    {
      title: "Takip görüşmesi: 1003 (Zeynep Kaya)",
      time: "14:30",
      type: "görüşme",
    },
    { title: "Veli toplantısı", time: "16:00", type: "etkinlik" },
    { title: "Anket sonucu inceleme: 10/B", time: "", type: "anket" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2 bg-gradient-to-br from-primary/15 via-primary/5 to-accent/15 border-primary/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Rehber360 Dashboard</span>
              <Badge variant="secondary">
                Rol:{" "}
                {role === "ogretmen" ? "Rehber Öğretmen" : "Yönetici"}
              </Badge>
            </CardTitle>
            <CardDescription>
              MEB uyumlu dijital rehberlik yönetimi
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
            {reminders.map((r, i) => {
              const getIconByType = (type: string) => {
                switch (type) {
                  case 'görüşme': return CalendarDays;
                  case 'etkinlik': return Users2;
                  case 'anket': return MessageSquare;
                  default: return Bell;
                }
              };
              const Icon = getIconByType(r.type);
              return (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <Icon className="h-4 w-4 text-primary" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{r.title}</div>
                    {r.time && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {r.time}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {s.label}
                    </div>
                    <div className="text-2xl font-bold">
                      {s.value.toLocaleString()}
                    </div>
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

      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Görüşme Trendleri</CardTitle>
              <CardDescription>Bu hafta vs geçen hafta</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  this: { label: "Bu Hafta", color: "hsl(var(--primary))" },
                  prev: {
                    label: "Geçen Hafta",
                    color: "hsl(var(--muted-foreground))",
                  },
                }}
              >
                <AreaChart data={data}>
                  <CartesianGrid vertical={false} strokeDasharray="4 4" />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideIndicator />}
                  />
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Hızlı Erişim</CardTitle>
              <CardDescription>Öne çıkan modüller</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {role === "yönetici" ? (
                <>
                  <Button asChild className="w-full">
                    <a href="/ogrenci" aria-label="Öğrenci Yönetimi sayfasına git">
                      <Users2 className="mr-2 h-4 w-4" /> Öğrenci Yönetimi
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <a href="/raporlar" aria-label="Raporlama sayfasına git">
                      <BarChart3 className="mr-2 h-4 w-4" /> Sistem Raporları
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <a href="/ayarlar" aria-label="Sistem Ayarları sayfasına git">
                      <Settings className="mr-2 h-4 w-4" /> Sistem Ayarları
                    </a>
                  </Button>
                  <Button asChild variant="secondary" className="w-full">
                    <a href="/surveys" aria-label="Anket Yönetimi sayfasına git">
                      <MessageSquare className="mr-2 h-4 w-4" /> Anket Yönetimi
                    </a>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild className="w-full">
                    <a href="/ogrenci" aria-label="Öğrenci Yönetimi sayfasına git">
                      <Users2 className="mr-2 h-4 w-4" /> Öğrenci Yönetimi
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <a href="/gorusmeler" aria-label="Görüşmeler sayfasına git">
                      <CalendarDays className="mr-2 h-4 w-4" /> Görüşmeler
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <a
                      href="/ayarlar?tab=dersler"
                      aria-label="Ders ve Konular ayarlarına git"
                    >
                      <BookOpen className="mr-2 h-4 w-4" /> Ders & Konular
                    </a>
                  </Button>
                  <Button asChild variant="secondary" className="w-full">
                    <a href="/raporlar" aria-label="Raporlama sayfasına git">
                      <FileText className="mr-2 h-4 w-4" /> Raporlama
                    </a>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Rehber Öğretmen İçin Bilgilendirici Kartlar */}
      {role === "ogretmen" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Rehberlik Bilgi Merkezi</h2>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Risk Değerlendirme Özeti */}
            <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <AlertTriangle className="h-5 w-5" />
                  Risk Değerlendirme
                </CardTitle>
                <CardDescription>Öğrenci risk durumu özeti</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-red-600">Yüksek Risk</span>
                  <Badge variant="destructive">2</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-yellow-600">Orta Risk</span>
                  <Badge variant="outline" className="border-yellow-500 text-yellow-700">7</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-600">Düşük Risk</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">15</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Haftalık Odak Alanları */}
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Target className="h-5 w-5" />
                  Bu Hafta Odak
                </CardTitle>
                <CardDescription>Öncelikli konular</CardDescription>
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

            {/* Acil Durumlar */}
            <Card className="border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="h-5 w-5" />
                  Acil Dikkat
                </CardTitle>
                <CardDescription>Hemen müdahale gerekli</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm bg-red-100 p-2 rounded">
                  <strong>1001 - Mehmet K.</strong><br />
                  <span className="text-xs text-red-600">3 gün devamsızlık</span>
                </div>
                <div className="text-sm bg-orange-100 p-2 rounded">
                  <strong>1015 - Ayşe T.</strong><br />
                  <span className="text-xs text-orange-600">Akademik düşüş</span>
                </div>
              </CardContent>
            </Card>

            {/* Haftalık İlerleme */}
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <TrendingUp className="h-5 w-5" />
                  Haftalık İlerleme
                </CardTitle>
                <CardDescription>Bu hafta başarılar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tamamlanan görüşme</span>
                  <Badge className="bg-green-100 text-green-700">12/15</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Çözülen takip</span>
                  <Badge className="bg-blue-100 text-blue-700">3</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Olumlu gelişim</span>
                  <Badge className="bg-purple-100 text-purple-700">8</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Hızlı Kaynaklar */}
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Lightbulb className="h-5 w-5" />
                  Hızlı Kaynaklar
                </CardTitle>
                <CardDescription>Rehberlik araçları</CardDescription>
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

            {/* Sistem Hatırlatmaları */}
            <Card className="border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Shield className="h-5 w-5" />
                  Sistem Hatırlatma
                </CardTitle>
                <CardDescription>Bekleyen görevler</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm flex items-center justify-between">
                  <span>Bekleyen rapor onayı</span>
                  <Badge variant="outline">2</Badge>
                </div>
                <div className="text-sm flex items-center justify-between">
                  <span>Süresi dolan takipler</span>
                  <Badge variant="outline">1</Badge>
                </div>
                <div className="text-sm flex items-center justify-between">
                  <span>Veri yedekleme</span>
                  <Badge className="bg-green-100 text-green-700">Güncel</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

    </div>
  );
}
