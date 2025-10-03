import { HealthInfo, saveHealthInfo } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Activity } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const healthInfoSchema = z.object({
  bloodType: z.string().optional(),
  chronicDiseases: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  specialNeeds: z.string().optional(),
  emergencyContact1Name: z.string().optional(),
  emergencyContact1Phone: z.string().optional(),
  emergencyContact1Relation: z.string().optional(),
  emergencyContact2Name: z.string().optional(),
  emergencyContact2Phone: z.string().optional(),
  emergencyContact2Relation: z.string().optional(),
  physicianName: z.string().optional(),
  physicianPhone: z.string().optional(),
  lastHealthCheckup: z.string().optional(),
  notes: z.string().optional(),
});

type HealthInfoFormValues = z.infer<typeof healthInfoSchema>;

interface SaglikBilgileriSectionProps {
  studentId: string;
  healthInfo: HealthInfo | null;
  onUpdate: () => void;
}

export default function SaglikBilgileriSection({ studentId, healthInfo, onUpdate }: SaglikBilgileriSectionProps) {
  const form = useForm<HealthInfoFormValues>({
    resolver: zodResolver(healthInfoSchema),
    defaultValues: {
      bloodType: healthInfo?.bloodType || "",
      chronicDiseases: healthInfo?.chronicDiseases || "",
      allergies: healthInfo?.allergies || "",
      medications: healthInfo?.medications || "",
      specialNeeds: healthInfo?.specialNeeds || "",
      emergencyContact1Name: healthInfo?.emergencyContact1Name || "",
      emergencyContact1Phone: healthInfo?.emergencyContact1Phone || "",
      emergencyContact1Relation: healthInfo?.emergencyContact1Relation || "",
      emergencyContact2Name: healthInfo?.emergencyContact2Name || "",
      emergencyContact2Phone: healthInfo?.emergencyContact2Phone || "",
      emergencyContact2Relation: healthInfo?.emergencyContact2Relation || "",
      physicianName: healthInfo?.physicianName || "",
      physicianPhone: healthInfo?.physicianPhone || "",
      lastHealthCheckup: healthInfo?.lastHealthCheckup || "",
      notes: healthInfo?.notes || "",
    },
  });

  const onSubmit = async (data: HealthInfoFormValues) => {
    try {
      const healthData: HealthInfo = {
        id: healthInfo?.id || crypto.randomUUID(),
        studentId,
        ...data,
      };
      
      await saveHealthInfo(healthData);
      toast.success("Sağlık bilgileri kaydedildi");
      onUpdate();
    } catch (error) {
      toast.error("Kayıt sırasında hata oluştu");
      console.error("Error saving health info:", error);
    }
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Sağlık Bilgileri ve Acil Durum</CardTitle>
          <CardDescription>Öğrencinin sağlık bilgileri ve acil iletişim</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Kan Grubu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="physicianName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Doktor Adı" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="physicianPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Doktor Telefon" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="chronicDiseases"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="Kronik Hastalıklar" rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="Alerjiler" rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="medications"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="İlaçlar" rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="specialNeeds"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="Özel İhtiyaçlar" rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="border-t pt-3 mt-3">
                <h4 className="font-medium mb-3">Acil İletişim Kişileri</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name="emergencyContact1Name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="1. Kişi Adı" {...field} />
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
                        <FormControl>
                          <Input placeholder="1. Kişi Telefon" {...field} />
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
                        <FormControl>
                          <Input placeholder="1. Kişi Yakınlık" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                  <FormField
                    control={form.control}
                    name="emergencyContact2Name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="2. Kişi Adı" {...field} />
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
                        <FormControl>
                          <Input placeholder="2. Kişi Telefon" {...field} />
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
                        <FormControl>
                          <Input placeholder="2. Kişi Yakınlık" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="lastHealthCheckup"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="date" placeholder="Son Sağlık Kontrolü" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="Ek Notlar" rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                <Activity className="mr-2 h-4 w-4" />
                {form.formState.isSubmitting ? "Kaydediliyor..." : "Sağlık Bilgisi Kaydet"}
              </Button>
            </form>
          </Form>
          
          {healthInfo && (
            <div className="space-y-2 mt-4">
              <h4 className="font-medium">Kayıtlı Sağlık Bilgileri</h4>
              <div className="border rounded-lg p-3 space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  {healthInfo.bloodType && <div><strong>Kan Grubu:</strong> {healthInfo.bloodType}</div>}
                  {healthInfo.physicianName && <div><strong>Doktor:</strong> {healthInfo.physicianName}</div>}
                </div>
                {healthInfo.chronicDiseases && <div><strong>Kronik Hastalıklar:</strong> {healthInfo.chronicDiseases}</div>}
                {healthInfo.allergies && <div><strong>Alerjiler:</strong> {healthInfo.allergies}</div>}
                {healthInfo.emergencyContact1Name && (
                  <div><strong>Acil İletişim 1:</strong> {healthInfo.emergencyContact1Name} - {healthInfo.emergencyContact1Phone}</div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
