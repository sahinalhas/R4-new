import { HealthInfo, saveHealthInfo } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

interface SaglikBilgileriSectionProps {
  studentId: string;
  healthInfo: HealthInfo | null;
  onUpdate: () => void;
}

export default function SaglikBilgileriSection({ studentId, healthInfo, onUpdate }: SaglikBilgileriSectionProps) {
  const handleSave = async () => {
    const healthData: HealthInfo = {
      id: crypto.randomUUID(),
      studentId,
      bloodType: (document.getElementById('health-bloodType') as HTMLInputElement)?.value,
      chronicDiseases: (document.getElementById('health-chronicDiseases') as HTMLTextAreaElement)?.value,
      allergies: (document.getElementById('health-allergies') as HTMLTextAreaElement)?.value,
      medications: (document.getElementById('health-medications') as HTMLTextAreaElement)?.value,
      specialNeeds: (document.getElementById('health-specialNeeds') as HTMLTextAreaElement)?.value,
      emergencyContact1Name: (document.getElementById('health-emergency1Name') as HTMLInputElement)?.value,
      emergencyContact1Phone: (document.getElementById('health-emergency1Phone') as HTMLInputElement)?.value,
      emergencyContact1Relation: (document.getElementById('health-emergency1Relation') as HTMLInputElement)?.value,
      emergencyContact2Name: (document.getElementById('health-emergency2Name') as HTMLInputElement)?.value,
      emergencyContact2Phone: (document.getElementById('health-emergency2Phone') as HTMLInputElement)?.value,
      emergencyContact2Relation: (document.getElementById('health-emergency2Relation') as HTMLInputElement)?.value,
      physicianName: (document.getElementById('health-physicianName') as HTMLInputElement)?.value,
      physicianPhone: (document.getElementById('health-physicianPhone') as HTMLInputElement)?.value,
      lastHealthCheckup: (document.getElementById('health-lastCheckup') as HTMLInputElement)?.value,
      notes: (document.getElementById('health-notes') as HTMLTextAreaElement)?.value,
    };
    await saveHealthInfo(healthData);
    onUpdate();
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Sağlık Bilgileri ve Acil Durum</CardTitle>
          <CardDescription>Öğrencinin sağlık bilgileri ve acil iletişim</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input placeholder="Kan Grubu" id="health-bloodType" defaultValue={healthInfo?.bloodType || ""} />
            <Input placeholder="Doktor Adı" id="health-physicianName" defaultValue={healthInfo?.physicianName || ""} />
            <Input placeholder="Doktor Telefon" id="health-physicianPhone" defaultValue={healthInfo?.physicianPhone || ""} />
          </div>
          <Textarea placeholder="Kronik Hastalıklar" id="health-chronicDiseases" rows={2} defaultValue={healthInfo?.chronicDiseases || ""} />
          <Textarea placeholder="Alerjiler" id="health-allergies" rows={2} defaultValue={healthInfo?.allergies || ""} />
          <Textarea placeholder="İlaçlar" id="health-medications" rows={2} defaultValue={healthInfo?.medications || ""} />
          <Textarea placeholder="Özel İhtiyaçlar" id="health-specialNeeds" rows={2} defaultValue={healthInfo?.specialNeeds || ""} />
          
          <div className="border-t pt-3 mt-3">
            <h4 className="font-medium mb-3">Acil İletişim Kişileri</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="1. Kişi Adı" id="health-emergency1Name" defaultValue={healthInfo?.emergencyContact1Name || ""} />
              <Input placeholder="1. Kişi Telefon" id="health-emergency1Phone" defaultValue={healthInfo?.emergencyContact1Phone || ""} />
              <Input placeholder="1. Kişi Yakınlık" id="health-emergency1Relation" defaultValue={healthInfo?.emergencyContact1Relation || ""} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
              <Input placeholder="2. Kişi Adı" id="health-emergency2Name" defaultValue={healthInfo?.emergencyContact2Name || ""} />
              <Input placeholder="2. Kişi Telefon" id="health-emergency2Phone" defaultValue={healthInfo?.emergencyContact2Phone || ""} />
              <Input placeholder="2. Kişi Yakınlık" id="health-emergency2Relation" defaultValue={healthInfo?.emergencyContact2Relation || ""} />
            </div>
          </div>
          
          <Input type="date" placeholder="Son Sağlık Kontrolü" id="health-lastCheckup" defaultValue={healthInfo?.lastHealthCheckup || ""} />
          <Textarea placeholder="Ek Notlar" id="health-notes" rows={2} defaultValue={healthInfo?.notes || ""} />
          
          <Button className="w-full" onClick={handleSave}>
            <Activity className="mr-2 h-4 w-4" />
            Sağlık Bilgisi Kaydet
          </Button>
          
          {healthInfo && (
            <div className="space-y-2 mt-4">
              <h4 className="font-medium">Kayıtlı Sağlık Bilgileri</h4>
              <div className="border rounded-lg p-3 space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  {healthInfo.bloodType && <div><strong>Kan Grubu:</strong> {healthInfo.bloodType}</div>}
                  {healthInfo.physicianName && <div><strong>Doktor:</strong> {healthInfo.physicianName}</div>}
                </div>
                {healthInfo.chronicDiseases && <div><strong>Kronik Hastalıklar:</strong> {healthInfo.chronicDiseases}</div>}
                {healthInfo.allergies && <div><strong>Alerjiler:</strong> {healthInfo.allergies}</div>}
                {healthInfo.emergencyContact1Name && (
                  <div><strong>Acil İletişim 1:</strong> {healthInfo.emergencyContact1Name} - {healthInfo.emergencyContact1Phone}</div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
