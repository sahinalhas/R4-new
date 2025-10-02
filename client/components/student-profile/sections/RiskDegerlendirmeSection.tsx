import { RiskFactors, addRiskFactors } from "@/lib/storage";
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
import { AlertTriangle } from "lucide-react";

interface RiskDegerlendirmeSectionProps {
  studentId: string;
  riskFactors: RiskFactors | null;
  onUpdate: () => void;
}

export default function RiskDegerlendirmeSection({ studentId, riskFactors, onUpdate }: RiskDegerlendirmeSectionProps) {
  const handleSave = async () => {
    const riskData: RiskFactors = {
      id: crypto.randomUUID(),
      studentId,
      assessmentDate: (document.getElementById('risk-assessmentDate') as HTMLInputElement)?.value || new Date().toISOString().slice(0, 10),
      academicRiskLevel: (document.getElementById('risk-academic') as HTMLSelectElement)?.value || 'DÜŞÜK',
      behavioralRiskLevel: (document.getElementById('risk-behavioral') as HTMLSelectElement)?.value || 'DÜŞÜK',
      attendanceRiskLevel: (document.getElementById('risk-attendance') as HTMLSelectElement)?.value || 'DÜŞÜK',
      socialEmotionalRiskLevel: (document.getElementById('risk-socialEmotional') as HTMLSelectElement)?.value || 'DÜŞÜK',
      academicFactors: (document.getElementById('risk-academicFactors') as HTMLTextAreaElement)?.value,
      behavioralFactors: (document.getElementById('risk-behavioralFactors') as HTMLTextAreaElement)?.value,
      protectiveFactors: (document.getElementById('risk-protectiveFactors') as HTMLTextAreaElement)?.value,
      interventionsNeeded: (document.getElementById('risk-interventions') as HTMLTextAreaElement)?.value,
      parentNotified: (document.getElementById('risk-parentNotified') as HTMLInputElement)?.checked || false,
      assignedCounselor: (document.getElementById('risk-counselor') as HTMLInputElement)?.value,
      nextAssessmentDate: (document.getElementById('risk-nextAssessment') as HTMLInputElement)?.value,
      status: 'AKTİF'
    };
    await addRiskFactors(riskData);
    onUpdate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Değerlendirme ve Erken Uyarı</CardTitle>
        <CardDescription>Akademik, davranışsal ve sosyal-duygusal risk faktörleri</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input type="date" placeholder="Değerlendirme Tarihi" id="risk-assessmentDate" defaultValue={new Date().toISOString().slice(0, 10)} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Select defaultValue="DÜŞÜK">
            <SelectTrigger id="risk-academic">
              <SelectValue placeholder="Akademik Risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DÜŞÜK">Düşük</SelectItem>
              <SelectItem value="ORTA">Orta</SelectItem>
              <SelectItem value="YÜKSEK">Yüksek</SelectItem>
              <SelectItem value="ÇOK_YÜKSEK">Çok Yüksek</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="DÜŞÜK">
            <SelectTrigger id="risk-behavioral">
              <SelectValue placeholder="Davranışsal Risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DÜŞÜK">Düşük</SelectItem>
              <SelectItem value="ORTA">Orta</SelectItem>
              <SelectItem value="YÜKSEK">Yüksek</SelectItem>
              <SelectItem value="ÇOK_YÜKSEK">Çok Yüksek</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Select defaultValue="DÜŞÜK">
            <SelectTrigger id="risk-attendance">
              <SelectValue placeholder="Devamsızlık Riski" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DÜŞÜK">Düşük</SelectItem>
              <SelectItem value="ORTA">Orta</SelectItem>
              <SelectItem value="YÜKSEK">Yüksek</SelectItem>
              <SelectItem value="ÇOK_YÜKSEK">Çok Yüksek</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="DÜŞÜK">
            <SelectTrigger id="risk-socialEmotional">
              <SelectValue placeholder="Sosyal-Duygusal Risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DÜŞÜK">Düşük</SelectItem>
              <SelectItem value="ORTA">Orta</SelectItem>
              <SelectItem value="YÜKSEK">Yüksek</SelectItem>
              <SelectItem value="ÇOK_YÜKSEK">Çok Yüksek</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Textarea placeholder="Akademik Risk Faktörleri" id="risk-academicFactors" rows={2} />
        <Textarea placeholder="Davranışsal Faktörler" id="risk-behavioralFactors" rows={2} />
        <Textarea placeholder="Koruyucu Faktörler" id="risk-protectiveFactors" rows={2} />
        <Textarea placeholder="Gerekli Müdahaleler" id="risk-interventions" rows={2} />
        
        <div className="flex items-center gap-2">
          <input type="checkbox" id="risk-parentNotified" className="h-4 w-4" />
          <label htmlFor="risk-parentNotified">Veli bilgilendirildi</label>
        </div>
        
        <Input placeholder="Sorumlu Danışman" id="risk-counselor" />
        <Input type="date" placeholder="Sonraki Değerlendirme" id="risk-nextAssessment" />
        
        <Button className="w-full" onClick={handleSave}>
          <AlertTriangle className="mr-2 h-4 w-4" />
          Risk Değerlendirmesi Kaydet
        </Button>
        
        {riskFactors && (
          <div className="space-y-2 mt-4">
            <h4 className="font-medium">Son Risk Değerlendirmesi</h4>
            <div className="border rounded-lg p-3 space-y-2">
              <div className="text-sm font-medium">
                {new Date(riskFactors.assessmentDate).toLocaleDateString()}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <span>Akademik:</span>
                  <Badge variant={riskFactors.academicRiskLevel === 'YÜKSEK' || riskFactors.academicRiskLevel === 'ÇOK_YÜKSEK' ? 'destructive' : 'secondary'}>
                    {riskFactors.academicRiskLevel}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <span>Davranış:</span>
                  <Badge variant={riskFactors.behavioralRiskLevel === 'YÜKSEK' || riskFactors.behavioralRiskLevel === 'ÇOK_YÜKSEK' ? 'destructive' : 'secondary'}>
                    {riskFactors.behavioralRiskLevel}
                  </Badge>
                </div>
              </div>
              {riskFactors.interventionsNeeded && (
                <div className="text-sm"><strong>Müdahaleler:</strong> {riskFactors.interventionsNeeded}</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
