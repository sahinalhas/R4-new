import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Settings, BarChart } from "lucide-react";
import { useSurveyTemplates, useSurveyDistributions, useTemplateQuestions } from "@/hooks/surveys";
import { surveyService } from "@/services/surveyService";
import { useToast } from "@/hooks/use-toast";
import { SurveyTemplate } from "@/lib/survey-types";
import SurveyCreationDialog from "@/components/surveys/SurveyCreationDialog";
import SurveyDistributionDialog from "@/components/surveys/SurveyDistributionDialog";
import SurveyAnalyticsTab from "@/components/surveys/SurveyAnalyticsTab";
import SurveyStats from "@/components/surveys/SurveyStats";
import TemplatesList from "@/components/surveys/TemplatesList";
import DistributionsList from "@/components/surveys/DistributionsList";
import TemplateSelector from "@/components/surveys/TemplateSelector";
import SurveyAIAnalysis from "@/components/ai/SurveyAIAnalysis";
import { MEB_SURVEY_TEMPLATES } from "@/lib/survey-types";
import { getMebDefaultQuestions } from "@/components/surveys/templates/meb-templates";

export default function Surveys() {
  const { toast } = useToast();
  const { templates, loading: templatesLoading, refresh: refreshTemplates } = useSurveyTemplates();
  const { distributions, loading: distributionsLoading, refresh: refreshDistributions } = useSurveyDistributions();
  const { questions, loadQuestions, clearQuestions } = useTemplateQuestions();
  
  const [selectedTemplate, setSelectedTemplate] = useState<SurveyTemplate | null>(null);
  const [selectedDistributionForAI, setSelectedDistributionForAI] = useState<any>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<SurveyTemplate | null>(null);

  const loading = templatesLoading || distributionsLoading;

  const refreshAllData = async () => {
    await Promise.all([refreshTemplates(), refreshDistributions()]);
  };

  const handleCreateDistribution = async (template: SurveyTemplate) => {
    await loadQuestions(template.id);
    setSelectedTemplate(template);
  };

  const handleDistributionCreated = async (distributionData: any) => {
    try {
      await surveyService.createDistribution({
        ...distributionData,
        templateId: selectedTemplate?.id,
      });

      toast({ 
        title: "Başarılı", 
        description: "Anket dağıtımı oluşturuldu" 
      });
      
      await refreshAllData();
      setSelectedTemplate(null);
      clearQuestions();
      setShowTemplateSelector(false);
    } catch (error) {
      console.error("Error creating distribution:", error);
      toast({ 
        title: "Hata", 
        description: "Anket dağıtımı oluşturulamadı", 
        variant: "destructive" 
      });
    }
  };

  const handleNewDistribution = () => {
    setShowTemplateSelector(true);
  };

  const handleTemplateSelected = async (template: SurveyTemplate) => {
    await loadQuestions(template.id);
    setSelectedTemplate(template);
    setShowTemplateSelector(false);
  };

  const handleEditTemplate = async (template: SurveyTemplate) => {
    setEditingTemplate(template);
  };

  const handleDuplicateTemplate = async (template: SurveyTemplate) => {
    try {
      const duplicatedTemplate = {
        ...template,
        id: `${template.id}_copy_${Date.now()}`,
        title: `${template.title} (Kopya)`,
        createdAt: new Date().toISOString(),
      };
      
      await surveyService.createTemplate(duplicatedTemplate);
      
      toast({ 
        title: "Başarılı", 
        description: "Anket şablonu kopyalandı" 
      });
      
      await refreshAllData();
    } catch (error) {
      console.error("Error duplicating template:", error);
      toast({ 
        title: "Hata", 
        description: "Anket şablonu kopyalanamadı", 
        variant: "destructive" 
      });
    }
  };

  const handleDeleteTemplate = async (template: SurveyTemplate) => {
    if (!confirm(`"${template.title}" anket şablonunu silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      await surveyService.deleteTemplate(template.id);
      
      toast({ 
        title: "Başarılı", 
        description: "Anket şablonu silindi" 
      });
      
      await refreshAllData();
    } catch (error) {
      console.error("Error deleting template:", error);
      toast({ 
        title: "Hata", 
        description: "Anket şablonu silinemedi", 
        variant: "destructive" 
      });
    }
  };

  const handleImportMEBTemplates = async () => {
    try {
      let importedCount = 0;
      
      for (const [key, templateData] of Object.entries(MEB_SURVEY_TEMPLATES)) {
        const existingTemplate = templates.find(t => t.title === templateData.title);
        
        if (!existingTemplate) {
          const template: Partial<SurveyTemplate> = {
            id: `meb_${key.toLowerCase()}_${Date.now()}`,
            ...templateData,
            created_at: new Date().toISOString(),
            isActive: true
          };
          
          await surveyService.createTemplate(template);
          importedCount++;
        }
      }
      
      if (importedCount > 0) {
        toast({ 
          title: "Başarılı", 
          description: `${importedCount} adet MEB standart anket şablonu yüklendi` 
        });
        await refreshAllData();
      } else {
        toast({ 
          title: "Bilgi", 
          description: "Tüm MEB şablonları zaten mevcut" 
        });
      }
    } catch (error) {
      console.error("Error importing MEB templates:", error);
      toast({ 
        title: "Hata", 
        description: "MEB şablonları yüklenemedi", 
        variant: "destructive" 
      });
    }
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
      <div className="rounded-xl bg-gradient-to-br from-primary/15 via-primary/5 to-accent/15 p-6 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Anket & Test Modülü</h1>
            <p className="text-muted-foreground mt-1">
              Anket oluşturun, sınıflara dağıtın ve sonuçları analiz edin
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Ayarlar
            </Button>
            <SurveyCreationDialog onSurveyCreated={refreshAllData}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Yeni Anket
              </Button>
            </SurveyCreationDialog>
          </div>
        </div>
      </div>

      <SurveyStats templates={templates} distributions={distributions} />

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Anket Şablonları</TabsTrigger>
          <TabsTrigger value="distributions">Dağıtımlar</TabsTrigger>
          <TabsTrigger value="responses">Yanıtlar</TabsTrigger>
          <TabsTrigger value="analytics">Analiz</TabsTrigger>
          <TabsTrigger value="ai-analysis">AI Analiz</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <TemplatesList 
            templates={templates} 
            onRefresh={refreshAllData}
            onDistribute={handleCreateDistribution}
            onEdit={handleEditTemplate}
            onDuplicate={handleDuplicateTemplate}
            onDelete={handleDeleteTemplate}
            onImportMEBTemplates={handleImportMEBTemplates}
          />
        </TabsContent>

        <TabsContent value="distributions" className="space-y-4">
          <DistributionsList 
            distributions={distributions}
            onNewDistribution={handleNewDistribution}
          />
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

        <TabsContent value="ai-analysis" className="space-y-4">
          {distributions.length > 0 ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Dağıtım Seçin</CardTitle>
                  <CardDescription>AI analizi için bir anket dağıtımı seçin</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {distributions.map(dist => (
                      <Button
                        key={dist.id}
                        variant="outline"
                        className="justify-start h-auto p-4"
                        onClick={() => setSelectedDistributionForAI(dist)}
                      >
                        <div className="text-left">
                          <div className="font-medium">{dist.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {dist.targetClasses?.join(', ') || 'Tüm Sınıflar'} • {new Date(dist.startDate).toLocaleDateString('tr-TR')}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {selectedDistributionForAI && (
                <SurveyAIAnalysis distributionId={String(selectedDistributionForAI.id)} />
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <p>Henüz anket dağıtımı bulunmuyor</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <TemplateSelector
        open={showTemplateSelector}
        onOpenChange={setShowTemplateSelector}
        templates={templates}
        onSelect={handleTemplateSelected}
      />

      {selectedTemplate && questions.length > 0 && (
        <SurveyDistributionDialog
          survey={selectedTemplate}
          questions={questions}
          onDistributionCreated={handleDistributionCreated}
        >
          <div />
        </SurveyDistributionDialog>
      )}
    </div>
  );
}
