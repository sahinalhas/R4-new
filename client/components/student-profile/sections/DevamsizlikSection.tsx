import { useState } from "react";
import { AttendanceRecord, addAttendance } from "@/lib/storage";
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

interface DevamsizlikSectionProps {
  studentId: string;
  attendanceRecords: AttendanceRecord[];
  onUpdate: () => void;
}

export default function DevamsizlikSection({ 
  studentId, 
  attendanceRecords, 
  onUpdate 
}: DevamsizlikSectionProps) {
  const [attDate, setAttDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [attStatus, setAttStatus] = useState<string>("Var");
  const [attReason, setAttReason] = useState<string>("");

  const handleSave = async () => {
    if (!studentId) return;
    const attendanceRecord: AttendanceRecord = {
      id: crypto.randomUUID(),
      studentId: studentId,
      date: attDate,
      status: attStatus as any,
      reason: attReason || undefined,
    };
    await addAttendance(attendanceRecord);
    onUpdate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Devamsızlık</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            type="date"
            value={attDate}
            onChange={(e) => setAttDate(e.target.value)}
          />
          <Select
            value={attStatus}
            onValueChange={setAttStatus}
          >
            <SelectTrigger>
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Var">Var</SelectItem>
              <SelectItem value="Devamsız">Devamsız</SelectItem>
              <SelectItem value="Geç">Geç Kaldı</SelectItem>
              <SelectItem value="İzinli">İzinli</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Sebep (opsiyonel)"
            value={attReason}
            onChange={(e) => setAttReason(e.target.value)}
          />
          <Button onClick={handleSave}>
            Kaydet
          </Button>
        </div>
        <div className="grid gap-2">
          {attendanceRecords.length === 0 && (
            <div className="text-sm text-muted-foreground">Kayıt yok.</div>
          )}
          {attendanceRecords.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between rounded border p-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {new Date(a.date).toLocaleDateString()}
                </Badge>
                <span>{a.status}</span>
              </div>
              {a.reason && (
                <span className="text-xs text-muted-foreground">{a.reason}</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
