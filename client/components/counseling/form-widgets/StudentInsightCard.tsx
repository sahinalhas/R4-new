import { MessageSquare, Calendar, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface StudentInsightCardProps {
  studentName: string;
  className: string;
  lastSession?: {
    date: string;
    topic: string;
  };
  totalSessions?: number;
  riskLevel?: 'Düşük' | 'Orta' | 'Yüksek' | 'Kritik';
}

export default function StudentInsightCard({ 
  studentName, 
  className, 
  lastSession,
  totalSessions = 0,
  riskLevel
}: StudentInsightCardProps) {
  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case 'Kritik': return 'destructive';
      case 'Yüksek': return 'destructive';
      case 'Orta': return 'default';
      case 'Düşük': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <span className="text-primary">👤</span>
          Öğrenci Bilgileri
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="font-semibold text-lg">{studentName}</p>
          <p className="text-sm text-muted-foreground">{className}</p>
        </div>

        {riskLevel && (
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-muted-foreground">Risk Seviyesi:</span>
            <Badge variant={getRiskColor(riskLevel)}>{riskLevel}</Badge>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Toplam Görüşme:</span>
          <span className="font-medium">{totalSessions}</span>
        </div>

        {lastSession && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-1">Son Görüşme</p>
            <div className="flex items-start gap-2">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">{lastSession.topic}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(lastSession.date), 'dd MMMM yyyy', { locale: tr })}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
