import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Target, Edit, Plus } from "lucide-react";
import { holisticProfileApi } from "@/lib/api/holistic-profile.api";
import type { StudentFutureVision } from "@shared/types";

export default function FutureVisionSection({ studentId, onUpdate }: { studentId: string; onUpdate: () => void }) {
  const [data, setData] = useState<StudentFutureVision | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm();

  useEffect(() => {
    holisticProfileApi.getLatestFutureVision(studentId).then(d => {
      if (d) { setData(d); form.reset(d); } else { setIsEditing(true); }
    }).catch(console.error);
  }, [studentId]);

  const onSubmit = async (formData: any) => {
    try {
      if (data?.id) {
        await holisticProfileApi.updateFutureVision(data.id, formData);
      } else {
        await holisticProfileApi.createFutureVision({ studentId, assessmentDate: new Date().toISOString(), ...formData });
      }
      const updated = await holisticProfileApi.getLatestFutureVision(studentId);
      setData(updated);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />Gelecek Vizyonu & Motivasyon
            </CardTitle>
            <CardDescription>Hedefler, hayaller, kariyer aspirasyonları ve motivasyon kaynakları</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "İptal" : data ? <><Edit className="h-4 w-4 mr-2" />Düzenle</> : <><Plus className="h-4 w-4 mr-2" />Ekle</>}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="shortTermGoals" render={({ field }) => (
                <FormItem>
                  <FormLabel>Kısa Vadeli Hedefler</FormLabel>
                  <FormControl><Textarea placeholder="Bu yıl, bu dönem için hedefler..." {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="longTermGoals" render={({ field }) => (
                <FormItem>
                  <FormLabel>Uzun Vadeli Hedefler</FormLabel>
                  <FormControl><Textarea placeholder="5-10 yıllık hedefler..." {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="careerAspirations" render={({ field }) => (
                <FormItem>
                  <FormLabel>Kariyer Aspirasyonları</FormLabel>
                  <FormControl><Textarea placeholder="Meslek hedefleri, kariyer planı..." {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="dreamJob" render={({ field }) => (
                <FormItem>
                  <FormLabel>Hayalindeki Meslek</FormLabel>
                  <FormControl><Textarea placeholder="İdeal meslek..." {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="universityPreferences" render={({ field }) => (
                <FormItem>
                  <FormLabel>Üniversite Tercihleri</FormLabel>
                  <FormControl><Textarea placeholder="Hedef üniversiteler..." {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="fearsAndConcerns" render={({ field }) => (
                <FormItem>
                  <FormLabel>Korkular ve Kaygılar</FormLabel>
                  <FormControl><Textarea placeholder="Geleceğe dair korkular..." {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="motivationSources" render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivasyon Kaynakları</FormLabel>
                  <FormControl><Textarea placeholder="Neyin motive ettiği..." {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem>
                  <FormLabel>Notlar</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                </FormItem>
              )} />
              <Button type="submit">Kaydet</Button>
            </form>
          </Form>
        ) : data ? (
          <div className="space-y-3">
            {data.shortTermGoals && <div><strong>Kısa Vadeli Hedefler:</strong> {data.shortTermGoals}</div>}
            {data.longTermGoals && <div><strong>Uzun Vadeli Hedefler:</strong> {data.longTermGoals}</div>}
            {data.careerAspirations && <div><strong>Kariyer Aspirasyonları:</strong> {data.careerAspirations}</div>}
            {data.dreamJob && <div><strong>Hayalindeki Meslek:</strong> {data.dreamJob}</div>}
            {data.universityPreferences && <div><strong>Üniversite Tercihleri:</strong> {data.universityPreferences}</div>}
            {data.motivationSources && <div><strong>Motivasyon Kaynakları:</strong> {data.motivationSources}</div>}
          </div>
        ) : <p className="text-sm text-muted-foreground">Henüz veri yok.</p>}
      </CardContent>
    </Card>
  );
}
