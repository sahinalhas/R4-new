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
  kanGrubu: z.string().optional(),
  saglikNotu: z.string().optional(),
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
      kanGrubu: student.kanGrubu || "",
      saglikNotu: student.saglikNotu || "",
      veliAdi: student.veliAdi || "",
      veliTelefon: student.veliTelefon || "",
      acilKisi: student.acilKisi || "",
      acilTelefon: student.acilTelefon || "",
    },
  });

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Öğrenci Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="ad"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Ad" {...field} />
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
                  <FormControl>
                    <Input placeholder="Soyad" {...field} />
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
                  <FormControl>
                    <Input placeholder="Sınıf (örn. 9/A)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cinsiyet"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Cinsiyet" />
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
            
            <div>
              <Input
                value={student.id}
                placeholder="Öğrenci No"
                readOnly
                className="bg-gray-50"
              />
            </div>
            
            <FormField
              control={form.control}
              name="dogumTarihi"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="date" placeholder="Doğum Tarihi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="telefon"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Telefon" {...field} />
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
                  <FormControl>
                    <Input placeholder="E-posta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="il"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="İl" {...field} />
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
                  <FormControl>
                    <Input placeholder="İlçe" {...field} />
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
                  <FormControl>
                    <Input placeholder="Adres" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="rehberOgretmen"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Rehber Öğretmen" {...field} />
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Risk" />
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
                  <FormControl>
                    <Input placeholder="Etiketler (virgülle)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="kanGrubu"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Kan Grubu (ops.)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="saglikNotu"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormControl>
                    <Textarea placeholder="Sağlık Notu (ops.)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="md:col-span-2">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Veli & Acil Durum</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="veliAdi"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Veli Adı" {...field} />
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
                  <FormControl>
                    <Input placeholder="Veli Telefon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="acilKisi"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Acil Durum Kişisi" {...field} />
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
                  <FormControl>
                    <Input placeholder="Acil Durum Telefon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="md:col-span-2">
              <Button type="submit" variant="outline" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
