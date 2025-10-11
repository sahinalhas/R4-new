import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface StudentFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedClass: string;
  onClassChange: (value: string) => void;
  selectedGender: string;
  onGenderChange: (value: string) => void;
}

export function StudentFilters({
  searchQuery,
  onSearchChange,
  selectedClass,
  onClassChange,
  selectedGender,
  onGenderChange
}: StudentFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Öğrenci ara (No, Ad, Soyad)..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={selectedClass} onValueChange={onClassChange}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tum">Tüm Sınıflar</SelectItem>
          <SelectItem value="9">9. Sınıf</SelectItem>
          <SelectItem value="10">10. Sınıf</SelectItem>
          <SelectItem value="11">11. Sınıf</SelectItem>
          <SelectItem value="12">12. Sınıf</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedGender} onValueChange={onGenderChange}>
        <SelectTrigger className="w-full sm:w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tum">Tüm Cinsiyetler</SelectItem>
          <SelectItem value="K">Kız</SelectItem>
          <SelectItem value="E">Erkek</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
