import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Users } from "lucide-react";
import { ParentMeeting, addParentMeeting } from "@/lib/storage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const meetingTypes = ["YÜZ_YÜZE", "TELEFON", "ONLINE", "EV_ZİYARETİ"] as const;

const parentMeetingSchema = z.object({
  meetingDate: z.string().min(1, "Görüşme tarihi gereklidir"),
  time: z.string().min(1, "Görüşme saati gereklidir"),
  type: z.enum(meetingTypes),
  participants: z.string().min(1, "Katılımcı bilgisi gereklidir"),
  mainTopics: z.string().min(1, "Ana konular gereklidir"),
  concerns: z.string().optional(),
  decisions: z.string().optional(),
  actionPlan: z.string().optional(),
  nextMeetingDate: z.string().optional(),
  parentSatisfaction: z.string().optional(),
});

type ParentMeetingFormValues = z.infer<typeof parentMeetingSchema>;

interface VeliGorusmeleriSectionProps {
  studentId: string;
  parentMeetings: ParentMeeting[];
  onUpdate: () => void;
}

export default function VeliGorusmeleriSection({ studentId, parentMeetings, onUpdate }: VeliGorusmeleriSectionProps) {
  const form = useForm<ParentMeetingFormValues>({
    resolver: zodResolver(parentMeetingSchema),
    defaultValues: {
      meetingDate: new Date().toISOString().slice(0, 10),
      time: "14:00",
      type: "YÜZ_YÜZE",
      participants: "",
      mainTopics: "",
      concerns: "",
      decisions: "",
      actionPlan: "",
      nextMeetingDate: "",
      parentSatisfaction: "",
    },
  });

  const onSubmit = async (data: ParentMeetingFormValues) => {
    try {
      const parentMeeting: ParentMeeting = {
        id: crypto.randomUUID(),
        studentId,
        meetingDate: data.meetingDate,
        time: data.time,
        type: data.type,
        participants: data.participants.split(",").map(p => p.trim()).filter(Boolean),
        mainTopics: data.mainTopics.split(",").map(t => t.trim()).filter(Boolean),
        concerns: data.concerns || undefined,
        decisions: data.decisions || undefined,
        actionPlan: data.actionPlan || undefined,
        nextMeetingDate: data.nextMeetingDate || undefined,
        parentSatisfaction: data.parentSatisfaction ? Number(data.parentSatisfaction) : undefined,
        followUpRequired: !!data.nextMeetingDate || !!data.actionPlan,
        notes: undefined,
        createdBy: "Sistem",
        createdAt: new Date().toISOString(),
      };

      await addParentMeeting(parentMeeting);
      toast.success("Veli görüşmesi kaydedildi");
      form.reset();
      onUpdate();
    } catch (error) {
      toast.error("Kayıt sırasında hata oluştu");
      console.error("Error saving parent meeting:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Veli Görüşme Kayıtları
        </CardTitle>
        <CardDescription>
          Detaylı veli görüşme kayıtları ve takip planları
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="meetingDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="date" placeholder="Görüşme Tarihi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="time" placeholder="Görüşme Saati" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Görüşme Türü" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="YÜZ_YÜZE">Yüz Yüze</SelectItem>
                        <SelectItem value="TELEFON">Telefon</SelectItem>
                        <SelectItem value="ONLINE">Online</SelectItem>
                        <SelectItem value="EV_ZİYARETİ">Ev Ziyareti</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="participants"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Katılımcılar (virgülle ayırın)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="mainTopics"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Ana konular (virgülle ayırın)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="concerns"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Endişeler ve sorunlar" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="decisions"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Alınan kararlar" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="actionPlan"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Eylem planı" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="nextMeetingDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="date" placeholder="Sonraki görüşme tarihi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="parentSatisfaction"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Veli Memnuniyeti (1-10)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              <Users className="mr-2 h-4 w-4" />
              {form.formState.isSubmitting ? "Kaydediliyor..." : "Veli Görüşmesi Kaydet"}
            </Button>
          </form>
        </Form>

        <div className="space-y-3 mt-6">
          <h4 className="font-medium">Görüşme Geçmişi</h4>
          {parentMeetings.length === 0 && (
            <div className="text-sm text-muted-foreground">
              Henüz veli görüşmesi kaydı yok.
            </div>
          )}
          {parentMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="border rounded-lg p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  {new Date(meeting.meetingDate).toLocaleDateString()} - {meeting.time}
                </div>
                <Badge variant="outline">{meeting.type}</Badge>
              </div>
              <div className="text-sm">
                <strong>Katılımcılar:</strong> {meeting.participants.join(", ")}
              </div>
              <div className="text-sm">
                <strong>Ana Konular:</strong> {meeting.mainTopics.join(", ")}
              </div>
              {meeting.concerns && (
                <div className="text-sm text-muted-foreground">
                  <strong>Endişeler:</strong> {meeting.concerns}
                </div>
              )}
              {meeting.actionPlan && (
                <div className="text-sm text-muted-foreground">
                  <strong>Eylem Planı:</strong> {meeting.actionPlan}
                </div>
              )}
              {meeting.parentSatisfaction && (
                <div className="text-sm">
                  <Badge variant="secondary">
                    Memnuniyet: {meeting.parentSatisfaction}/10
                  </Badge>
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                Kaydeden: {meeting.createdBy}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
