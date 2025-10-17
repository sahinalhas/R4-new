import { useEffect, useMemo, useState, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Plus, Trash2, Pencil, Search, Users, GraduationCap, Filter, Download, Eye, UserPlus, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Student, loadStudents, saveStudents, refreshStudentsFromAPI, upsertStudent } from "@/lib/storage";
import { frontendToBackend } from "@/lib/types/student.types";
import { apiClient } from "@/lib/api/api-client";
import { STUDENT_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type { ApiResponse } from "@/lib/types/api-types";
import { toast } from "sonner";

function useDebounced<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const StudentRow = memo(({ 
  student, 
  onEditClick, 
  onDeleteClick 
}: { 
  student: Student; 
  onEditClick: (s: Student) => void; 
  onDeleteClick: (s: Student) => void;
}) => {
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
});

StudentRow.displayName = 'StudentRow';

type SortColumn = 'id' | 'ad' | 'soyad' | 'sinif' | 'cinsiyet' | 'risk';
type SortDirection = 'asc' | 'desc' | null;

export default function Students() {
  const [q, setQ] = useState("");
  const debouncedQ = useDebounced(q, 300);
  const [sinif, setSinif] = useState<string>("tum");
  const [cinsiyet, setCinsiyet] = useState<string>("tum");
  const [students, setStudents] = useState<Student[]>([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [confirmationName, setConfirmationName] = useState("");
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  useEffect(() => {
    // Load initial data from cache/localStorage first
    setStudents(loadStudents());
    
    // Listen for API updates (loadStudents() already triggers API fetch)
    const handleStudentsUpdated = () => {
      setStudents(loadStudents());
    };
    
    window.addEventListener('studentsUpdated', handleStudentsUpdated);
    
    // Cleanup
    return () => {
      window.removeEventListener('studentsUpdated', handleStudentsUpdated);
    };
  }, []);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const list = useMemo(() => {
    let filtered = students.filter((s) => {
      const matchesQ = `${s.id} ${s.ad} ${s.soyad}`
        .toLowerCase()
        .includes(debouncedQ.toLowerCase());
      const matchesSinif = sinif === "tum" || s.sinif.startsWith(sinif);
      const matchesC =
        cinsiyet === "tum" || s.cinsiyet === (cinsiyet as "K" | "E");
      return matchesQ && matchesSinif && matchesC;
    });

    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aVal: string | number = a[sortColumn] || '';
        let bVal: string | number = b[sortColumn] || '';

        // Numeric sort for 'id'
        if (sortColumn === 'id') {
          aVal = parseInt(a.id) || 0;
          bVal = parseInt(b.id) || 0;
        } else {
          // String comparison for other fields
          aVal = String(aVal).toLowerCase();
          bVal = String(bVal).toLowerCase();
        }

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [debouncedQ, sinif, cinsiyet, students, sortColumn, sortDirection]);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<Student>({
    defaultValues: {
      id: "",
      ad: "",
      soyad: "",
      sinif: "9/A",
      cinsiyet: "K",
      risk: "Düşük",
    },
  });

  const onCreate = async (data: Student) => {
    const id = (data.id || "").trim();
    if (!id) {
      alert("Öğrenci numarası zorunludur.");
      return;
    }
    if (!/^\d+$/.test(id)) {
      alert("Öğrenci numarası sadece rakamlardan oluşmalıdır.");
      return;
    }
    if (students.some((s) => s.id === id)) {
      alert("Bu öğrenci numarası zaten kayıtlı.");
      return;
    }
    
    const newStudent = { ...data, id };
    
    try {
      // Update local state immediately for responsive UI
      setStudents((prev) => [newStudent, ...prev]);
      
      // Save to API - wait for confirmation
      await upsertStudent(newStudent);
      
      reset();
      setOpen(false);
    } catch (error) {
      // Revert local state if API save failed
      setStudents((prev) => prev.filter((s) => s.id !== id));
      alert("Öğrenci kaydedilemedi. Lütfen tekrar deneyin.");
      console.error('Failed to save student:', error);
    }
  };

  const onEditClick = (student: Student) => {
    setStudentToEdit(student);
    setValue("id", student.id);
    setValue("ad", student.ad);
    setValue("soyad", student.soyad);
    setValue("sinif", student.sinif);
    setValue("cinsiyet", student.cinsiyet);
    setValue("risk", student.risk || "Düşük");
    setEditOpen(true);
  };

  const onUpdate = async (data: Student) => {
    if (!studentToEdit) return;
    
    const id = (data.id || "").trim();
    if (!id) {
      alert("Öğrenci numarası zorunludur.");
      return;
    }
    if (!/^\d+$/.test(id)) {
      alert("Öğrenci numarası sadece rakamlardan oluşmalıdır.");
      return;
    }
    
    // Check if ID changed and if new ID already exists
    if (id !== studentToEdit.id && students.some((s) => s.id === id)) {
      alert("Bu öğrenci numarası zaten kayıtlı.");
      return;
    }
    
    const updatedStudent = { ...data, id };
    
    try {
      // Update local state immediately for responsive UI
      setStudents((prev) => prev.map((s) => s.id === studentToEdit.id ? updatedStudent : s));
      
      // Save to API - wait for confirmation
      await upsertStudent(updatedStudent);
      
      reset();
      setEditOpen(false);
      setStudentToEdit(null);
      
      // Trigger update event to sync other components
      window.dispatchEvent(new CustomEvent('studentsUpdated'));
    } catch (error) {
      // Revert local state if API save failed
      setStudents((prev) => prev.map((s) => s.id === updatedStudent.id ? studentToEdit : s));
      alert("Öğrenci güncellenemedi. Lütfen tekrar deneyin.");
      console.error('Failed to update student:', error);
    }
  };

  const onDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setConfirmationName("");
    setDeleteDialogOpen(true);
  };

  const onDeleteConfirm = async () => {
    if (!studentToDelete) return;
    
    const expectedName = `${studentToDelete.ad} ${studentToDelete.soyad}`.trim();
    if (confirmationName.trim() !== expectedName) {
      alert("Öğrencinin tam adını doğru yazmalısınız!");
      return;
    }

    try {
      const response = await fetch(STUDENT_ENDPOINTS.BY_ID(studentToDelete.id), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmationName: expectedName })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setStudents(prev => prev.filter(s => s.id !== studentToDelete.id));
        setDeleteDialogOpen(false);
        setStudentToDelete(null);
        setConfirmationName("");
        toast.success(`${expectedName} başarıyla silindi.`);
      } else {
        toast.error(result.error || "Silme işlemi başarısız oldu.");
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Silme işlemi sırasında hata oluştu.");
    }
  };

  const normalize = (s?: string) => (s || "").toString().trim();
  const slug = (s?: string) =>
    normalize(s)
      .toLowerCase()
      .replaceAll("ı", "i")
      .replaceAll("İ", "i")
      .replaceAll("ç", "c")
      .replaceAll("Ç", "c")
      .replaceAll("ö", "o")
      .replaceAll("Ö", "o")
      .replaceAll("ğ", "g")
      .replaceAll("Ğ", "g")
      .replaceAll("ş", "s")
      .replaceAll("Ş", "s")
      .replaceAll("ü", "u")
      .replaceAll("Ü", "u")
      .replace(/[^a-z0-9]+/g, "");

  const importSheet = async (file: File) => {
    try {
      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert("Dosya boyutu çok büyük. Maksimum 5MB dosya yükleyebilirsiniz.");
        return;
      }

      // Validate file type
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!ext || !['xlsx', 'xls', 'csv'].includes(ext)) {
        alert("Desteklenmeyen dosya formatı. Sadece Excel (.xlsx, .xls) ve CSV (.csv) dosyaları desteklenmektedir.");
        return;
      }

      const isCsv = ext === "csv";
      let data: ArrayBuffer | Uint8Array;
      
      if (isCsv) {
        const buffer = await file.arrayBuffer();
        let decodedText: string;
        
        try {
          decodedText = new TextDecoder('utf-8', { fatal: true }).decode(buffer);
        } catch (utfError) {
          console.log('UTF-8 decode failed, trying Windows-1254 for Turkish characters');
          decodedText = new TextDecoder('windows-1254').decode(buffer);
        }
        
        data = new TextEncoder().encode(decodedText);
      } else {
        data = await file.arrayBuffer();
      }
      
      let wb, ws, rows;
      try {
        wb = XLSX.read(data, { type: "array", codepage: 65001 });
      } catch (parseError) {
        console.error('Error parsing file:', parseError);
        alert("Dosya okunamadı. Dosyanın bozuk olmadığından veya doğru formatta olduğundan emin olun.");
        return;
      }
      
      if (!wb.SheetNames || wb.SheetNames.length === 0) {
        alert("Dosyada geçerli bir sayfa bulunamadı.");
        return;
      }

      try {
        ws = wb.Sheets[wb.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false }) as unknown[][];
      } catch (conversionError) {
        console.error('Error converting sheet to JSON:', conversionError);
        alert("Dosya içeriği işlenirken hata oluştu. Dosya formatını kontrol edin.");
        return;
      }
      
      if (!rows.length) {
        alert("Dosya boş veya geçerli veri içermiyor.");
        return;
      }

      // Validate maximum rows (prevent excessive memory usage)
      if (rows.length > 10000) {
        alert("Dosyada çok fazla satır var. Maksimum 10.000 satır desteklenmektedir.");
        return;
      }

      const header = rows[0].map((h) => slug(String(h)));
      const idx = (keys: string[]) => header.findIndex((h) => keys.includes(h));

    const iNum = idx(
      [
        "numara",
        "no",
        "ogrencino",
        "ogrenci_no",
        "ogrenci-numarasi",
        "ogrenci-numarası",
        "id",
        "numarasi",
        "numarası",
      ].map(slug),
    );
    const iName = idx(
      [
        "adisoyadi",
        "adisoyad",
        "adisoyadiadi",
        "adiisoyadi",
        "adisoyadı",
        "adisoyadı",
      ].map(slug),
    );
    const iAd = idx(["ad", "adi"]);
    const iSoyad = idx(["soyad", "soyadi", "soyadı"]);
    const iSinif = idx(
      [
        "sinif",
        "sinifi",
        "sinifi",
        "sinifi",
        "sinifi",
        "sinifi",
        "sinifi",
        "sınıf",
        "sınıfı",
      ].map(slug),
    );
    const iCins = idx(["cinsiyet", "cinsiyeti"]);
    const iRisk = idx(["risk"]);

    const imported: Student[] = [];
    for (const r of rows.slice(1)) {
      const numVal = iNum >= 0 ? normalize(r[iNum]) : "";
      const nameCombined = iName >= 0 ? normalize(r[iName]) : "";
      const ad =
        iAd >= 0
          ? normalize(r[iAd])
          : nameCombined.split(/\s+/).slice(0, -1).join(" ") || nameCombined;
      const soyad =
        iSoyad >= 0
          ? normalize(r[iSoyad])
          : nameCombined.split(/\s+/).slice(-1)[0] || "";
      const sinif = iSinif >= 0 ? normalize(r[iSinif]) : "";
      const cRaw = iCins >= 0 ? slug(r[iCins]) : "";
      const risk = iRisk >= 0 ? normalize(r[iRisk]) : undefined;

      if (!ad && !soyad) continue;
      const idRaw = normalize(iNum >= 0 ? numVal : "");
      const id = idRaw.replace(/\D/g, "");
      if (!id) continue;

      const cinsiyet: "K" | "E" = cRaw.startsWith("k")
        ? "K"
        : cRaw.startsWith("e")
          ? "E"
          : "K";
      imported.push({
        id,
        ad,
        soyad,
        sinif: sinif || "9/A",
        cinsiyet,
        risk: risk ? (risk.toLowerCase() === 'high' || risk.toLowerCase() === 'yüksek' ? 'Yüksek' : 
               risk.toLowerCase() === 'medium' || risk.toLowerCase() === 'orta' ? 'Orta' : 
               'Düşük') as 'Düşük' | 'Orta' | 'Yüksek' : undefined,
        kayitTarihi: new Date().toISOString(),
      });
    }

    if (!imported.length) {
      alert("Dosyadan hiçbir geçerli öğrenci verisi bulunamadı.");
      return;
    }

    const updatedStudents = await new Promise<Student[]>((resolve) => {
      setStudents((prev) => {
        const map = new Map(prev.map((s) => [s.id, s] as const));
        const byNumeric = new Map<string, string>();
        for (const [key] of map) {
          const num = key.replace(/\D/g, "");
          if (num) byNumeric.set(num, key);
        }
        for (const s of imported) {
          const existingKey =
            byNumeric.get(s.id) || (map.has(s.id) ? s.id : undefined);
          if (existingKey) {
            map.set(existingKey, { ...map.get(existingKey)!, ...s });
          } else {
            map.set(s.id, s);
            byNumeric.set(s.id, s.id);
          }
        }
        const result = Array.from(map.values());
        resolve(result);
        return result;
      });
    });

    try {
      const backendStudents = updatedStudents.map(s => frontendToBackend(s));
      
      await apiClient.post<ApiResponse>(
        STUDENT_ENDPOINTS.BULK,
        backendStudents,
        {
          showSuccessToast: true,
          successMessage: `${imported.length} öğrenci başarıyla içe aktarıldı.`,
          showErrorToast: true,
        }
      );
      
      await refreshStudentsFromAPI();
      setStudents(updatedStudents);
    } catch (error) {
      console.error('Backend save error:', error);
    }
    
    } catch (error) {
      console.error('File import error:', error);
      alert("Dosya içe aktarılırken hata oluştu: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  const exportCsv = () => {
    const headers = ["numara", "ad", "soyad", "sinif", "cinsiyet", "risk"].join(
      ",",
    );
    const body = students
      .map((s) =>
        [s.id, s.ad, s.soyad, s.sinif, s.cinsiyet, s.risk ?? ""].join(","),
      )
      .join("\n");
    const csv = headers + "\n" + body;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ogrenciler.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => {
    const total = students.length;
    const female = students.filter(s => s.cinsiyet === "K").length;
    const male = students.filter(s => s.cinsiyet === "E").length;
    const highRisk = students.filter(s => s.risk === "Yüksek").length;
    
    return { total, female, male, highRisk };
  }, [students]);

  return (
    <div className="space-y-6">
      {/* Modern Header with Gradient */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/15 via-primary/5 to-accent/15 border border-primary/20 p-8 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        <div className="relative">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-primary">Öğrenci Yönetimi</h1>
              <p className="text-muted-foreground">Öğrenci kayıtlarını görüntüleyin ve yönetin</p>
            </div>
            <div className="flex gap-2">
              <label className="inline-flex items-center">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => e.target.files && importSheet(e.target.files[0])}
                />
                <Button asChild variant="secondary" size="sm">
                  <span>
                    <Upload className="mr-2 h-4 w-4" /> İçe Aktar
                  </span>
                </Button>
              </label>
              <Button variant="secondary" size="sm" onClick={exportCsv}>
                <Download className="mr-2 h-4 w-4" />
                Dışa Aktar
              </Button>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <UserPlus className="mr-2 h-4 w-4" /> Yeni Öğrenci
                  </Button>
                </DialogTrigger>
            <DialogContent className="w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">Yeni Öğrenci Ekle</DialogTitle>
              </DialogHeader>
              <form
                id="student-form"
                onSubmit={handleSubmit(onCreate)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium">Öğrenci No</label>
                  <Input
                    placeholder="12345"
                    inputMode="numeric"
                    type="text"
                    {...register("id", { 
                      required: "Öğrenci numarası zorunludur",
                      pattern: {
                        value: /^\d+$/,
                        message: "Öğrenci numarası sadece rakamlardan oluşmalıdır"
                      }
                    })}
                  />
                  {errors.id && (
                    <p className="text-xs text-red-600">{errors.id.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ad</label>
                  <Input
                    placeholder="Ahmet"
                    {...register("ad", { required: "Ad zorunludur" })}
                  />
                  {errors.ad && (
                    <p className="text-xs text-red-600">{errors.ad.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Soyad</label>
                  <Input
                    placeholder="Yılmaz"
                    {...register("soyad", { required: "Soyad zorunludur" })}
                  />
                  {errors.soyad && (
                    <p className="text-xs text-red-600">{errors.soyad.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sınıf</label>
                  <Input placeholder="9/A" {...register("sinif")} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cinsiyet</label>
                  <Select
                    onValueChange={(v) => setValue("cinsiyet", v as "K" | "E")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="K">Kız</SelectItem>
                      <SelectItem value="E">Erkek</SelectItem>
                    </SelectContent>
                  </Select>
                  <input
                    type="hidden"
                    {...register("cinsiyet")}
                    defaultValue="K"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Risk Seviyesi</label>
                  <Select
                    onValueChange={(v) => setValue("risk", v as "Düşük" | "Orta" | "Yüksek")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Düşük">Düşük</SelectItem>
                      <SelectItem value="Orta">Orta</SelectItem>
                      <SelectItem value="Yüksek">Yüksek</SelectItem>
                    </SelectContent>
                  </Select>
                  <input
                    type="hidden"
                    {...register("risk")}
                    defaultValue="Düşük"
                  />
                </div>
              </form>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button form="student-form" type="submit" className="w-full sm:w-auto min-h-[44px]">
                  Öğrenci Ekle
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </div>
        </div>
      </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 shadow-sm">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Toplam Öğrenci</p>
                <h3 className="text-2xl font-bold text-primary">{stats.total}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/10 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-gradient-to-br from-purple-500 to-purple-600 p-3 shadow-sm">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Kız Öğrenci</p>
                <h3 className="text-2xl font-bold text-primary">{stats.female}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-primary/20 bg-gradient-to-br from-accent/5 to-primary/10 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-gradient-to-br from-violet-500 to-violet-600 p-3 shadow-sm">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Erkek Öğrenci</p>
                <h3 className="text-2xl font-bold text-primary">{stats.male}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 p-3 shadow-sm">
                <Filter className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Yüksek Risk</p>
                <h3 className="text-2xl font-bold text-accent">{stats.highRisk}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modern Filter Section */}
      <Card className="border-2 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Filtrele ve Ara</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Öğrenci ara (No, Ad, Soyad)"
              className="pl-9"
            />
          </div>
          <Select value={sinif} onValueChange={setSinif}>
            <SelectTrigger>
              <SelectValue placeholder="Sınıf Seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tum">Tüm Sınıflar</SelectItem>
              <SelectItem value="9">9. Sınıf</SelectItem>
              <SelectItem value="10">10. Sınıf</SelectItem>
              <SelectItem value="11">11. Sınıf</SelectItem>
              <SelectItem value="12">12. Sınıf</SelectItem>
            </SelectContent>
          </Select>
          <Select value={cinsiyet} onValueChange={setCinsiyet}>
            <SelectTrigger>
              <SelectValue placeholder="Cinsiyet Seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tum">Tümü</SelectItem>
              <SelectItem value="K">Kız</SelectItem>
              <SelectItem value="E">Erkek</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Student Table */}
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="h-5 w-5" />
              Öğrenci Listesi
              <Badge variant="secondary" className="ml-2">{list.length} öğrenci</Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {list.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Users className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Henüz öğrenci yok</h3>
              <p className="text-muted-foreground text-center mb-6">
                {students.length === 0 
                  ? "Yeni öğrenci ekleyerek başlayın veya Excel/CSV dosyasından içe aktarın"
                  : "Filtre kriterlerinize uygun öğrenci bulunamadı"}
              </p>
              {students.length === 0 && (
                <Button onClick={() => setOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  İlk Öğrenciyi Ekle
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto overflow-y-auto max-h-[600px] rounded-b-lg -mx-4 sm:mx-0">
              <div className="min-w-[800px]">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10 border-b">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold">
                      <button 
                        onClick={() => handleSort('id')}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        No
                        {sortColumn === 'id' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        ) : <ArrowUpDown className="h-4 w-4 opacity-50" />}
                      </button>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <button 
                        onClick={() => handleSort('ad')}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        Ad
                        {sortColumn === 'ad' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        ) : <ArrowUpDown className="h-4 w-4 opacity-50" />}
                      </button>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <button 
                        onClick={() => handleSort('soyad')}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        Soyad
                        {sortColumn === 'soyad' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        ) : <ArrowUpDown className="h-4 w-4 opacity-50" />}
                      </button>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <button 
                        onClick={() => handleSort('sinif')}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        Sınıf
                        {sortColumn === 'sinif' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        ) : <ArrowUpDown className="h-4 w-4 opacity-50" />}
                      </button>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <button 
                        onClick={() => handleSort('cinsiyet')}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        Cinsiyet
                        {sortColumn === 'cinsiyet' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        ) : <ArrowUpDown className="h-4 w-4 opacity-50" />}
                      </button>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <button 
                        onClick={() => handleSort('risk')}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        Risk
                        {sortColumn === 'risk' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        ) : <ArrowUpDown className="h-4 w-4 opacity-50" />}
                      </button>
                    </TableHead>
                    <TableHead className="font-semibold">Profil</TableHead>
                    <TableHead className="font-semibold">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map((student) => (
                    <StudentRow
                      key={student.id}
                      student={student}
                      onEditClick={onEditClick}
                      onDeleteClick={onDeleteClick}
                    />
                  ))}
                </TableBody>
              </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Öğrenci Düzenleme Dialogu */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Öğrenci Bilgilerini Düzenle</DialogTitle>
          </DialogHeader>
          <form
            id="student-edit-form"
            onSubmit={handleSubmit(onUpdate)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Öğrenci No</label>
              <Input
                placeholder="12345"
                inputMode="numeric"
                type="text"
                {...register("id", { 
                  required: "Öğrenci numarası zorunludur",
                  pattern: {
                    value: /^\d+$/,
                    message: "Öğrenci numarası sadece rakamlardan oluşmalıdır"
                  }
                })}
              />
              {errors.id && (
                <p className="text-xs text-red-600">{errors.id.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ad</label>
              <Input
                placeholder="Ahmet"
                {...register("ad", { required: "Ad zorunludur" })}
              />
              {errors.ad && (
                <p className="text-xs text-red-600">{errors.ad.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Soyad</label>
              <Input
                placeholder="Yılmaz"
                {...register("soyad", { required: "Soyad zorunludur" })}
              />
              {errors.soyad && (
                <p className="text-xs text-red-600">{errors.soyad.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sınıf</label>
              <Input placeholder="9/A" {...register("sinif")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cinsiyet</label>
              <Select
                onValueChange={(v) => setValue("cinsiyet", v as "K" | "E")}
                value={watch("cinsiyet")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="K">Kız</SelectItem>
                  <SelectItem value="E">Erkek</SelectItem>
                </SelectContent>
              </Select>
              <input
                type="hidden"
                {...register("cinsiyet")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Risk Seviyesi</label>
              <Select
                onValueChange={(v) => setValue("risk", v as "Düşük" | "Orta" | "Yüksek")}
                value={watch("risk")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Düşük">Düşük</SelectItem>
                  <SelectItem value="Orta">Orta</SelectItem>
                  <SelectItem value="Yüksek">Yüksek</SelectItem>
                </SelectContent>
              </Select>
              <input
                type="hidden"
                {...register("risk")}
              />
            </div>
          </form>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => {
              setEditOpen(false);
              setStudentToEdit(null);
              reset();
            }} className="w-full sm:w-auto min-h-[44px]">
              İptal
            </Button>
            <Button form="student-edit-form" type="submit" className="w-full sm:w-auto min-h-[44px]">
              Değişiklikleri Kaydet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Güvenli Silme Dialogu */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-red-600 flex items-center gap-2">
              <div className="rounded-full bg-red-100 p-2">
                <Trash2 className="h-5 w-5" />
              </div>
              Öğrenci Silme Onayı
            </DialogTitle>
          </DialogHeader>
          {studentToDelete && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">{studentToDelete.ad} {studentToDelete.soyad}</strong> öğrencisini kalıcı olarak silmek istediğinizden emin misiniz?
              </p>
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-semibold mb-1">⚠️ Bu işlem geri alınamaz!</p>
                <p className="text-xs text-red-700">
                  Tüm akademik kayıtlar, notlar ve ilerleme verileri kalıcı olarak silinecektir.
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Silme işlemini onaylamak için öğrencinin tam adını yazın:
                </label>
                <Input
                  value={confirmationName}
                  onChange={(e) => setConfirmationName(e.target.value)}
                  placeholder={`${studentToDelete.ad} ${studentToDelete.soyad}`}
                  className="border-red-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              className="w-full sm:w-auto min-h-[44px]"
            >
              İptal
            </Button>
            <Button 
              variant="destructive" 
              onClick={onDeleteConfirm}
              disabled={!confirmationName.trim()}
              className="w-full sm:w-auto min-h-[44px]"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Kalıcı Olarak Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
