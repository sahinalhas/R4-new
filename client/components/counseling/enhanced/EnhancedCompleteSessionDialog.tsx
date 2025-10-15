import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Star, MessageSquare, Activity, Brain, Target, ArrowRight, FileText, ClipboardCheck, Tag, CheckCircle2, Mic } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EnhancedTextarea as Textarea } from "@/components/ui/enhanced-textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { completeSessionSchema, type CompleteSessionFormValues, type CounselingSession } from "../types";
import SessionTagSelector from "./SessionTagSelector";
import ActionItemsManager from "./ActionItemsManager";
import { VoiceRecorder } from "../../voice/VoiceRecorder";

interface EnhancedCompleteSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: CounselingSession | null;
  onSubmit: (data: CompleteSessionFormValues) => void;
  isPending: boolean;
}

export default function EnhancedCompleteSessionDialog({
  open,
  onOpenChange,
  session,
  onSubmit,
  isPending,
}: EnhancedCompleteSessionDialogProps) {
  const [activeTab, setActiveTab] = useState("summary");
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  const form = useForm<CompleteSessionFormValues>({
    resolver: zodResolver(completeSessionSchema),
    defaultValues: {
      exitTime: new Date().toTimeString().slice(0, 5),
      detailedNotes: "",
      sessionTags: [],
      actionItems: [],
      followUpNeeded: false,
      cooperationLevel: 3,
    },
  });

  const followUpNeeded = form.watch("followUpNeeded");

  const handleSubmit = (data: CompleteSessionFormValues) => {
    onSubmit(data);
    form.reset();
  };

  const getTabIcon = (tab: string) => {
    switch(tab) {
      case "summary": return <FileText className="h-4 w-4" />;
      case "assessment": return <ClipboardCheck className="h-4 w-4" />;
      case "tags": return <Tag className="h-4 w-4" />;
      case "actions": return <Target className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="relative pb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-md opacity-40" />
                <div className="relative p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <DialogTitle className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Görüşmeyi Tamamla
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Görüşme detaylarını kaydedin, etiketleyin ve takip planı oluşturun
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50">
                <TabsTrigger 
                  value="summary" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white py-2.5"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Özet
                </TabsTrigger>
                <TabsTrigger 
                  value="assessment"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white py-2.5"
                >
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  Değerlendirme
                </TabsTrigger>
                <TabsTrigger 
                  value="tags"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-600 data-[state=active]:text-white py-2.5"
                >
                  <Tag className="h-4 w-4 mr-2" />
                  Etiketler
                </TabsTrigger>
                <TabsTrigger 
                  value="actions"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-600 data-[state=active]:text-white py-2.5"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Aksiyon
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-5 mt-6">
                <div className="relative pb-4 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-sm opacity-30" />
                      <div className="relative p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <h3 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Görüşme Özeti
                    </h3>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="exitTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold text-blue-700 dark:text-blue-400">Çıkış Saati</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} className="h-12 border-2 focus:border-blue-400" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sessionFlow"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold text-purple-700 dark:text-purple-400">Görüşme Seyri</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 border-2 focus:border-purple-400">
                            <SelectValue placeholder="Görüşme nasıl geçti?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="çok_olumlu">✅ Çok Olumlu</SelectItem>
                          <SelectItem value="olumlu">😊 Olumlu</SelectItem>
                          <SelectItem value="nötr">😐 Nötr</SelectItem>
                          <SelectItem value="sorunlu">😟 Sorunlu</SelectItem>
                          <SelectItem value="kriz">🚨 Kriz</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="detailedNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Görüşme Özeti</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Görüşmede neler konuşuldu, ne tür kararlar alındı..."
                          rows={6}
                          className="border-2 focus:border-blue-400 resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="voice-note">
                    <AccordionTrigger className="text-base font-semibold text-blue-700 dark:text-blue-400">
                      <div className="flex items-center gap-2">
                        <Mic className="h-4 w-4" />
                        Sesli Not Al (AI ile Otomatik Form Doldurma)
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {isAutoFilling && (
                        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm font-medium">AI formu otomatik dolduruyor...</span>
                          </div>
                        </div>
                      )}
                      <VoiceRecorder
                        onTranscriptionComplete={async (result) => {
                          setIsAutoFilling(true);
                          
                          try {
                            if (!result?.transcription?.text) {
                              console.error('Transcription result is invalid:', result);
                              setIsAutoFilling(false);
                              return;
                            }

                            const sessionType = session?.sessionType === 'individual' ? 'INDIVIDUAL' : session?.sessionType === 'group' ? 'GROUP' : session?.participantType === 'veli' ? 'PARENT' : 'OTHER';
                            
                            const response = await fetch('/api/voice-transcription/auto-fill-form', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                transcriptionText: result.transcription.text,
                                sessionType
                              }),
                            });

                            const data = await response.json();

                            if (data.success && data.data) {
                              const formData = data.data;
                              
                              const isFallback = formData.detailedNotes?.startsWith('[Otomatik Form Doldurma Başarısız]');
                              
                              if (formData.sessionFlow) form.setValue("sessionFlow", formData.sessionFlow);
                              if (formData.detailedNotes) form.setValue("detailedNotes", formData.detailedNotes);
                              if (formData.achievedOutcomes) form.setValue("achievedOutcomes", formData.achievedOutcomes);
                              if (formData.studentParticipationLevel) form.setValue("studentParticipationLevel", formData.studentParticipationLevel);
                              if (formData.cooperationLevel) form.setValue("cooperationLevel", formData.cooperationLevel);
                              if (formData.emotionalState) form.setValue("emotionalState", formData.emotionalState);
                              if (formData.physicalState) form.setValue("physicalState", formData.physicalState);
                              if (formData.communicationQuality) form.setValue("communicationQuality", formData.communicationQuality);
                              if (formData.sessionTags && formData.sessionTags.length > 0) form.setValue("sessionTags", formData.sessionTags);
                              if (formData.actionItems && formData.actionItems.length > 0) {
                                const validActionItems = formData.actionItems
                                  .filter(item => item.id && item.description)
                                  .map(item => ({
                                    id: item.id!,
                                    description: item.description!,
                                    assignedTo: item.assignedTo,
                                    dueDate: item.dueDate,
                                    priority: item.priority
                                  }));
                                form.setValue("actionItems", validActionItems);
                              }
                              if (formData.followUpNeeded !== undefined) form.setValue("followUpNeeded", formData.followUpNeeded);
                              if (formData.followUpPlan) form.setValue("followUpPlan", formData.followUpPlan);

                              if (isFallback) {
                                alert('⚠️ AI form doldurma kısmen başarısız oldu. Sesli not manuel olarak eklendi - lütfen formu kendiniz tamamlayın.');
                              } else {
                                alert('✅ Form otomatik dolduruldu! Lütfen kontrol edin ve gerekirse düzenleyin.');
                              }
                            } else {
                              throw new Error(data.error || 'Form doldurma başarısız');
                            }
                          } catch (error: any) {
                            console.error('Auto-fill error:', error);
                            
                            const fallbackNotes = `[Sesli Not - ${new Date().toLocaleString('tr-TR')}]\n${result.transcription.text}\n\n[AI Analizi: ${result.analysis.category} - ${result.analysis.sentiment}]\n${result.analysis.summary}`;
                            const currentNotes = form.getValues("detailedNotes");
                            form.setValue("detailedNotes", currentNotes ? `${currentNotes}\n\n${fallbackNotes}` : fallbackNotes);
                            
                            alert(`⚠️ Otomatik form doldurma başarısız oldu: ${error.message}\n\nSesli not manuel olarak eklendi.`);
                          } finally {
                            setIsAutoFilling(false);
                          }
                        }}
                        studentId={session?.student?.id || session?.students?.[0]?.id}
                        sessionType={session?.sessionType === 'individual' ? 'INDIVIDUAL' : session?.sessionType === 'group' ? 'GROUP' : session?.participantType === 'veli' ? 'PARENT' : 'OTHER'}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <FormField
                  control={form.control}
                  name="achievedOutcomes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Ulaşılan Sonuçlar</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Görüşmede ulaşılan sonuçlar ve alınan kararlar..."
                          rows={4}
                          className="border-2 focus:border-purple-400 resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="assessment" className="space-y-5 mt-6">
                <div className="relative pb-4 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl blur-sm opacity-30" />
                      <div className="relative p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                        <ClipboardCheck className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <h3 className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      Görüşme Değerlendirmesi
                    </h3>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="studentParticipationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Öğrenci Katılım Düzeyi
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 border-2 focus:border-emerald-400">
                            <SelectValue placeholder="Katılım düzeyini seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="çok_aktif">Çok Aktif</SelectItem>
                          <SelectItem value="aktif">Aktif</SelectItem>
                          <SelectItem value="pasif">Pasif</SelectItem>
                          <SelectItem value="dirençli">Dirençli</SelectItem>
                          <SelectItem value="kapalı">Kapalı</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cooperationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold text-teal-700 dark:text-teal-400 flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        İşbirliği Düzeyi: {field.value}/5
                      </FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={5}
                          step={1}
                          value={[field.value || 3]}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="py-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emotionalState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Duygu Durumu
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 border-2 focus:border-emerald-400">
                            <SelectValue placeholder="Duygu durumunu seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sakin">😌 Sakin</SelectItem>
                          <SelectItem value="kaygılı">😰 Kaygılı</SelectItem>
                          <SelectItem value="üzgün">😢 Üzgün</SelectItem>
                          <SelectItem value="sinirli">😠 Sinirli</SelectItem>
                          <SelectItem value="mutlu">😊 Mutlu</SelectItem>
                          <SelectItem value="karışık">😕 Karışık</SelectItem>
                          <SelectItem value="diğer">🤔 Diğer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="physicalState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Fiziksel Durum</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 border-2 focus:border-teal-400">
                            <SelectValue placeholder="Fiziksel durumu seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="yorgun">Yorgun</SelectItem>
                          <SelectItem value="huzursuz">Huzursuz</SelectItem>
                          <SelectItem value="ajite">Ajite</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="communicationQuality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">İletişim Kalitesi</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 border-2 focus:border-emerald-400">
                            <SelectValue placeholder="İletişim kalitesini seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="açık">Açık</SelectItem>
                          <SelectItem value="ketum">Ketum</SelectItem>
                          <SelectItem value="seçici">Seçici</SelectItem>
                          <SelectItem value="kapalı">Kapalı</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="tags" className="space-y-5 mt-6">
                <div className="relative pb-4 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl blur-sm opacity-30" />
                      <div className="relative p-2 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600">
                        <Tag className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <h3 className="font-bold text-lg bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                      Görüşme Etiketleri
                    </h3>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="sessionTags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold text-pink-700 dark:text-pink-400">Etiketler</FormLabel>
                      <FormControl>
                        <SessionTagSelector
                          selectedTags={field.value || []}
                          onTagsChange={field.onChange}
                          topicPath={session?.topic}
                        />
                      </FormControl>
                      <FormDescription className="text-sm">
                        Görüşmeyi etiketleyerek raporlamayı kolaylaştırın
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="actions" className="space-y-5 mt-6">
                <div className="relative pb-4 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl blur-sm opacity-30" />
                      <div className="relative p-2 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600">
                        <Target className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <h3 className="font-bold text-lg bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                      Aksiyon Planı
                    </h3>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="followUpNeeded"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-xl border-2 border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-semibold">Takip Gerekli mi?</FormLabel>
                        <FormDescription className="text-sm">
                          Gelecekte takip görüşmesi planlanacak
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {followUpNeeded && (
                  <FormField
                    control={form.control}
                    name="followUpPlan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-orange-700 dark:text-orange-400 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Takip Planı
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Takip görüşmesinde neler yapılacak..."
                            rows={3}
                            className="border-2 focus:border-orange-400 resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="actionItems"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                        <ArrowRight className="h-4 w-4" />
                        Eylem Maddeleri
                      </FormLabel>
                      <FormControl>
                        <ActionItemsManager
                          items={(field.value || []).filter(item => item.id && item.description) as any}
                          onItemsChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription className="text-sm">
                        Yapılacak işleri ve sorumlularını belirleyin
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="border-2"
              >
                İptal
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold min-w-[180px]"
              >
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Tamamla ve Kaydet
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
