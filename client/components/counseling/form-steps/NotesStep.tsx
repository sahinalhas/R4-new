import { UseFormReturn } from "react-hook-form";
import { FileText, CheckCircle2, Calendar, MapPin, Users, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import type { IndividualSessionFormValues, GroupSessionFormValues, Student } from "../types";

interface NotesStepProps {
  form: UseFormReturn<IndividualSessionFormValues | GroupSessionFormValues>;
  sessionType: 'individual' | 'group';
  students?: Student[];
  selectedStudents?: Student[];
}

export default function NotesStep({ 
  form, 
  sessionType, 
  students = [],
  selectedStudents = []
}: NotesStepProps) {
  const formValues = form.getValues();
  
  // Get student info for individual sessions
  const getStudentInfo = () => {
    if (sessionType === 'individual' && 'studentId' in formValues) {
      const student = students.find(s => s.id === formValues.studentId);
      return student ? [student] : [];
    }
    return selectedStudents;
  };

  const studentList = getStudentInfo();

  const getSessionModeLabel = (mode: string) => {
    switch (mode) {
      case 'yüz_yüze': return 'Yüz Yüze';
      case 'online': return 'Online';
      case 'telefon': return 'Telefon';
      default: return mode;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-2 border-b">
        <div className="p-2 rounded-lg bg-primary/10">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Notlar & Özet</h3>
          <p className="text-sm text-muted-foreground">
            Ek notlar ekleyin ve bilgileri kontrol edin
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - Notes */}
        <div className="lg:col-span-2 space-y-5">
          <FormField
            control={form.control}
            name="sessionDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Görüşme Notları (Opsiyonel)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Görüşme hakkında eklemek istediğiniz notlar..."
                    className="min-h-[200px] resize-none"
                  />
                </FormControl>
                <FormDescription>
                  Görüşme sırasında veya sonrasında eklemek istediğiniz notları yazabilirsiniz
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tips */}
          <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    Görüşme Kayıt İpuçları
                  </p>
                  <ul className="space-y-1 text-blue-800 dark:text-blue-200">
                    <li>• Görüşme sonrasında detaylı notlar ekleyebilirsiniz</li>
                    <li>• Gözlemlerinizi ve önemli noktaları kaydedin</li>
                    <li>• Öğrencinin durumu ve gelişimi hakkında bilgi ekleyin</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Özet Bilgiler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Students */}
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">
                    {sessionType === 'individual' ? 'Öğrenci' : 'Öğrenciler'}
                  </span>
                </div>
                <div className="space-y-1">
                  {studentList.map((student) => (
                    <div key={student.id} className="text-sm">
                      <p className="font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.className}</p>
                    </div>
                  ))}
                  {studentList.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">Seçilmedi</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Topic */}
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="font-medium">Konu</span>
                </div>
                <p className="text-sm">
                  {formValues.topic || <span className="text-muted-foreground italic">Seçilmedi</span>}
                </p>
              </div>

              <Separator />

              {/* Date & Time */}
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Tarih & Saat</span>
                </div>
                <div className="text-sm space-y-1">
                  {formValues.sessionDate ? (
                    <p>{format(formValues.sessionDate, 'd MMMM yyyy, EEEE', { locale: tr })}</p>
                  ) : (
                    <p className="text-muted-foreground italic">Tarih seçilmedi</p>
                  )}
                  {formValues.sessionTime && (
                    <p className="text-muted-foreground">{formValues.sessionTime}</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Location & Mode */}
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">Yer & Şekil</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    {formValues.sessionLocation || <span className="text-muted-foreground italic">Belirtilmedi</span>}
                  </p>
                  <Badge variant="secondary">
                    {getSessionModeLabel(formValues.sessionMode || '')}
                  </Badge>
                </div>
              </div>

              {/* Participant Type */}
              {formValues.participantType && formValues.participantType !== 'öğrenci' && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">
                      <span className="font-medium">Ek Katılımcı</span>
                    </div>
                    <Badge variant="outline">{formValues.participantType}</Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
