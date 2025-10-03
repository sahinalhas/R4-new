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
import { BarChart2 } from "lucide-react";
import { ExamResult, addExamResult } from "@/lib/storage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const examTypes = ["LGS", "YKS_TYT", "YKS_AYT", "YKS_YDT", "DENEME", "DİĞER"] as const;

const examResultSchema = z.object({
  examType: z.enum(examTypes),
  examName: z.string().min(1, "Sınav adı gereklidir"),
  examDate: z.string().min(1, "Sınav tarihi gereklidir"),
  examProvider: z.string().optional(),
  totalScore: z.string().optional(),
  turkishScore: z.string().optional(),
  mathScore: z.string().optional(),
  scienceScore: z.string().optional(),
  socialScore: z.string().optional(),
  foreignLanguageScore: z.string().optional(),
  turkishNet: z.string().optional(),
  mathNet: z.string().optional(),
  scienceNet: z.string().optional(),
  socialNet: z.string().optional(),
  foreignLanguageNet: z.string().optional(),
  totalNet: z.string().optional(),
  classRank: z.string().optional(),
  schoolRank: z.string().optional(),
  isOfficial: z.boolean().default(false),
  strengthAreas: z.string().optional(),
  weaknessAreas: z.string().optional(),
  counselorNotes: z.string().optional(),
});

type ExamResultFormValues = z.infer<typeof examResultSchema>;

interface SinavSonuclariSectionProps {
  studentId: string;
  examResults: ExamResult[];
  onUpdate: () => void;
}

function parseNumberOrUndefined(value: string): number | undefined {
  if (!value || !value.trim()) return undefined;
  const num = Number(value.trim());
  return Number.isFinite(num) ? num : undefined;
}

