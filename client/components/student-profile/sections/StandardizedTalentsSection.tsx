import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import { TagInput } from "@/components/ui/tag-input";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { 
  CREATIVE_TALENTS, 
  PHYSICAL_TALENTS,
  INTEREST_AREAS 
} from "@/shared/constants/student-profile-taxonomy";

const talentsInterestsSchema = z.object({
  assessmentDate: z.string(),
  creativeTalents: z.array(z.string()).default([]),
  physicalTalents: z.array(z.string()).default([]),
  primaryInterests: z.array(z.string()).default([]),
  exploratoryInterests: z.array(z.string()).default([]),
  weeklyEngagementHours: z.number().min(0).default(0),
  clubMemberships: z.array(z.string()).default([]),
  competitionsParticipated: z.array(z.string()).default([]),
  additionalNotes: z.string().optional(),
});

type TalentsInterestsFormValues = z.infer<typeof talentsInterestsSchema>;

interface StandardizedTalentsSectionProps {
  studentId: string;
  talentsData?: any;
  onUpdate: () => void;
}

export default function StandardizedTalentsSection({ 
  studentId, 
  talentsData,
  onUpdate 
}: StandardizedTalentsSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TalentsInterestsFormValues>({
    resolver: zodResolver(talentsInterestsSchema),
    defaultValues: {
      assessmentDate: talentsData?.assessmentDate || new Date().toISOString().slice(0, 10),
      creativeTalents: talentsData?.creativeTalents ? JSON.parse(talentsData.creativeTalents) : [],
      physicalTalents: talentsData?.physicalTalents ? JSON.parse(talentsData.physicalTalents) : [],
      primaryInterests: talentsData?.primaryInterests ? JSON.parse(talentsData.primaryInterests) : [],
      exploratoryInterests: talentsData?.exploratoryInterests ? JSON.parse(talentsData.exploratoryInterests) : [],
      weeklyEngagementHours: talentsData?.weeklyEngagementHours || 0,
      clubMemberships: talentsData?.clubMemberships ? JSON.parse(talentsData.clubMemberships) : [],
      competitionsParticipated: talentsData?.competitionsParticipated ? JSON.parse(talentsData.competitionsParticipated) : [],
      additionalNotes: talentsData?.additionalNotes || "",
    },
  });

  const onSubmit = async (data: TalentsInterestsFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        id: talentsData?.id || crypto.randomUUID(),
        studentId,
        ...data,
        creativeTalents: JSON.stringify(data.creativeTalents),
        physicalTalents: JSON.stringify(data.physicalTalents),
        primaryInterests: JSON.stringify(data.primaryInterests),
        exploratoryInterests: JSON.stringify(data.exploratoryInterests),
        clubMemberships: JSON.stringify(data.clubMemberships),
        competitionsParticipated: JSON.stringify(data.competitionsParticipated),
      };

      toast.success("Yetenek ve ilgi alanları kaydedildi");
      onUpdate();
    } catch (error) {
      toast.error("Kayıt sırasında hata oluştu");
      console.error("Error saving talents:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Standartlaştırılmış Yetenek & İlgi Profili
        </CardTitle>
        <CardDescription>
          Kategorize edilmiş yetenekler ve ilgi alanları
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

            <FormField
              control={form.control}
              name="creativeTalents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yaratıcı & Sanatsal Yetenekler</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={CREATIVE_TALENTS}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder="Yaratıcı yeteneklerini seçiniz..."
                      groupByCategory
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="physicalTalents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fiziksel & Sportif Yetenekler</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={PHYSICAL_TALENTS}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder="Sportif yeteneklerini seçiniz..."
                      groupByCategory
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="primaryInterests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ana İlgi Alanları</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={INTEREST_AREAS}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder="Ana ilgi alanlarını seçiniz..."
                      groupByCategory
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="exploratoryInterests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keşfedilen/Gelişen İlgi Alanları</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={INTEREST_AREAS}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder="Yeni ilgi alanlarını seçiniz..."
                      groupByCategory
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weeklyEngagementHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Haftalık Aktivite Saati</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clubMemberships"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kulüp Üyelikleri</FormLabel>
                  <FormControl>
                    <TagInput
                      tags={field.value}
                      onChange={field.onChange}
                      placeholder="Kulüp adı ekle..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="competitionsParticipated"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Katıldığı Yarışmalar/Turnuvalar</FormLabel>
                  <FormControl>
                    <TagInput
                      tags={field.value}
                      onChange={field.onChange}
                      placeholder="Yarışma adı ekle..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
