import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  FormMessage,
} from "@/components/ui/form";
import { Intervention, addIntervention } from "@/lib/storage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const interventionStatuses = ["Planlandı", "Devam Ediyor", "Tamamlandı", "İptal Edildi"] as const;

const interventionSchema = z.object({
  date: z.string().min(1, "Tarih gereklidir"),
  title: z.string().min(1, "Müdahale başlığı gereklidir"),
  status: z.enum(interventionStatuses),
});

type InterventionFormValues = z.infer<typeof interventionSchema>;

interface MudahalelerSectionProps {
  studentId: string;
  interventions: Intervention[];
  onUpdate: () => void;
}

export default function MudahalelerSection({ 
  studentId, 
  interventions, 
  onUpdate 
}: MudahalelerSectionProps) {
  const form = useForm<InterventionFormValues>({
    resolver: zodResolver(interventionSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      title: "",
      status: "Planlandı",
    },
  });

  const onSubmit = async (data: InterventionFormValues) => {
    try {
      const intervention: Intervention = {
        id: crypto.randomUUID(),
        studentId: studentId,
        title: data.title,
        status: data.status as any,
        date: data.date,
      };
      
      await addIntervention(intervention);
      toast.success("Müdahale kaydedildi");
      form.reset();
      onUpdate();
    } catch (error) {
      toast.error("Kayıt sırasında hata oluştu");
      console.error("Error saving intervention:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Müdahaleler</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Müdahale Başlığı" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Durum" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Planlandı">Planlandı</SelectItem>
                        <SelectItem value="Devam Ediyor">Devam Ediyor</SelectItem>
                        <SelectItem value="Tamamlandı">Tamamlandı</SelectItem>
                        <SelectItem value="İptal Edildi">İptal Edildi</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </form>
        </Form>
        
        <div className="space-y-2 mt-4">
          {interventions.map(intervention => (
            <div key={intervention.id} className="border rounded p-3 space-y-1">
              <div className="flex items-center justify-between">
                <div className="font-medium">{intervention.title}</div>
                <Badge variant={intervention.status === "Tamamlandı" ? "default" : 
                               intervention.status === "Devam" ? "secondary" : "outline"}>
                  {intervention.status}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Tarih: {new Date(intervention.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
