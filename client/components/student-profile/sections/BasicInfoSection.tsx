import { useEffect } from "react";
import { Student, upsertStudent } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  User,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Users,
  AlertCircle,
  Calendar,
  Hash,
  UserCheck,
  Shield,
  Tag,
} from "lucide-react";

const basicInfoSchema = z.object({
  ad: z.string().min(1, "Ad zorunludur"),
  soyad: z.string().min(1, "Soyad zorunludur"),
  sinif: z.string().optional(),
  cinsiyet: z.enum(["K", "E"]).optional(),
  dogumTarihi: z.string().optional(),
  telefon: z.string().optional(),
  eposta: z.string().email("Geçerli bir e-posta giriniz").optional().or(z.literal("")),
  il: z.string().optional(),
  ilce: z.string().optional(),
  adres: z.string().optional(),
  rehberOgretmen: z.string().optional(),
  risk: z.enum(["Düşük", "Orta", "Yüksek"]).optional(),
  etiketler: z.string().optional(),
  veliAdi: z.string().optional(),
  veliTelefon: z.string().optional(),
  acilKisi: z.string().optional(),
  acilTelefon: z.string().optional(),
});

type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;

interface BasicInfoSectionProps {
  student: Student;
  onUpdate: () => void;
}

export default function BasicInfoSection({ student, onUpdate }: BasicInfoSectionProps) {
  const form = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      ad: student.ad || "",
      soyad: student.soyad || "",
      sinif: student.sinif || "",
      cinsiyet: student.cinsiyet,
      dogumTarihi: student.dogumTarihi || "",
      telefon: student.telefon || "",
      eposta: student.eposta || "",
      il: student.il || "",
      ilce: student.ilce || "",
      adres: student.adres || "",
      rehberOgretmen: student.rehberOgretmen || "",
      risk: student.risk,
      etiketler: (student.etiketler || []).join(", "),
      veliAdi: student.veliAdi || "",
      veliTelefon: student.veliTelefon || "",
      acilKisi: student.acilKisi || "",
      acilTelefon: student.acilTelefon || "",
    },
  });

  // Form verilerini öğrenci prop'u değiştiğinde güncelle
  useEffect(() => {
    form.reset({
      ad: student.ad || "",
      soyad: student.soyad || "",
      sinif: student.sinif || "",
      cinsiyet: student.cinsiyet,
      dogumTarihi: student.dogumTarihi || "",
      telefon: student.telefon || "",
      eposta: student.eposta || "",
      il: student.il || "",
      ilce: student.ilce || "",
      adres: student.adres || "",
      rehberOgretmen: student.rehberOgretmen || "",
      risk: student.risk,
      etiketler: (student.etiketler || []).join(", "),
      veliAdi: student.veliAdi || "",
      veliTelefon: student.veliTelefon || "",
      acilKisi: student.acilKisi || "",
      acilTelefon: student.acilTelefon || "",
    });
  }, [student, form]);

  const onSubmit = async (data: BasicInfoFormValues) => {
    try {
      const updatedStudent: Student = {
        ...student,
        ...data,
        etiketler: data.etiketler
          ? data.etiketler.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };
      
      await upsertStudent(updatedStudent);
      toast.success("Öğrenci bilgileri kaydedildi");
      onUpdate();
    } catch (error) {
      toast.error("Kayıt sırasında hata oluştu");
      console.error("Error saving student:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Kişisel Bilgiler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="ad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs flex items-center gap-1.5">
                      <User className="h-3 w-3" />
                      Ad
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="h-9" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="soyad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs flex items-center gap-1.5">
                      <User className="h-3 w-3" />
                      Soyad
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="h-9" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormItem>
                <FormLabel className="text-xs flex items-center gap-1.5">
                  <Hash className="h-3 w-3" />
                  Öğrenci No
                </FormLabel>
                <Input
                  value={student.id}
                  readOnly
                  className="bg-muted h-9"
                />
              </FormItem>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="cinsiyet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs flex items-center gap-1.5">
                      <User className="h-3 w-3" />
                      Cinsiyet
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Seçiniz" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="K">Kız</SelectItem>
                        <SelectItem value="E">Erkek</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dogumTarihi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      Doğum Tarihi
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="h-9" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sinif"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs flex items-center gap-1.5">
                      <GraduationCap className="h-3 w-3" />
                      Sınıf
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="örn. 9/A" {...field} className="h-9" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-2 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="telefon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs flex items-center gap-1.5">
                        <Phone className="h-3 w-3" />
                        Telefon
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="555 123 45 67" {...field} className="h-9" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="eposta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs flex items-center gap-1.5">
                        <Mail className="h-3 w-3" />
                        E-posta
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="ornek@mail.com" {...field} className="h-9" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="il"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" />
                        İl
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ilce"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">İlçe</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adres"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Adres</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              Okul Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="rehberOgretmen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs flex items-center gap-1.5">
                      <UserCheck className="h-3 w-3" />
                      Rehber Öğretmen
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="h-9" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="risk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs flex items-center gap-1.5">
                      <Shield className="h-3 w-3" />
                      Risk Durumu
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Seçiniz" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Düşük">Düşük</SelectItem>
                        <SelectItem value="Orta">Orta</SelectItem>
                        <SelectItem value="Yüksek">Yüksek</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="etiketler"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs flex items-center gap-1.5">
                      <Tag className="h-3 w-3" />
                      Etiketler
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="virgülle ayırın" {...field} className="h-9" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Veli & Acil Durum
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="veliAdi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs flex items-center gap-1.5">
                      <Users className="h-3 w-3" />
                      Veli Adı
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="h-9" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="veliTelefon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs flex items-center gap-1.5">
                      <Phone className="h-3 w-3" />
                      Veli Telefon
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="555 123 45 67" {...field} className="h-9" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-2 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="acilKisi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs flex items-center gap-1.5">
                        <AlertCircle className="h-3 w-3" />
                        Acil Durum Kişisi
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="acilTelefon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs flex items-center gap-1.5">
                        <Phone className="h-3 w-3" />
                        Acil Durum Telefon
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="555 123 45 67" {...field} className="h-9" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
            size="sm"
          >
            {form.formState.isSubmitting ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
