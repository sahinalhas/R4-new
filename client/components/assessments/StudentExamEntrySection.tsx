import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Save, Calculator } from "lucide-react";
import { EXAM_TYPES, getExamFormat, calculateNet } from "@shared/constants/exam-formats";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/api-client";

interface SectionResult {
  sectionId: string;
  sectionName: string;
  correct: number;
  wrong: number;
  empty: number;
  total: number;
  net: number;
}

export function StudentExamEntrySection() {
  const queryClient = useQueryClient();
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedExamType, setSelectedExamType] = useState<string>("LGS");
  const [examName, setExamName] = useState<string>("");
  const [examDate, setExamDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [examProvider, setExamProvider] = useState<string>("");
  const [sectionResults, setSectionResults] = useState<Record<string, { correct: number; wrong: number; empty: number }>>({});

  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      return await apiClient.get<any[]>('/api/students');
    },
  });

  const examFormat = useMemo(() => {
    return getExamFormat(selectedExamType);
  }, [selectedExamType]);

  const calculatedResults = useMemo(() => {
    if (!examFormat) return [];
    
    const results: SectionResult[] = [];
    
    examFormat.sections.forEach(section => {
      const result = sectionResults[section.id] || { correct: 0, wrong: 0, empty: 0 };
      const net = calculateNet(result.correct, result.wrong);
      
      results.push({
        sectionId: section.id,
        sectionName: section.name,
        correct: result.correct,
        wrong: result.wrong,
        empty: result.empty,
        total: section.questionCount,
        net: net,
      });

      if (section.subsections) {
        section.subsections.forEach(subsection => {
          const subResult = sectionResults[subsection.id] || { correct: 0, wrong: 0, empty: 0 };
          const subNet = calculateNet(subResult.correct, subResult.wrong);
          
          results.push({
            sectionId: subsection.id,
            sectionName: `  → ${subsection.name}`,
            correct: subResult.correct,
            wrong: subResult.wrong,
            empty: subResult.empty,
            total: subsection.questionCount,
            net: subNet,
          });
        });
      }
    });
    
    return results;
  }, [examFormat, sectionResults]);

  const totalNet = useMemo(() => {
    return calculatedResults.reduce((sum, result) => sum + result.net, 0);
  }, [calculatedResults]);

  const totalCorrect = useMemo(() => {
    return calculatedResults.reduce((sum, result) => sum + result.correct, 0);
  }, [calculatedResults]);

  const totalWrong = useMemo(() => {
    return calculatedResults.reduce((sum, result) => sum + result.wrong, 0);
  }, [calculatedResults]);

  const totalEmpty = useMemo(() => {
    return calculatedResults.reduce((sum, result) => sum + result.empty, 0);
  }, [calculatedResults]);

  const createExamMutation = useMutation({
    mutationFn: async () => {
      if (!selectedStudentId) {
        throw new Error("Öğrenci seçmelisiniz");
      }
      if (!examName.trim()) {
        throw new Error("Deneme adı girmelisiniz");
      }

      const subjectBreakdown = calculatedResults.map(result => ({
        subject: result.sectionName.trim(),
        correct: result.correct,
        wrong: result.wrong,
        empty: result.empty,
        net: result.net,
        total: result.total,
      }));

      const examData = {
        id: crypto.randomUUID(),
        studentId: selectedStudentId,
        examType: selectedExamType,
        examName: examName.trim(),
        examDate: examDate,
        examProvider: examProvider.trim() || undefined,
        totalNet: totalNet,
        correctAnswers: totalCorrect,
        wrongAnswers: totalWrong,
        emptyAnswers: totalEmpty,
        totalQuestions: examFormat?.totalQuestions || 0,
        subjectBreakdown: JSON.stringify(subjectBreakdown),
        isOfficial: false,
        goalsMet: false,
        parentNotified: false,
      };

      return await apiClient.post('/api/exams', examData);
    },
    onSuccess: () => {
      toast.success("Deneme sonucu başarıyla kaydedildi");
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['exam-results'] });
    },
    onError: (error: any) => {
      toast.error("Deneme sonucu kaydedilemedi", {
        description: error.message,
      });
    },
  });

  const updateSectionResult = (sectionId: string, field: 'correct' | 'wrong' | 'empty', value: number) => {
    const section = examFormat?.sections.find(s => s.id === sectionId) 
      || examFormat?.sections.find(s => s.subsections?.find(sub => sub.id === sectionId))?.subsections?.find(sub => sub.id === sectionId);
    
    const maxQuestions = section?.questionCount || 0;
    const current = sectionResults[sectionId] || { correct: 0, wrong: 0, empty: 0 };
    
    const newValue = Math.max(0, Math.min(value, maxQuestions));
    const updatedCurrent = { ...current, [field]: newValue };
    
    const total = updatedCurrent.correct + updatedCurrent.wrong + updatedCurrent.empty;
    if (total > maxQuestions) {
      toast.warning(`Bu ders için toplam ${maxQuestions} soru var. Girilen toplam: ${total}`);
    }
    
    setSectionResults(prev => ({
      ...prev,
      [sectionId]: updatedCurrent,
    }));
  };

  const resetForm = () => {
    setExamName("");
    setExamProvider("");
    setExamDate(new Date().toISOString().split('T')[0]);
    setSectionResults({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createExamMutation.mutate();
  };

  if (!examFormat) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            Lütfen geçerli bir sınav tipi seçin
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Öğrenci Bazlı Deneme Girişi
        </CardTitle>
        <CardDescription>
          Öğrenci seçin, deneme tipini belirleyin ve ders bazında sonuçları girin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="student">Öğrenci *</Label>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger id="student">
                  <SelectValue placeholder="Öğrenci seçin" />
                </SelectTrigger>
                <SelectContent>
                  {studentsLoading ? (
                    <SelectItem value="loading" disabled>Yükleniyor...</SelectItem>
                  ) : students.length === 0 ? (
                    <SelectItem value="empty" disabled>Öğrenci bulunamadı</SelectItem>
                  ) : (
                    students.map((student: any) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.firstName} {student.lastName} ({student.studentNumber})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="examType">Deneme Tipi *</Label>
              <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                <SelectTrigger id="examType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXAM_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="examName">Deneme Adı *</Label>
              <Input
                id="examName"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="Örn: 1. Deneme"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="examDate">Tarih *</Label>
              <Input
                id="examDate"
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="examProvider">Yayın/Kurum</Label>
              <Input
                id="examProvider"
                value={examProvider}
                onChange={(e) => setExamProvider(e.target.value)}
                placeholder="Örn: Esen Yayınları"
              />
            </div>
          </div>

          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                {examFormat.name} - Ders Sonuçları
              </h3>
              <div className="text-sm text-muted-foreground">
                {examFormat.totalQuestions} soru • {examFormat.totalTimeMinutes} dk
              </div>
            </div>

            <div className="space-y-3">
              {examFormat.sections.map(section => (
                <div key={section.id} className="space-y-2">
                  <div className="grid gap-3 md:grid-cols-5 items-center p-3 bg-muted/50 rounded-lg">
                    <div className="md:col-span-2 font-medium">
                      {section.name}
                      <span className="text-sm text-muted-foreground ml-2">({section.questionCount} soru)</span>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Doğru</Label>
                      <Input
                        type="number"
                        min="0"
                        max={section.questionCount}
                        value={sectionResults[section.id]?.correct || 0}
                        onChange={(e) => updateSectionResult(section.id, 'correct', parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Yanlış</Label>
                      <Input
                        type="number"
                        min="0"
                        max={section.questionCount}
                        value={sectionResults[section.id]?.wrong || 0}
                        onChange={(e) => updateSectionResult(section.id, 'wrong', parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Boş</Label>
                      <Input
                        type="number"
                        min="0"
                        max={section.questionCount}
                        value={sectionResults[section.id]?.empty || 0}
                        onChange={(e) => updateSectionResult(section.id, 'empty', parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                    </div>
                  </div>

                  {section.subsections && section.subsections.map(subsection => (
                    <div key={subsection.id} className="grid gap-3 md:grid-cols-5 items-center p-2 pl-6 bg-muted/30 rounded-lg ml-4">
                      <div className="md:col-span-2 text-sm">
                        → {subsection.name}
                        <span className="text-xs text-muted-foreground ml-2">({subsection.questionCount} soru)</span>
                      </div>
                      <div className="space-y-1">
                        <Input
                          type="number"
                          min="0"
                          max={subsection.questionCount}
                          placeholder="D"
                          value={sectionResults[subsection.id]?.correct || 0}
                          onChange={(e) => updateSectionResult(subsection.id, 'correct', parseInt(e.target.value) || 0)}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Input
                          type="number"
                          min="0"
                          max={subsection.questionCount}
                          placeholder="Y"
                          value={sectionResults[subsection.id]?.wrong || 0}
                          onChange={(e) => updateSectionResult(subsection.id, 'wrong', parseInt(e.target.value) || 0)}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Input
                          type="number"
                          min="0"
                          max={subsection.questionCount}
                          placeholder="B"
                          value={sectionResults[subsection.id]?.empty || 0}
                          onChange={(e) => updateSectionResult(subsection.id, 'empty', parseInt(e.target.value) || 0)}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 text-sm">
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="text-muted-foreground">Toplam Doğru</div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalCorrect}</div>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <div className="text-muted-foreground">Toplam Yanlış</div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{totalWrong}</div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-950/20 rounded-lg">
                  <div className="text-muted-foreground">Toplam Boş</div>
                  <div className="text-2xl font-bold">{totalEmpty}</div>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="text-muted-foreground">Toplam Net</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalNet.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              type="submit" 
              disabled={createExamMutation.isPending || !selectedStudentId || !examName.trim()}
              className="w-full md:w-auto"
            >
              <Save className="h-4 w-4 mr-2" />
              {createExamMutation.isPending ? "Kaydediliyor..." : "Deneme Sonucunu Kaydet"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={resetForm}
              className="w-full md:w-auto"
            >
              Temizle
            </Button>
          </div>

          <div className="text-sm text-muted-foreground space-y-1 p-3 bg-muted/50 rounded-lg">
            <p><strong>İpucu:</strong> Seçilen deneme tipine göre dersler otomatik olarak gösterilir.</p>
            <p>Her ders için Doğru, Yanlış ve Boş sayılarını girin. Net hesaplaması otomatik yapılır.</p>
            <p>* ile işaretlenmiş alanlar zorunludur.</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
