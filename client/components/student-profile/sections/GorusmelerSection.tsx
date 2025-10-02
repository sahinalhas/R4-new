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
import { CalendarDays } from "lucide-react";
import { MeetingNote, addNote } from "@/lib/storage";

interface GorusmelerSectionProps {
  studentId: string;
  notes: MeetingNote[];
  onUpdate: () => void;
}

export default function GorusmelerSection({ studentId, notes, onUpdate }: GorusmelerSectionProps) {
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 16));
  const [type, setType] = useState<MeetingNote["type"]>("Bireysel");
  const [note, setNote] = useState("");
  const [plan, setPlan] = useState("");

  const handleAddNote = async () => {
    if (!studentId || !note.trim()) return;
    await addNote({
      id: crypto.randomUUID(),
      studentId,
      date,
      type,
      note,
      plan,
    });
    setNote("");
    setPlan("");
    onUpdate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Görüşme Kayıtları</CardTitle>
        <CardDescription>
          Not ekleyin ve eylem planını takip edin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <Input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <Select
            value={type}
            onValueChange={(v) => setType(v as MeetingNote["type"])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tür" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bireysel">Bireysel</SelectItem>
              <SelectItem value="Grup">Grup</SelectItem>
              <SelectItem value="Veli">Veli</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAddNote}>
            <CalendarDays className="mr-2 h-4 w-4" /> Kaydı Ekle
          </Button>
        </div>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Görüşme notu"
        />
        <Input
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          placeholder="Eylem planı (opsiyonel)"
        />

        <div className="space-y-3">
          {notes.length === 0 && (
            <div className="text-sm text-muted-foreground">
              Henüz kayıt yok.
            </div>
          )}
          {notes.map((n) => (
            <div key={n.id} className="rounded-md border p-3">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{n.type}</Badge>{" "}
                  {new Date(n.date).toLocaleString()}
                </div>
                {n.plan && (
                  <span className="text-xs">Plan: {n.plan}</span>
                )}
              </div>
              <div className="mt-2 whitespace-pre-wrap text-sm">
                {n.note}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
