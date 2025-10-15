import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { EnhancedTextarea as Textarea } from "@/components/ui/enhanced-textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import { toast } from "sonner";
import { Target } from "lucide-react";

const motivationProfileSchema = z.object({
  assessmentDate: z.string(),
  primaryMotivators: z.array(z.string()).default([]),
  careerAspirations: z.array(z.string()).default([]),
  academicGoals: z.array(z.string()).default([]),
  goalClarityLevel: z.number().min(1).max(10).default(5),
  intrinsicMotivationLevel: z.number().min(1).max(10).default(5),
  extrinsicMotivationLevel: z.number().min(1).max(10).default(5),
  persistenceLevel: z.number().min(1).max(10).default(5),
  futureOrientationLevel: z.number().min(1).max(10).default(5),
  shortTermGoals: z.string().optional(),
  longTermGoals: z.string().optional(),
  obstacles: z.string().optional(),
  supportNeeds: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type MotivationProfileFormValues = z.infer<typeof motivationProfileSchema>;

interface MotivationProfileSectionProps {
  studentId: string;
  motivationData?: any;
  onUpdate: () => void;
}

export default function MotivationProfileSection({ 
  studentId, 
  motivationData,
  onUpdate 
}: MotivationProfileSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MotivationProfileFormValues>({
    resolver: zodResolver(motivationProfileSchema),
    defaultValues: {
      assessmentDate: motivationData?.assessmentDate || new Date().toISOString().slice(0, 10),
      primaryMotivators: motivationData?.primaryMotivationSources ? JSON.parse(motivationData.primaryMotivationSources) : [],
      careerAspirations: motivationData?.careerAspirations ? JSON.parse(motivationData.careerAspirations) : [],
      academicGoals: motivationData?.academicGoals ? JSON.parse(motivationData.academicGoals) : [],
      goalClarityLevel: motivationData?.goalClarityLevel || 5,
      intrinsicMotivationLevel: motivationData?.intrinsicMotivation || 5,
      extrinsicMotivationLevel: motivationData?.extrinsicMotivation || 5,
      persistenceLevel: motivationData?.persistenceLevel || 5,
      futureOrientationLevel: motivationData?.futureOrientationLevel || 5,
      shortTermGoals: motivationData?.shortTermGoals || "",
      longTermGoals: motivationData?.longTermGoals || "",
      obstacles: motivationData?.obstacles || "",
      supportNeeds: motivationData?.supportNeeds || "",
      additionalNotes: motivationData?.additionalNotes || "",
    },
  });

  // Form verilerini motivationData prop'u değiştiğinde güncelle
  useEffect(() => {
    form.reset({
      assessmentDate: motivationData?.assessmentDate || new Date().toISOString().slice(0, 10),
      primaryMotivators: motivationData?.primaryMotivationSources ? JSON.parse(motivationData.primaryMotivationSources) : [],
      careerAspirations: motivationData?.careerAspirations ? JSON.parse(motivationData.careerAspirations) : [],
      academicGoals: motivationData?.academicGoals ? JSON.parse(motivationData.academicGoals) : [],
      goalClarityLevel: motivationData?.goalClarityLevel || 5,
      intrinsicMotivationLevel: motivationData?.intrinsicMotivation || 5,
      extrinsicMotivationLevel: motivationData?.extrinsicMotivation || 5,
      persistenceLevel: motivationData?.persistenceLevel || 5,
      futureOrientationLevel: motivationData?.futureOrientationLevel || 5,
      shortTermGoals: motivationData?.shortTermGoals || "",
      longTermGoals: motivationData?.longTermGoals || "",
      obstacles: motivationData?.obstacles || "",
      supportNeeds: motivationData?.supportNeeds || "",
      additionalNotes: motivationData?.additionalNotes || "",
    });
  }, [motivationData, form]);

  const onSubmit = async (data: MotivationProfileFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        id: motivationData?.id || self.crypto.randomUUID(),
        studentId,
        ...data,
      };

      const response = await fetch(`/api/standardized-profile/${studentId}/motivation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save');

      toast.success("Motivasyon profili kaydedildi");
      onUpdate();
    } catch (error) {
      toast.error("Kayıt sırasında hata oluştu");
      console.error("Error saving motivation profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const motivatorOptions = [
    { value: 'AKADEMİK_BAŞARI', label: 'Akademik Başarı', category: 'İçsel' },
    { value: 'MERAK', label: 'Merak ve Öğrenme İsteği', category: 'İçsel' },
    { value: 'ÖZERKLIK', label: 'Özerklik ve Bağımsızlık', category: 'İçsel' },
    { value: 'YETKİNLİK', label: 'Yetkinlik Hissi', category: 'İçsel' },
    { value: 'AİLE_BEKLENTİSİ', label: 'Aile Beklentisi', category: 'Dışsal' },
    { value: 'AKRAN_TANINMA', label: 'Akran Tanınması', category: 'Dışsal' },
    { value: 'ÖDÜL_TAKDİR', label: 'Ödül ve Takdir', category: 'Dışsal' },
    { value: 'GELECEKTEKİ_BAŞARI', label: 'Gelecekteki Kariyer Başarısı', category: 'Dışsal' },
    { value: 'REKABET', label: 'Rekabet', category: 'Dışsal' },
  ];

  const careerOptions = [
    { value: 'TIP', label: 'Tıp', category: 'Sağlık Bilimleri' },
    { value: 'MÜHENDİSLİK', label: 'Mühendislik', category: 'Fen Bilimleri' },
    { value: 'HUKUK', label: 'Hukuk', category: 'Sosyal Bilimler' },
    { value: 'EĞİTİM', label: 'Eğitim', category: 'Sosyal Bilimler' },
    { value: 'İŞLETME', label: 'İşletme/Ekonomi', category: 'İdari Bilimler' },
    { value: 'SANAT_TASARIM', label: 'Sanat ve Tasarım', category: 'Güzel Sanatlar' },
    { value: 'MEDYA_İLETİŞİM', label: 'Medya ve İletişim', category: 'İletişim' },
    { value: 'SPOR', label: 'Spor Bilimleri', category: 'Sağlık Bilimleri' },
    { value: 'TEKNOLOJİ_BT', label: 'Teknoloji/BT', category: 'Fen Bilimleri' },
    { value: 'BELİRSİZ', label: 'Henüz Belirli Değil', category: 'Diğer' },
  ];

  const academicGoalOptions = [
    { value: 'ÜNİVERSİTE', label: 'Üniversite Kazanma', category: 'Kısa Vadeli' },
    { value: 'BURS', label: 'Burs Kazanma', category: 'Kısa Vadeli' },
    { value: 'NOT_ORTALAMASI', label: 'Not Ortalaması Yükseltme', category: 'Kısa Vadeli' },
    { value: 'SINAV_BAŞARISI', label: 'Sınav Başarısı', category: 'Kısa Vadeli' },
    { value: 'LİSANSÜSTÜ', label: 'Lisansüstü Eğitim', category: 'Uzun Vadeli' },
    { value: 'YURT_DIŞI_EĞİTİM', label: 'Yurt Dışı Eğitim', category: 'Uzun Vadeli' },
    { value: 'ARAŞTIRMACI', label: 'Araştırmacı Olma', category: 'Uzun Vadeli' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Motivasyon ve Hedef Profili
        </CardTitle>
        <CardDescription>
          Öğrenci motivasyon kaynakları ve kariyer hedefleri
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="assessmentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Değerlendirme Tarihi</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Motivasyon Kaynakları ve Hedefler
              </h3>

              <FormField
                control={form.control}
                name="primaryMotivators"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ana Motivasyon Kaynakları</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={motivatorOptions}
                        selected={field.value}
                        onChange={field.onChange}
                        placeholder="Motivasyon kaynaklarını seçin"
                        groupByCategory
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="careerAspirations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kariyer Aspirasyonları</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={careerOptions}
                        selected={field.value}
                        onChange={field.onChange}
                        placeholder="İlgilenilen kariyer alanlarını seçin"
                        groupByCategory
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="academicGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Akademik Hedefler</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={academicGoalOptions}
                        selected={field.value}
                        onChange={field.onChange}
                        placeholder="Akademik hedefleri seçin"
                        groupByCategory
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6 border-t pt-6">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Motivasyon Düzey Değerlendirmesi (1-10 Ölçeği)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="goalClarityLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hedef Netliği: {field.value}/10</FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={10}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>Hedeflerini ne kadar net tanımlayabiliyor</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="intrinsicMotivationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>İçsel Motivasyon: {field.value}/10</FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={10}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>Kendi isteğiyle öğrenme ve gelişme isteği</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="extrinsicMotivationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dışsal Motivasyon: {field.value}/10</FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={10}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>Ödül, takdir ve dış teşviklerle motive olma</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="persistenceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Azim ve Sebat: {field.value}/10</FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={10}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>Zorluklara karşı dayanıklılık</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="futureOrientationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gelecek Yönelimi: {field.value}/10</FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={10}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>Uzun vadeli planlama ve gelecek odaklılık</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4 border-t pt-6">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Hedef Detayları
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="shortTermGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kısa Vadeli Hedefler (1 yıl içi)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Bu yıl için hedefler..." 
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longTermGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Uzun Vadeli Hedefler (5-10 yıl)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Gelecek için büyük hedefler..." 
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="obstacles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Engeller ve Zorluklar</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Hedeflere ulaşmada karşılaşılan zorluklar..." 
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supportNeeds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destek İhtiyaçları</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Hedeflere ulaşmak için gereken destekler..." 
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ek Notlar</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Motivasyon ve hedefler hakkında ek gözlemler..." 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
