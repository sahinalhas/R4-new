import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Calendar as CalendarIcon, Clock, MapPin, Video, Phone, Users as UsersIcon, Settings2, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { IndividualSessionFormValues, GroupSessionFormValues } from "../types";

interface SessionDetailsStepProps {
  form: UseFormReturn<IndividualSessionFormValues | GroupSessionFormValues>;
}

export default function SessionDetailsStep({ form }: SessionDetailsStepProps) {
  const [dateOpen, setDateOpen] = useState(false);
  const sessionMode = form.watch("sessionMode");

  return (
    <div className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b-2">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 ring-2 ring-primary/20">
          <Settings2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-xl">Görüşme Detayları</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Tarih, saat ve görüşme şeklini belirleyin
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="sessionDate"
            render={({ field }) => (
              <FormItem className="flex flex-col animate-in fade-in-50 slide-in-from-left-4 duration-500">
                <FormLabel className="text-base font-semibold">Görüşme Tarihi *</FormLabel>
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal h-12 transition-all hover:border-primary/50",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "d MMMM yyyy, EEEE", { locale: tr })
                        ) : (
                          <span>Tarih seçin</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setDateOpen(false);
                      }}
                      locale={tr}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Görüşme tarihini seçin veya değiştirin
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sessionTime"
            render={({ field }) => (
              <FormItem className="flex flex-col animate-in fade-in-50 slide-in-from-right-4 duration-500">
                <FormLabel className="text-base font-semibold">Başlangıç Saati *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Input 
                      type="time" 
                      {...field} 
                      className="pl-10 h-12 transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Görüşme başlangıç saatini girin
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Session Mode */}
        <FormField
          control={form.control}
          name="sessionMode"
          render={({ field }) => (
            <FormItem className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
              <FormLabel className="text-base font-semibold">Görüşme Şekli *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="yüz_yüze"
                      id="yuz_yuze"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="yuz_yuze"
                      className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all duration-200 hover:shadow-md"
                    >
                      <UsersIcon className="mb-3 h-8 w-8 text-primary" />
                      <span className="font-semibold">Yüz Yüze</span>
                      <span className="text-xs text-muted-foreground mt-1">Ofiste görüşme</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="online"
                      id="online"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="online"
                      className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all duration-200 hover:shadow-md"
                    >
                      <Video className="mb-3 h-8 w-8 text-primary" />
                      <span className="font-semibold">Online</span>
                      <span className="text-xs text-muted-foreground mt-1">Video görüşme</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="telefon"
                      id="telefon"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="telefon"
                      className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all duration-200 hover:shadow-md"
                    >
                      <Phone className="mb-3 h-8 w-8 text-primary" />
                      <span className="font-semibold">Telefon</span>
                      <span className="text-xs text-muted-foreground mt-1">Telefon görüşme</span>
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormDescription>
                Görüşmenin nasıl gerçekleştirileceğini seçin
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Session Location */}
        <FormField
          control={form.control}
          name="sessionLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Görüşme Yeri *
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder={
                    sessionMode === "online" 
                      ? "Zoom, Teams, vb." 
                      : sessionMode === "telefon"
                      ? "Telefon görüşmesi"
                      : "Rehberlik Servisi"
                  }
                  className="h-12"
                />
              </FormControl>
              <FormDescription>
                {sessionMode === "online" 
                  ? "Online görüşme platformunu belirtin"
                  : sessionMode === "telefon"
                  ? "Telefon görüşmesi için not ekleyin"
                  : "Görüşmenin yapılacağı fiziksel yeri belirtin"
                }
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Discipline/Student Behavior Evaluation */}
        <FormField
          control={form.control}
          name="disciplineStatus"
          render={({ field }) => (
            <FormItem className="animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
              <FormLabel className="text-base flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                Disiplin / Öğrenci Davranış Değerlendirme Görüşmeleri
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Seçiniz</SelectItem>
                  <SelectItem value="kurulu_sevk">Kurulu sevk edilen öğrenci</SelectItem>
                  <SelectItem value="gorusu_alinan">Olayla ilgili görüşü alınan öğrenci / şahit</SelectItem>
                  <SelectItem value="akran_gorusmesi">Akran Görüşmesi</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Görüşmenin disiplin veya davranış değerlendirmesi kapsamında olup olmadığını belirtin
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
