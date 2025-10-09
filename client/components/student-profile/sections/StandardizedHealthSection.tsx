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
import { MultiSelect } from "@/components/ui/multi-select";
import { toast } from "sonner";
import { Activity } from "lucide-react";
import { 
  BLOOD_TYPES, 
  CHRONIC_DISEASES, 
  ALLERGIES, 
  MEDICATION_TYPES 
} from "@/shared/constants/student-profile-taxonomy";

const healthSchema = z.object({
  bloodType: z.string().optional(),
  chronicDiseases: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  currentMedications: z.array(z.string()).default([]),
  medicalHistory: z.string().optional(),
  specialNeeds: z.string().optional(),
  physicalLimitations: z.string().optional(),
  emergencyContact1Name: z.string().optional(),
  emergencyContact1Phone: z.string().optional(),
  emergencyContact1Relation: z.string().optional(),
  emergencyContact2Name: z.string().optional(),
  emergencyContact2Phone: z.string().optional(),
  emergencyContact2Relation: z.string().optional(),
  physicianName: z.string().optional(),
  physicianPhone: z.string().optional(),
  lastHealthCheckup: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type HealthFormValues = z.infer<typeof healthSchema>;

interface StandardizedHealthSectionProps {
  studentId: string;
  healthData?: any;
  onUpdate: () => void;
}

export default function StandardizedHealthSection({ 
  studentId, 
  healthData,
  onUpdate 
}: StandardizedHealthSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<HealthFormValues>({
    resolver: zodResolver(healthSchema),
    defaultValues: {
      bloodType: healthData?.bloodType || "",
      chronicDiseases: Array.isArray(healthData?.chronicDiseases) 
        ? healthData.chronicDiseases 
        : healthData?.chronicDiseases 
          ? JSON.parse(healthData.chronicDiseases) 
          : [],
      allergies: Array.isArray(healthData?.allergies)
        ? healthData.allergies
        : healthData?.allergies
          ? JSON.parse(healthData.allergies)
          : [],
      currentMedications: Array.isArray(healthData?.currentMedications)
        ? healthData.currentMedications
        : healthData?.currentMedications
          ? JSON.parse(healthData.currentMedications)
          : [],
      medicalHistory: healthData?.medicalHistory || "",
      specialNeeds: healthData?.specialNeeds || "",
      physicalLimitations: healthData?.physicalLimitations || "",
      emergencyContact1Name: healthData?.emergencyContact1Name || "",
      emergencyContact1Phone: healthData?.emergencyContact1Phone || "",
      emergencyContact1Relation: healthData?.emergencyContact1Relation || "",
      emergencyContact2Name: healthData?.emergencyContact2Name || "",
      emergencyContact2Phone: healthData?.emergencyContact2Phone || "",
      emergencyContact2Relation: healthData?.emergencyContact2Relation || "",
      physicianName: healthData?.physicianName || "",
      physicianPhone: healthData?.physicianPhone || "",
      lastHealthCheckup: healthData?.lastHealthCheckup || "",
      additionalNotes: healthData?.additionalNotes || "",
    },
  });

  const onSubmit = async (data: HealthFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        id: healthData?.id || crypto.randomUUID(),
        studentId,
        ...data,
        chronicDiseases: JSON.stringify(data.chronicDiseases),
        allergies: JSON.stringify(data.allergies),
        currentMedications: JSON.stringify(data.currentMedications),
      };

      toast.success("Sağlık bilgileri kaydedildi");
      onUpdate();
    } catch (error) {
      toast.error("Kayıt sırasında hata oluştu");
      console.error("Error saving health info:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Standartlaştırılmış Sağlık Profili
        </CardTitle>
        <CardDescription>
          Yapay zeka analizi için standart kodlanmış sağlık bilgileri
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bloodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kan Grubu</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Kan grubu seçiniz" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BLOOD_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              name="chronicDiseases"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kronik Hastalıklar (Standart Kodlar)</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={CHRONIC_DISEASES}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder="Kronik hastalık seçiniz..."
                      groupByCategory
                    />
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
                  <FormLabel>Alerjiler (Standart Kodlar)</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={ALLERGIES}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder="Alerji seçiniz..."
                      groupByCategory
                    />
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
                  <FormLabel>Kullanılan İlaçlar (Standart Kategoriler)</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={MEDICATION_TYPES}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder="İlaç kategorisi seçiniz..."
                      groupByCategory
                    />
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
                  <FormLabel>Özel İhtiyaçlar</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="physicalLimitations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fiziksel Kısıtlamalar</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
              <FormField
                control={form.control}
                name="emergencyContact1Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Acil Durumİletişim 1 - Ad Soyad</FormLabel>
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
