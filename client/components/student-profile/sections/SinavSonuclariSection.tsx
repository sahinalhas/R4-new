import { ExamResult, addExamResult } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart2 } from "lucide-react";

interface SinavSonuclariSectionProps {
  studentId: string;
  examResults: ExamResult[];
  onUpdate: () => void;
}

function parseNumberOrUndefined(value: string): number | undefined {
  if (!value || !value.trim()) return undefined;
  const num = Number(value.trim());
  return Number.isFinite(num) ? num : undefined;
}

export default function SinavSonuclariSection({ studentId, examResults, onUpdate }: SinavSonuclariSectionProps) {
  const handleSave = async () => {
    const examData: ExamResult = {
      id: crypto.randomUUID(),
      studentId,
      examType: (document.getElementById('exam-type') as HTMLSelectElement)?.value || 'DENEME',
      examName: (document.getElementById('exam-name') as HTMLInputElement)?.value || '',
      examDate: (document.getElementById('exam-date') as HTMLInputElement)?.value || new Date().toISOString().slice(0, 10),
      examProvider: (document.getElementById('exam-provider') as HTMLInputElement)?.value,
      totalScore: parseFloat((document.getElementById('exam-totalScore') as HTMLInputElement)?.value) || undefined,
      turkishScore: parseFloat((document.getElementById('exam-turkish') as HTMLInputElement)?.value) || undefined,
      mathScore: parseFloat((document.getElementById('exam-math') as HTMLInputElement)?.value) || undefined,
      scienceScore: parseFloat((document.getElementById('exam-science') as HTMLInputElement)?.value) || undefined,
      socialScore: parseFloat((document.getElementById('exam-social') as HTMLInputElement)?.value) || undefined,
      foreignLanguageScore: parseFloat((document.getElementById('exam-foreign') as HTMLInputElement)?.value) || undefined,
      turkishNet: parseFloat((document.getElementById('exam-turkishNet') as HTMLInputElement)?.value) || undefined,
      mathNet: parseFloat((document.getElementById('exam-mathNet') as HTMLInputElement)?.value) || undefined,
      scienceNet: parseFloat((document.getElementById('exam-scienceNet') as HTMLInputElement)?.value) || undefined,
      socialNet: parseFloat((document.getElementById('exam-socialNet') as HTMLInputElement)?.value) || undefined,
      foreignLanguageNet: parseFloat((document.getElementById('exam-foreignNet') as HTMLInputElement)?.value) || undefined,
      totalNet: parseFloat((document.getElementById('exam-totalNet') as HTMLInputElement)?.value) || undefined,
      classRank: parseInt((document.getElementById('exam-classRank') as HTMLInputElement)?.value) || undefined,
      schoolRank: parseInt((document.getElementById('exam-schoolRank') as HTMLInputElement)?.value) || undefined,
      isOfficial: (document.getElementById('exam-isOfficial') as HTMLInputElement)?.checked || false,
      strengthAreas: (document.getElementById('exam-strengths') as HTMLTextAreaElement)?.value.split(',').map(s => s.trim()).filter(Boolean),
      weaknessAreas: (document.getElementById('exam-weaknesses') as HTMLTextAreaElement)?.value.split(',').map(s => s.trim()).filter(Boolean),
      counselorNotes: (document.getElementById('exam-counselorNotes') as HTMLTextAreaElement)?.value,
      goalsMet: false,
      parentNotified: false,
    };
    await addExamResult(examData);
    onUpdate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sınav Sonuçları - LGS/YKS</CardTitle>
        <CardDescription>Merkezi sınav ve deneme sonuçları takibi</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Select defaultValue="DENEME">
            <SelectTrigger id="exam-type">
              <SelectValue placeholder="Sınav Türü" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LGS">LGS</SelectItem>
              <SelectItem value="YKS_TYT">YKS - TYT</SelectItem>
              <SelectItem value="YKS_AYT">YKS - AYT</SelectItem>
              <SelectItem value="YKS_YDT">YKS - YDT</SelectItem>
              <SelectItem value="DENEME">Deneme Sınavı</SelectItem>
              <SelectItem value="DİĞER">Diğer</SelectItem>
            </SelectContent>
          </Select>
          
          <Input placeholder="Sınav Adı" id="exam-name" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input type="date" placeholder="Sınav Tarihi" id="exam-date" />
          <Input placeholder="Sınav Sağlayıcı" id="exam-provider" />
        </div>
        
        <div className="border-t pt-3 mt-3">
          <h4 className="font-medium mb-2">Puan Bilgileri</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Input type="number" placeholder="Toplam Puan" id="exam-totalScore" />
            <Input type="number" placeholder="Türkçe Puan" id="exam-turkish" />
            <Input type="number" placeholder="Matematik Puan" id="exam-math" />
            <Input type="number" placeholder="Fen Puan" id="exam-science" />
            <Input type="number" placeholder="Sosyal Puan" id="exam-social" />
            <Input type="number" placeholder="Yabancı Dil" id="exam-foreign" />
          </div>
        </div>
        
        <div className="border-t pt-3 mt-3">
          <h4 className="font-medium mb-2">Net Bilgileri</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Input type="number" step="0.25" placeholder="Türkçe Net" id="exam-turkishNet" />
            <Input type="number" step="0.25" placeholder="Matematik Net" id="exam-mathNet" />
            <Input type="number" step="0.25" placeholder="Fen Net" id="exam-scienceNet" />
            <Input type="number" step="0.25" placeholder="Sosyal Net" id="exam-socialNet" />
            <Input type="number" step="0.25" placeholder="Yabancı Dil Net" id="exam-foreignNet" />
            <Input type="number" step="0.25" placeholder="Toplam Net" id="exam-totalNet" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input type="number" placeholder="Sınıf Sıralaması" id="exam-classRank" />
          <Input type="number" placeholder="Okul Sıralaması" id="exam-schoolRank" />
        </div>
        
        <div className="flex items-center gap-2">
          <input type="checkbox" id="exam-isOfficial" className="h-4 w-4" />
          <label htmlFor="exam-isOfficial">Resmi Sınav</label>
        </div>
        
        <Textarea placeholder="Güçlü Alanlar (virgülle ayırın)" id="exam-strengths" rows={2} />
        <Textarea placeholder="Gelişim Alanları (virgülle ayırın)" id="exam-weaknesses" rows={2} />
        <Textarea placeholder="Danışman Notları ve Eylem Planı" id="exam-counselorNotes" rows={2} />
        
        <Button className="w-full" onClick={handleSave}>
          <BarChart2 className="mr-2 h-4 w-4" />
          Sınav Sonucu Kaydet
        </Button>
        
        {examResults.length > 0 && (
          <div className="space-y-2 mt-4">
            <h4 className="font-medium">Sınav Geçmişi</h4>
            {examResults.map(exam => (
              <div key={exam.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{exam.examName}</div>
                  <div className="flex items-center gap-2">
                    <Badge>{exam.examType}</Badge>
                    {exam.isOfficial && <Badge variant="default">Resmi</Badge>}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(exam.examDate).toLocaleDateString()}
                </div>
                {exam.totalScore && (
                  <div className="text-lg font-bold">Toplam: {exam.totalScore}</div>
                )}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {exam.turkishNet !== undefined && <div>Türkçe Net: {exam.turkishNet}</div>}
                  {exam.mathNet !== undefined && <div>Matematik Net: {exam.mathNet}</div>}
                  {exam.scienceNet !== undefined && <div>Fen Net: {exam.scienceNet}</div>}
                  {exam.socialNet !== undefined && <div>Sosyal Net: {exam.socialNet}</div>}
                </div>
                {exam.totalNet !== undefined && (
                  <div className="text-sm font-medium">Toplam Net: {exam.totalNet}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
