import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EnhancedTextarea } from "@/components/ui/enhanced-textarea";
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
import { CalendarDays } from "lucide-react";
import { MeetingNote, addNote } from "@/lib/storage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const meetingTypes = ["Bireysel", "Grup", "Veli"] as const;

const meetingNoteSchema = z.object({
  date: z.string().min(1, "Görüşme tarihi gereklidir"),
  type: z.enum(meetingTypes),
  note: z.string().min(1, "Görüşme notu gereklidir"),
  plan: z.string().optional(),
});

type MeetingNoteFormValues = z.infer<typeof meetingNoteSchema>;

interface GorusmelerSectionProps {
  studentId: string;
  notes: MeetingNote[];
  onUpdate: () => void;
}

export default function GorusmelerSection({ studentId, notes, onUpdate }: GorusmelerSectionProps) {
  const form = useForm<MeetingNoteFormValues>({
    resolver: zodResolver(meetingNoteSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 16),
      type: "Bireysel",
      note: "",
      plan: "",
    },
  });

  const onSubmit = async (data: MeetingNoteFormValues) => {
    try {
      await addNote({
        id: crypto.randomUUID(),
        studentId,
        date: data.date,
        type: data.type,
        note: data.note,
        plan: data.plan || "",
      });
      
      toast.success("Görüşme kaydedildi");
      form.reset();
      onUpdate();
    } catch (error) {
      toast.error("Kayıt sırasında hata oluştu");
      console.error("Error saving meeting note:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Görüşme Kayıtları
        </CardTitle>
        <CardDescription>
          Not ekleyin ve eylem planını takip edin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Tür" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Bireysel">Bireysel</SelectItem>
                        <SelectItem value="Grup">Grup</SelectItem>
                        <SelectItem value="Veli">Veli</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={form.formState.isSubmitting}>
                <CalendarDays className="mr-2 h-4 w-4" />
                {form.formState.isSubmitting ? "Kaydediliyor..." : "Kaydı Ekle"}
              </Button>
            </div>
            
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <EnhancedTextarea placeholder="Görüşme notu" {...field} aiContext="counseling" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="plan"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Eylem planı (opsiyonel)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="space-y-3 mt-4">
          {notes.length === 0 && (
            <div className="text-sm text-muted-foreground">
              Henüz kayıt yok.
            </div>
          )}
          {notes.map((n) => (
            <div key={n.id} className="rounded-md border p-3">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{n.type}</Badge>{" "}
                  {new Date(n.date).toLocaleString()}
                </div>
                {n.plan && (
                  <span className="text-xs">Plan: {n.plan}</span>
                )}
              </div>
              <div className="mt-2 whitespace-pre-wrap text-sm">
                {n.note}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
