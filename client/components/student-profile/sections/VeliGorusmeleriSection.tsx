import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Plus, Users, Calendar, Clock, MessageSquare, Info } from "lucide-react";
import { CounselingSession } from "@/components/counseling/types";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface VeliGorusmeleriSectionProps {
  studentId: string;
  onUpdate: () => void;
}

const sessionModeLabels: Record<string, string> = {
  "YÜZ_YÜZE": "Yüz Yüze",
  "yuz_yuze": "Yüz Yüze",
  "TELEFON": "Telefon",
  "telefon": "Telefon",
  "ONLINE": "Online",
  "online": "Online",
};

export default function VeliGorusmeleriSection({ studentId, onUpdate }: VeliGorusmeleriSectionProps) {
  const { data: allSessions = [], isLoading } = useQuery<CounselingSession[]>({
    queryKey: ['/api/counseling-sessions'],
    queryFn: async () => {
      const response = await fetch('/api/counseling-sessions');
      if (!response.ok) throw new Error('Görüşmeler yüklenemedi');
      return response.json();
    },
  });

  const parentMeetings = allSessions.filter(session => {
    const isParentMeeting = session.participantType === 'veli';
    const includesStudent = session.sessionType === 'individual' 
      ? session.student?.id === studentId
      : session.students?.some(s => s.id === studentId);
    return isParentMeeting && includesStudent;
  });

  const sortedMeetings = [...parentMeetings].sort((a, b) => {
    const dateA = new Date(`${a.sessionDate}T${a.entryTime}`);
    const dateB = new Date(`${b.sessionDate}T${b.entryTime}`);
    return dateB.getTime() - dateA.getTime();
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Veli görüşmeleri yükleniyor...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Veli Görüşmeleri Özeti
            </CardTitle>
            <CardDescription>
              Ana görüşmeler sisteminden alınan veli görüşme kayıtları
            </CardDescription>
          </div>
          <Button asChild variant="outline">
            <Link to="/gorusmeler">
              <Plus className="mr-2 h-4 w-4" />
              Yeni Görüşme Ekle
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Veli görüşmelerini yönetmek için{" "}
            <Link to="/gorusmeler" className="font-medium underline">
              Ana Görüşmeler
            </Link>{" "}
            sayfasına gidin.
          </AlertDescription>
        </Alert>

        {sortedMeetings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>Henüz veli görüşmesi kaydı yok</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="border rounded-lg p-4 space-y-3 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {format(new Date(meeting.sessionDate), "d MMMM yyyy", { locale: tr })}
                      </span>
                      <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                      <span className="text-sm text-muted-foreground">
                        {meeting.entryTime}
                        {meeting.exitTime && ` - ${meeting.exitTime}`}
                      </span>
                    </div>
                    {meeting.parentName && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{meeting.parentName}</span>
                        {meeting.parentRelationship && (
                          <Badge variant="outline" className="text-xs">
                            {meeting.parentRelationship}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {meeting.sessionMode && (
                      <Badge variant="secondary">
                        {sessionModeLabels[meeting.sessionMode] || meeting.sessionMode}
                      </Badge>
                    )}
                    <Badge variant={meeting.completed ? "default" : "outline"}>
                      {meeting.completed ? "Tamamlandı" : "Devam Ediyor"}
                    </Badge>
                  </div>
                </div>

                {meeting.topic && (
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Görüşme Konusu:</p>
                      <p className="text-sm text-muted-foreground">{meeting.topic}</p>
                    </div>
                  </div>
                )}

                {meeting.sessionDetails && (
                  <div className="text-sm">
                    <p className="font-medium mb-1">Görüşme Detayları:</p>
                    <p className="text-muted-foreground">{meeting.sessionDetails}</p>
                  </div>
                )}

                {meeting.detailedNotes && (
                  <div className="text-sm bg-muted/50 p-3 rounded-md">
                    <p className="font-medium mb-1">Notlar:</p>
                    <p className="text-muted-foreground whitespace-pre-wrap">{meeting.detailedNotes}</p>
                  </div>
                )}

                {meeting.sessionLocation && (
                  <div className="text-xs text-muted-foreground">
                    📍 {meeting.sessionLocation}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
