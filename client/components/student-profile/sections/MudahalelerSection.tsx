import { useState } from "react";
import { Intervention, addIntervention } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface MudahalelerSectionProps {
  studentId: string;
  interventions: Intervention[];
  onUpdate: () => void;
}

export default function MudahalelerSection({ 
  studentId, 
  interventions, 
  onUpdate 
}: MudahalelerSectionProps) {
  const [interventionDate, setInterventionDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [interventionTitle, setInterventionTitle] = useState<string>("");
  const [interventionStatus, setInterventionStatus] = useState<string>("Planlandı");

  const handleSave = async () => {
    if (!studentId || !interventionTitle) return;
    const intervention: Intervention = {
      id: crypto.randomUUID(),
      studentId: studentId,
      title: interventionTitle,
      status: interventionStatus as any,
      date: interventionDate,
    };
    await addIntervention(intervention);
    setInterventionTitle("");
    onUpdate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Müdahaleler</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            type="date"
            value={interventionDate}
            onChange={(e) => setInterventionDate(e.target.value)}
          />
          <Input
            placeholder="Müdahale Başlığı"
            value={interventionTitle}
            onChange={(e) => setInterventionTitle(e.target.value)}
          />
          <Select
            value={interventionStatus}
            onValueChange={setInterventionStatus}
          >
            <SelectTrigger>
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Planlandı">Planlandı</SelectItem>
              <SelectItem value="Devam Ediyor">Devam Ediyor</SelectItem>
              <SelectItem value="Tamamlandı">Tamamlandı</SelectItem>
              <SelectItem value="İptal Edildi">İptal Edildi</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSave}>
            Kaydet
          </Button>
        </div>
        
        <div className="space-y-2">
          {interventions.map(intervention => (
            <div key={intervention.id} className="border rounded p-3 space-y-1">
              <div className="flex items-center justify-between">
                <div className="font-medium">{intervention.title}</div>
                <Badge variant={intervention.status === "Tamamlandı" ? "default" : 
                               intervention.status === "Devam" ? "secondary" : "outline"}>
                  {intervention.status}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Tarih: {new Date(intervention.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
