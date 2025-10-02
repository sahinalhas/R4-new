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
import { Users } from "lucide-react";
import { ParentMeeting, addParentMeeting } from "@/lib/storage";

interface VeliGorusmeleriSectionProps {
  studentId: string;
  parentMeetings: ParentMeeting[];
  onUpdate: () => void;
}

export default function VeliGorusmeleriSection({ studentId, parentMeetings, onUpdate }: VeliGorusmeleriSectionProps) {
  const [pmDate, setPmDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [pmTime, setPmTime] = useState<string>("14:00");
  const [pmType, setPmType] = useState<string>("YÜZ_YÜZE");
  const [pmParticipants, setPmParticipants] = useState<string>("");
  const [pmTopics, setPmTopics] = useState<string>("");
  const [pmConcerns, setPmConcerns] = useState<string>("");
  const [pmDecisions, setPmDecisions] = useState<string>("");
  const [pmActionPlan, setPmActionPlan] = useState<string>("");
  const [pmNextDate, setPmNextDate] = useState<string>("");
  const [pmSatisfaction, setPmSatisfaction] = useState<string>("");

  const handleSaveParentMeeting = () => {
    if (!studentId || !pmParticipants.trim()) return;

    const parentMeeting: ParentMeeting = {
      id: crypto.randomUUID(),
      studentId,
      date: pmDate,
      time: pmTime,
      type: pmType as ParentMeeting["type"],
      participants: pmParticipants.split(",").map(p => p.trim()).filter(Boolean),
      mainTopics: pmTopics.split(",").map(t => t.trim()).filter(Boolean),
      concerns: pmConcerns || undefined,
      decisions: pmDecisions || undefined,
      actionPlan: pmActionPlan || undefined,
      nextMeetingDate: pmNextDate || undefined,
      parentSatisfaction: pmSatisfaction ? Number(pmSatisfaction) : undefined,
      followUpRequired: !!pmNextDate || !!pmActionPlan,
      notes: undefined,
      createdBy: "Sistem",
      createdAt: new Date().toISOString(),
    };

    addParentMeeting(parentMeeting);

    setPmParticipants("");
    setPmTopics("");
    setPmConcerns("");
    setPmDecisions("");
    setPmActionPlan("");
    setPmNextDate("");
    setPmSatisfaction("");
    onUpdate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Veli Görüşme Kayıtları
        </CardTitle>
        <CardDescription>
          Detaylı veli görüşme kayıtları ve takip planları
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            type="date"
            placeholder="Görüşme Tarihi"
            value={pmDate}
            onChange={(e) => setPmDate(e.target.value)}
          />
          <Input
            type="time"
            placeholder="Görüşme Saati"
            value={pmTime}
            onChange={(e) => setPmTime(e.target.value)}
          />
          <Select value={pmType} onValueChange={setPmType}>
            <SelectTrigger>
              <SelectValue placeholder="Görüşme Türü" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="YÜZ_YÜZE">Yüz Yüze</SelectItem>
              <SelectItem value="TELEFON">Telefon</SelectItem>
              <SelectItem value="ONLINE">Online</SelectItem>
              <SelectItem value="EV_ZİYARETİ">Ev Ziyareti</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Katılımcılar (virgülle ayırın)"
            value={pmParticipants}
            onChange={(e) => setPmParticipants(e.target.value)}
          />
        </div>

        <Textarea
          placeholder="Ana konular (virgülle ayırın)"
          value={pmTopics}
          onChange={(e) => setPmTopics(e.target.value)}
        />

        <Textarea
          placeholder="Endişeler ve sorunlar"
          value={pmConcerns}
          onChange={(e) => setPmConcerns(e.target.value)}
        />

        <Textarea
          placeholder="Alınan kararlar"
          value={pmDecisions}
          onChange={(e) => setPmDecisions(e.target.value)}
        />

        <Textarea
          placeholder="Eylem planı"
          value={pmActionPlan}
          onChange={(e) => setPmActionPlan(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            type="date"
            placeholder="Sonraki görüşme tarihi"
            value={pmNextDate}
            onChange={(e) => setPmNextDate(e.target.value)}
          />
          <Select value={pmSatisfaction} onValueChange={setPmSatisfaction}>
            <SelectTrigger>
              <SelectValue placeholder="Veli Memnuniyeti (1-10)" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full" onClick={handleSaveParentMeeting}>
          <Users className="mr-2 h-4 w-4" />
          Veli Görüşmesi Kaydet
        </Button>

        <div className="space-y-3">
          <h4 className="font-medium">Görüşme Geçmişi</h4>
          {parentMeetings.length === 0 && (
            <div className="text-sm text-muted-foreground">
              Henüz veli görüşmesi kaydı yok.
            </div>
          )}
          {parentMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="border rounded-lg p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  {new Date(meeting.date).toLocaleDateString()} - {meeting.time}
                </div>
                <Badge variant="outline">{meeting.type}</Badge>
              </div>
              <div className="text-sm">
                <strong>Katılımcılar:</strong> {meeting.participants.join(", ")}
              </div>
              <div className="text-sm">
                <strong>Ana Konular:</strong> {meeting.mainTopics.join(", ")}
              </div>
              {meeting.concerns && (
                <div className="text-sm text-muted-foreground">
                  <strong>Endişeler:</strong> {meeting.concerns}
                </div>
              )}
              {meeting.actionPlan && (
                <div className="text-sm text-muted-foreground">
                  <strong>Eylem Planı:</strong> {meeting.actionPlan}
                </div>
              )}
              {meeting.parentSatisfaction && (
                <div className="text-sm">
                  <Badge variant="secondary">
                    Memnuniyet: {meeting.parentSatisfaction}/10
                  </Badge>
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                Kaydeden: {meeting.createdBy}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
