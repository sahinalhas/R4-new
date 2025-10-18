import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Plus } from "lucide-react";
import { getStudentPerformanceTasks } from "@/lib/api/assessments.api";
import { Progress } from "@/components/ui/progress";

interface PerformanceTasksSectionProps {
  studentId: string;
  onUpdate: () => void;
}

export function PerformanceTasksSection({ studentId, onUpdate }: PerformanceTasksSectionProps) {
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['performance-tasks', studentId],
    queryFn: () => getStudentPerformanceTasks(studentId),
  });

  const averageScore = tasks.length > 0
    ? tasks.reduce((sum: number, t: any) => {
        const criteriaScores = t.criteriaScores ? JSON.parse(t.criteriaScores) : {};
        const scores = Object.values(criteriaScores) as number[];
        const avg = scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0;
        return sum + avg;
      }, 0) / tasks.length
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Performans Görevleri & Projeler</h3>
        </div>
        <Button onClick={onUpdate}>
          <Plus className="h-4 w-4 mr-2" />
          Görev Ekle
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Yükleniyor...
          </CardContent>
        </Card>
      ) : tasks.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Henüz performans görevi kaydı bulunmuyor.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Toplam Görev</CardDescription>
                <CardTitle className="text-2xl">{tasks.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Ortalama Puan</CardDescription>
                <CardTitle className="text-2xl">{averageScore.toFixed(1)}</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={averageScore} className="h-2" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performans Görevleri Detayı</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task: any, index: number) => {
                  const criteriaScores = task.criteriaScores ? JSON.parse(task.criteriaScores) : {};
                  const scores = Object.values(criteriaScores) as number[];
                  const taskAvg = scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0;
                  const strengths = task.strengths ? JSON.parse(task.strengths) : [];
                  const improvements = task.improvements ? JSON.parse(task.improvements) : [];

                  return (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-lg mb-1">Performans Görevi #{index + 1}</div>
                          {task.feedback && (
                            <p className="text-sm text-muted-foreground">{task.feedback}</p>
                          )}
                        </div>
                        <Badge variant="default" className="text-base px-3 py-1">
                          {taskAvg.toFixed(1)}
                        </Badge>
                      </div>

                      {Object.keys(criteriaScores).length > 0 && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Kriterler:</div>
                          {Object.entries(criteriaScores).map(([criterion, score], idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="text-sm flex-1">{criterion}</span>
                              <Progress value={(score as number / 100) * 100} className="w-24 h-2" />
                              <span className="text-sm font-medium w-12 text-right">{String(score)}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {strengths.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-green-600 mb-1">Güçlü Yönler:</div>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {strengths.map((s: string, idx: number) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {improvements.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-yellow-600 mb-1">Gelişim Alanları:</div>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {improvements.map((i: string, idx: number) => (
                              <li key={idx}>{i}</li>
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
        </>
      )}
    </div>
  );
}
