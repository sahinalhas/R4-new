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
import { Home } from "lucide-react";
import { HomeVisit, addHomeVisit } from "@/lib/storage";

interface EvZiyaretleriSectionProps {
  studentId: string;
  homeVisits: HomeVisit[];
  onUpdate: () => void;
}

export default function EvZiyaretleriSection({ studentId, homeVisits, onUpdate }: EvZiyaretleriSectionProps) {
  const [hvDate, setHvDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [hvTime, setHvTime] = useState<string>("14:00");
  const [hvDuration, setHvDuration] = useState<string>("");
  const [hvVisitors, setHvVisitors] = useState<string>("");
  const [hvFamilyPresent, setHvFamilyPresent] = useState<string>("");
  const [hvEnvironment, setHvEnvironment] = useState<string>("UYGUN");
  const [hvInteraction, setHvInteraction] = useState<string>("OLUMLU");
  const [hvObservations, setHvObservations] = useState<string>("");
  const [hvRecommendations, setHvRecommendations] = useState<string>("");
  const [hvConcerns, setHvConcerns] = useState<string>("");
  const [hvResources, setHvResources] = useState<string>("");
  const [hvNextVisit, setHvNextVisit] = useState<string>("");

  const handleSaveHomeVisit = () => {
    if (!studentId || !hvVisitors.trim() || !hvObservations.trim()) return;

    const homeVisit: HomeVisit = {
      id: crypto.randomUUID(),
      studentId,
      date: hvDate,
      time: hvTime,
      visitDuration: Number(hvDuration) || 60,
      visitors: hvVisitors.split(",").map(v => v.trim()).filter(Boolean),
      familyPresent: hvFamilyPresent.split(",").map(f => f.trim()).filter(Boolean),
      homeEnvironment: hvEnvironment as HomeVisit["homeEnvironment"],
      familyInteraction: hvInteraction as HomeVisit["familyInteraction"],
      observations: hvObservations,
      recommendations: hvRecommendations,
      concerns: hvConcerns || undefined,
      resources: hvResources || undefined,
      followUpActions: undefined,
      nextVisitPlanned: hvNextVisit || undefined,
      notes: undefined,
      createdBy: "Sistem",
      createdAt: new Date().toISOString(),
    };

    addHomeVisit(homeVisit);

    setHvDuration("");
    setHvVisitors("");
    setHvFamilyPresent("");
    setHvObservations("");
    setHvRecommendations("");
    setHvConcerns("");
    setHvResources("");
    setHvNextVisit("");
    onUpdate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Ev Ziyareti Kayıtları
        </CardTitle>
        <CardDescription>
          Ev ziyareti gözlemleri ve önerileri
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            type="date"
            placeholder="Ziyaret Tarihi"
            value={hvDate}
            onChange={(e) => setHvDate(e.target.value)}
          />
          <Input
            type="time"
            placeholder="Ziyaret Saati"
            value={hvTime}
            onChange={(e) => setHvTime(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Süre (dakika)"
            value={hvDuration}
            onChange={(e) => setHvDuration(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            placeholder="Ziyaretçiler (virgülle ayırın)"
            value={hvVisitors}
            onChange={(e) => setHvVisitors(e.target.value)}
          />
          <Input
            placeholder="Evde bulunanlar (virgülle ayırın)"
            value={hvFamilyPresent}
            onChange={(e) => setHvFamilyPresent(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Select value={hvEnvironment} onValueChange={setHvEnvironment}>
            <SelectTrigger>
              <SelectValue placeholder="Ev Ortamı" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UYGUN">Uygun</SelectItem>
              <SelectItem value="ORTA">Orta</SelectItem>
              <SelectItem value="ZOR_KOŞULLAR">Zor Koşullar</SelectItem>
              <SelectItem value="DEĞERLENDİRİLEMEDİ">Değerlendirilemedi</SelectItem>
            </SelectContent>
          </Select>
          <Select value={hvInteraction} onValueChange={setHvInteraction}>
            <SelectTrigger>
              <SelectValue placeholder="Aile Etkileşimi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OLUMLU">Olumlu</SelectItem>
              <SelectItem value="NORMAL">Normal</SelectItem>
              <SelectItem value="GERGİN">Gergin</SelectItem>
              <SelectItem value="İŞBİRLİKSİZ">İşbirliksiz</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Textarea
          placeholder="Gözlemler"
          value={hvObservations}
          onChange={(e) => setHvObservations(e.target.value)}
        />

        <Textarea
          placeholder="Öneriler"
          value={hvRecommendations}
          onChange={(e) => setHvRecommendations(e.target.value)}
        />

        <Textarea
          placeholder="Tespit edilen sorunlar"
          value={hvConcerns}
          onChange={(e) => setHvConcerns(e.target.value)}
        />

        <Textarea
          placeholder="Sağlanan kaynaklar/yardımlar"
          value={hvResources}
          onChange={(e) => setHvResources(e.target.value)}
        />

        <Input
          type="date"
          placeholder="Sonraki ziyaret tarihi"
          value={hvNextVisit}
          onChange={(e) => setHvNextVisit(e.target.value)}
        />

        <Button className="w-full" onClick={handleSaveHomeVisit}>
          <Home className="mr-2 h-4 w-4" />
          Ev Ziyareti Kaydet
        </Button>

        <div className="space-y-3">
          <h4 className="font-medium">Ziyaret Geçmişi</h4>
          {homeVisits.length === 0 && (
            <div className="text-sm text-muted-foreground">
              Henüz ev ziyareti kaydı yok.
            </div>
          )}
          {homeVisits.map((visit) => (
            <div
              key={visit.id}
              className="border rounded-lg p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  {new Date(visit.date).toLocaleDateString()} - {visit.time}
                </div>
                <Badge variant="outline">{visit.visitDuration} dk</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <strong>Ev Ortamı:</strong> {visit.homeEnvironment}
                </div>
                <div>
                  <strong>Aile Etkileşimi:</strong> {visit.familyInteraction}
                </div>
              </div>
              <div className="text-sm">
                <strong>Ziyaretçiler:</strong> {visit.visitors.join(", ")}
              </div>
              <div className="text-sm text-muted-foreground">
                <strong>Gözlemler:</strong> {visit.observations}
              </div>
              <div className="text-sm text-muted-foreground">
                <strong>Öneriler:</strong> {visit.recommendations}
              </div>
              <div className="text-xs text-muted-foreground">
                Kaydeden: {visit.createdBy}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
