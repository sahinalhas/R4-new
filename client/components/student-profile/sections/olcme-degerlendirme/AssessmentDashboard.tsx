import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ClipboardCheck, 
  FileText, 
  Target, 
  BookOpen, 
  Award,
  TrendingUp,
  Upload,
  BarChart3,
  AlertCircle
} from "lucide-react";
import { MockExamsSection } from "./MockExamsSection";
import { SubjectGradesSection } from "./SubjectGradesSection";
import { TopicAssessmentsSection } from "./TopicAssessmentsSection";
import { PerformanceTasksSection } from "./PerformanceTasksSection";
import { AssessmentAnalyticsSection } from "./AssessmentAnalyticsSection";
import { ManualEntrySection } from "./ManualEntrySection";
import { BulkUploadSection } from "./BulkUploadSection";
import { AssessmentOverview } from "./AssessmentOverview";

interface AssessmentDashboardProps {
  studentId: string;
  onUpdate: () => void;
}

export function AssessmentDashboard({ studentId, onUpdate }: AssessmentDashboardProps) {
  const [activeTab, setActiveTab] = useState("ozet");

  const tabs = [
    {
      value: "ozet",
      label: "Özet",
      icon: BarChart3,
      description: "Genel değerlendirme özeti ve trendler"
    },
    {
      value: "deneme-sinavlari",
      label: "Deneme Sınavları",
      icon: FileText,
      description: "TYT/AYT/LGS deneme sınavları"
    },
    {
      value: "ders-notlari",
      label: "Okul Dersleri",
      icon: BookOpen,
      description: "Ders notları ve dönemlik ortalamalar"
    },
    {
      value: "konu-tarama",
      label: "Konu Tarama",
      icon: Target,
      description: "Konu/kazanım bazlı değerlendirmeler"
    },
    {
      value: "performans-gorevleri",
      label: "Performans Görevleri",
      icon: Award,
      description: "Projeler ve rubric değerlendirmeleri"
    },
    {
      value: "analizler",
      label: "Analizler",
      icon: TrendingUp,
      description: "AI destekli analiz ve müdahale önerileri"
    },
    {
      value: "manuel-giris",
      label: "Manuel Giriş",
      icon: ClipboardCheck,
      description: "Tek tek değerlendirme girişi"
    },
    {
      value: "toplu-yukleme",
      label: "Toplu Yükleme",
      icon: Upload,
      description: "Excel/CSV ile toplu veri yükleme"
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Ölçme ve Değerlendirme
          </CardTitle>
          <CardDescription>
            Öğrencinin tüm akademik değerlendirme sonuçları, analizler ve müdahale önerileri
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-1 h-auto p-1 bg-muted/50">
          {tabs.map(({ value, label, icon: Icon }) => (
            <TabsTrigger 
              key={value} 
              value={value}
              className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-background"
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="ozet" className="space-y-4">
          <AssessmentOverview studentId={studentId} />
        </TabsContent>

        <TabsContent value="deneme-sinavlari" className="space-y-4">
          <MockExamsSection studentId={studentId} onUpdate={onUpdate} />
        </TabsContent>

        <TabsContent value="ders-notlari" className="space-y-4">
          <SubjectGradesSection studentId={studentId} onUpdate={onUpdate} />
        </TabsContent>

        <TabsContent value="konu-tarama" className="space-y-4">
          <TopicAssessmentsSection studentId={studentId} onUpdate={onUpdate} />
        </TabsContent>

        <TabsContent value="performans-gorevleri" className="space-y-4">
          <PerformanceTasksSection studentId={studentId} onUpdate={onUpdate} />
        </TabsContent>

        <TabsContent value="analizler" className="space-y-4">
          <AssessmentAnalyticsSection studentId={studentId} />
        </TabsContent>

        <TabsContent value="manuel-giris" className="space-y-4">
          <ManualEntrySection studentId={studentId} onUpdate={onUpdate} />
        </TabsContent>

        <TabsContent value="toplu-yukleme" className="space-y-4">
          <BulkUploadSection studentId={studentId} onUpdate={onUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
