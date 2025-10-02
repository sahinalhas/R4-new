import { Student, upsertStudent } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BasicInfoSectionProps {
  student: Student;
  onUpdate: () => void;
}

export default function BasicInfoSection({ student, onUpdate }: BasicInfoSectionProps) {
  const handleSave = () => {
    upsertStudent(student);
    onUpdate();
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Öğrenci Bilgileri (Düzenle)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            defaultValue={student.ad}
            placeholder="Ad"
            onChange={(e) => (student.ad = e.target.value)}
          />
          <Input
            defaultValue={student.soyad}
            placeholder="Soyad"
            onChange={(e) => (student.soyad = e.target.value)}
          />
          <Input
            defaultValue={student.sinif}
            placeholder="Sınıf (örn. 9/A)"
            onChange={(e) => (student.sinif = e.target.value)}
          />
          <Select
            defaultValue={student.cinsiyet}
            onValueChange={(v) => (student.cinsiyet = v as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Cinsiyet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="K">Kız</SelectItem>
              <SelectItem value="E">Erkek</SelectItem>
            </SelectContent>
          </Select>
          <Input
            defaultValue={student.id}
            placeholder="Öğrenci No"
            readOnly
            className="bg-gray-50"
          />
          <Input
            defaultValue={student.dogumTarihi}
            type="date"
            placeholder="Doğum Tarihi"
            onChange={(e) => (student.dogumTarihi = e.target.value)}
          />
          <Input
            defaultValue={student.telefon}
            placeholder="Telefon"
            onChange={(e) => (student.telefon = e.target.value)}
          />
          <Input
            defaultValue={student.eposta}
            placeholder="E-posta"
            onChange={(e) => (student.eposta = e.target.value)}
          />
          <Input
            defaultValue={student.il}
            placeholder="İl"
            onChange={(e) => (student.il = e.target.value)}
          />
          <Input
            defaultValue={student.ilce}
            placeholder="İlçe"
            onChange={(e) => (student.ilce = e.target.value)}
          />
          <Input
            defaultValue={student.adres}
            placeholder="Adres"
            onChange={(e) => (student.adres = e.target.value)}
          />
          <Input
            defaultValue={student.rehberOgretmen}
            placeholder="Rehber Öğretmen"
            onChange={(e) => (student.rehberOgretmen = e.target.value)}
          />
          <Select
            defaultValue={student.risk || "Düşük"}
            onValueChange={(v) => (student.risk = v as any)}
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
          <Input
            defaultValue={(student.etiketler || []).join(", ")}
            placeholder="Etiketler (virgülle)"
            onChange={(e) =>
              (student.etiketler = e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean))
            }
          />
          <Input
            defaultValue={student.kanGrubu}
            placeholder="Kan Grubu (ops.)"
            onChange={(e) => (student.kanGrubu = e.target.value)}
          />
          <Textarea
            defaultValue={student.saglikNotu}
            placeholder="Sağlık Notu (ops.)"
            onChange={(e) => (student.saglikNotu = e.target.value)}
          />
          <div className="md:col-span-2">
            <Button onClick={handleSave}>
              Kaydet
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Veli & Acil Durum</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            defaultValue={student.veliAdi}
            placeholder="Veli Adı"
            onChange={(e) => (student.veliAdi = e.target.value)}
          />
          <Input
            defaultValue={student.veliTelefon}
            placeholder="Veli Telefon"
            onChange={(e) => (student.veliTelefon = e.target.value)}
          />
          <Input
            defaultValue={student.acilKisi}
            placeholder="Acil Durum Kişisi"
            onChange={(e) => (student.acilKisi = e.target.value)}
          />
          <Input
            defaultValue={student.acilTelefon}
            placeholder="Acil Durum Telefon"
            onChange={(e) => (student.acilTelefon = e.target.value)}
          />
          <div className="md:col-span-2">
            <Button
              variant="outline"
              onClick={handleSave}
            >
              Kaydet
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
