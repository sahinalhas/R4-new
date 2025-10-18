import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, CheckCircle2, Target, Lightbulb } from "lucide-react";
import { getAssessmentAnalyses, getStudentAssessmentSummary } from "@/lib/api/assessments.api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface AssessmentAnalyticsSectionProps {
  studentId: string;
}

export function AssessmentAnalyticsSection({ studentId }: AssessmentAnalyticsSectionProps) {
  const { data: analyses = [], isLoading: analysesLoading } = useQuery({
    queryKey: ['assessment-analyses', studentId],
    queryFn: () => getAssessmentAnalyses(studentId),
  });

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['assessment-summary', studentId],
    queryFn: () => getStudentAssessmentSummary(studentId),
  });

  const isLoading = analysesLoading || summaryLoading;

  const getAnalysisTypeLabel = (type: string) => {
    switch (type) {
      case 'PERFORMANCE_DROP': return 'Performans Düşüşü';
      case 'WEAK_TOPICS': return 'Zayıf Konular';
      case 'TREND_ANALYSIS': return 'Trend Analizi';
      case 'STRENGTH_ANALYSIS': return 'Güçlü Yönler';
      case 'IMPROVEMENT_SUGGESTION': return 'Gelişim Önerisi';
      case 'GOAL_COMPARISON': return 'Hedef Karşılaştırma';
      case 'INTERVENTION_NEEDED': return 'Müdahale Gerekli';
      default: return type;
    }
  };

  const getAnalysisIcon = (type: string) => {
    switch (type) {
      case 'PERFORMANCE_DROP':
      case 'INTERVENTION_NEEDED':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'WEAK_TOPICS':
        return <Target className="h-5 w-5 text-yellow-500" />;
      case 'TREND_ANALYSIS':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'STRENGTH_ANALYSIS':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'IMPROVEMENT_SUGGESTION':
        return <Lightbulb className="h-5 w-5 text-purple-500" />;
      default:
        return <Target className="h-5 w-5" />;
    }
  };

  const getAnalysisVariant = (type: string): "default" | "destructive" | "secondary" => {
    switch (type) {
      case 'PERFORMANCE_DROP':
      case 'INTERVENTION_NEEDED':
        return 'destructive';
      case 'STRENGTH_ANALYSIS':
        return 'default';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Analizler yükleniyor...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            AI Destekli Değerlendirme Analizleri
          </CardTitle>
          <CardDescription>
            Öğrencinin performansı hakkında otomatik analizler ve müdahale önerileri
          </CardDescription>
        </CardHeader>
      </Card>

      {summary && summary.trend === 'declining' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Dikkat: Performans Düşüşü Tespit Edildi</AlertTitle>
          <AlertDescription>
            Son değerlendirmelerde düşüş eğilimi gözlemlendi. Öğrenciyle birebir görüşme ve müdahale planı önerilir.
          </AlertDescription>
        </Alert>
      )}

      {summary && summary.weakTopics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Öncelikli Gelişim Alanları
            </CardTitle>
            <CardDescription>AI tarafından tespit edilen zayıf konular</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.weakTopics.map((topic, index) => (
                <div key={index} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{topic.topicName}</span>
                    <Badge variant="destructive">{topic.score.toFixed(0)}%</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>Önerilen Müdahale:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Ek çalışma materyali sağlayın</li>
                      <li>Birebir konu anlatımı düşünün</li>
                      <li>Konu tarama testi ile ilerlemeyi takip edin</li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {analyses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Otomatik Analizler</CardTitle>
            <CardDescription>Sistem tarafından oluşturulan tüm analizler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyses.map((analysis: any, index: number) => {
                const insights = analysis.insights ? JSON.parse(analysis.insights) : {};
                const recommendations = analysis.recommendations ? JSON.parse(analysis.recommendations) : {};
                const severity = analysis.severity || 'medium';

                return (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getAnalysisIcon(analysis.analysisType)}
                        <div>
                          <div className="font-medium">{getAnalysisTypeLabel(analysis.analysisType)}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(analysis.created_at).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </div>
                        </div>
                      </div>
                      <Badge variant={getAnalysisVariant(analysis.analysisType)}>
                        {severity === 'high' ? 'Yüksek Öncelik' : severity === 'medium' ? 'Orta Öncelik' : 'Düşük Öncelik'}
                      </Badge>
                    </div>

                    {insights && Object.keys(insights).length > 0 && (
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Bulgular:</div>
                        <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                          {Object.entries(insights).map(([key, value], idx) => (
                            <li key={idx}>{value as string}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {recommendations && Object.keys(recommendations).length > 0 && (
                      <div className="space-y-1">
                        <div className="text-sm font-medium flex items-center gap-1">
                          <Lightbulb className="h-4 w-4" />
                          Öneriler:
                        </div>
                        <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                          {Object.entries(recommendations).map(([key, value], idx) => (
                            <li key={idx}>{value as string}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {analyses.length === 0 && (!summary || summary.weakTopics.length === 0) && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
            <p>Herhangi bir kritik durum tespit edilmedi.</p>
            <p className="text-sm mt-1">Öğrenci genel olarak iyi performans gösteriyor.</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Manuel Müdahale Planı Oluştur</h4>
              <p className="text-sm text-muted-foreground">
                AI önerilerini gözden geçirdikten sonra detaylı bir müdahale planı oluşturun
              </p>
            </div>
            <Button>Müdahale Planı Oluştur</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
