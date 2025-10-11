import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Student } from "@/lib/storage";

interface StudentRowProps {
  student: Student;
  onEditClick: (student: Student) => void;
  onDeleteClick: (student: Student) => void;
}

function StudentRowComponent({ student, onEditClick, onDeleteClick }: StudentRowProps) {
  const getRiskBadgeVariant = (risk?: string) => {
    switch (risk) {
      case "Yüksek":
        return "destructive";
      case "Orta":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <TableRow className="hover:bg-muted/50 transition-colors group">
      <TableCell className="font-medium">{student.id}</TableCell>
      <TableCell className="font-medium">{student.ad}</TableCell>
      <TableCell>{student.soyad}</TableCell>
      <TableCell>
        <Badge variant="outline" className="font-normal">
          {student.sinif}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="font-normal">
          {student.cinsiyet === "E" ? "Erkek" : "Kız"}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={getRiskBadgeVariant(student.risk)} className="font-normal">
          {student.risk || "Düşük"}
        </Badge>
      </TableCell>
      <TableCell>
        <Button asChild size="sm" variant="ghost" className="gap-1.5">
          <Link to={`/ogrenci/${student.id}`}>
            <Eye className="h-3.5 w-3.5" />
            Görüntüle
          </Link>
        </Button>
      </TableCell>
      <TableCell>
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => onEditClick(student)}
            className="h-8 w-8 p-0"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => onDeleteClick(student)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export const StudentRow = memo(StudentRowComponent);
StudentRow.displayName = 'StudentRow';
