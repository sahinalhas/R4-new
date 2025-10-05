import { CheckCircle2, Calendar, Clock, User, Users, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { CounselingSession } from "./types";
import { calculateSessionDuration } from "./utils/sessionHelpers";

interface CompletedSessionsListProps {
  sessions: CounselingSession[];
  onAddOutcome?: (session: CounselingSession) => void;
}

function getParticipantInfo(session: CounselingSession): string {
  if (session.participantType === "veli" && session.parentName) {
    return `Veli: ${session.parentName} (${session.parentRelationship || 'Veli'})`;
  }
  if (session.participantType === "öğretmen" && session.teacherName) {
    return `Öğretmen: ${session.teacherName}${session.teacherBranch ? ` - ${session.teacherBranch}` : ''}`;
  }
  if (session.participantType === "diğer" && session.otherParticipantDescription) {
    return `Katılımcı: ${session.otherParticipantDescription}`;
  }
  return '';
}

export default function CompletedSessionsList({ sessions, onAddOutcome }: CompletedSessionsListProps) {
  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">Henüz tamamlanan görüşme yok</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {sessions.map((session) => {
        const duration = calculateSessionDuration(session.entryTime, session.exitTime || '');
        const participantInfo = getParticipantInfo(session);
        
        return (
          <Card key={session.id} className="hover:shadow-sm transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    {session.sessionType === 'individual' ? (
                      <User className="h-5 w-5 text-green-600" />
                    ) : (
                      <Users className="h-5 w-5 text-green-600" />
                    )}
                    <CardTitle className="text-lg">
                      {session.sessionType === 'individual' 
                        ? session.student?.name 
                        : session.groupName || 'Grup Görüşmesi'}
                    </CardTitle>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Tamamlandı
                    </Badge>
                  </div>
                  {session.sessionType === 'group' && session.students && (
                    <p className="text-sm text-muted-foreground">
                      {session.students.map(s => s.name).join(', ')}
                    </p>
                  )}
                  {participantInfo && (
                    <p className="text-sm text-muted-foreground italic">
                      {participantInfo}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {duration && (
                    <Badge variant="secondary" className="text-sm">
                      {duration} dakika
                    </Badge>
                  )}
                  {onAddOutcome && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAddOutcome(session)}
                      className="gap-1"
                    >
                      <FileText className="h-4 w-4" />
                      Sonuç Ekle
                    </Button>
                  )}
              </div>
              <CardDescription className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(session.sessionDate).toLocaleDateString('tr-TR')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {session.entryTime} - {session.exitTime}
                </span>
                <span>•</span>
                <span>{session.topic}</span>
              </CardDescription>
            </CardHeader>
            {session.detailedNotes && (
              <CardContent>
                <p className="text-sm text-muted-foreground">{session.detailedNotes}</p>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
