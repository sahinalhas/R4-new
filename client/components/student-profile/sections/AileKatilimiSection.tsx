import { useState } from "react";
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
import { Heart } from "lucide-react";
import { FamilyParticipation, addFamilyParticipation } from "@/lib/storage";

interface AileKatilimiSectionProps {
  studentId: string;
  familyParticipation: FamilyParticipation[];
  onUpdate: () => void;
}

export default function AileKatilimiSection({ studentId, familyParticipation, onUpdate }: AileKatilimiSectionProps) {
  const [fpEventType, setFpEventType] = useState<string>("VELI_TOPLANTISI");
  const [fpEventName, setFpEventName] = useState<string>("");
  const [fpEventDate, setFpEventDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [fpParticipationStatus, setFpParticipationStatus] = useState<string>("KATILDI");
  const [fpParticipants, setFpParticipants] = useState<string>("");
  const [fpEngagementLevel, setFpEngagementLevel] = useState<string>("AKTİF");
  const [fpCommunicationFreq, setFpCommunicationFreq] = useState<string>("HAFTALIK");
  const [fpContactMethod, setFpContactMethod] = useState<string>("TELEFON");
  const [fpAvailability, setFpAvailability] = useState<string>("");
  const [fpNotes, setFpNotes] = useState<string>("");

  const handleSaveFamilyParticipation = () => {
    if (!studentId || !fpEventName.trim()) return;

    const familyParticipationData: FamilyParticipation = {
      id: crypto.randomUUID(),
      studentId,
      eventType: fpEventType as FamilyParticipation["eventType"],
      eventName: fpEventName,
      eventDate: fpEventDate,
      participationStatus: fpParticipationStatus as FamilyParticipation["participationStatus"],
      participants: fpParticipants ? fpParticipants.split(",").map(p => p.trim()).filter(Boolean) : undefined,
      engagementLevel: fpEngagementLevel as FamilyParticipation["engagementLevel"],
      communicationFrequency: fpCommunicationFreq as FamilyParticipation["communicationFrequency"],
      preferredContactMethod: fpContactMethod as FamilyParticipation["preferredContactMethod"],
      parentAvailability: fpAvailability || undefined,
      notes: fpNotes || undefined,
      recordedBy: "Sistem",
      recordedAt: new Date().toISOString(),
    };

    addFamilyParticipation(familyParticipationData);

    setFpEventName("");
    setFpParticipants("");
    setFpAvailability("");
    setFpNotes("");
    onUpdate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Aile Katılım Durumu
        </CardTitle>
        <CardDescription>
          Okul etkinlikleri ve görüşmelere katılım takibi
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Select value={fpEventType} onValueChange={setFpEventType}>
            <SelectTrigger>
              <SelectValue placeholder="Etkinlik Türü" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VELI_TOPLANTISI">Veli Toplantısı</SelectItem>
              <SelectItem value="OKUL_ETKİNLİĞİ">Okul Etkinliği</SelectItem>
              <SelectItem value="ÖĞRETMEN_GÖRÜŞMESİ">Öğretmen Görüşmesi</SelectItem>
              <SelectItem value="PERFORMANS_DEĞERLENDİRME">Performans Değerlendirme</SelectItem>
              <SelectItem value="DİĞER">Diğer</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Etkinlik Adı"
            value={fpEventName}
            onChange={(e) => setFpEventName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            type="date"
            placeholder="Etkinlik Tarihi"
            value={fpEventDate}
            onChange={(e) => setFpEventDate(e.target.value)}
          />
          <Select value={fpParticipationStatus} onValueChange={setFpParticipationStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Katılım Durumu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="KATILDI">Katıldı</SelectItem>
              <SelectItem value="KATILMADI">Katılmadı</SelectItem>
              <SelectItem value="GEÇ_KATILDI">Geç Katıldı</SelectItem>
              <SelectItem value="ERKEN_AYRILDI">Erken Ayrıldı</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Input
          placeholder="Katılan aile üyeleri (virgülle ayırın)"
          value={fpParticipants}
          onChange={(e) => setFpParticipants(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Select value={fpEngagementLevel} onValueChange={setFpEngagementLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Katılım Düzeyi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ÇOK_AKTİF">Çok Aktif</SelectItem>
              <SelectItem value="AKTİF">Aktif</SelectItem>
              <SelectItem value="PASİF">Pasif</SelectItem>
              <SelectItem value="İLGİSİZ">İlgisiz</SelectItem>
            </SelectContent>
          </Select>
          <Select value={fpCommunicationFreq} onValueChange={setFpCommunicationFreq}>
            <SelectTrigger>
              <SelectValue placeholder="İletişim Sıklığı" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GÜNLÜK">Günlük</SelectItem>
              <SelectItem value="HAFTALIK">Haftalık</SelectItem>
              <SelectItem value="AYLIK">Aylık</SelectItem>
              <SelectItem value="SADECE_GEREKENDE">Sadece Gerekende</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select value={fpContactMethod} onValueChange={setFpContactMethod}>
          <SelectTrigger>
            <SelectValue placeholder="Tercih Edilen İletişim Yöntemi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TELEFON">Telefon</SelectItem>
            <SelectItem value="EMAIL">E-mail</SelectItem>
            <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
            <SelectItem value="YÜZ_YÜZE">Yüz Yüze</SelectItem>
            <SelectItem value="OKUL_SISTEMI">Okul Sistemi</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Veli müsait olduğu zamanlar"
          value={fpAvailability}
          onChange={(e) => setFpAvailability(e.target.value)}
        />

        <Textarea
          placeholder="Notlar"
          value={fpNotes}
          onChange={(e) => setFpNotes(e.target.value)}
        />

        <Button className="w-full" onClick={handleSaveFamilyParticipation}>
          <Heart className="mr-2 h-4 w-4" />
          Katılım Kaydı Ekle
        </Button>

        <div className="space-y-3">
          <h4 className="font-medium">Katılım Geçmişi</h4>
          {familyParticipation.length === 0 && (
            <div className="text-sm text-muted-foreground">
              Henüz katılım kaydı yok.
            </div>
          )}
          {familyParticipation.map((participation) => (
            <div
              key={participation.id}
              className="border rounded-lg p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="font-medium">{participation.eventName}</div>
                <Badge variant="outline">{participation.eventType}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  {new Date(participation.eventDate).toLocaleDateString()}
                </div>
                <Badge
                  variant={participation.participationStatus === "KATILDI" ? "default" : "secondary"}
                >
                  {participation.participationStatus}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <strong>Katılım Düzeyi:</strong> {participation.engagementLevel}
                </div>
                <div>
                  <strong>İletişim:</strong> {participation.communicationFrequency}
                </div>
              </div>
              <div className="text-sm">
                <strong>Tercih Edilen Yöntem:</strong> {participation.preferredContactMethod}
              </div>
              {participation.participants && (
                <div className="text-sm text-muted-foreground">
                  <strong>Katılanlar:</strong> {participation.participants.join(", ")}
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                Kaydeden: {participation.recordedBy}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
