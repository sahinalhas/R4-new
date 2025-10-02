import { useState } from "react";
import { AcademicRecord, addAcademic } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

function parseNumberOrUndefined(value: string): number | undefined {
  if (!value || !value.trim()) return undefined;
  const num = Number(value.trim());
  return Number.isFinite(num) ? num : undefined;
}

interface AkademikPerformansSectionProps {
  studentId: string;
  academicRecords: AcademicRecord[];
  onUpdate: () => void;
}

export default function AkademikPerformansSection({ 
  studentId, 
  academicRecords, 
  onUpdate 
}: AkademikPerformansSectionProps) {
  const [academicTerm, setAcademicTerm] = useState<string>("");
  const [academicGpa, setAcademicGpa] = useState<string>("");
  const [academicNotes, setAcademicNotes] = useState<string>("");

  const handleSave = async () => {
    if (!studentId || !academicTerm) return;
    const gpa = parseNumberOrUndefined(academicGpa);
    const academicRecord: AcademicRecord = {
      id: crypto.randomUUID(),
      studentId: studentId,
      term: academicTerm,
      gpa,
      notes: academicNotes || undefined,
    };
    await addAcademic(academicRecord);
    setAcademicTerm("");
    setAcademicGpa("");
    setAcademicNotes("");
    onUpdate();
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Akademik Performans
          </CardTitle>
          <CardDescription>Detaylı akademik analiz ve raporlama</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              placeholder="Dönem (örn. 2024-Güz)"
              value={academicTerm}
              onChange={(e) => setAcademicTerm(e.target.value)}
            />
            <Input
              placeholder="GPA (0-4 arası)"
              value={academicGpa}
              onChange={(e) => setAcademicGpa(e.target.value)}
            />
            <Button onClick={handleSave}>
              Kaydet
            </Button>
          </div>
          <Textarea
            placeholder="Notlar (opsiyonel)"
            value={academicNotes}
            onChange={(e) => setAcademicNotes(e.target.value)}
          />
          
          <div className="space-y-2">
            <h4 className="font-medium">Akademik Kayıtlar</h4>
            {academicRecords.map(record => (
              <div key={record.id} className="border rounded p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{record.term}</div>
                  {record.gpa && (
                    <Badge variant={record.gpa >= 3.5 ? "default" : 
                                   record.gpa >= 2.5 ? "secondary" : "destructive"}>
                      GPA: {record.gpa}
                    </Badge>
                  )}
                </div>
                {record.notes && (
                  <p className="text-sm text-muted-foreground">{record.notes}</p>
                )}
                <div className="text-xs text-muted-foreground">
                  {record.term} dönemi
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
