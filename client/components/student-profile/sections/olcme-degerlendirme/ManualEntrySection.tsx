import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardCheck, Save } from "lucide-react";
import { getAssessmentTypes, createAssessment, createAssessmentResult } from "@/lib/api/assessments.api";
import { toast } from "sonner";

interface ManualEntrySectionProps {
  studentId: string;
  onUpdate: () => void;
}

export function ManualEntrySection({ studentId, onUpdate }: ManualEntrySectionProps) {
  const queryClient = useQueryClient();
  const [assessmentTypeId, setAssessmentTypeId] = useState("");
  const [title, setTitle] = useState("");
  const [assessmentDate, setAssessmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [score, setScore] = useState("");
  const [maxScore, setMaxScore] = useState("100");
  const [notes, setNotes] = useState("");

  const { data: assessmentTypes = [] } = useQuery({
    queryKey: ['assessment-types'],
    queryFn: () => getAssessmentTypes(),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const assessment = await createAssessment({
        assessmentTypeId,
        title,
        description: notes,
        assessmentDate,
        semester: "2024-2025/1",
        academicYear: "2024-2025",
        maxScore: parseFloat(maxScore),
      } as any);

      await createAssessmentResult({
        assessmentId: assessment.id!,
        studentId,
        score: parseFloat(score),
        percentage: (parseFloat(score) / parseFloat(maxScore)) * 100,
        notes,
      } as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment-summary', studentId] });
      queryClient.invalidateQueries({ queryKey: ['assessment-results', studentId] });
      toast.success("Değerlendirme başarıyla kaydedildi");
      resetForm();
      onUpdate();
    },
    onError: (error: any) => {
      toast.error("Değerlendirme kaydedilemedi", {
        description: error.message,
      });
    },
  });

  const resetForm = () => {
    setTitle("");
    setScore("");
    setMaxScore("100");
    setNotes("");
    setAssessmentDate(new Date().toISOString().split('T')[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assessmentTypeId || !title || !score || !maxScore) {
      toast.error("Lütfen tüm gerekli alanları doldurun");
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Manuel Değerlendirme Girişi
          </CardTitle>
          <CardDescription>
            Tek bir öğrenci için değerlendirme sonucu girin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="assessmentType">Değerlendirme Türü *</Label>
                <Select value={assessmentTypeId} onValueChange={setAssessmentTypeId}>
                  <SelectTrigger id="assessmentType">
                    <SelectValue placeholder="Türü seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {assessmentTypes.map((type: any) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Başlık *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Örn: 1. Yazılı, Deneme 5, vb."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Değerlendirme Tarihi *</Label>
                <Input
                  id="date"
                  type="date"
                  value={assessmentDate}
                  onChange={(e) => setAssessmentDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="score">Alınan Puan *</Label>
                <Input
                  id="score"
                  type="number"
                  step="0.01"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="Örn: 85"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxScore">Maksimum Puan *</Label>
                <Input
                  id="maxScore"
                  type="number"
                  step="0.01"
                  value={maxScore}
                  onChange={(e) => setMaxScore(e.target.value)}
                  placeholder="Örn: 100"
                />
              </div>

              <div className="space-y-2">
                <Label>Başarı Yüzdesi</Label>
                <Input
                  value={
                    score && maxScore && parseFloat(maxScore) > 0
                      ? `${((parseFloat(score) / parseFloat(maxScore)) * 100).toFixed(2)}%`
                      : "-"
                  }
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notlar</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Değerlendirme hakkında notlar..."
                rows={4}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={createMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {createMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Temizle
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-6">
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>İpucu:</strong> Toplu veri girişi için "Toplu Yükleme" sekmesini kullanabilirsiniz.</p>
            <p>* ile işaretlenmiş alanlar zorunludur.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
