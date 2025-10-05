import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { DialogFooter } from "@/components/ui/dialog";

import type { IndividualSessionFormValues, Student, CounselingTopic } from "./types";

interface IndividualSessionFormProps {
  form: UseFormReturn<IndividualSessionFormValues>;
  students: Student[];
  topics: CounselingTopic[];
  onSubmit: (data: IndividualSessionFormValues) => void;
  onCancel: () => void;
  isPending: boolean;
}

export default function IndividualSessionForm({
  form,
  students,
  topics,
  onSubmit,
  onCancel,
  isPending,
}: IndividualSessionFormProps) {
  const [studentSearchOpen, setStudentSearchOpen] = useState(false);
  const [topicSearchOpen, setTopicSearchOpen] = useState(false);
  const [topicSearch, setTopicSearch] = useState("");
  const participantType = form.watch("participantType");

  const filteredTopics = topics.filter(topic => 
    topicSearch.trim() === "" || 
    topic.title.toLowerCase().includes(topicSearch.toLowerCase()) ||
    topic.category.toLowerCase().includes(topicSearch.toLowerCase())
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Öğrenci *</FormLabel>
              <Popover open={studentSearchOpen} onOpenChange={setStudentSearchOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? students.find((s) => s.id === field.value)?.name
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
                        {students.map((student) => (
                          <CommandItem
                            key={student.id}
                            value={student.name}
                            onSelect={() => {
                              field.onChange(student.id);
                              setStudentSearchOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === student.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-muted-foreground">{student.className}</p>
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
                        "justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value || "Konu seçin"}
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
                            <div>
                              <p className="font-medium">{topic.title}</p>
                              <p className="text-xs text-muted-foreground">{topic.category}</p>
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

        <FormField
          control={form.control}
          name="participantType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Katılımcı Tipi</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || "öğrenci"}>
                <FormControl>
                  <SelectTrigger>
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

        {participantType === "veli" && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="parentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Veli Adı *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Veli adını girin" />
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
                      <SelectTrigger>
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
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="teacherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Öğretmen Adı *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Öğretmen adını girin" />
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
                    <Input {...field} placeholder="Örn: Matematik" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {participantType === "diğer" && (
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
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sessionMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Görüşme Şekli</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="yüz_yüze">Yüz Yüze</SelectItem>
                    <SelectItem value="telefon">Telefon</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
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
                <FormLabel>Konum</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Rehberlik Servisi" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="sessionDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notlar (Opsiyonel)</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Görüşme hakkında ek notlar..."
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
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
          >
            {isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Görüşmeyi Başlat
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
