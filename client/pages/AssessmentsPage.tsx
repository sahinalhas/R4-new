import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ClipboardCheck,
  Upload,
  Users,
  BarChart3,
  AlertTriangle,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { getAssessments, getAssessmentTypes } from "@/lib/api/assessments.api";
import { BulkUploadSection } from "@/components/student-profile/sections/olcme-degerlendirme/BulkUploadSection";

export default function AssessmentsPage() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("overview");

  const { data: assessments = [], isLoading } = useQuery({
    queryKey: ['assessments', selectedType],
    queryFn: () => getAssessments(selectedType === "all" ? {} : { assessmentTypeId: selectedType }),
  });

  const { data: assessmentTypes = [] } = useQuery({
    queryKey: ['assessment-types'],
    queryFn: () => getAssessmentTypes(),
  });

  const studentCount = new Set(assessments.map((a: any) => a.studentId)).size;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ClipboardCheck className="h-8 w-8" />
            Ölçme ve Değerlendirme
          </h1>
          <p className="text-muted-foreground mt-1">
            Tüm öğrencilerin değerlendirme sonuçlarını yönetin, analiz edin ve raporlayın
          </p>
        </div>
        <Button size="lg">
          <Upload className="h-4 w-4 mr-2" />
          Toplu Veri Yükle
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Toplam Değerlendirme</CardDescription>
            <CardTitle className="text-3xl">{assessments.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Tüm türler</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Öğrenci Sayısı</CardDescription>
            <CardTitle className="text-3xl">{studentCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Değerlendirilen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Değerlendirme Türü</CardDescription>
            <CardTitle className="text-2xl">{assessmentTypes.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Farklı tür</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Bu Ay</CardDescription>
            <CardTitle className="text-3xl">
              {assessments.filter((a: any) => {
                const date = new Date(a.assessmentDate);
                const now = new Date();
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
              }).length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Yeni değerlendirme</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Genel Bakış
          </TabsTrigger>
          <TabsTrigger value="bulk-upload">
            <Upload className="h-4 w-4 mr-2" />
            Toplu Yükleme
          </TabsTrigger>
          <TabsTrigger value="students">
            <Users className="h-4 w-4 mr-2" />
            Öğrenci Bazlı
          </TabsTrigger>
          <TabsTrigger value="reports">
            <Download className="h-4 w-4 mr-2" />
            Raporlar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tüm Değerlendirmeler</CardTitle>
                  <CardDescription>Sistemdeki tüm değerlendirme kayıtları</CardDescription>
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Tür seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Türler</SelectItem>
                    {assessmentTypes.map((type: any) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Yükleniyor...</div>
              ) : assessments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Henüz değerlendirme kaydı bulunmuyor.
                </div>
              ) : (
                <div className="space-y-2">
                  {assessments.slice(0, 10).map((assessment: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="font-medium">{assessment.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {assessment.assessmentDate} • {assessment.className || 'Tüm sınıflar'}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Detaylar
                      </Button>
                    </div>
                  ))}
                  {assessments.length > 10 && (
                    <p className="text-center text-sm text-muted-foreground py-2">
                      ve {assessments.length - 10} değerlendirme daha...
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk-upload" className="space-y-4">
          <BulkUploadSection studentId="" onUpdate={() => {}} />
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Öğrenci Bazlı Değerlendirmeler</CardTitle>
              <CardDescription>Her öğrencinin değerlendirme geçmişi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Öğrenci profil sayfasından erişilebilir
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                Değerlendirme Raporları
              </CardTitle>
              <CardDescription>Excel ve PDF formatında rapor oluşturun</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Tüm Değerlendirmeleri İndir (Excel)
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Sınıf Bazlı Rapor (PDF)
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Konu Bazlı Analiz (Excel)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
