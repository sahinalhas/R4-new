import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  FileText, 
  Settings,
  CheckSquare,
  Type,
  Star,
  ChevronDown,
  ToggleLeft
} from "lucide-react";
import {
  SurveyTemplateType,
  SurveyQuestionType,
  MEB_SURVEY_TEMPLATES
} from "@/lib/survey-types";

const surveyTemplateSchema = z.object({
  title: z.string().min(1, "Başlık gereklidir"),
  description: z.string().optional(),
  type: z.enum(["MEB_STANDAR", "OZEL", "AKADEMIK", "SOSYAL", "REHBERLIK"]),
  mebCompliant: z.boolean().default(false),
  estimatedDuration: z.number().min(1).max(180).optional(),
  targetGrades: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  questions: z.array(z.object({
    questionText: z.string().min(1, "Soru metni gereklidir"),
    questionType: z.enum(["MULTIPLE_CHOICE", "OPEN_ENDED", "LIKERT", "YES_NO", "RATING", "DROPDOWN"]),
    required: z.boolean().default(false),
    options: z.array(z.string()).optional(),
    validation: z.object({
      minLength: z.number().optional(),
      maxLength: z.number().optional(),
      minValue: z.number().optional(),
      maxValue: z.number().optional(),
    }).optional(),
  })).default([])
});

type SurveyTemplateForm = z.infer<typeof surveyTemplateSchema>;

interface SurveyCreationDialogProps {
  children: React.ReactNode;
  onSurveyCreated?: (survey: SurveyTemplateForm) => void;
}

