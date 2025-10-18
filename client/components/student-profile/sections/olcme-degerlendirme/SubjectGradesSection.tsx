import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { getSubjectGrades } from "@/lib/api/assessments.api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";
import { Progress } from "@/components/ui/progress";

interface SubjectGradesSectionProps {
  studentId: string;
  onUpdate: () => void;
}

export function SubjectGradesSection({ studentId, onUpdate }: SubjectGradesSectionProps) {
  const [selectedSemester, setSelectedSemester] = useState<string>("all");

  const { data: grades = [], isLoading } = useQuery({
    queryKey: ['subject-grades', studentId, selectedSemester],
    queryFn: () => getSubjectGrades(studentId, selectedSemester === "all" ? {} : { semester: selectedSemester }),
  });

  const radarData = grades
    .filter((g: any) => g.score !== null && g.score !== undefined)
    .map((g: any) => ({
      subject: g.subjectName || g.subjectId,
      puan: g.score || 0,
    }));

  const averageGrade = grades.length > 0
    ? grades.reduce((sum: number, g: any) => sum + (g.score || 0), 0) / grades.length
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Okul Dersleri Notları</h3>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Dönem seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Dönemler</SelectItem>
              <SelectItem value="2024-2025/1">2024-2025 / 1. Dönem</SelectItem>
              <SelectItem value="2024-2025/2">2024-2025 / 2. Dönem</SelectItem>
              <SelectItem value="2023-2024/2">2023-2024 / 2. Dönem</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={onUpdate}>
            <Plus className="h-4 w-4 mr-2" />
            Not Ekle
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Yükleniyor...
          </CardContent>
        </Card>
      ) : grades.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Henüz ders notu kaydı bulunmuyor.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Ders Sayısı</CardDescription>
                <CardTitle className="text-2xl">{grades.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Genel Ortalama</CardDescription>
                <CardTitle className="text-2xl">{averageGrade.toFixed(2)}</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={(averageGrade / 100) * 100} className="h-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Başarı Durumu</CardDescription>
                <CardTitle className="text-2xl">
                  {averageGrade >= 85 ? "Pekiyi" : averageGrade >= 70 ? "İyi" : averageGrade >= 50 ? "Orta" : "Gelişmeli"}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {radarData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ders Bazlı Performans</CardTitle>
                <CardDescription>Tüm derslerdeki başarı dağılımı</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Puan" dataKey="puan" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ders Notları Detayı</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {grades.map((grade: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="font-medium">{grade.subjectName || grade.subjectId}</div>
                      <div className="text-sm text-muted-foreground">
                        {grade.semester} • {grade.academicYear}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={(grade.score / 100) * 100} className="w-20 h-2" />
                      <Badge variant={grade.score >= 85 ? "default" : grade.score >= 50 ? "secondary" : "destructive"}>
                        {grade.score?.toFixed(0) || 0}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
