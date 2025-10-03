import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Target } from "lucide-react";
import { AcademicGoal, addAcademicGoal } from "@/lib/storage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const examTypes = ["YKS", "LGS", "TYT", "AYT", "Kişisel"] as const;

const academicGoalSchema = z.object({
  examType: z.enum(examTypes),
  targetScore: z.string().optional(),
  currentScore: z.string().optional(),
});

type AcademicGoalFormValues = z.infer<typeof academicGoalSchema>;

interface HedeflerPlanlamaSectionProps {
  studentId: string;
  academicGoals: AcademicGoal[];
  onUpdate: () => void;
}

function parseNumberOrUndefined(value: string): number | undefined {
  if (!value || !value.trim()) return undefined;
  const num = Number(value.trim());
  return Number.isFinite(num) ? num : undefined;
}

export default function HedeflerPlanlamaSection({ 
  studentId, 
  academicGoals, 
  onUpdate 
}: HedeflerPlanlamaSectionProps) {
  const form = useForm<AcademicGoalFormValues>({
    resolver: zodResolver(academicGoalSchema),
    defaultValues: {
      examType: "YKS",
      targetScore: "",
      currentScore: "",
    },
  });

  const onSubmit = async (data: AcademicGoalFormValues) => {
    try {
      const target = parseNumberOrUndefined(data.targetScore || "");
      const current = parseNumberOrUndefined(data.currentScore || "");
      
      const academicGoal: AcademicGoal = {
        id: crypto.randomUUID(),
        studentId,
        examType: data.examType as any,
        targetScore: target,
        currentScore: current,
        deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        createdAt: new Date().toISOString(),
      };
      
      await addAcademicGoal(academicGoal);
      toast.success("Akademik hedef eklendi");
      form.reset();
      onUpdate();
    } catch (error) {
      toast.error("Kayıt sırasında hata oluştu");
      console.error("Error saving academic goal:", error);
    }
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            SMART Hedefler
          </CardTitle>
          <CardDescription>Spesifik, Ölçülebilir, Ulaşılabilir, Relevans, Zaman-bound hedefler</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="examType"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sınav Türü" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="YKS">YKS</SelectItem>
                          <SelectItem value="LGS">LGS</SelectItem>
                          <SelectItem value="TYT">TYT</SelectItem>
                          <SelectItem value="AYT">AYT</SelectItem>
                          <SelectItem value="Kişisel">Kişisel Hedef</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="targetScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Hedef Puan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="currentScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Mevcut Puan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Ekleniyor..." : "Akademik Hedef Ekle"}
              </Button>
            </form>
          </Form>

          <div className="space-y-3 mt-4">
            <h4 className="font-medium">Mevcut Hedefler</h4>
            {academicGoals.map(goal => (
              <div key={goal.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{goal.examType} Hedefi</div>
                  <Badge variant="outline">
                    Son Tarih: {new Date(goal.deadline).toLocaleDateString()}
                  </Badge>
                </div>
                {goal.targetScore && goal.currentScore && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>İlerleme: {goal.currentScore} / {goal.targetScore}</span>
                      <span>{Math.round((goal.currentScore / goal.targetScore) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-primary rounded-full transition-all"
                        style={{ width: `${Math.min(100, (goal.currentScore / goal.targetScore) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
