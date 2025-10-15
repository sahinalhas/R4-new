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
import { SESSION_MODES } from "@shared/constants/common.constants";

import type { IndividualSessionFormValues, GroupSessionFormValues } from "../types";

interface SessionDetailsStepProps {
  form: UseFormReturn<IndividualSessionFormValues | GroupSessionFormValues>;
}

export default function SessionDetailsStep({ form }: SessionDetailsStepProps) {
  const [dateOpen, setDateOpen] = useState(false);
  const sessionMode = form.watch("sessionMode");

  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
      {/* Section Header - Green/Orange Theme */}
      <div className="relative pb-6 mb-2">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-orange-500 rounded-2xl blur-md opacity-40" />
            <div className="relative p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-orange-500">
              <Settings2 className="h-7 w-7 text-white" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-2xl bg-gradient-to-r from-emerald-600 to-orange-600 bg-clip-text text-transparent">
              Görüşme Detayları
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Tarih, saat ve görüşme şeklini belirleyin
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="sessionDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-base font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Tarih *
                </FormLabel>
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal h-12 border-2 hover:border-emerald-400",
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sessionTime"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-base font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Saat *
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Input 
                      type="time" 
                      {...field} 
                      className="pl-10 h-12 border-2 focus:border-emerald-400"
                    />
                  </div>
                </FormControl>
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
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-semibold text-orange-700 dark:text-orange-400">Görüşme Şekli *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value={SESSION_MODES.YUZ_YUZE}
                      id="yuz_yuze"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="yuz_yuze"
                      className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-background p-5 hover:bg-accent hover:border-emerald-400 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-50 dark:peer-data-[state=checked]:bg-emerald-950/30 cursor-pointer transition-all duration-200 hover:shadow-lg"
                    >
                      <UsersIcon className="mb-2 h-8 w-8 text-emerald-600" />
                      <span className="font-semibold">Yüz Yüze</span>
                      <span className="text-xs text-muted-foreground mt-1">Ofiste</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value={SESSION_MODES.ONLINE}
                      id="online"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="online"
                      className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-background p-5 hover:bg-accent hover:border-blue-400 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-950/30 cursor-pointer transition-all duration-200 hover:shadow-lg"
                    >
                      <Video className="mb-2 h-8 w-8 text-blue-600" />
                      <span className="font-semibold">Online</span>
                      <span className="text-xs text-muted-foreground mt-1">Video</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value={SESSION_MODES.TELEFON}
                      id="telefon"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="telefon"
                      className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-background p-5 hover:bg-accent hover:border-orange-400 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50 dark:peer-data-[state=checked]:bg-orange-950/30 cursor-pointer transition-all duration-200 hover:shadow-lg"
                    >
                      <Phone className="mb-2 h-8 w-8 text-orange-600" />
                      <span className="font-semibold">Telefon</span>
                      <span className="text-xs text-muted-foreground mt-1">Arama</span>
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
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
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-600" />
                Görüşme Yeri *
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder={
                    sessionMode === SESSION_MODES.ONLINE 
                      ? "Zoom, Teams, vb." 
                      : sessionMode === SESSION_MODES.TELEFON
                      ? "Telefon görüşmesi"
                      : "Rehberlik Servisi"
                  }
                  className="h-12 border-2 focus:border-emerald-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Discipline Status */}
        <FormField
          control={form.control}
          name="disciplineStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-orange-600" />
                Disiplin / Davranış Değerlendirme
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 border-2">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Seçiniz</SelectItem>
                  <SelectItem value="kurulu_sevk">Kurulu sevk edilen öğrenci</SelectItem>
                  <SelectItem value="gorusu_alinan">Görüşü alınan öğrenci / şahit</SelectItem>
                  <SelectItem value="akran_gorusmesi">Akran Görüşmesi</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
