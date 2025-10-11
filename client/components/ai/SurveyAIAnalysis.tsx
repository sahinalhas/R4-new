import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, TrendingUp, TrendingDown, Lightbulb, BarChart3, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SurveyAIAnalysisProps {
  distributionId: string;
}

export default function SurveyAIAnalysis({ distributionId }: SurveyAIAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const analyzeResults = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/surveys/ai-analysis/analyze/${distributionId}`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        setAnalysis(data.data);
        toast({
          title: 'Analiz Tamamlandı',
          description: 'AI analizi başarıyla oluşturuldu'
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: 'Hata',
        description: error.message || 'Analiz oluşturulamadı',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Destekli Anket Analizi
          </CardTitle>
          <CardDescription>
            Yapay zeka ile anket sonuçlarınızı derinlemesine analiz edin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={analyzeResults} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analiz Ediliyor...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                AI Analizi Başlat
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Analiz Sonuçları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-sm text-muted-foreground">{analysis.summary}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="findings" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="findings">Ana Bulgular</TabsTrigger>
          <TabsTrigger value="trends">Trendler</TabsTrigger>
          <TabsTrigger value="insights">İçgörüler</TabsTrigger>
          <TabsTrigger value="recommendations">Öneriler</TabsTrigger>
        </TabsList>

        <TabsContent value="findings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ana Bulgular</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.keyFindings?.map((finding: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 mt-0.5 text-primary" />
                    <span className="text-sm">{finding}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  Pozitif Trendler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {analysis.trends?.positive?.map((trend: string, index: number) => (
                    <li key={index} className="text-sm">{trend}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2 text-red-600">
                  <TrendingDown className="h-4 w-4" />
                  Negatif Trendler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {analysis.trends?.negative?.map((trend: string, index: number) => (
                    <li key={index} className="text-sm">{trend}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
                  <BarChart3 className="h-4 w-4" />
                  Nötr Gözlemler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {analysis.trends?.neutral?.map((trend: string, index: number) => (
                    <li key={index} className="text-sm">{trend}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {analysis.insights?.map((insight: any, index: number) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{insight.title}</CardTitle>
                  <Badge variant={
                    insight.priority === 'high' ? 'destructive' :
                    insight.priority === 'medium' ? 'default' : 'secondary'
                  }>
                    {insight.priority === 'high' ? 'Yüksek' :
                     insight.priority === 'medium' ? 'Orta' : 'Düşük'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Önerileri</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.recommendations?.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50">
                    <Badge variant="outline" className="mt-0.5">{index + 1}</Badge>
                    <span className="text-sm flex-1">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {analysis.visualizationSuggestions && analysis.visualizationSuggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Görselleştirme Önerileri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.visualizationSuggestions.map((viz: any, index: number) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{viz.chartType.toUpperCase()} Grafiği</span>
                        <Badge variant="secondary">Öneri</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{viz.purpose}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => setAnalysis(null)}>
          Yeni Analiz
        </Button>
      </div>
    </div>
  );
}
