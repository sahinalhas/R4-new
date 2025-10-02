import { BehaviorIncident, addBehaviorIncident } from "@/lib/storage";
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
import { ClipboardList } from "lucide-react";

interface DavranisTakibiSectionProps {
  studentId: string;
  behaviorIncidents: BehaviorIncident[];
  onUpdate: () => void;
}

export default function DavranisTakibiSection({ studentId, behaviorIncidents, onUpdate }: DavranisTakibiSectionProps) {
  const handleSave = async () => {
    const behaviorData: BehaviorIncident = {
      id: crypto.randomUUID(),
      studentId,
      incidentDate: (document.getElementById('behavior-date') as HTMLInputElement)?.value || new Date().toISOString().slice(0, 10),
      incidentTime: (document.getElementById('behavior-time') as HTMLInputElement)?.value || '',
      location: (document.getElementById('behavior-location') as HTMLInputElement)?.value || '',
      behaviorType: (document.getElementById('behavior-type') as HTMLSelectElement)?.value || 'DİĞER',
      behaviorCategory: (document.getElementById('behavior-type') as HTMLSelectElement)?.value || 'DİĞER',
      description: (document.getElementById('behavior-description') as HTMLTextAreaElement)?.value || '',
      antecedent: (document.getElementById('behavior-antecedent') as HTMLTextAreaElement)?.value,
      consequence: (document.getElementById('behavior-consequence') as HTMLTextAreaElement)?.value,
      intensity: (document.getElementById('behavior-intensity') as HTMLSelectElement)?.value,
      interventionUsed: (document.getElementById('behavior-intervention') as HTMLTextAreaElement)?.value,
      interventionEffectiveness: (document.getElementById('behavior-effectiveness') as HTMLSelectElement)?.value,
      parentNotified: (document.getElementById('behavior-parentNotified') as HTMLInputElement)?.checked || false,
      followUpRequired: false,
      adminNotified: false,
      status: 'KAYITLI',
      recordedBy: (document.getElementById('behavior-recordedBy') as HTMLInputElement)?.value || 'Sistem',
      notes: (document.getElementById('behavior-notes') as HTMLTextAreaElement)?.value,
    };
    await addBehaviorIncident(behaviorData);
    onUpdate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Davranış Takibi - ABC Analizi</CardTitle>
        <CardDescription>Davranış olayları ve müdahale etkinliği</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input type="date" placeholder="Olay Tarihi" id="behavior-date" defaultValue={new Date().toISOString().slice(0, 10)} />
          <Input type="time" placeholder="Olay Saati" id="behavior-time" />
        </div>
        
        <Input placeholder="Konum (Sınıf, bahçe, vb.)" id="behavior-location" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Select defaultValue="SÖZLÜ">
            <SelectTrigger id="behavior-type">
              <SelectValue placeholder="Davranış Türü" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SÖZLÜ">Sözlü</SelectItem>
              <SelectItem value="FİZİKSEL">Fiziksel</SelectItem>
              <SelectItem value="KURALLARA_UYMAMA">Kurallara Uymama</SelectItem>
              <SelectItem value="DERSE_KATILMAMA">Derse Katılmama</SelectItem>
              <SelectItem value="DİĞER">Diğer</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="ORTA">
            <SelectTrigger id="behavior-intensity">
              <SelectValue placeholder="Yoğunluk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DÜŞÜK">Düşük</SelectItem>
              <SelectItem value="ORTA">Orta</SelectItem>
              <SelectItem value="YÜKSEK">Yüksek</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Textarea placeholder="Davranış Açıklaması" id="behavior-description" rows={2} />
        <Textarea placeholder="Öncül (Antecedent) - Davranıştan önce ne oldu?" id="behavior-antecedent" rows={2} />
        <Textarea placeholder="Sonuç (Consequence) - Davranıştan sonra ne oldu?" id="behavior-consequence" rows={2} />
        <Textarea placeholder="Kullanılan Müdahale" id="behavior-intervention" rows={2} />
        
        <Select defaultValue="KISMEN_ETKİLİ">
          <SelectTrigger id="behavior-effectiveness">
            <SelectValue placeholder="Müdahale Etkinliği" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ÇOK_ETKİLİ">Çok Etkili</SelectItem>
            <SelectItem value="ETKİLİ">Etkili</SelectItem>
            <SelectItem value="KISMEN_ETKİLİ">Kısmen Etkili</SelectItem>
            <SelectItem value="ETKİSİZ">Etkisiz</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center gap-2">
          <input type="checkbox" id="behavior-parentNotified" className="h-4 w-4" />
          <label htmlFor="behavior-parentNotified">Veli bilgilendirildi</label>
        </div>
        
        <Input placeholder="Kaydeden Kişi" id="behavior-recordedBy" />
        <Textarea placeholder="Notlar ve Patern Analizi" id="behavior-notes" rows={2} />
        
        <Button className="w-full" onClick={handleSave}>
          <ClipboardList className="mr-2 h-4 w-4" />
          Davranış Kaydı Ekle
        </Button>
        
        {behaviorIncidents.length > 0 && (
          <div className="space-y-2 mt-4">
            <h4 className="font-medium">Davranış Kayıtları</h4>
            {behaviorIncidents.map(incident => (
              <div key={incident.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">
                    {new Date(incident.incidentDate).toLocaleDateString()} {incident.incidentTime}
                  </div>
                  <Badge>{incident.behaviorType}</Badge>
                </div>
                <div className="text-sm">{incident.description}</div>
                {incident.antecedent && (
                  <div className="text-xs"><strong>Öncül:</strong> {incident.antecedent}</div>
                )}
                {incident.interventionUsed && (
                  <div className="text-xs"><strong>Müdahale:</strong> {incident.interventionUsed}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