export default function SurveyCreationDialog({ 
  children, 
  onSurveyCreated 
}: SurveyCreationDialogProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<"template" | "questions">("template");

  const form = useForm<SurveyTemplateForm>({
    resolver: zodResolver(surveyTemplateSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "OZEL",
      mebCompliant: false,
      estimatedDuration: 10,
      targetGrades: [],
      tags: [],
      questions: []
    },
  });

  const { fields: questions, append, remove, move } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const questionTypeIcons = {
    MULTIPLE_CHOICE: CheckSquare,
    OPEN_ENDED: Type,
    LIKERT: Star,
    YES_NO: ToggleLeft,
    RATING: Star,
    DROPDOWN: ChevronDown,
  };

  const questionTypeLabels = {
    MULTIPLE_CHOICE: "Çoktan Seçmeli",
    OPEN_ENDED: "Açık Uçlu",
    LIKERT: "Likert Ölçeği",
    YES_NO: "Evet/Hayır",
    RATING: "Puanlama",
    DROPDOWN: "Açılır Liste",
  };

  const addQuestion = (type: SurveyQuestionType) => {
    const newQuestion = {
      questionText: "",
      questionType: type,
      required: false,
      options: type === "MULTIPLE_CHOICE" || type === "DROPDOWN" ? [""] : undefined,
      validation: {},
    };
    append(newQuestion);
  };

  const addOptionToQuestion = (questionIndex: number) => {
    const currentOptions = form.watch(`questions.${questionIndex}.options`) || [];
    form.setValue(`questions.${questionIndex}.options`, [...currentOptions, ""]);
  };

  const removeOptionFromQuestion = (questionIndex: number, optionIndex: number) => {
    const currentOptions = form.watch(`questions.${questionIndex}.options`) || [];
    const newOptions = currentOptions.filter((_, i) => i !== optionIndex);
    form.setValue(`questions.${questionIndex}.options`, newOptions);
  };

  const loadMebTemplate = (templateKey: keyof typeof MEB_SURVEY_TEMPLATES) => {
    const template = MEB_SURVEY_TEMPLATES[templateKey];
    form.setValue("title", template.title);
    form.setValue("description", template.description);
    form.setValue("type", template.type);
    form.setValue("mebCompliant", template.mebCompliant);
    form.setValue("estimatedDuration", template.estimatedDuration);
    form.setValue("targetGrades", template.targetGrades);
    
    // Add some default MEB questions based on type
    const defaultQuestions = getMebDefaultQuestions(templateKey);
    form.setValue("questions", defaultQuestions);
    setCurrentStep("questions");
  };

  const getMebDefaultQuestions = (templateKey: keyof typeof MEB_SURVEY_TEMPLATES) => {
    const commonQuestions = [
      {
        questionText: "Bu anketi doldurduğunuz sınıf düzeyinizi belirtiniz.",
        questionType: "DROPDOWN" as SurveyQuestionType,
        required: true,
        options: ["9. Sınıf", "10. Sınıf", "11. Sınıf", "12. Sınıf"],
      },
      {
        questionText: "Cinsiyetinizi belirtiniz.",
        questionType: "MULTIPLE_CHOICE" as SurveyQuestionType,
        required: true,
        options: ["Kız", "Erkek"],
      }
    ];

    switch (templateKey) {
      case "OGRENCI_MEMNUNIYET":
        return [
          ...commonQuestions,
          {
            questionText: "Okulunuzdan genel olarak ne kadar memnunsunuz?",
            questionType: "LIKERT" as SurveyQuestionType,
            required: true,
          },
          {
            questionText: "Öğretmenlerinizin ders anlatımından ne kadar memnunsunuz?",
            questionType: "LIKERT" as SurveyQuestionType,
            required: true,
          },
          {
            questionText: "Okul imkanlarından (kütüphane, laboratuvar, spor salonu vb.) ne kadar memnunsunuz?",
            questionType: "LIKERT" as SurveyQuestionType,
            required: true,
          },
          {
            questionText: "Okul yönetiminin öğrencilere yaklaşımından memnun musunuz?",
            questionType: "LIKERT" as SurveyQuestionType,
            required: true,
          },
          {
            questionText: "Okulunuzda verilen rehberlik hizmetlerinden memnun musunuz?",
            questionType: "LIKERT" as SurveyQuestionType,
            required: true,
          },
          {
            questionText: "Okul kantin ve yemek hizmetlerinden memnun musunuz?",
            questionType: "LIKERT" as SurveyQuestionType,
            required: false,
          },
          {
            questionText: "Okulunuzla ilgili öneriniz var mı? (İsteğe bağlı)",
            questionType: "OPEN_ENDED" as SurveyQuestionType,
            required: false,
          }
        ];
      
      case "OGRETMEN_DEGERLENDIRME":
        return [
          ...commonQuestions,
          {
            questionText: "Değerlendireceğiniz öğretmenin dersi:",
            questionType: "DROPDOWN" as SurveyQuestionType,
            required: true,
            options: ["Matematik", "Türkçe", "Fen Bilimleri", "Sosyal Bilgiler", "İngilizce", "Diğer"],
          },
          {
            questionText: "Öğretmeniniz dersi etkili bir şekilde anlatıyor mu?",
            questionType: "LIKERT" as SurveyQuestionType,
            required: true,
          },
          {
            questionText: "Öğretmeniniz sorularınızı sabırla yanıtlıyor mu?",
            questionType: "LIKERT" as SurveyQuestionType,
            required: true,
          },
          {
            questionText: "Öğretmeniniz derste teknoloji ve materyal kullanıyor mu?",
            questionType: "LIKERT" as SurveyQuestionType,
            required: true,
          },
          {
            questionText: "Öğretmeniniz sınıf disiplinini sağlıyor mu?",
            questionType: "LIKERT" as SurveyQuestionType,
            required: true,
          },
          {
            questionText: "Öğretmeniniz ödevleri düzenli kontrol ediyor mu?",
            questionType: "LIKERT" as SurveyQuestionType,
            required: true,
          },
          {
            questionText: "Bu öğretmen hakkında eklemek istediğiniz görüş:",
            questionType: "OPEN_ENDED" as SurveyQuestionType,
            required: false,
          }
        ];

      case "OKUL_IKLIMI":
        return [
          ...commonQuestions,
          {
            questionText: "Okulunuzda kendinizi güvende hissediyor musunuz?",
            questionType: "LIKERT" as SurveyQuestionType,
            required: true,
          },
          {
            questionText: "Arkadaşlarınızla ilişkiniz nasıl?",
            questionType: "LIKERT" as SurveyQuestionType,
            required: true,
          },
          {
            questionText: "Okul kuralları adil bir şekilde uygulanıyor mu?",
            questionType: "LIKERT" as SurveyQuestionType,
            required: true,
          },
          {
            questionText: "Okulda zorbalık yaşıyor musunuz?",
            questionType: "YES_NO" as SurveyQuestionType,
            required: true,
          },
          {
            questionText: "Öğretmenleriniz sizinle saygılı bir şekilde konuşuyor mu?",
            questionType: "LIKERT" as SurveyQuestionType,
            required: true,
          }
        ];

      case "REHBERLIK_IHTIYAC":
        return [
          ...commonQuestions,
          {
            questionText: "Hangi konularda rehberlik desteğine ihtiyaç duyuyorsunuz? (Birden fazla seçebilirsiniz)",
            questionType: "MULTIPLE_CHOICE" as SurveyQuestionType,
            required: true,
            options: ["Ders çalışma teknikleri", "Sınav kaygısı", "Meslek seçimi", "Arkadaş ilişkileri", "Aile sorunları", "Kişisel gelişim"],
          },
          {
            questionText: "Rehber öğretmeninizle görüşme sıklığınız:",
            questionType: "DROPDOWN" as SurveyQuestionType,
            required: true,
            options: ["Hiç görüşmedim", "Ayda bir", "Haftada bir", "İhtiyaç duyduğumda", "Düzenli aralıklarla"],
          },
          {
            questionText: "Rehberlik hizmetlerinden ne kadar memnunsunuz?",
            questionType: "LIKERT" as SurveyQuestionType,
            required: true,
          }
        ];

      case "AKADEMIK_BASARI":
        return [
          ...commonQuestions,
          {
            questionText: "Genel akademik başarınızı nasıl değerlendiriyorsunuz?",
            questionType: "DROPDOWN" as SurveyQuestionType,
            required: true,
            options: ["Çok başarılı", "Başarılı", "Orta", "Düşük", "Çok düşük"],
          },
          {
            questionText: "Hangi derslerde daha başarılısınız? (Birden fazla seçebilirsiniz)",
            questionType: "MULTIPLE_CHOICE" as SurveyQuestionType,
            required: true,
            options: ["Matematik", "Türkçe", "Fen Bilimleri", "Sosyal Bilgiler", "İngilizce", "Sanat dersleri", "Beden eğitimi"],
          },
          {
            questionText: "Ders çalışmaya ne kadar zaman ayırıyorsunuz?",
            questionType: "DROPDOWN" as SurveyQuestionType,
            required: true,
            options: ["1 saatten az", "1-2 saat", "2-3 saat", "3-4 saat", "4 saatten fazla"],
          },
          {
            questionText: "Ödevlerinizi düzenli yapıyor musunuz?",
            questionType: "LIKERT" as SurveyQuestionType,
            required: true,
          }
        ];

      case "SOSYAL_BECERI":
        return [
          ...commonQuestions,
          {
            questionText: "Arkadaşlarınızla iletişim kurma becerinizi nasıl değerlendiriyorsunuz?",
            questionType: "LIKERT" as SurveyQuestionType,
            required: true,
          },
          {
            questionText: "Grup çalışmalarında aktif rol alır mısınız?",
            questionType: "LIKERT" as SurveyQuestionType,
            required: true,
          },
          {
            questionText: "Okul etkinliklerine katılım düzeyiniz:",
            questionType: "DROPDOWN" as SurveyQuestionType,
            required: true,
            options: ["Hiç katılmam", "Nadiren", "Bazen", "Sık sık", "Her zaman"],
          },
          {
            questionText: "Liderlik özellikleriniz gelişmiş midir?",
            questionType: "LIKERT" as SurveyQuestionType,
            required: true,
          }
        ];

      case "TEKNOLOJI_KULLANIMI":
        return [
          ...commonQuestions,
          {
            questionText: "Teknoloji kullanımında kendinizi nasıl değerlendiriyorsunuz?",
            questionType: "DROPDOWN" as SurveyQuestionType,
            required: true,
            options: ["Çok iyi", "İyi", "Orta", "Zayıf", "Çok zayıf"],
          },
          {
            questionText: "Hangi teknolojik araçları aktif kullanıyorsunuz? (Birden fazla seçebilirsiniz)",
            questionType: "MULTIPLE_CHOICE" as SurveyQuestionType,
            required: true,
            options: ["Bilgisayar", "Tablet", "Akıllı telefon", "Akıllı tahta", "Eğitim yazılımları"],
          },
          {
            questionText: "Derslerde teknoloji kullanımı size yardımcı oluyor mu?",
            questionType: "LIKERT" as SurveyQuestionType,
            required: true,
          }
        ];

      case "OKUL_GUVENLIGI":
        return [
          ...commonQuestions,
          {
            questionText: "Okulunuzun fiziki güvenliği hakkında ne düşünüyorsunuz?",
            questionType: "LIKERT" as SurveyQuestionType,
            required: true,
          },
          {
            questionText: "Okul kuralları size uygun mu?",
            questionType: "LIKERT" as SurveyQuestionType,
            required: true,
          },
          {
            questionText: "Disiplin sorunlarıyla karşılaştığınızda adaletli davranılıyor mu?",
            questionType: "LIKERT" as SurveyQuestionType,
            required: true,
          },
          {
            questionText: "Güvenlik konusunda önerileriniz:",
            questionType: "OPEN_ENDED" as SurveyQuestionType,
            required: false,
          }
        ];
        
      default:
        return commonQuestions;
    }
  };

  const onSubmit = async (data: SurveyTemplateForm) => {
    try {
      // Create the survey template
      const templateId = `template_${Date.now()}`;
      const templateData = {
        id: templateId,
        title: data.title,
        description: data.description || "",
        type: data.type,
        mebCompliant: data.mebCompliant,
        isActive: true,
        createdBy: "user", // TODO: Get from auth context
        tags: data.tags || [],
        estimatedDuration: data.estimatedDuration || 10,
        targetGrades: data.targetGrades || []
      };

      const templateResponse = await fetch('/api/survey-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      if (!templateResponse.ok) {
        throw new Error('Failed to create survey template');
      }

      // Create questions for the template
      for (let i = 0; i < data.questions.length; i++) {
        const question = data.questions[i];
        const questionData = {
          id: `question_${templateId}_${i}`,
          templateId: templateId,
          questionText: question.questionText,
          questionType: question.questionType,
          required: question.required,
          orderIndex: i,
          options: question.options,
          validation: question.validation
        };

        const questionResponse = await fetch('/api/survey-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(questionData),
        });

        if (!questionResponse.ok) {
          console.error(`Failed to create question ${i + 1}`);
        }
      }

      console.log("Survey template created successfully:", templateData.title);
      onSurveyCreated?.(data);
      setOpen(false);
      form.reset();
      setCurrentStep("template");
    } catch (error) {
      console.error("Error creating survey:", error);
      alert("Anket oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni Anket Oluştur</DialogTitle>
          <DialogDescription>
            MEB standartlarına uygun anket şablonu oluşturun veya özel anket tasarlayın
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={currentStep} onValueChange={(value) => setCurrentStep(value as "template" | "questions")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="template">
                  <Settings className="mr-2 h-4 w-4" />
                  Temel Bilgiler
                </TabsTrigger>
                <TabsTrigger value="questions">
                  <FileText className="mr-2 h-4 w-4" />
                  Sorular
                </TabsTrigger>
              </TabsList>

              <TabsContent value="template" className="space-y-4">
                {/* MEB Templates Quick Start */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">MEB Standart Şablonları</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(MEB_SURVEY_TEMPLATES).map(([key, template]) => (
                        <Button
                          key={key}
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => loadMebTemplate(key as keyof typeof MEB_SURVEY_TEMPLATES)}
                          className="justify-start h-auto p-3"
                        >
                          <div className="text-left">
                            <div className="font-medium text-sm">{template.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {template.estimatedDuration} dk • {template.targetGrades.join(", ")}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Basic Survey Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Anket Başlığı</FormLabel>
                        <FormControl>
                          <Input placeholder="Örn: Öğrenci Memnuniyet Anketi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Anket Türü</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Anket türünü seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MEB_STANDAR">MEB Standart</SelectItem>
                            <SelectItem value="OZEL">Özel</SelectItem>
                            <SelectItem value="AKADEMIK">Akademik</SelectItem>
                            <SelectItem value="SOSYAL">Sosyal</SelectItem>
                            <SelectItem value="REHBERLIK">Rehberlik</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Açıklama</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Anketin amacını ve kapsamını açıklayın..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="estimatedDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tahmini Süre (dakika)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="180"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mebCompliant"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">MEB Uyumlu</FormLabel>
          <FormDescription>
            MEB standartlarına uygun anket
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
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={() => setCurrentStep("questions")}
                  >
                    Sonraki: Sorular
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="questions" className="space-y-4">
                {/* Question Type Buttons */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Soru Ekle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {Object.entries(questionTypeLabels).map(([type, label]) => {
                        const Icon = questionTypeIcons[type as SurveyQuestionType];
                        return (
                          <Button
                            key={type}
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={() => addQuestion(type as SurveyQuestionType)}
                            className="justify-start"
                          >
                            <Icon className="mr-2 h-4 w-4" />
                            {label}
                          </Button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Questions List */}
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <Card key={question.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <Badge variant="outline">
                              {questionTypeLabels[question.questionType]}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Soru {index + 1}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name={`questions.${index}.questionText`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  placeholder="Soru metnini yazın..."
                                  className="resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Options for multiple choice and dropdown questions */}
                        {(question.questionType === "MULTIPLE_CHOICE" || question.questionType === "DROPDOWN") && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <FormLabel className="text-sm">Seçenekler</FormLabel>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addOptionToQuestion(index)}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Seçenek Ekle
                              </Button>
                            </div>
                            {form.watch(`questions.${index}.options`)?.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex gap-2">
                                <Input
                                  placeholder={`Seçenek ${optionIndex + 1}`}
                                  value={option}
                                  onChange={(e) => {
                                    const currentOptions = form.watch(`questions.${index}.options`) || [];
                                    const newOptions = [...currentOptions];
                                    newOptions[optionIndex] = e.target.value;
                                    form.setValue(`questions.${index}.options`, newOptions);
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeOptionFromQuestion(index, optionIndex)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                        <FormField
                          control={form.control}
                          name={`questions.${index}.required`}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel className="text-sm">Zorunlu Soru</FormLabel>
                                <FormDescription className="text-xs">
                                  Bu sorunun cevaplanması zorunlu mu?
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
                      </CardContent>
                    </Card>
                  ))}

                  {questions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                      <FileText className="mx-auto h-12 w-12 mb-4" />
                      <p>Henüz soru eklenmemiş</p>
                      <p className="text-sm">Yukarıdaki butonlardan soru tipini seçerek başlayın</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setCurrentStep("template")}
                  >
                    Önceki
                  </Button>
                  <Button type="submit">
                    Anket Oluştur
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}