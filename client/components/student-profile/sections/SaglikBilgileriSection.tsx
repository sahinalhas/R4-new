import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { getHealthInfoByStudent, createOrUpdateHealthInfo, type HealthInfo } from "@/lib/api/health.api";

const healthInfoSchema = z.object({
  bloodType: z.string().optional(),
  allergies: z.string().optional(),
  chronicDiseases: z.string().optional(),
  currentMedications: z.string().optional(),
  emergencyContact1Name: z.string().optional(),
  emergencyContact1Phone: z.string().optional(),
  emergencyContact1Relation: z.string().optional(),
  emergencyContact2Name: z.string().optional(),
  emergencyContact2Phone: z.string().optional(),
  emergencyContact2Relation: z.string().optional(),
  physicianName: z.string().optional(),
  physicianPhone: z.string().optional(),
  lastHealthCheckup: z.string().optional(),
  vaccinations: z.string().optional(),
  medicalHistory: z.string().optional(),
  specialNeeds: z.string().optional(),
  physicalLimitations: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  mentalHealthNotes: z.string().optional(),
  notes: z.string().optional(),
});

type HealthInfoFormValues = z.infer<typeof healthInfoSchema>;

interface SaglikBilgileriSectionProps {
  studentId: string;
  healthInfo?: any;
  onUpdate?: () => void;
}

export default function SaglikBilgileriSection({ studentId, healthInfo, onUpdate }: SaglikBilgileriSectionProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<HealthInfoFormValues>({
    resolver: zodResolver(healthInfoSchema),
    defaultValues: {},
  });

  useEffect(() => {
    async function loadHealthInfo() {
      try {
        const data = await getHealthInfoByStudent(studentId);
        if (data) {
          form.reset(data);
        }
      } catch (error) {
        console.error("Sağlık bilgileri yüklenirken hata:", error);
      }
    }
    loadHealthInfo();
  }, [studentId, form]);

  const onSubmit = async (data: HealthInfoFormValues) => {
    setLoading(true);
    try {
      await createOrUpdateHealthInfo({ studentId, ...data });
      toast.success("Sağlık bilgileri kaydedildi");
      onUpdate?.();
    } catch (error) {
      toast.error("Sağlık bilgileri kaydedilirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sağlık Bilgileri</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bloodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kan Grubu</FormLabel>
                    <FormControl>
                      <Input placeholder="Örn: A Rh+" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastHealthCheckup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Son Sağlık Kontrolü</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="allergies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alerjiler</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Bilinen alerjiler..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chronicDiseases"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kronik Hastalıklar</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Kronik hastalıklar..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentMedications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kullanılan İlaçlar</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Düzenli kullanılan ilaçlar..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold mb-3">Acil Durum İletişim 1</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="emergencyContact1Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ad Soyad</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyContact1Phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefon</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyContact1Relation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yakınlık</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold mb-3">Acil Durum İletişim 2</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="emergencyContact2Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ad Soyad</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyContact2Phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefon</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyContact2Relation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yakınlık</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notlar</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ek notlar..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading}>
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
