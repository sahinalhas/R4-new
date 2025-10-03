import { Download, Eye, Filter, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type { CounselingSession } from "./types";
import { calculateSessionDuration } from "./utils/sessionHelpers";

interface SessionsTableProps {
  sessions: CounselingSession[];
  onExport: () => void;
}

export default function SessionsTable({ sessions, onExport }: SessionsTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Görüşme Kayıtları</CardTitle>
            <CardDescription>Tüm rehberlik görüşmeleri</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtrele
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={onExport}>
              <Download className="h-4 w-4" />
              Excel İndir
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Eye className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">Henüz kayıt bulunmuyor</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-sm font-medium text-muted-foreground">
                  <th className="text-left px-4 py-3">Tarih</th>
                  <th className="text-left px-4 py-3">Başlangıç</th>
                  <th className="text-left px-4 py-3">Bitiş</th>
                  <th className="text-left px-4 py-3">Öğrenci(ler)</th>
                  <th className="text-left px-4 py-3">Tip</th>
                  <th className="text-left px-4 py-3">Konu</th>
                  <th className="text-left px-4 py-3">Süre</th>
                  <th className="text-left px-4 py-3">Durum</th>
                  <th className="text-left px-4 py-3">Notlar</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => {
                  const duration = calculateSessionDuration(session.entryTime, session.exitTime || '');
                  const studentNames = session.sessionType === 'individual'
                    ? session.student?.name
                    : session.students?.map(s => s.name).join(', ') || session.groupName;

                  return (
                    <tr key={session.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 text-sm">
                        {new Date(session.sessionDate).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-4 py-3 text-sm">{session.entryTime}</td>
                      <td className="px-4 py-3 text-sm">{session.exitTime || '-'}</td>
                      <td className="px-4 py-3 text-sm font-medium">{studentNames}</td>
                      <td className="px-4 py-3">
                        <Badge variant={session.sessionType === 'individual' ? 'default' : 'secondary'} className="text-xs">
                          {session.sessionType === 'individual' ? 'Bireysel' : 'Grup'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm max-w-xs truncate">{session.topic}</td>
                      <td className="px-4 py-3 text-sm">{duration ? `${duration} dk` : '-'}</td>
                      <td className="px-4 py-3">
                        {session.completed ? (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Tamamlandı
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            <Clock className="h-3 w-3 mr-1" />
                            Devam Ediyor
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 max-w-md">
                        <p className="text-xs text-muted-foreground truncate">
                          {session.detailedNotes || session.sessionDetails || '-'}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
