import { useState, useMemo, useEffect } from "react";
import { useAuth, PermissionGuard, getExportPermissions } from "@/lib/auth-context";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Analytics Components
import PredictiveAnalysis from "@/components/analytics/PredictiveAnalysis";
import ComparativeReports from "@/components/analytics/ComparativeReports";
import ProgressCharts from "@/components/analytics/ProgressCharts";
import EarlyWarningSystem from "@/components/analytics/EarlyWarningSystem";

// Chart Components
import {
  SuccessMetricCard,
  RiskDistributionChart,
  PerformanceTrendChart,
  ClassComparisonChart,
  EarlyWarningIndicator,
} from "@/components/charts/AnalyticsCharts";

// Analytics Functions
import { 
  exportAnalyticsData,
  predictStudentSuccess,
  calculateRiskScore,
} from "@/lib/analytics";

import { 
  performanceMonitor,
  optimizedGenerateEarlyWarnings,
  optimizedGenerateClassComparisons,
  optimizedPredictStudentSuccess,
  optimizedCalculateRiskScore,
} from "@/lib/analytics-cache";

import { loadStudents } from "@/lib/storage";

import { 
  BarChart3, 
  TrendingUp, 
  Users,
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  Download,
  Filter,
  Eye,
  Settings,
  RefreshCw,
  FileText,
  Mail,
} from "lucide-react";

// =================== OVERVIEW DASHBOARD ===================

