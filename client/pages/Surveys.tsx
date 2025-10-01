import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, Users, BarChart, Download, Upload, Link2, Settings } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SurveyTemplate, SurveyDistribution, SurveyTemplateType, DistributionStatus, SurveyQuestion } from "@/lib/survey-types";
import SurveyCreationDialog from "@/components/surveys/SurveyCreationDialog";
import SurveyDistributionDialog from "@/components/surveys/SurveyDistributionDialog";
import SurveyAnalyticsTab from "@/components/surveys/SurveyAnalyticsTab";
import { useToast } from "@/hooks/use-toast";

export default function Surveys() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<SurveyTemplate[]>([]);
  const [distributions, setDistributions] = useState<SurveyDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<SurveyTemplate | null>(null);
  const [templateQuestions, setTemplateQuestions] = useState<SurveyQuestion[]>([]);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    loadData(abortController.signal);
    return () => abortController.abort();
  }, []);

  const loadData = async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      
      // Load survey templates
      const templatesResponse = await fetch('/api/survey-templates', { signal });
      if (templatesResponse.ok) {
        const templatesData = await templatesResponse.json();
        setTemplates(templatesData);
      } else {
        console.error("Failed to load survey templates");
        toast({ 
          title: "Hata", 
          description: "Anket şablonları yüklenemedi", 
          variant: "destructive" 
        });
      }

      // Load survey distributions
      const distributionsResponse = await fetch('/api/survey-distributions', { signal });
      if (distributionsResponse.ok) {
        const distributionsData = await distributionsResponse.json();
        setDistributions(distributionsData);
      } else {
        console.error("Failed to load survey distributions");
        toast({ 
          title: "Hata", 
          description: "Anket dağıtımları yüklenemedi", 
          variant: "destructive" 
        });
      }

      setLoading(false);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return;
      }
      console.error("Error loading survey data:", error);
      toast({ 
        title: "Hata", 
        description: "Anket verileri yüklenirken bir hata oluştu", 
        variant: "destructive" 
      });
      setLoading(false);
    }
  };

  const loadTemplateQuestions = async (templateId: string) => {
    try {
      const response = await fetch(`/api/survey-questions/${templateId}`);
      if (response.ok) {
        const questions = await response.json();
        setTemplateQuestions(questions);
      } else {
        console.error("Failed to load template questions");
        toast({ 
          title: "Hata", 
          description: "Anket soruları yüklenemedi", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error("Error loading template questions:", error);
      toast({ 
        title: "Hata", 
        description: "Anket soruları yüklenirken bir hata oluştu", 
        variant: "destructive" 
      });
    }
  };

  const handleCreateDistribution = async (template: SurveyTemplate) => {
    await loadTemplateQuestions(template.id);
    setSelectedTemplate(template);
  };

  const handleDistributionCreated = async (distributionData: any) => {
    try {
      const response = await fetch('/api/survey-distributions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...distributionData,
          templateId: selectedTemplate?.id,
        }),
      });

      if (response.ok) {
        console.log("Distribution created successfully");
        toast({ 
          title: "Başarılı", 
          description: "Anket dağıtımı oluşturuldu" 
        });
        await loadData(); // Reload data to show new distribution
        setSelectedTemplate(null);
        setTemplateQuestions([]);
        setShowTemplateSelector(false);
      } else {
        console.error("Failed to create distribution");
        toast({ 
          title: "Hata", 
          description: "Anket dağıtımı oluşturulamadı", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error("Error creating distribution:", error);
      toast({ 
        title: "Hata", 
        description: "Anket dağıtımı oluşturulurken bir hata oluştu", 
        variant: "destructive" 
      });
    }
  };

  const handleNewDistribution = () => {
    setShowTemplateSelector(true);
  };

  const handleTemplateSelected = async (template: SurveyTemplate) => {
    await loadTemplateQuestions(template.id);
    setSelectedTemplate(template);
    setShowTemplateSelector(false);
  };

  const getStatusBadge = (status: DistributionStatus) => {
    const statusStyles = {
      DRAFT: "bg-gray-100 text-gray-700",
      ACTIVE: "bg-green-100 text-green-700",
      CLOSED: "bg-red-100 text-red-700",
      ARCHIVED: "bg-blue-100 text-blue-700",
    };

    const statusLabels = {
      DRAFT: "Taslak",
      ACTIVE: "Aktif",
      CLOSED: "Kapalı",
      ARCHIVED: "Arşivlenmiş",
    };

    return (
      <Badge className={statusStyles[status]}>
        {statusLabels[status]}
      </Badge>
    );
  };

  const getTypeBadge = (type: SurveyTemplateType) => {
    const typeStyles = {
      MEB_STANDAR: "bg-blue-100 text-blue-700",
      OZEL: "bg-purple-100 text-purple-700",
      AKADEMIK: "bg-orange-100 text-orange-700",
      SOSYAL: "bg-green-100 text-green-700",
      REHBERLIK: "bg-yellow-100 text-yellow-700",
    };

    const typeLabels = {
      MEB_STANDAR: "MEB Standart",
      OZEL: "Özel",
      AKADEMIK: "Akademik",
      SOSYAL: "Sosyal",
      REHBERLIK: "Rehberlik",
    };

    return (
      <Badge className={typeStyles[type]}>
        {typeLabels[type]}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Anket & Test Modülü</h1>
          <p className="text-muted-foreground">
            Anket oluşturun, sınıflara dağıtın ve sonuçları analiz edin
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Ayarlar
          </Button>
          <SurveyCreationDialog onSurveyCreated={(survey) => {
            console.log("New survey created:", survey);
            loadData(); // Reload data after creation
          }}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Anket
            </Button>
          </SurveyCreationDialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Şablon</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 bu ay
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Anket</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {distributions.filter(d => d.status === 'ACTIVE').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Şu anda dağıtılmış
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Yanıt</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              +12% önceki aya göre
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tamamlanma Oranı</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              +5% önceki aya göre
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Anket Şablonları</TabsTrigger>
          <TabsTrigger value="distributions">Dağıtımlar</TabsTrigger>
          <TabsTrigger value="responses">Yanıtlar</TabsTrigger>
          <TabsTrigger value="analytics">Analiz</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Anket Şablonları</CardTitle>
                  <CardDescription>
                    Mevcut anket şablonları ve MEB standart anketleri
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    MEB Şablonları
                  </Button>
                  <SurveyCreationDialog onSurveyCreated={(survey) => {
                    console.log("New survey template created:", survey);
                    loadData();
                  }}>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Yeni Şablon
                    </Button>
                  </SurveyCreationDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Başlık</TableHead>
                    <TableHead>Tür</TableHead>
                    <TableHead>Süre</TableHead>
                    <TableHead>Hedef Sınıf</TableHead>
                    <TableHead>MEB Uyumlu</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="text-muted-foreground">
                          <FileText className="mx-auto h-12 w-12 mb-4" />
                          <p>Henüz anket şablonu bulunmuyor</p>
                          <p className="text-sm">Başlamak için yeni bir şablon oluşturun</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    templates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.title}</TableCell>
                        <TableCell>{getTypeBadge(template.type)}</TableCell>
                        <TableCell>{template.estimatedDuration || '-'} dk</TableCell>
                        <TableCell>
                          {template.targetGrades?.join(', ') || 'Tümü'}
                        </TableCell>
                        <TableCell>
                          {template.mebCompliant ? (
                            <Badge className="bg-green-100 text-green-700">✓ Uyumlu</Badge>
                          ) : (
                            <Badge variant="secondary">-</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                İşlemler
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>Düzenle</DropdownMenuItem>
                              <DropdownMenuItem>Kopyala</DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleCreateDistribution(template)}
                              >
                                Dağıt
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Sil</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distributions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Anket Dağıtımları</CardTitle>
                  <CardDescription>
                    Sınıflara dağıtılmış anketler ve durumları
                  </CardDescription>
                </div>
                <Button size="sm" onClick={handleNewDistribution}>
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni Dağıtım
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Anket</TableHead>
                    <TableHead>Dağıtım Türü</TableHead>
                    <TableHead>Hedef Sınıflar</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Yanıt Sayısı</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {distributions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="text-muted-foreground">
                          <Users className="mx-auto h-12 w-12 mb-4" />
                          <p>Henüz anket dağıtımı bulunmuyor</p>
                          <p className="text-sm">Bir anket şablonu seçip dağıtmaya başlayın</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    distributions.map((distribution) => (
                      <TableRow key={distribution.id}>
                        <TableCell className="font-medium">{distribution.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {distribution.distributionType === 'MANUAL_EXCEL' && 'Excel Şablonu'}
                            {distribution.distributionType === 'ONLINE_LINK' && 'Online Link'}
                            {distribution.distributionType === 'HYBRID' && 'Hibrit'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {distribution.targetClasses?.join(', ') || 'Tümü'}
                        </TableCell>
                        <TableCell>{getStatusBadge(distribution.status)}</TableCell>
                        <TableCell>0 / {distribution.targetStudents?.length || 0}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                İşlemler
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Excel İndir
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link2 className="mr-2 h-4 w-4" />
                                Link Kopyala
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Upload className="mr-2 h-4 w-4" />
                                Excel Yükle
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BarChart className="mr-2 h-4 w-4" />
                                Sonuçları Gör
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Anket Yanıtları</CardTitle>
              <CardDescription>
                Gelen yanıtları görüntüleyin ve yönetin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart className="mx-auto h-12 w-12 mb-4" />
                <p>Yanıt verileri burada görüntülenecek</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <SurveyAnalyticsTab distributions={distributions} />
        </TabsContent>
      </Tabs>

      {/* Template Selection Dialog */}
      <Dialog open={showTemplateSelector} onOpenChange={setShowTemplateSelector}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Anket Şablonu Seçin</DialogTitle>
            <DialogDescription>
              Dağıtım için bir anket şablonu seçin. Seçtiğiniz şablon ile sınıflara dağıtım yapabilirsiniz.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {templates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 mb-4" />
                <p>Henüz anket şablonu bulunmuyor</p>
                <p className="text-sm">Önce bir anket şablonu oluşturun</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {templates.map((template) => (
                  <Card 
                    key={template.id} 
                    className="cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => handleTemplateSelected(template)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{template.title}</h4>
                          {template.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {template.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            {getTypeBadge(template.type)}
                            {template.mebCompliant && (
                              <Badge className="bg-green-100 text-green-700">✓ MEB Uyumlu</Badge>
                            )}
                            {template.estimatedDuration && (
                              <Badge variant="outline">{template.estimatedDuration} dk</Badge>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Seç
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Survey Distribution Dialog */}
      {selectedTemplate && templateQuestions.length > 0 && (
        <SurveyDistributionDialog
          survey={selectedTemplate}
          questions={templateQuestions}
          onDistributionCreated={handleDistributionCreated}
        >
          <div /> {/* Dummy child since dialog opens programmatically */}
        </SurveyDistributionDialog>
      )}
    </div>
  );
}