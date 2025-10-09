import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelect } from "@/components/ui/multi-select";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { BEHAVIOR_CATEGORIES, INTERVENTION_TYPES } from "@/shared/constants/student-profile-taxonomy";

const behaviorIncidentSchema = z.object({
  incidentDate: z.string(),
  incidentTime: z.string().optional(),
  location: z.string().min(1, "Konum gerekli"),
  behaviorCategory: z.string().min(1, "Davranış kategorisi gerekli"),
  behaviorType: z.enum(['OLUMLU', 'KÜÇÜK_İHLAL', 'ORTA_DÜZEY', 'CİDDİ', 'ÇOK_CİDDİ']),
  antecedent: z.string().optional(),
  description: z.string().min(1, "Açıklama gerekli"),
  consequence: z.string().optional(),
  interventionsUsed: z.array(z.string()).default([]),
  interventionEffectiveness: z.enum(['ÇOK_ETKİLİ', 'ETKİLİ', 'KISMEN_ETKİLİ', 'ETKİSİZ']).optional(),
  parentNotified: z.boolean().default(false),
  adminNotified: z.boolean().default(false),
  followUpNeeded: z.boolean().default(false),
  status: z.enum(['AÇIK', 'DEVAM_EDIYOR', 'ÇÖZÜLDÜ', 'İZLENIYOR']).default('AÇIK'),
  reportedBy: z.string().min(1, "Raporlayan kişi gerekli"),
  additionalNotes: z.string().optional(),
});

type BehaviorIncidentFormValues = z.infer<typeof behaviorIncidentSchema>;

interface StandardizedBehaviorSectionProps {
  studentId: string;
  onUpdate: () => void;
}

export default function StandardizedBehaviorSection({ 
  studentId, 
  onUpdate 
}: StandardizedBehaviorSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBehaviorType, setSelectedBehaviorType] = useState<string>("");

  const form = useForm<BehaviorIncidentFormValues>({
    resolver: zodResolver(behaviorIncidentSchema),
    defaultValues: {
      incidentDate: new Date().toISOString().slice(0, 10),
      incidentTime: new Date().toTimeString().slice(0, 5),
      location: "",
      behaviorCategory: "",
      behaviorType: "KÜÇÜK_İHLAL",
      antecedent: "",
      description: "",
      consequence: "",
      interventionsUsed: [],
      parentNotified: false,
      adminNotified: false,
      followUpNeeded: false,
      status: "AÇIK",
      reportedBy: "",
      additionalNotes: "",
    },
  });

  const behaviorType = form.watch("behaviorType");
  
  const filteredBehaviorCategories = BEHAVIOR_CATEGORIES.filter(
    (cat) => !behaviorType || cat.type === behaviorType
  );

  const onSubmit = async (data: BehaviorIncidentFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        id: crypto.randomUUID(),
        studentId,
        ...data,
        interventionsUsed: JSON.stringify(data.interventionsUsed),
        parentNotified: data.parentNotified ? 1 : 0,
        adminNotified: data.adminNotified ? 1 : 0,
        followUpNeeded: data.followUpNeeded ? 1 : 0,
      };

      toast.success("Davranış kaydı oluşturuldu");
      form.reset();
      onUpdate();
    } catch (error) {
      toast.error("Kayıt sırasında hata oluştu");
      console.error("Error saving behavior incident:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Standartlaştırılmış Davranış Takibi
        </CardTitle>
        <CardDescription>
          ABC modeline göre kategorize edilmiş davranış kayıtları
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="incidentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tarih</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="incidentTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Saat</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konum</FormLabel>
                    <FormControl>
                      <Input placeholder="Sınıf, bahçe, kantin..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="behaviorType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Davranış Türü</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Davranış türü seçiniz" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="OLUMLU">Olumlu Davranış</SelectItem>
                        <SelectItem value="KÜÇÜK_İHLAL">Küçük İhlal</SelectItem>
                        <SelectItem value="ORTA_DÜZEY">Orta Düzey</SelectItem>
                        <SelectItem value="CİDDİ">Ciddi</SelectItem>
                        <SelectItem value="ÇOK_CİDDİ">Çok Ciddi</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="behaviorCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Davranış Kategorisi</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Kategori seçiniz" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredBehaviorCategories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border-l-4 border-blue-500 pl-4 space-y-4">
              <h4 className="font-medium text-sm">ABC Modeli (Antecedent-Behavior-Consequence)</h4>
              
              <FormField
                control={form.control}
                name="antecedent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>A - Öncül (Ne oldu?)</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={2} placeholder="Davranıştan önce neler oldu?" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>B - Davranış (Neydi?)</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={2} placeholder="Davranışı detaylı açıklayınız" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consequence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>C - Sonuç (Ne oldu?)</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={2} placeholder="Davranıştan sonra ne oldu?" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="interventionsUsed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Uygulanan Müdahaleler</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={INTERVENTION_TYPES}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder="Müdahale türlerini seçiniz..."
                      groupByCategory
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interventionEffectiveness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Müdahale Etkinliği</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Etkinlik düzeyi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ÇOK_ETKİLİ">Çok Etkili</SelectItem>
                      <SelectItem value="ETKİLİ">Etkili</SelectItem>
                      <SelectItem value="KISMEN_ETKİLİ">Kısmen Etkili</SelectItem>
                      <SelectItem value="ETKİSİZ">Etkisiz</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-6">
              <FormField
                control={form.control}
                name="parentNotified"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Veli Bilgilendirildi</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adminNotified"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">İdare Bilgilendirildi</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="followUpNeeded"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Takip Gerekli</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durum</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Durum seçiniz" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AÇIK">Açık</SelectItem>
                        <SelectItem value="DEVAM_EDIYOR">Devam Ediyor</SelectItem>
                        <SelectItem value="ÇÖZÜLDÜ">Çözüldü</SelectItem>
                        <SelectItem value="İZLENIYOR">İzleniyor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reportedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Raporlayan</FormLabel>
                    <FormControl>
                      <Input placeholder="Öğretmen adı" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ek Notlar</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
