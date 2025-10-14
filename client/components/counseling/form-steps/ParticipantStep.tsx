import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Check, ChevronDown, Users as UsersIcon, Search, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

import type { IndividualSessionFormValues, GroupSessionFormValues, Student, CounselingTopic } from "../types";
import StudentInsightCard from "../form-widgets/StudentInsightCard";

interface ParticipantStepProps {
  form: UseFormReturn<IndividualSessionFormValues | GroupSessionFormValues>;
  students: Student[];
  topics: CounselingTopic[];
  sessionType: 'individual' | 'group';
  selectedStudents?: Student[];
  onSelectedStudentsChange?: (students: Student[]) => void;
}

export default function ParticipantStep({ 
  form, 
  students, 
  topics, 
  sessionType,
  selectedStudents = [],
  onSelectedStudentsChange
}: ParticipantStepProps) {
  const [studentSearchOpen, setStudentSearchOpen] = useState(false);
  const [topicSearchOpen, setTopicSearchOpen] = useState(false);
  const [topicSearch, setTopicSearch] = useState("");

  const filteredTopics = topics.filter(topic => 
    topicSearch.trim() === "" || 
    topic.title.toLowerCase().includes(topicSearch.toLowerCase()) ||
    topic.category.toLowerCase().includes(topicSearch.toLowerCase())
  );

  const participantType = form.watch("participantType");

  const selectedStudentId = sessionType === 'individual' ? (form.watch("studentId") as string) : null;
  const selectedStudent = selectedStudentId ? students.find(s => s.id === selectedStudentId) : null;

  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
      {/* Section Header - Blue/Purple Theme */}
      <div className="relative pb-6 mb-2">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-md opacity-40" />
            <div className="relative p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
              <UserCircle2 className="h-7 w-7 text-white" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Katılımcı Bilgileri
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {sessionType === 'individual' ? 'Öğrenci ve konu seçin' : 'Öğrencileri ve konu seçin'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - Form fields */}
        <div className="lg:col-span-2 space-y-5">
          {sessionType === 'individual' ? (
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-base font-semibold text-blue-700 dark:text-blue-400">Öğrenci Seçin *</FormLabel>
                  <Popover open={studentSearchOpen} onOpenChange={setStudentSearchOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between h-12 text-left font-normal border-2 hover:border-blue-400",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 opacity-50" />
                            {field.value
                              ? students.find((s) => s.id === field.value)?.name
                              : "Öğrenci ara..."}
                          </div>
                          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
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
                                value={`${student.id} ${student.name}`}
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
                                  <p className="text-sm text-muted-foreground">No: {student.id} • {student.className}</p>
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
          ) : (
            <FormField
              control={form.control}
              name="studentIds"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-base font-semibold text-blue-700 dark:text-blue-400">
                    Öğrenciler * ({selectedStudents.length} seçili)
                  </FormLabel>
                  <Popover open={studentSearchOpen} onOpenChange={setStudentSearchOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          className="justify-between h-12 text-left font-normal border-2 hover:border-blue-400"
                        >
                          <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 opacity-50" />
                            {selectedStudents.length > 0
                              ? `${selectedStudents.length} öğrenci seçildi`
                              : "Öğrenci seçin..."}
                          </div>
                          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
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
                                  value={`${student.id} ${student.name}`}
                                  onSelect={() => {
                                    if (!onSelectedStudentsChange) return;
                                    
                                    const newStudents = isSelected
                                      ? selectedStudents.filter(s => s.id !== student.id)
                                      : [...selectedStudents, student];
                                    
                                    onSelectedStudentsChange(newStudents);
                                    field.onChange(newStudents.map(s => s.id));
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
                                    <p className="text-sm text-muted-foreground">No: {student.id} • {student.className}</p>
                                  </div>
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Group Name */}
          {sessionType === 'group' && (
            <FormField
              control={form.control}
              name="groupName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-blue-700 dark:text-blue-400">Grup Adı (Opsiyonel)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Örn: 9-A Sınıfı Akran Arabuluculuğu" 
                      className="h-12 border-2 focus:border-blue-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Topic Selection */}
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-base font-semibold text-purple-700 dark:text-purple-400">Görüşme Konusu *</FormLabel>
                <Popover open={topicSearchOpen} onOpenChange={setTopicSearchOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between h-12 text-left font-normal border-2 hover:border-purple-400",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Search className="h-4 w-4 opacity-50 flex-shrink-0" />
                          <span className="truncate">{field.value || "Konu seçin veya ara..."}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
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
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{topic.title}</p>
                                <p className="text-xs text-muted-foreground truncate">{topic.category}</p>
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

          {/* Participant Type */}
          <FormField
            control={form.control}
            name="participantType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Katılımcı Tipi</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || "öğrenci"}>
                  <FormControl>
                    <SelectTrigger className="h-12 border-2">
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

          {/* Conditional fields */}
          {participantType === "veli" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 border-2 border-blue-200 dark:border-blue-800 rounded-xl bg-blue-50/50 dark:bg-blue-950/20">
              <FormField
                control={form.control}
                name="parentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Veli Adı *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ad Soyad" className="h-11 border-2" />
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
                    <FormLabel className="font-semibold">Yakınlık *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 border-2">
                          <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="anne">Anne</SelectItem>
                        <SelectItem value="baba">Baba</SelectItem>
                        <SelectItem value="vasi">Vasi</SelectItem>
                        <SelectItem value="diger_aile">Diğer Aile</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {participantType === "öğretmen" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 border-2 border-blue-200 dark:border-blue-800 rounded-xl bg-blue-50/50 dark:bg-blue-950/20">
              <FormField
                control={form.control}
                name="teacherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Öğretmen Adı *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ad Soyad" className="h-11 border-2" />
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
                    <FormLabel className="font-semibold">Branş</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Örn: Matematik" className="h-11 border-2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {participantType === "diğer" && (
            <div className="p-5 border-2 border-blue-200 dark:border-blue-800 rounded-xl bg-blue-50/50 dark:bg-blue-950/20">
              <FormField
                control={form.control}
                name="otherParticipantDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Katılımcı Açıklaması *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Katılımcı hakkında bilgi" className="h-11 border-2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        {/* Right side - Student insight card */}
        {sessionType === 'individual' && selectedStudent && (
          <div className="lg:col-span-1">
            <StudentInsightCard
              studentName={selectedStudent.name}
              className={selectedStudent.className}
              totalSessions={0}
            />
          </div>
        )}
      </div>
    </div>
  );
}
