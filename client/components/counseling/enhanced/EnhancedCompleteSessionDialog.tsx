import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Star, MessageSquare, Activity, Brain, Target, ArrowRight } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

import { completeSessionSchema, type CompleteSessionFormValues, type CounselingSession } from "../types";
import SessionTagSelector from "./SessionTagSelector";
import ActionItemsManager from "./ActionItemsManager";

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Görüşmeyi Tamamla
          </DialogTitle>
          <DialogDescription>
            Görüşme detaylarını kaydedin, etiketleyin ve takip planı oluşturun
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">Özet</TabsTrigger>
                <TabsTrigger value="assessment">Değerlendirme</TabsTrigger>
                <TabsTrigger value="tags">Etiketler</TabsTrigger>
                <TabsTrigger value="actions">Aksiyon</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="exitTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Çıkış Saati</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
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
                      <FormLabel>Görüşme Seyri</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
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
                      <FormLabel>Görüşme Özeti</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Görüşmede neler konuşuldu, ne tür kararlar alındı..."
                          rows={6}
                        />
                      </FormControl>
                      <FormDescription>
                        Görüşmenin detaylı özetini yazın
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="achievedOutcomes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ulaşılan Sonuçlar</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Görüşmede ulaşılan sonuçlar ve alınan kararlar..."
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="assessment" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="studentParticipationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Öğrenci Katılım Düzeyi
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
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
                      <FormLabel className="flex items-center gap-2">
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
                      <FormLabel className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Duygu Durumu
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
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
                      <FormLabel>Fiziksel Durum</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
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
                      <FormLabel>İletişim Kalitesi</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
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

              <TabsContent value="tags" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="sessionTags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Görüşme Etiketleri</FormLabel>
                      <FormControl>
                        <SessionTagSelector
                          selectedTags={field.value || []}
                          onTagsChange={field.onChange}
                          topicPath={session?.topic}
                        />
                      </FormControl>
                      <FormDescription>
                        Görüşmeyi etiketleyerek raporlamayı kolaylaştırın
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="actions" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="followUpNeeded"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Takip Gerekli mi?</FormLabel>
                        <FormDescription>
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
                        <FormLabel className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Takip Planı
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Takip görüşmesinde neler yapılacak..."
                            rows={3}
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
                      <FormLabel className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4" />
                        Eylem Maddeleri
                      </FormLabel>
                      <FormControl>
                        <ActionItemsManager
                          items={field.value || []}
                          onItemsChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Yapılacak işleri ve sorumlularını belirleyin
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                İptal
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
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
