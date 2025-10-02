import { CoachingRecommendation, generateAutoRecommendations } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

interface DijitalCoclukSectionProps {
  studentId: string;
  coachingRecommendations: CoachingRecommendation[];
  onUpdate: () => void;
}

export default function DijitalCoclukSection({ 
  studentId, 
  coachingRecommendations, 
  onUpdate 
}: DijitalCoclukSectionProps) {
  const handleGenerate = () => {
    generateAutoRecommendations(studentId);
    onUpdate();
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Dijital Koçluk Önerileri
          </CardTitle>
          <CardDescription>AI destekli kişiselleştirilmiş öneriler</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleGenerate}
            className="w-full"
          >
            <Zap className="mr-2 h-4 w-4" />
            Yeni Öneriler Oluştur
          </Button>

          <div className="space-y-3">
            {coachingRecommendations.map(rec => (
              <div key={rec.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={rec.priority === "Yüksek" ? "destructive" : 
                                 rec.priority === "Orta" ? "default" : "secondary"}>
                    {rec.priority} Öncelik
                  </Badge>
                  <Badge variant="outline">{rec.type}</Badge>
                </div>
                <h4 className="font-medium">{rec.title}</h4>
                <p className="text-sm text-muted-foreground">{rec.description}</p>
                {rec.description && (
                  <div className="mt-2">
                    <div className="text-sm font-medium mb-1">Detaylar:</div>
                    <p className="text-sm">{rec.description}</p>
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  {new Date(rec.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
