import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Check, ChevronDown, X, Loader2, Calendar as CalendarIcon, Clock, Video, Users as UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import type { GroupSessionFormValues, Student, CounselingTopic } from "./types";

interface GroupSessionFormProps {
  form: UseFormReturn<GroupSessionFormValues>;
  students: Student[];
  topics: CounselingTopic[];
  selectedStudents: Student[];
  onSelectedStudentsChange: (students: Student[]) => void;
  onSubmit: (data: GroupSessionFormValues) => void;
  onCancel: () => void;
  isPending: boolean;
}

export default function GroupSessionForm({
  form,
  students,
  topics,
  selectedStudents,
  onSelectedStudentsChange,
  onSubmit,
  onCancel,
  isPending,
}: GroupSessionFormProps) {
  const [studentSearchOpen, setStudentSearchOpen] = useState(false);
  const [topicSearchOpen, setTopicSearchOpen] = useState(false);
  const [topicSearch, setTopicSearch] = useState("");
  const [dateOpen, setDateOpen] = useState(false);
  const participantType = form.watch("participantType");
  const sessionMode = form.watch("sessionMode");

  const filteredTopics = topics.filter(topic => 
    topicSearch.trim() === "" || 
    topic.title.toLowerCase().includes(topicSearch.toLowerCase()) ||
    topic.category.toLowerCase().includes(topicSearch.toLowerCase())
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <UsersIcon className="h-4 w-4" />
            <span>Grup Bilgileri</span>
          </div>

          <FormField
            control={form.control}
            name="groupName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grup Adı (Opsiyonel)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Örn: 9-A Sınıfı Akran Arabuluculuğu" className="h-11" />
                </FormControl>
                <FormDescription>
                  Grup görüşmesini tanımlayan bir ad verin
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="studentIds"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Öğrenciler * ({selectedStudents.length} seçili)</FormLabel>
                <Popover open={studentSearchOpen} onOpenChange={setStudentSearchOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between h-11",
                          selectedStudents.length === 0 && "text-muted-foreground"
                        )}
                      >
                        {selectedStudents.length > 0
                          ? `${selectedStudents.length} öğrenci seçildi`
                          : "Öğrenci seçin"}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Öğrenci ara..." />
                      <CommandList>
                        <CommandEmpty>Öğrenci bulunamadı.</CommandEmpty>
                        <CommandGroup>
                          {students.map((student) => {
                            const isSelected = selectedStudents.some(s => s.id === student.id);
                            return (
                              <CommandItem
                                key={student.id}
                                value={student.name}
                                onSelect={() => {
                                  if (isSelected) {
                                    const updated = selectedStudents.filter(s => s.id !== student.id);
                                    onSelectedStudentsChange(updated);
                                    field.onChange(updated.map(s => s.id));
                                  } else {
                                    const updated = [...selectedStudents, student];
                                    onSelectedStudentsChange(updated);
                                    field.onChange(updated.map(s => s.id));
                                  }
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    isSelected ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div>
                                  <p className="font-medium">{student.name}</p>
                                  <p className="text-sm text-muted-foreground">{student.className}</p>
                                </div>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {selectedStudents.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedStudents.map((student) => (
                      <Badge key={student.id} variant="secondary" className="gap-1">
                        {student.name}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => {
                            const updated = selectedStudents.filter(s => s.id !== student.id);
                            onSelectedStudentsChange(updated);
                            field.onChange(updated.map(s => s.id));
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Görüşme Konusu *</FormLabel>
                <Popover open={topicSearchOpen} onOpenChange={setTopicSearchOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between h-11",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <span className="truncate">{field.value || "Konu seçin"}</span>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[500px] p-0">
                    <Command shouldFilter={false}>
                      <CommandInput 
                        placeholder="Konu ara..." 
                        value={topicSearch}
                        onValueChange={setTopicSearch}
                      />
                      <CommandList className="max-h-[300px]">
                        <CommandEmpty>Konu bulunamadı.</CommandEmpty>
                        <CommandGroup>
                          {filteredTopics.map((topic) => (
                            <CommandItem
                              key={topic.id}
                              value={topic.title}
                              onSelect={() => {
                                field.onChange(topic.title);
                                setTopicSearchOpen(false);
                                setTopicSearch("");
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === topic.title ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex-1">
                                <p className="font-medium">{topic.title}</p>
                                <p className="text-sm text-muted-foreground">{topic.fullPath}</p>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="participantType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Katılımcı Tipi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || "öğrenci"}>
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="öğrenci">Öğrenci</SelectItem>
                      <SelectItem value="veli">Veli</SelectItem>
                      <SelectItem value="öğretmen">Öğretmen</SelectItem>
                      <SelectItem value="diğer">Diğer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sessionLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konum *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Rehberlik Servisi" className="h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {participantType === "veli" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <FormField
                control={form.control}
                name="parentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Veli Adı *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Veli adını girin" className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parentRelationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yakınlık Derecesi *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Seçiniz" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Anne">Anne</SelectItem>
                        <SelectItem value="Baba">Baba</SelectItem>
                        <SelectItem value="Dede">Dede</SelectItem>
                        <SelectItem value="Nine">Nine</SelectItem>
                        <SelectItem value="Amca">Amca</SelectItem>
                        <SelectItem value="Teyze">Teyze</SelectItem>
                        <SelectItem value="Diğer">Diğer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {participantType === "öğretmen" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <FormField
                control={form.control}
                name="teacherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Öğretmen Adı *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Öğretmen adını girin" className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teacherBranch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branş</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Örn: Matematik" className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {participantType === "diğer" && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <FormField
                control={form.control}
                name="otherParticipantDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Katılımcı Açıklaması *</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Katılımcı hakkında bilgi girin..."
                        rows={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>Görüşme Detayları</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="sessionDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Görüşme Tarihi *</FormLabel>
                  <Popover open={dateOpen} onOpenChange={setDateOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal h-11",
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
                <FormItem className="flex flex-col">
                  <FormLabel>Başlangıç Saati *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="time" 
                        {...field} 
                        className="pl-10 h-11"
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

          <FormField
            control={form.control}
            name="sessionMode"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Görüşme Şekli *</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-3 gap-2"
                  >
                    <div>
                      <RadioGroupItem
                        value="yüz_yüze"
                        id="group_yuz_yuze"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="group_yuz_yuze"
                        className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
                      >
                        <UsersIcon className="mb-2 h-5 w-5" />
                        <span className="text-xs font-medium">Yüz Yüze</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="online"
                        id="group_online"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="group_online"
                        className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
                      >
                        <Video className="mb-2 h-5 w-5" />
                        <span className="text-xs font-medium">Online</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="telefon"
                        id="group_telefon"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="group_telefon"
                        className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
                      >
                        <svg className="mb-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-xs font-medium">Telefon</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormDescription className="text-xs">
                  {sessionMode === "online" 
                    ? "Online platform adı veya bağlantısı (örn: Zoom, Teams)"
                    : "Görüşmenin yapılacağı fiziksel konum"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sessionDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notlar (Opsiyonel)</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Grup görüşmesi hakkında ek notlar..."
                    rows={3}
                    className="resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            İptal
          </Button>
          <Button 
            type="submit" 
            disabled={isPending}
            className="min-w-[160px]"
          >
            {isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Grup Görüşmesini Başlat
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