export default function SinavSonuclariSection({ studentId, examResults, onUpdate }: SinavSonuclariSectionProps) {
  const form = useForm<ExamResultFormValues>({
    resolver: zodResolver(examResultSchema),
    defaultValues: {
      examType: "DENEME",
      examName: "",
      examDate: new Date().toISOString().slice(0, 10),
      examProvider: "",
      totalScore: "",
      turkishScore: "",
      mathScore: "",
      scienceScore: "",
      socialScore: "",
      foreignLanguageScore: "",
      turkishNet: "",
      mathNet: "",
      scienceNet: "",
      socialNet: "",
      foreignLanguageNet: "",
      totalNet: "",
      classRank: "",
      schoolRank: "",
      isOfficial: false,
      strengthAreas: "",
      weaknessAreas: "",
      counselorNotes: "",
    },
  });

  const onSubmit = async (data: ExamResultFormValues) => {
    try {
      const examData: ExamResult = {
        id: crypto.randomUUID(),
        studentId,
        examType: data.examType,
        examName: data.examName,
        examDate: data.examDate,
        examProvider: data.examProvider || undefined,
        totalScore: parseNumberOrUndefined(data.totalScore || ""),
        turkishScore: parseNumberOrUndefined(data.turkishScore || ""),
        mathScore: parseNumberOrUndefined(data.mathScore || ""),
        scienceScore: parseNumberOrUndefined(data.scienceScore || ""),
        socialScore: parseNumberOrUndefined(data.socialScore || ""),
        foreignLanguageScore: parseNumberOrUndefined(data.foreignLanguageScore || ""),
        turkishNet: parseNumberOrUndefined(data.turkishNet || ""),
        mathNet: parseNumberOrUndefined(data.mathNet || ""),
        scienceNet: parseNumberOrUndefined(data.scienceNet || ""),
        socialNet: parseNumberOrUndefined(data.socialNet || ""),
        foreignLanguageNet: parseNumberOrUndefined(data.foreignLanguageNet || ""),
        totalNet: parseNumberOrUndefined(data.totalNet || ""),
        classRank: parseNumberOrUndefined(data.classRank || ""),
        schoolRank: parseNumberOrUndefined(data.schoolRank || ""),
        isOfficial: data.isOfficial,
        strengthAreas: data.strengthAreas 
          ? data.strengthAreas.split(",").map(s => s.trim()).filter(Boolean) 
          : undefined,
        weaknessAreas: data.weaknessAreas 
          ? data.weaknessAreas.split(",").map(s => s.trim()).filter(Boolean) 
          : undefined,
        counselorNotes: data.counselorNotes || undefined,
        goalsMet: false,
        parentNotified: false,
      };

      await addExamResult(examData);
      toast.success("Sınav sonucu kaydedildi");
      form.reset();
      onUpdate();
    } catch (error) {
      toast.error("Kayıt sırasında hata oluştu");
      console.error("Error saving exam result:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5" />
          Sınav Sonuçları - LGS/YKS
        </CardTitle>
        <CardDescription>Merkezi sınav ve deneme sonuçları takibi</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                        <SelectItem value="LGS">LGS</SelectItem>
                        <SelectItem value="YKS_TYT">YKS - TYT</SelectItem>
                        <SelectItem value="YKS_AYT">YKS - AYT</SelectItem>
                        <SelectItem value="YKS_YDT">YKS - YDT</SelectItem>
                        <SelectItem value="DENEME">Deneme Sınavı</SelectItem>
                        <SelectItem value="DİĞER">Diğer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="examName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Sınav Adı" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="examDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="date" placeholder="Sınav Tarihi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="examProvider"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Sınav Sağlayıcı" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="border-t pt-3 mt-3">
              <h4 className="font-medium mb-2">Puan Bilgileri</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <FormField
                  control={form.control}
                  name="totalScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" placeholder="Toplam Puan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="turkishScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" placeholder="Türkçe Puan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="mathScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" placeholder="Matematik Puan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="scienceScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" placeholder="Fen Puan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="socialScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" placeholder="Sosyal Puan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="foreignLanguageScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" placeholder="Yabancı Dil" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="border-t pt-3 mt-3">
              <h4 className="font-medium mb-2">Net Bilgileri</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <FormField
                  control={form.control}
                  name="turkishNet"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" step="0.25" placeholder="Türkçe Net" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="mathNet"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" step="0.25" placeholder="Matematik Net" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="scienceNet"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" step="0.25" placeholder="Fen Net" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="socialNet"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" step="0.25" placeholder="Sosyal Net" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="foreignLanguageNet"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" step="0.25" placeholder="Yabancı Dil Net" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="totalNet"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" step="0.25" placeholder="Toplam Net" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="classRank"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="number" placeholder="Sınıf Sıralaması" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="schoolRank"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="number" placeholder="Okul Sıralaması" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="isOfficial"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <input 
                      type="checkbox" 
                      className="h-4 w-4" 
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0 cursor-pointer">Resmi Sınav</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="strengthAreas"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Güçlü Alanlar (virgülle ayırın)" rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="weaknessAreas"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Gelişim Alanları (virgülle ayırın)" rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="counselorNotes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Danışman Notları ve Eylem Planı" rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              <BarChart2 className="mr-2 h-4 w-4" />
              {form.formState.isSubmitting ? "Kaydediliyor..." : "Sınav Sonucu Kaydet"}
            </Button>
          </form>
        </Form>
        
        {examResults.length > 0 && (
          <div className="space-y-2 mt-6">
            <h4 className="font-medium">Sınav Geçmişi</h4>
            {examResults.map(exam => (
              <div key={exam.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{exam.examName}</div>
                  <div className="flex items-center gap-2">
                    <Badge>{exam.examType}</Badge>
                    {exam.isOfficial && <Badge variant="default">Resmi</Badge>}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(exam.examDate).toLocaleDateString()}
                </div>
                {exam.totalScore && (
                  <div className="text-lg font-bold">Toplam: {exam.totalScore}</div>
                )}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {exam.turkishNet !== undefined && <div>Türkçe Net: {exam.turkishNet}</div>}
                  {exam.mathNet !== undefined && <div>Matematik Net: {exam.mathNet}</div>}
                  {exam.scienceNet !== undefined && <div>Fen Net: {exam.scienceNet}</div>}
                  {exam.socialNet !== undefined && <div>Sosyal Net: {exam.socialNet}</div>}
                </div>
                {exam.totalNet !== undefined && (
                  <div className="text-sm font-medium">Toplam Net: {exam.totalNet}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
