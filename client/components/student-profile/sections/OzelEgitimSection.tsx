import { SpecialEducation, addSpecialEducation } from "@/lib/storage";
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
import { FileText } from "lucide-react";

interface OzelEgitimSectionProps {
  studentId: string;
  specialEducation: SpecialEducation[];
  onUpdate: () => void;
}

export default function OzelEgitimSection({ studentId, specialEducation, onUpdate }: OzelEgitimSectionProps) {
  const handleSave = async () => {
    const specialEd: SpecialEducation = {
      id: crypto.randomUUID(),
      studentId,
      hasIEP: (document.getElementById('special-hasIEP') as HTMLInputElement)?.checked || false,
      iepStartDate: (document.getElementById('special-iepStart') as HTMLInputElement)?.value,
      iepEndDate: (document.getElementById('special-iepEnd') as HTMLInputElement)?.value,
      iepGoals: (document.getElementById('special-iepGoals') as HTMLTextAreaElement)?.value,
      diagnosis: (document.getElementById('special-diagnosis') as HTMLTextAreaElement)?.value,
      ramReportDate: (document.getElementById('special-ramDate') as HTMLInputElement)?.value,
      ramReportSummary: (document.getElementById('special-ramSummary') as HTMLTextAreaElement)?.value,
      supportServices: (document.getElementById('special-support') as HTMLTextAreaElement)?.value,
      accommodations: (document.getElementById('special-accommodations') as HTMLTextAreaElement)?.value,
      status: (document.getElementById('special-status') as HTMLSelectElement)?.value || 'AKTİF',
      nextReviewDate: (document.getElementById('special-nextReview') as HTMLInputElement)?.value,
      notes: (document.getElementById('special-notes') as HTMLTextAreaElement)?.value,
    };
    await addSpecialEducation(specialEd);
    onUpdate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Özel Eğitim - BEP Takibi</CardTitle>
        <CardDescription>Bireysel Eğitim Planı ve RAM raporları</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <input type="checkbox" id="special-hasIEP" className="h-4 w-4" />
          <label htmlFor="special-hasIEP">BEP var</label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input type="date" placeholder="BEP Başlangıç" id="special-iepStart" />
          <Input type="date" placeholder="BEP Bitiş" id="special-iepEnd" />
        </div>
        
        <Textarea placeholder="BEP Hedefleri" id="special-iepGoals" rows={3} />
        <Textarea placeholder="Tanı" id="special-diagnosis" rows={2} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input type="date" placeholder="RAM Rapor Tarihi" id="special-ramDate" />
          <Select defaultValue="AKTİF">
            <SelectTrigger id="special-status">
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AKTİF">Aktif</SelectItem>
              <SelectItem value="TAMAMLANDI">Tamamlandı</SelectItem>
              <SelectItem value="İPTAL">İptal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Textarea placeholder="RAM Rapor Özeti" id="special-ramSummary" rows={2} />
        <Textarea placeholder="Destek Hizmetleri" id="special-support" rows={2} />
        <Textarea placeholder="Uyarlamalar" id="special-accommodations" rows={2} />
        <Input type="date" placeholder="Sonraki Değerlendirme" id="special-nextReview" />
        <Textarea placeholder="Notlar" id="special-notes" rows={2} />
        
        <Button className="w-full" onClick={handleSave}>
          <FileText className="mr-2 h-4 w-4" />
          BEP Kaydı Ekle
        </Button>
        
        {specialEducation && specialEducation.length > 0 && (
          <div className="space-y-2 mt-4">
            <h4 className="font-medium">BEP Kaydı</h4>
            <div className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant={specialEducation[0].hasIEP ? "default" : "secondary"}>
                  {specialEducation[0].hasIEP ? "BEP Var" : "BEP Yok"}
                </Badge>
                <Badge variant="outline">{specialEducation[0].status}</Badge>
              </div>
              {specialEducation[0].diagnosis && <div className="text-sm"><strong>Tanı:</strong> {specialEducation[0].diagnosis}</div>}
              {specialEducation[0].iepGoals && <div className="text-sm"><strong>Hedefler:</strong> {specialEducation[0].iepGoals}</div>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
