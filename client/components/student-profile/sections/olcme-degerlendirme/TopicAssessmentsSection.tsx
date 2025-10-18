import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Plus, CheckCircle2, XCircle } from "lucide-react";
import { getTopicAssessments } from "@/lib/api/assessments.api";
import { Progress } from "@/components/ui/progress";

interface TopicAssessmentsSectionProps {
  studentId: string;
  onUpdate: () => void;
}

export function TopicAssessmentsSection({ studentId, onUpdate }: TopicAssessmentsSectionProps) {
  const { data: assessments = [], isLoading } = useQuery({
    queryKey: ['topic-assessments', studentId],
    queryFn: () => getTopicAssessments(studentId, {}),
  });

  const masteredCount = assessments.filter((a: any) => a.mastered).length;
  const masteryRate = assessments.length > 0 ? (masteredCount / assessments.length) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Konu/Kazanım Değerlendirmeleri</h3>
        </div>
        <Button onClick={onUpdate}>
          <Plus className="h-4 w-4 mr-2" />
          Değerlendirme Ekle
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Yükleniyor...
          </CardContent>
        </Card>
      ) : assessments.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Henüz konu değerlendirmesi bulunmuyor.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Toplam Konu</CardDescription>
                <CardTitle className="text-2xl">{assessments.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Kavrandı</CardDescription>
                <CardTitle className="text-2xl text-green-600">{masteredCount}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Kavranma Oranı</CardDescription>
                <CardTitle className="text-2xl">{masteryRate.toFixed(0)}%</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={masteryRate} className="h-2" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Konu Detayları</CardTitle>
              <CardDescription>Tüm konu ve kazanım değerlendirmeleri</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {assessments.map((assessment: any, index: number) => {
                  const scorePercentage = assessment.maxScore > 0 
                    ? (assessment.score / assessment.maxScore) * 100 
                    : 0;

                  return (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {assessment.mastered ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="font-medium">{assessment.topicId}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {assessment.outcome}
                        </div>
                        {assessment.attempts > 1 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {assessment.attempts} deneme yapıldı
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {assessment.score?.toFixed(1) || 0} / {assessment.maxScore || 0}
                          </div>
                          <Progress value={scorePercentage} className="w-20 h-2 mt-1" />
                        </div>
                        <Badge variant={assessment.mastered ? "default" : "secondary"}>
                          {scorePercentage.toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
