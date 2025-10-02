import { useState } from "react";
import { AcademicGoal, addAcademicGoal } from "@/lib/storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Target } from "lucide-react";

interface HedeflerPlanlamaSectionProps {
  studentId: string;
  academicGoals: AcademicGoal[];
  onUpdate: () => void;
}

function parseNumberOrUndefined(value: string): number | undefined {
  if (!value || !value.trim()) return undefined;
  const num = Number(value.trim());
  return Number.isFinite(num) ? num : undefined;
}

export default function HedeflerPlanlamaSection({ 
  studentId, 
  academicGoals, 
  onUpdate 
}: HedeflerPlanlamaSectionProps) {
  const [examType, setExamType] = useState<string>("YKS");
  const [targetScore, setTargetScore] = useState<string>("");
  const [currentScore, setCurrentScore] = useState<string>("");

  const handleSave = () => {
    if (!examType) return;
    
    const target = parseNumberOrUndefined(targetScore);
    const current = parseNumberOrUndefined(currentScore);
    
    const academicGoal: AcademicGoal = {
      id: crypto.randomUUID(),
      studentId,
      examType: examType as any,
      targetScore: target,
      currentScore: current,
      deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
    };
    addAcademicGoal(academicGoal);
    setExamType("YKS");
    setTargetScore("");
    setCurrentScore("");
    onUpdate();
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            SMART Hedefler
          </CardTitle>
          <CardDescription>Spesifik, Ölçülebilir, Ulaşılabilir, Relevans, Zaman-bound hedefler</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Select
              value={examType}
              onValueChange={setExamType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sınav Türü" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="YKS">YKS</SelectItem>
                <SelectItem value="LGS">LGS</SelectItem>
                <SelectItem value="TYT">TYT</SelectItem>
                <SelectItem value="AYT">AYT</SelectItem>
                <SelectItem value="Kişisel">Kişisel Hedef</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Hedef Puan"
              value={targetScore}
              onChange={(e) => setTargetScore(e.target.value)}
            />
            <Input
              placeholder="Mevcut Puan"
              value={currentScore}
              onChange={(e) => setCurrentScore(e.target.value)}
            />
          </div>

          <Button onClick={handleSave}>
            Akademik Hedef Ekle
          </Button>

          <div className="space-y-3">
            <h4 className="font-medium">Mevcut Hedefler</h4>
            {academicGoals.map(goal => (
              <div key={goal.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{goal.examType} Hedefi</div>
                  <Badge variant="outline">
                    Son Tarih: {new Date(goal.deadline).toLocaleDateString()}
                  </Badge>
                </div>
                {goal.targetScore && goal.currentScore && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>İlerleme: {goal.currentScore} / {goal.targetScore}</span>
                      <span>{Math.round((goal.currentScore / goal.targetScore) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-primary rounded-full transition-all"
                        style={{ width: `${Math.min(100, (goal.currentScore / goal.targetScore) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
