import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Target, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getStudentAssessmentSummary } from "@/lib/api/assessments.api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface AssessmentOverviewProps {
  studentId: string;
}

export function AssessmentOverview({ studentId }: AssessmentOverviewProps) {
  const { data: summary, isLoading } = useQuery({
    queryKey: ['assessment-summary', studentId],
    queryFn: () => getStudentAssessmentSummary(studentId),
  });

  if (isLoading || !summary) {
    return <div className="text-center py-8 text-muted-foreground">Yükleniyor...</div>;
  }

  const getTrendIcon = (trend: 'improving' | 'declining' | 'stable') => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getTrendLabel = (trend: 'improving' | 'declining' | 'stable') => {
    switch (trend) {
      case 'improving':
        return 'Gelişiyor';
      case 'declining':
        return 'Düşüş';
      case 'stable':
        return 'Sabit';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Toplam Değerlendirme</CardDescription>
            <CardTitle className="text-3xl">{summary.totalAssessments}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Tüm değerlendirme türleri
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ortalama Başarı</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              {summary.averageScore.toFixed(1)}
              <span className="text-sm text-muted-foreground">/ 100</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={summary.averageScore} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Genel Trend</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              {getTrendIcon(summary.trend)}
              {getTrendLabel(summary.trend)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Son değerlendirmelere göre
            </p>
          </CardContent>
        </Card>
      </div>

      {summary.recentPerformance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performans Trendi</CardTitle>
            <CardDescription>Son değerlendirmelerdeki başarı grafiği</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={summary.recentPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('tr-TR')}
                  formatter={(value: number, name: string, props: any) => [
                    `${value.toFixed(1)} puan`,
                    props.payload.assessmentTitle
                  ]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Başarı Puanı"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {summary.weakTopics.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Zayıf Konular
              </CardTitle>
              <CardDescription>Geliştirilmesi gereken alanlar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {summary.weakTopics.map((topic, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{topic.topicName}</span>
                      <Badge variant="destructive" className="text-xs">
                        {topic.score.toFixed(0)}%
                      </Badge>
                    </div>
                    <Progress value={topic.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {summary.strongTopics.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Güçlü Konular
              </CardTitle>
              <CardDescription>Başarılı olduğu alanlar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {summary.strongTopics.map((topic, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{topic.topicName}</span>
                      <Badge variant="default" className="text-xs bg-green-600">
                        {topic.score.toFixed(0)}%
                      </Badge>
                    </div>
                    <Progress value={topic.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
