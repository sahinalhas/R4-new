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

export default function Surveys() {
  const { toast } = useToast();
  const { templates, loading: templatesLoading, refresh: refreshTemplates } = useSurveyTemplates();
  const { distributions, loading: distributionsLoading, refresh: refreshDistributions } = useSurveyDistributions();
  const { questions, loadQuestions, clearQuestions } = useTemplateQuestions();
  
  const [selectedTemplate, setSelectedTemplate] = useState<SurveyTemplate | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

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
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <TemplatesList 
            templates={templates} 
            onRefresh={refreshAllData}
            onDistribute={handleCreateDistribution}
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
