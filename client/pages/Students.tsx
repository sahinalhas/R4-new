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
import { Upload, Plus, Trash2, Pencil } from "lucide-react";
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
  return (
    <TableRow>
      <TableCell>{student.id}</TableCell>
      <TableCell>{student.ad}</TableCell>
      <TableCell>{student.soyad}</TableCell>
      <TableCell>{student.sinif}</TableCell>
      <TableCell>{student.cinsiyet === "E" ? "Erkek" : "Kız"}</TableCell>
      <TableCell>
        <span
          className={
            student.risk === "Yüksek"
              ? "px-2 py-1 rounded text-xs bg-red-100 text-red-700"
              : student.risk === "Orta"
                ? "px-2 py-1 rounded text-xs bg-amber-100 text-amber-700"
                : "px-2 py-1 rounded text-xs bg-emerald-100 text-emerald-700"
          }
        >
          {student.risk}
        </span>
      </TableCell>
      <TableCell>
        <Button asChild size="sm" variant="outline">
          <Link to={`/ogrenci/${student.id}`}>Görüntüle</Link>
        </Button>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onEditClick(student)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => onDeleteClick(student)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
});

StudentRow.displayName = 'StudentRow';

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

  const list = useMemo(() => {
    return students.filter((s) => {
      const matchesQ = `${s.id} ${s.ad} ${s.soyad}`
        .toLowerCase()
        .includes(debouncedQ.toLowerCase());
      const matchesSinif = sinif === "tum" || s.sinif.startsWith(sinif);
      const matchesC =
        cinsiyet === "tum" || s.cinsiyet === (cinsiyet as "K" | "E");
      return matchesQ && matchesSinif && matchesC;
    });
  }, [debouncedQ, sinif, cinsiyet, students]);

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
      const response = await fetch(`/api/students/${studentToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmationName: expectedName })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Başarılı silme - UI'den kaldır
        setStudents(prev => prev.filter(s => s.id !== studentToDelete.id));
        setDeleteDialogOpen(false);
        setStudentToDelete(null);
        setConfirmationName("");
        alert(`${expectedName} başarıyla silindi.`);
      } else {
        alert(result.error || "Silme işlemi başarısız oldu.");
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert("Silme işlemi sırasında hata oluştu.");
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
      const data = isCsv
        ? new TextEncoder().encode(await file.text())
        : await file.arrayBuffer();
      
      let wb, ws, rows;
      try {
        wb = XLSX.read(data, { type: isCsv ? "array" : "array" });
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
        rows = XLSX.utils.sheet_to_json(ws, { header: 1 }) as unknown[][];
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
      });
    }

    if (!imported.length) {
      alert("Dosyadan hiçbir geçerli öğrenci verisi bulunamadı.");
      return;
    }
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
      return Array.from(map.values());
    });

    // Trigger update event
    window.dispatchEvent(new CustomEvent('studentsUpdated'));
    alert(`${imported.length} öğrenci başarıyla içe aktarıldı.`);
    
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold">Öğrenci Yönetimi</h1>
        <div className="flex gap-2">
          <label className="inline-flex items-center">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => e.target.files && importSheet(e.target.files[0])}
            />
            <Button asChild variant="outline">
              <span>
                <Upload className="mr-2 h-4 w-4" /> Excel/CSV İçe Aktar
              </span>
            </Button>
          </label>
          <Button variant="outline" onClick={exportCsv}>
            CSV Dışa Aktar
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Yeni Öğrenci
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Öğrenci</DialogTitle>
              </DialogHeader>
              <form
                id="student-form"
                onSubmit={handleSubmit(onCreate)}
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                <div className="space-y-1">
                  <Input
                    placeholder="Öğrenci No"
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
                <div className="space-y-1">
                  <Input
                    placeholder="Ad"
                    {...register("ad", { required: "Ad zorunludur" })}
                  />
                  {errors.ad && (
                    <p className="text-xs text-red-600">{errors.ad.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Input
                    placeholder="Soyad"
                    {...register("soyad", { required: "Soyad zorunludur" })}
                  />
                  {errors.soyad && (
                    <p className="text-xs text-red-600">{errors.soyad.message}</p>
                  )}
                </div>
                <Input placeholder="Sınıf (örn. 9/A)" {...register("sinif")} />
                <Select
                  onValueChange={(v) => setValue("cinsiyet", v as "K" | "E")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Cinsiyet" />
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
                <Select
                  onValueChange={(v) => setValue("risk", v as "Düşük" | "Orta" | "Yüksek")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Risk" />
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
              </form>
              <DialogFooter>
                <Button form="student-form" type="submit">
                  Kaydet
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtreler</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ara: No / Ad / Soyad"
          />
          <Select value={sinif} onValueChange={setSinif}>
            <SelectTrigger>
              <SelectValue placeholder="Sınıf" />
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
              <SelectValue placeholder="Cinsiyet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tum">Tümü</SelectItem>
              <SelectItem value="K">Kız</SelectItem>
              <SelectItem value="E">Erkek</SelectItem>
            </SelectContent>
          </Select>
          <div />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Öğrenci Listesi ({list.length} öğrenci)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto border rounded-md max-h-[600px]">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Ad</TableHead>
                  <TableHead>Soyad</TableHead>
                  <TableHead>Sınıf</TableHead>
                  <TableHead>Cinsiyet</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Profil</TableHead>
                  <TableHead>İşlemler</TableHead>
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
        </CardContent>
      </Card>

      {/* Öğrenci Düzenleme Dialogu */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Öğrenci Düzenle</DialogTitle>
          </DialogHeader>
          <form
            id="student-edit-form"
            onSubmit={handleSubmit(onUpdate)}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <div className="space-y-1">
              <Input
                placeholder="Öğrenci No"
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
            <div className="space-y-1">
              <Input
                placeholder="Ad"
                {...register("ad", { required: "Ad zorunludur" })}
              />
              {errors.ad && (
                <p className="text-xs text-red-600">{errors.ad.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Input
                placeholder="Soyad"
                {...register("soyad", { required: "Soyad zorunludur" })}
              />
              {errors.soyad && (
                <p className="text-xs text-red-600">{errors.soyad.message}</p>
              )}
            </div>
            <Input placeholder="Sınıf (örn. 9/A)" {...register("sinif")} />
            <Select
              onValueChange={(v) => setValue("cinsiyet", v as "K" | "E")}
              value={watch("cinsiyet")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Cinsiyet" />
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
            <Select
              onValueChange={(v) => setValue("risk", v as "Düşük" | "Orta" | "Yüksek")}
              value={watch("risk")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Risk" />
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
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditOpen(false);
              setStudentToEdit(null);
              reset();
            }}>
              İptal
            </Button>
            <Button form="student-edit-form" type="submit">
              Güncelle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Güvenli Silme Dialogu */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">⚠️ Öğrenci Silme</DialogTitle>
          </DialogHeader>
          {studentToDelete && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                <strong>{studentToDelete.ad} {studentToDelete.soyad}</strong> öğrencisini kalıcı olarak silmek istediğinizden emin misiniz?
              </p>
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-sm text-red-800 font-medium">Bu işlem geri alınamaz!</p>
                <p className="text-xs text-red-700 mt-1">
                  Tüm akademik kayıtlar, notlar ve ilerleme verileri silinecektir.
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">
                  Silme işlemini onaylamak için öğrencinin tam adını yazın:
                </label>
                <Input
                  value={confirmationName}
                  onChange={(e) => setConfirmationName(e.target.value)}
                  placeholder={`${studentToDelete.ad} ${studentToDelete.soyad}`}
                  className="mt-2"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
            >
              İptal
            </Button>
            <Button 
              variant="destructive" 
              onClick={onDeleteConfirm}
              disabled={!confirmationName.trim()}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
