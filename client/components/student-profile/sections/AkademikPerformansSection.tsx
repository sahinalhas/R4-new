import { AcademicRecord } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface AkademikPerformansSectionProps {
  studentId: string;
  academicRecords: AcademicRecord[];
  onUpdate: () => void;
}

export default function AkademikPerformansSection({ 
  studentId, 
  academicRecords, 
  onUpdate 
}: AkademikPerformansSectionProps) {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Akademik Performans
          </CardTitle>
          <CardDescription>Detaylı akademik analiz ve raporlama</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground text-center py-8">
            Akademik performans verileri burada gösterilecektir.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
