import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, GraduationCap, ShieldAlert } from "lucide-react";
import { Student } from "@/lib/storage";
import { RiskPill } from "./RiskPill";

interface StudentHeaderProps {
  student: Student;
}

export function StudentHeader({ student }: StudentHeaderProps) {
  const fullName = `${student.ad} ${student.soyad}`;

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <User className="h-6 w-6" /> {fullName}
        </CardTitle>
        <CardDescription>
          <span className="flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1">
              <GraduationCap className="h-4 w-4" /> Sınıf: {student.sinif}
            </span>
            <span>Cinsiyet: {student.cinsiyet}</span>
            <span className="inline-flex items-center gap-1">
              <ShieldAlert className="h-4 w-4" /> Risk:{" "}
              <RiskPill risk={student.risk} />
            </span>
          </span>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