function OverviewDashboard({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const { hasPermission } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  
  const [warnings, setWarnings] = useState([]);
  const [classComparisons, setClassComparisons] = useState([]);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const { loadStudentsAsync } = await import('@/lib/api/students.api');
        await loadStudentsAsync();
        const loadedStudents = loadStudents();
        setStudents(loadedStudents);
        
        // Öğrenciler yüklendikten sonra sınıf karşılaştırmalarını hesapla
        calculateClassComparisons(loadedStudents);
      } catch (error) {
        console.error('Error loading students:', error);
      }
    };
    
    const loadWarnings = async () => {
      try {
        const endTimer = performanceMonitor.startTiming('generateEarlyWarnings');
        const result = await optimizedGenerateEarlyWarnings();
        endTimer();
        setWarnings(result);
      } catch (error) {
        console.error('Error loading warnings:', error);
        setWarnings([]);
      }
    };
    
    const calculateClassComparisons = (studentsList: typeof students) => {
      if (studentsList.length === 0) return;
      
      // API limitleri nedeniyle doğrudan risk bazlı hesaplama kullan
      const classMap = new Map<string, any[]>();
      
      studentsList.forEach(student => {
        const className = student.sinif || "Belirtilmemiş";
        if (!classMap.has(className)) {
          classMap.set(className, []);
        }
        classMap.get(className)!.push(student);
      });
      
      // Risk bazlı tahminler - API çağrısı yok
      const comparisons = Array.from(classMap.entries()).map(([className, students]) => {
        const riskBasedGPA = students.reduce((sum, s) => {
          const score = s.risk === "Düşük" ? 3.5 : s.risk === "Orta" ? 2.8 : s.risk === "Yüksek" ? 2.0 : 1.5;
          return sum + score;
        }, 0) / students.length;
        
        const riskBasedAttendance = students.reduce((sum, s) => {
          const score = s.risk === "Düşük" ? 0.95 : s.risk === "Orta" ? 0.85 : s.risk === "Yüksek" ? 0.70 : 0.60;
          return sum + score;
        }, 0) / students.length;
        
        return {
          className,
          studentCount: students.length,
          averageGPA: parseFloat(riskBasedGPA.toFixed(2)),
          attendanceRate: parseFloat(riskBasedAttendance.toFixed(2)),
          riskDistribution: {
            düşük: students.filter(s => s.risk === "Düşük").length,
            orta: students.filter(s => s.risk === "Orta").length,
            yüksek: students.filter(s => s.risk === "Yüksek").length,
          },
          topPerformers: students
            .filter(s => s.risk === "Düşük")
            .map(s => `${s.ad} ${s.soyad}`)
            .slice(0, 3),
          atRiskStudents: students
            .filter(s => s.risk === "Yüksek" || s.risk === "Kritik")
            .map(s => `${s.ad} ${s.soyad}`)
            .slice(0, 3),
        };
      });
      
      setClassComparisons(comparisons);
    };
    
    loadData();
    loadWarnings();
  }, []);

  // Genel istatistikler
  const [overallStats, setOverallStats] = useState({
    totalStudents: 0,
    averageSuccessRate: 0,
    highSuccessCount: 0,
    atRiskCount: 0,
    criticalWarnings: 0,
    activeWarnings: 0,
  });

  useEffect(() => {
    const calculateStats = async () => {
      if (students.length === 0) {
        return;
      }
      
      const totalStudents = students.length;
      
      // Örnekleme yaparak başarı tahminlerini hesapla (tüm öğrenciler için API çağrısı yapmak yerine)
      const sampleSize = Math.min(20, students.length);
      const sampleStudents = [...students] // Array kopyası oluştur (mutation önlemek için)
        .sort(() => 0.5 - Math.random()) // Rastgele sırala
        .slice(0, sampleSize);
      
      try {
        const successPredictions = await Promise.all(
          sampleStudents.map(s => optimizedPredictStudentSuccess(s.id))
        );
        
        const avgSampleSuccess = successPredictions.reduce((sum, p) => sum + p, 0) / successPredictions.length;
        const averageSuccessRate = Math.round(avgSampleSuccess * 100);
        
        // Tüm öğrenciler için risk bazlı sayımlar
        const highSuccessCount = students.filter(s => s.risk === "Düşük").length;
        const atRiskCount = students.filter(s => s.risk === "Yüksek" || s.risk === "Kritik").length;
        
        const criticalWarnings = warnings.filter(w => w.severity === "kritik").length;
        const activeWarnings = warnings.length;
        
        setOverallStats({
          totalStudents,
          averageSuccessRate,
          highSuccessCount,
          atRiskCount,
          criticalWarnings,
          activeWarnings,
        });
      } catch (error) {
        console.error('Error calculating stats:', error);
        // Hata durumunda risk bazlı tahmin kullan
        const riskBasedAvg = students.reduce((sum, s) => {
          if (s.risk === "Düşük") return sum + 90;
          if (s.risk === "Orta") return sum + 60;
          if (s.risk === "Yüksek") return sum + 30;
          return sum + 50;
        }, 0) / students.length;
        
        setOverallStats({
          totalStudents,
          averageSuccessRate: Math.round(riskBasedAvg),
          highSuccessCount: students.filter(s => s.risk === "Düşük").length,
          atRiskCount: students.filter(s => s.risk === "Yüksek" || s.risk === "Kritik").length,
          criticalWarnings: warnings.filter(w => w.severity === "kritik").length,
          activeWarnings: warnings.length,
        });
      }
    };
    
    calculateStats();
  }, [students, warnings]);

  // Risk dağılımı
  const riskDistribution = useMemo(() => {
    const counts = { "Düşük": 0, "Orta": 0, "Yüksek": 0 };
    students.forEach(student => {
      const risk = student.risk || "Düşük";
      if (risk in counts) {
        counts[risk as keyof typeof counts]++;
      }
    });
    
    return [
      { name: "Düşük", value: counts["Düşük"] },
      { name: "Orta", value: counts["Orta"] },
      { name: "Yüksek", value: counts["Yüksek"] },
    ];
  }, [students]);

  // Sınıf karşılaştırması için veri
  const classComparisonData = useMemo(() => 
    classComparisons.map(cls => ({
      category: cls.className,
      current: cls.averageGPA,
      previous: cls.averageGPA * 0.95, // Simülasyon için
      target: 3.5,
    })), [classComparisons]);

  return (
    <div className="space-y-6">
      {/* Ana İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SuccessMetricCard
          title="Toplam Öğrenci"
          value={overallStats.totalStudents}
          icon={Users}
          description="Sisteme kayıtlı öğrenci sayısı"
          showAsPercentage={false}
        />
        
        <SuccessMetricCard
          title="Ortalama Başarı"
          value={Math.round(overallStats.averageSuccessRate)}
          icon={Award}
          description="Genel başarı tahmini ortalaması"
          trend="up"
        />
        
        <SuccessMetricCard
          title="Yüksek Başarı"
          value={overallStats.highSuccessCount}
          total={overallStats.totalStudents}
          icon={TrendingUp}
          description="Yüksek başarı gösteren öğrenci"
          trend="up"
        />
        
        <SuccessMetricCard
          title="Risk Altında"
          value={overallStats.atRiskCount}
          icon={AlertTriangle}
          description="Yakın takip gerektiren öğrenci"
          trend="down"
        />
      </div>

      {/* Uyarı Özeti */}
      {overallStats.activeWarnings > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Aktif Uyarılar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-800">
                  {overallStats.activeWarnings}
                </div>
                <div className="text-sm text-orange-600">
                  {overallStats.criticalWarnings > 0 && (
                    <span className="font-medium">
                      {overallStats.criticalWarnings} kritik uyarı
                    </span>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setActiveTab('warnings')}>
                Detayları Görüntüle
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskDistributionChart data={riskDistribution} />
        <ClassComparisonChart data={classComparisonData} />
      </div>

      {/* Son Uyarılar */}
      <EarlyWarningIndicator warnings={warnings} maxDisplay={5} />
    </div>
  );
}

// =================== EXPORT & SETTINGS ===================

function ExportSettings() {
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [exportFormat, setExportFormat] = useState<"json" | "csv">("json");
  const [reportType, setReportType] = useState<string>("all");
  const [includePersonalData, setIncludePersonalData] = useState(false);
  
  const exportPermissions = useMemo(() => {
    return user ? getExportPermissions(user.role) : { canExportAll: false, canExportFiltered: false, allowedFormats: [] };
  }, [user]);

  const handleExport = async () => {
    if (!exportPermissions.canExportFiltered && !exportPermissions.canExportAll) {
      alert('Bu işlem için yetkiniz bulunmamaktadır.');
      return;
    }

    if (!exportPermissions.allowedFormats.includes(exportFormat)) {
      alert(`${exportFormat.toUpperCase()} formatında dışa aktarma izniniz bulunmamaktadır.`);
      return;
    }
    
    try {
      const endTimer = performanceMonitor.startTiming('exportAnalyticsData');
      const rawData = await exportAnalyticsData({
        includePersonalData: includePersonalData && hasPermission('view_sensitive_data'),
      });
      endTimer();
      
      const dataString = exportFormat === "json" 
        ? JSON.stringify(rawData, null, 2)
        : convertToCSV(rawData);
      
      const blob = new Blob([dataString], { 
        type: exportFormat === "json" ? "application/json" : "text/csv" 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analytics_report_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert('Rapor ihracı sırasında hata oluştu.');
    }
  };
  
  function convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(field => JSON.stringify(row[field] || '')).join(','))
    ];
    return csvRows.join('\n');
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Rapor İhracı
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Rapor Türü</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Raporlar</SelectItem>
                  <SelectItem value="predictive">Prediktif Analiz</SelectItem>
                  <SelectItem value="comparative">Karşılaştırmalı</SelectItem>
                  <SelectItem value="progress">İlerleme Takibi</SelectItem>
                  <SelectItem value="warnings">Erken Uyarılar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Format</label>
              <Select 
                value={exportFormat} 
                onValueChange={(value) => setExportFormat(value as "json" | "csv")}
                disabled={!exportPermissions.canExportFiltered}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {exportPermissions.allowedFormats.includes('json') && (
                    <SelectItem value="json">JSON</SelectItem>
                  )}
                  {exportPermissions.allowedFormats.includes('csv') && (
                    <SelectItem value="csv">CSV</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {hasPermission('view_sensitive_data') && (
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="includePersonalData"
                checked={includePersonalData}
                onChange={(e) => setIncludePersonalData(e.target.checked)}
              />
              <label htmlFor="includePersonalData" className="text-sm">
                Kişisel verileri dahil et
              </label>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              onClick={handleExport} 
              className="gap-2"
              disabled={!exportPermissions.canExportFiltered && !exportPermissions.canExportAll}
            >
              <Download className="h-4 w-4" />
              Raporu İndir
            </Button>
            <PermissionGuard permission="export_all_data">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => {
                  alert('E-posta gönderme özelliği yakında eklenecek. Şu an için raporu indirip manuel olarak gönderebilirsiniz.');
                }}
              >
                <Mail className="h-4 w-4" />
                E-posta Gönder
              </Button>
            </PermissionGuard>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Rapor Ayarları
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Otomatik Rapor</div>
                <div className="text-sm text-muted-foreground">
                  Haftalık otomatik rapor oluşturma
                </div>
              </div>
              <Badge variant="outline">Kapalı</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Uyarı Bildirimleri</div>
                <div className="text-sm text-muted-foreground">
                  Kritik uyarılar için e-posta bildirimi
                </div>
              </div>
              <Badge variant="default">Açık</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Veri Saklama</div>
                <div className="text-sm text-muted-foreground">
                  Analitik verilerin saklama süresi
                </div>
              </div>
              <Badge variant="outline">12 Ay</Badge>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/ayarlar')}
          >
            Ayarları Düzenle
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// =================== MAIN REPORTS PAGE ===================

export default function Reports() {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshKey, setRefreshKey] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const exportPermissions = useMemo(() => {
    return user ? getExportPermissions(user.role) : { canExportAll: false, canExportFiltered: false, allowedFormats: [] };
  }, [user]);

  const handleHeaderExport = async () => {
    if (!exportPermissions.canExportFiltered && !exportPermissions.canExportAll) {
      alert('Bu işlem için yetkiniz bulunmamaktadır.');
      return;
    }

    if (!exportPermissions.allowedFormats || exportPermissions.allowedFormats.length === 0) {
      alert('İzin verilen dışa aktarma formatı bulunamadı.');
      return;
    }

    const format = exportPermissions.allowedFormats[0] as "json" | "csv";
    
    try {
      const rawData = await exportAnalyticsData({
        includePersonalData: hasPermission('view_sensitive_data'),
      });
      
      const dataString = format === "json" 
        ? JSON.stringify(rawData, null, 2)
        : convertToCSV(rawData);
      
      const mimeType = format === "json" ? "application/json" : "text/csv";
      const blob = new Blob([dataString], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analytics_report_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert('Rapor ihracı sırasında hata oluştu.');
    }
  };
  
  function convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(field => JSON.stringify(row[field] || '')).join(','))
    ];
    return csvRows.join('\n');
  }
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Giriş Gerekli</h2>
          <p className="text-muted-foreground">Bu sayfaya erişmek için giriş yapmanız gerekiyor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-gradient-to-br from-primary/15 via-primary/5 to-accent/15 p-6 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-primary">Analiz & Raporlama</h1>
              <Badge variant="outline">{user.role === 'admin' ? 'Yönetici' : user.role === 'counselor' ? 'Rehber Öğretmen' : user.role === 'teacher' ? 'Öğretmen' : 'Gözlemci'}</Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              Öğrenci başarı analizleri, karşılaştırmalı raporlar ve erken uyarı sistemi
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Yenile
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setFiltersOpen(true)}
            >
              <Filter className="h-4 w-4" />
              Filtreler
            </Button>
            <Button 
              className="gap-2"
              onClick={handleHeaderExport}
              disabled={!exportPermissions.canExportFiltered && !exportPermissions.canExportAll}
            >
              <Download className="h-4 w-4" />
              Rapor İndir
            </Button>
          </div>
        </div>
      </div>

      {/* Ana İçerik */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4" key={refreshKey}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="gap-2">
            <Eye className="h-4 w-4" />
            Genel Bakış
          </TabsTrigger>
          <TabsTrigger value="predictive" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Prediktif Analiz
          </TabsTrigger>
          <TabsTrigger value="comparative" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Karşılaştırmalı
          </TabsTrigger>
          <TabsTrigger value="progress" className="gap-2">
            <BookOpen className="h-4 w-4" />
            İlerleme
          </TabsTrigger>
          <TabsTrigger value="warnings" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Erken Uyarı
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Ayarlar
          </TabsTrigger>
        </TabsList>

        {activeTab === "overview" && (
          <div className="mt-4">
            <OverviewDashboard setActiveTab={setActiveTab} />
          </div>
        )}

        {activeTab === "predictive" && (
          <div className="mt-4">
            <PermissionGuard 
              permission="view_predictive_analysis"
              fallback={
                <div className="text-center py-12 text-muted-foreground">
                  <p>Bu özelliğe erişim yetkiniz bulunmamaktadır.</p>
                </div>
              }
            >
              <PredictiveAnalysis key={refreshKey} />
            </PermissionGuard>
          </div>
        )}

        {activeTab === "comparative" && (
          <div className="mt-4">
            <PermissionGuard 
              permission="view_comparative_reports"
              fallback={
                <div className="text-center py-12 text-muted-foreground">
                  <p>Bu özelliğe erişim yetkiniz bulunmamaktadır.</p>
                </div>
              }
            >
              <ComparativeReports key={refreshKey} />
            </PermissionGuard>
          </div>
        )}

        {activeTab === "progress" && (
          <div className="mt-4">
            <PermissionGuard 
              permission="view_progress_charts"
              fallback={
                <div className="text-center py-12 text-muted-foreground">
                  <p>Bu özelliğe erişim yetkiniz bulunmamaktadır.</p>
                </div>
              }
            >
              <ProgressCharts key={refreshKey} />
            </PermissionGuard>
          </div>
        )}

        {activeTab === "warnings" && (
          <div className="mt-4">
            <PermissionGuard 
              permission="view_early_warnings"
              fallback={
                <div className="text-center py-12 text-muted-foreground">
                  <p>Bu özelliğe erişim yetkiniz bulunmamaktadır.</p>
                </div>
              }
            >
              <EarlyWarningSystem key={refreshKey} />
            </PermissionGuard>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="mt-4">
            <ExportSettings />
          </div>
        )}
      </Tabs>

      {/* Filtreler Dialog */}
      <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rapor Filtreleri</DialogTitle>
            <DialogDescription>
              Raporları filtrelemek için aşağıdaki seçenekleri kullanın
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tarih Aralığı</label>
              <Select defaultValue="30days">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Son 7 Gün</SelectItem>
                  <SelectItem value="30days">Son 30 Gün</SelectItem>
                  <SelectItem value="90days">Son 90 Gün</SelectItem>
                  <SelectItem value="1year">Son 1 Yıl</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sınıf</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Sınıflar</SelectItem>
                  <SelectItem value="9">9. Sınıf</SelectItem>
                  <SelectItem value="10">10. Sınıf</SelectItem>
                  <SelectItem value="11">11. Sınıf</SelectItem>
                  <SelectItem value="12">12. Sınıf</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Risk Düzeyi</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="low">Düşük</SelectItem>
                  <SelectItem value="medium">Orta</SelectItem>
                  <SelectItem value="high">Yüksek</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setFiltersOpen(false)}>
              İptal
            </Button>
            <Button onClick={() => {
              setFiltersOpen(false);
              handleRefresh();
            }}>
              Filtreleri Uygula
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}