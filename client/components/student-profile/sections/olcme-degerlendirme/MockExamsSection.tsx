import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, TrendingUp, Target, Calendar } from "lucide-react";
import { getStudentMockExamResults } from "@/lib/api/assessments.api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface MockExamsSectionProps {
  studentId: string;
  onUpdate: () => void;
}

export function MockExamsSection({ studentId, onUpdate }: MockExamsSectionProps) {
  const [selectedExamType, setSelectedExamType] = useState<string>("all");

  const { data: mockExamResults = [], isLoading } = useQuery({
    queryKey: ['mock-exam-results', studentId, selectedExamType],
    queryFn: () => getStudentMockExamResults(studentId, selectedExamType === "all" ? undefined : selectedExamType),
  });

  const examTypes = [
    { value: "all", label: "Tüm Sınavlar" },
    { value: "TYT", label: "TYT" },
    { value: "AYT", label: "AYT" },
    { value: "LGS", label: "LGS" },
  ];

  const chartData = mockExamResults.map((result: any) => ({
    date: result.created_at ? format(new Date(result.created_at), 'dd MMM', { locale: tr }) : '-',
    net: result.netScore || 0,
    dogru: result.totalCorrect || 0,
    yanlis: result.totalWrong || 0,
    hedef: result.targetNet || 0,
  })).reverse();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Deneme Sınavları</h3>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedExamType} onValueChange={setSelectedExamType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {examTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={onUpdate}>
            <Plus className="h-4 w-4 mr-2" />
            Yeni Sınav Ekle
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Yükleniyor...
          </CardContent>
        </Card>
      ) : mockExamResults.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Henüz deneme sınavı kaydı bulunmuyor.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Toplam Deneme</CardDescription>
                <CardTitle className="text-2xl">{mockExamResults.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Ortalama Net</CardDescription>
                <CardTitle className="text-2xl">
                  {(mockExamResults.reduce((sum: number, r: any) => sum + (r.netScore || 0), 0) / mockExamResults.length).toFixed(1)}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>En Yüksek Net</CardDescription>
                <CardTitle className="text-2xl text-green-600">
                  {Math.max(...mockExamResults.map((r: any) => r.netScore || 0)).toFixed(1)}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Hedef Farkı</CardDescription>
                <CardTitle className="text-2xl">
                  {mockExamResults[mockExamResults.length - 1]?.targetNet && mockExamResults[mockExamResults.length - 1]?.netScore
                    ? (mockExamResults[mockExamResults.length - 1].netScore - mockExamResults[mockExamResults.length - 1].targetNet).toFixed(1)
                    : '-'
                  }
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {chartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Net Gelişim Grafiği</CardTitle>
                <CardDescription>Deneme sınavlarındaki net performansı</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={2} name="Net" />
                    <Line type="monotone" dataKey="hedef" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Hedef Net" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Deneme Sınav Geçmişi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockExamResults.map((result: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{result.examType || 'Deneme'}</Badge>
                        <span className="font-medium">
                          {result.created_at ? format(new Date(result.created_at), 'dd MMMM yyyy', { locale: tr }) : 'Tarih yok'}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          Net: {result.netScore?.toFixed(1) || 0}
                        </span>
                        <span className="text-green-600">D: {result.totalCorrect || 0}</span>
                        <span className="text-red-600">Y: {result.totalWrong || 0}</span>
                        <span className="text-gray-600">B: {result.totalEmpty || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {result.targetNet && (
                        <Badge variant={result.netScore >= result.targetNet ? "default" : "destructive"}>
                          Hedef: {result.targetNet}
                        </Badge>
                      )}
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
