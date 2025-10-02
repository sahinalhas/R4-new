import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SurveyResult, addSurveyResult } from "@/lib/storage";

interface AnketlerSectionProps {
  studentId: string;
  surveyResults: SurveyResult[];
  onUpdate: () => void;
}

function parseNumberOrUndefined(value: string): number | undefined {
  if (!value || !value.trim()) return undefined;
  const num = Number(value.trim());
  return Number.isFinite(num) ? num : undefined;
}

export default function AnketlerSection({ studentId, surveyResults, onUpdate }: AnketlerSectionProps) {
  const [srTitle, setSrTitle] = useState("");
  const [srScore, setSrScore] = useState<string>("");

  const handleAddSurvey = () => {
    if (!studentId || !srTitle.trim()) return;
    const score = parseNumberOrUndefined(srScore);
    addSurveyResult({
      id: crypto.randomUUID(),
      studentId,
      title: srTitle,
      score,
      date: new Date().toISOString(),
    });
    setSrTitle("");
    setSrScore("");
    onUpdate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anket / Test Sonuçları</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            placeholder="Başlık (örn. Beck Depresyon)"
            value={srTitle}
            onChange={(e) => setSrTitle(e.target.value)}
          />
          <Input
            placeholder="Puan (opsiyonel)"
            value={srScore}
            onChange={(e) => setSrScore(e.target.value)}
          />
          <div className="md:col-span-2">
            <Button onClick={handleAddSurvey}>Sonuç Ekle</Button>
          </div>
        </div>
        <div className="grid gap-2">
          {surveyResults.length === 0 && (
            <div className="text-sm text-muted-foreground">
              Kayıt yok.
            </div>
          )}
          {surveyResults.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between rounded border p-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {new Date(r.date).toLocaleDateString()}
                </Badge>
                <span>{r.title}</span>
              </div>
              {typeof r.score === "number" && (
                <Badge variant="secondary">Puan: {r.score}</Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
