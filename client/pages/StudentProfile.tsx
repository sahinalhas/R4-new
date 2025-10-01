import { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CalendarDays, 
  GraduationCap, 
  User, 
  ShieldAlert,
  Target,
  Brain,
  Trophy,
  TrendingUp,
  Users,
  Star,
  BookOpen,
  PieChart,
  MessageCircle,
  Heart,
  Award,
  Zap,
  BarChart3,
  Activity,
  AlertTriangle,
  FileText,
  ClipboardList,
  BarChart2
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeeklySchedule from "./components/WeeklySchedule";
import TopicPlanner from "./components/TopicPlanner";
import {
  Student,
  MeetingNote,
  loadStudents,
  getNotesByStudent,
  addNote,
  addSurveyResult,
  getSurveyResultsByStudent,
  SurveyResult,
  upsertStudent,
  getAttendanceByStudent,
  addAttendance,
  AttendanceRecord,
  getAcademicsByStudent,
  addAcademic,
  AcademicRecord,
  getInterventionsByStudent,
  addIntervention,
  Intervention,
  // Dijital Koçluk İmportları
  AcademicGoal,
  MultipleIntelligence,
  LearningStyle,
  SmartGoal,
  CoachingRecommendation,
  Evaluation360,
  Achievement,
  SelfAssessment,
  getAcademicGoalsByStudent,
  addAcademicGoal,
  updateAcademicGoal,
  getMultipleIntelligenceByStudent,
  addMultipleIntelligence,
  getLearningStyleByStudent,
  addLearningStyle,
  getSmartGoalsByStudent,
  addSmartGoal,
  updateSmartGoal,
  getCoachingRecommendationsByStudent,
  addCoachingRecommendation,
  updateCoachingRecommendation,
  getEvaluations360ByStudent,
  addEvaluation360,
  getAchievementsByStudent,
  addAchievement,
  getSelfAssessmentsByStudent,
  addSelfAssessment,
  getTodaysSelfAssessment,
  generateAutoRecommendations,
  // Eksik fonksiyonlar
  ensureProgressForStudent,
  getProgressByStudent,
  loadTopics,
  loadSubjects,
  // Aile İletişimi İmportları
  ParentMeeting,
  HomeVisit,
  FamilyParticipation,
  getParentMeetingsByStudent,
  addParentMeeting,
  updateParentMeeting,
  getHomeVisitsByStudent,
  addHomeVisit,
  updateHomeVisit,
  getFamilyParticipationByStudent,
  addFamilyParticipation,
  updateFamilyParticipation,
  // Yeni özellikler
  HealthInfo,
  SpecialEducation,
  RiskFactors,
  BehaviorIncident,
  ExamResult,
  getHealthInfoByStudent,
  saveHealthInfo,
  getSpecialEducationByStudent,
  addSpecialEducation,
  getRiskFactorsByStudent,
  getLatestRiskFactors,
  addRiskFactors,
  getBehaviorIncidentsByStudent,
  addBehaviorIncident,
  getExamResultsByStudent,
  getExamResultsByType,
  addExamResult,
} from "@/lib/storage";

function RiskPill({ risk }: { risk?: string }) {
  if (!risk) return null;
  const cls =
    risk === "Yüksek"
      ? "bg-red-100 text-red-700"
      : risk === "Orta"
        ? "bg-amber-100 text-amber-700"
        : "bg-emerald-100 text-emerald-700";
  return <span className={`px-2 py-1 rounded text-xs ${cls}`}>{risk}</span>;
}

// Güvenli sayı parsing helper fonksiyonu
function parseNumberOrUndefined(value: string): number | undefined {
  if (!value || !value.trim()) return undefined;
  const num = Number(value.trim());
  return Number.isFinite(num) ? num : undefined;
}

export default function StudentProfile() {
  const { id } = useParams();
  const [studentsData, setStudentsData] = useState(loadStudents());
  
  useEffect(() => {
    setStudentsData(loadStudents());
    
    const handleUpdate = () => setStudentsData(loadStudents());
    window.addEventListener('studentsUpdated', handleUpdate);
    return () => window.removeEventListener('studentsUpdated', handleUpdate);
  }, []);
  
  const normalizedId = useMemo(() => {
    if (!id) return id;
    if (studentsData.some((s) => s.id === id)) return id;
    return id;
  }, [id, studentsData]);
  
  const student: Student | undefined = useMemo(
    () => studentsData.find((s) => s.id === normalizedId),
    [normalizedId, studentsData],
  );
  const [type, setType] = useState<MeetingNote["type"]>("Bireysel");
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 16),
  );
  const [note, setNote] = useState("");
  const [plan, setPlan] = useState("");
  const [refresh, setRefresh] = useState(0);

  const sid = normalizedId as string;
  const [notes, setNotes] = useState<MeetingNote[]>([]);
  const [surveyResults, setSurveyResults] = useState<SurveyResult[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  
  // Yeni özellik state'leri
  const [healthInfo, setHealthInfo] = useState<HealthInfo | null>(null);
  const [specialEducation, setSpecialEducation] = useState<SpecialEducation[]>([]);
  const [riskFactors, setRiskFactors] = useState<RiskFactors | null>(null);
  const [behaviorIncidents, setBehaviorIncidents] = useState<BehaviorIncident[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  
  // Dijital Koçluk state'leri
  const [coachingRecommendations, setCoachingRecommendations] = useState<CoachingRecommendation[]>([]);
  const [academicGoals, setAcademicGoals] = useState<AcademicGoal[]>([]);
  const [multipleIntelligence, setMultipleIntelligence] = useState<MultipleIntelligence | null>(null);
  const [learningStyle, setLearningStyle] = useState<LearningStyle | null>(null);
  const [smartGoals, setSmartGoals] = useState<SmartGoal[]>([]);
  const [evaluations360, setEvaluations360] = useState<Evaluation360[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selfAssessments, setSelfAssessments] = useState<SelfAssessment[]>([]);
  const [todaysAssessment, setTodaysAssessment] = useState<SelfAssessment | undefined>(undefined);
  
  // Aile İletişimi state'leri
  const [parentMeetings, setParentMeetings] = useState<ParentMeeting[]>([]);
  const [homeVisits, setHomeVisits] = useState<HomeVisit[]>([]);
  const [familyParticipation, setFamilyParticipation] = useState<FamilyParticipation[]>([]);

  useEffect(() => {
    if (sid) {
      getNotesByStudent(sid).then(setNotes);
      getSurveyResultsByStudent(sid).then(setSurveyResults);
      getAttendanceByStudent(sid).then(setAttendanceRecords);
      getAcademicsByStudent(sid).then(setAcademicRecords);
      getInterventionsByStudent(sid).then(setInterventions);
      
      // Yeni özellik verileri yükle
      getHealthInfoByStudent(sid).then(data => setHealthInfo(data));
      getSpecialEducationByStudent(sid).then(data => setSpecialEducation(data));
      getLatestRiskFactors(sid).then(data => setRiskFactors(data));
      getBehaviorIncidentsByStudent(sid).then(setBehaviorIncidents);
      getExamResultsByStudent(sid).then(setExamResults);
      
      // Dijital Koçluk verileri yükle
      getCoachingRecommendationsByStudent(sid).then(setCoachingRecommendations);
      getAcademicGoalsByStudent(sid).then(setAcademicGoals);
      getMultipleIntelligenceByStudent(sid).then(data => setMultipleIntelligence(data));
      getLearningStyleByStudent(sid).then(data => setLearningStyle(data));
      getSmartGoalsByStudent(sid).then(setSmartGoals);
      getEvaluations360ByStudent(sid).then(setEvaluations360);
      getAchievementsByStudent(sid).then(setAchievements);
      getSelfAssessmentsByStudent(sid).then(setSelfAssessments);
      getTodaysSelfAssessment(sid).then(data => setTodaysAssessment(data));
      
      // Aile İletişimi verileri yükle
      getParentMeetingsByStudent(sid).then(setParentMeetings);
      getHomeVisitsByStudent(sid).then(setHomeVisits);
      getFamilyParticipationByStudent(sid).then(setFamilyParticipation);
    } else {
      setNotes([]);
      setSurveyResults([]);
      setAttendanceRecords([]);
      setAcademicRecords([]);
      setInterventions([]);
      setHealthInfo(null);
      setSpecialEducation([]);
      setRiskFactors(null);
      setBehaviorIncidents([]);
      setExamResults([]);
      setCoachingRecommendations([]);
      setAcademicGoals([]);
      setMultipleIntelligence(null);
      setLearningStyle(null);
      setSmartGoals([]);
      setEvaluations360([]);
      setAchievements([]);
      setSelfAssessments([]);
      setTodaysAssessment(undefined);
      setParentMeetings([]);
      setHomeVisits([]);
      setFamilyParticipation([]);
    }
  }, [sid, refresh]);

  const [srTitle, setSrTitle] = useState("");
  const [srScore, setSrScore] = useState<string>("");
  
  // Devamsızlık form states
  const [attDate, setAttDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [attStatus, setAttStatus] = useState<string>("Var");
  const [attReason, setAttReason] = useState<string>("");
  
  // Akademik kayıt form states  
  const [academicTerm, setAcademicTerm] = useState<string>("");
  const [academicGpa, setAcademicGpa] = useState<string>("");
  const [academicNotes, setAcademicNotes] = useState<string>("");
  
  // Müdahale form states
  const [interventionDate, setInterventionDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [interventionTitle, setInterventionTitle] = useState<string>("");
  const [interventionStatus, setInterventionStatus] = useState<string>("Planlandı");
  
  // Akademik hedefler form states
  const [examType, setExamType] = useState<string>("YKS");
  const [targetScore, setTargetScore] = useState<string>("");
  const [currentScore, setCurrentScore] = useState<string>("");

  // Aile iletişimi form states - Veli Görüşmeleri
  const [pmDate, setPmDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [pmTime, setPmTime] = useState<string>("14:00");
  const [pmType, setPmType] = useState<string>("YÜZ_YÜZE");
  const [pmParticipants, setPmParticipants] = useState<string>("");
  const [pmTopics, setPmTopics] = useState<string>("");
  const [pmConcerns, setPmConcerns] = useState<string>("");
  const [pmDecisions, setPmDecisions] = useState<string>("");
  const [pmActionPlan, setPmActionPlan] = useState<string>("");
  const [pmNextDate, setPmNextDate] = useState<string>("");
  const [pmSatisfaction, setPmSatisfaction] = useState<string>("");

  // Ev Ziyareti form states
  const [hvDate, setHvDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [hvTime, setHvTime] = useState<string>("14:00");
  const [hvDuration, setHvDuration] = useState<string>("");
  const [hvVisitors, setHvVisitors] = useState<string>("");
  const [hvFamilyPresent, setHvFamilyPresent] = useState<string>("");
  const [hvEnvironment, setHvEnvironment] = useState<string>("UYGUN");
  const [hvInteraction, setHvInteraction] = useState<string>("OLUMLU");
  const [hvObservations, setHvObservations] = useState<string>("");
  const [hvRecommendations, setHvRecommendations] = useState<string>("");
  const [hvConcerns, setHvConcerns] = useState<string>("");
  const [hvResources, setHvResources] = useState<string>("");
  const [hvNextVisit, setHvNextVisit] = useState<string>("");

  // Aile Katılımı form states
  const [fpEventType, setFpEventType] = useState<string>("VELI_TOPLANTISI");
  const [fpEventName, setFpEventName] = useState<string>("");
  const [fpEventDate, setFpEventDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [fpParticipationStatus, setFpParticipationStatus] = useState<string>("KATILDI");
  const [fpParticipants, setFpParticipants] = useState<string>("");
  const [fpEngagementLevel, setFpEngagementLevel] = useState<string>("AKTİF");
  const [fpCommunicationFreq, setFpCommunicationFreq] = useState<string>("HAFTALIK");
  const [fpContactMethod, setFpContactMethod] = useState<string>("TELEFON");
  const [fpAvailability, setFpAvailability] = useState<string>("");
  const [fpNotes, setFpNotes] = useState<string>("");

  const addSurvey = () => {
    if (!sid || !srTitle.trim()) return;
    const score = parseNumberOrUndefined(srScore);
    addSurveyResult({
      id: crypto.randomUUID(),
      studentId: sid,
      title: srTitle,
      score,
      date: new Date().toISOString(),
    });
    setSrTitle("");
    setSrScore("");
    setRefresh((x) => x + 1);
  };

  // Aile iletişimi save fonksiyonları
  const saveParentMeeting = () => {
    if (!sid || !pmParticipants.trim()) return;
    
    const parentMeeting: ParentMeeting = {
      id: crypto.randomUUID(),
      studentId: sid,
      date: pmDate,
      time: pmTime,
      type: pmType as ParentMeeting["type"],
      participants: pmParticipants.split(",").map(p => p.trim()).filter(Boolean),
      mainTopics: pmTopics.split(",").map(t => t.trim()).filter(Boolean),
      concerns: pmConcerns || undefined,
      decisions: pmDecisions || undefined,
      actionPlan: pmActionPlan || undefined,
      nextMeetingDate: pmNextDate || undefined,
      parentSatisfaction: pmSatisfaction ? Number(pmSatisfaction) : undefined,
      followUpRequired: !!pmNextDate || !!pmActionPlan,
      notes: undefined,
      createdBy: "Sistem", // Bu gerçek uygulamada giriş yapmış kullanıcıdan gelir
      createdAt: new Date().toISOString(),
    };
    
    addParentMeeting(parentMeeting);
    
    // Form alanlarını temizle
    setPmParticipants("");
    setPmTopics("");
    setPmConcerns("");
    setPmDecisions("");
    setPmActionPlan("");
    setPmNextDate("");
    setPmSatisfaction("");
    setRefresh((x) => x + 1);
  };

  const saveHomeVisit = () => {
    if (!sid || !hvVisitors.trim() || !hvObservations.trim()) return;
    
    const homeVisit: HomeVisit = {
      id: crypto.randomUUID(),
      studentId: sid,
      date: hvDate,
      time: hvTime,
      visitDuration: Number(hvDuration) || 60,
      visitors: hvVisitors.split(",").map(v => v.trim()).filter(Boolean),
      familyPresent: hvFamilyPresent.split(",").map(f => f.trim()).filter(Boolean),
      homeEnvironment: hvEnvironment as HomeVisit["homeEnvironment"],
      familyInteraction: hvInteraction as HomeVisit["familyInteraction"],
      observations: hvObservations,
      recommendations: hvRecommendations,
      concerns: hvConcerns || undefined,
      resources: hvResources || undefined,
      followUpActions: undefined,
      nextVisitPlanned: hvNextVisit || undefined,
      notes: undefined,
      createdBy: "Sistem",
      createdAt: new Date().toISOString(),
    };
    
    addHomeVisit(homeVisit);
    
    // Form alanlarını temizle
    setHvDuration("");
    setHvVisitors("");
    setHvFamilyPresent("");
    setHvObservations("");
    setHvRecommendations("");
    setHvConcerns("");
    setHvResources("");
    setHvNextVisit("");
    setRefresh((x) => x + 1);
  };

  const saveFamilyParticipation = () => {
    if (!sid || !fpEventName.trim()) return;
    
    const familyParticipation: FamilyParticipation = {
      id: crypto.randomUUID(),
      studentId: sid,
      eventType: fpEventType as FamilyParticipation["eventType"],
      eventName: fpEventName,
      eventDate: fpEventDate,
      participationStatus: fpParticipationStatus as FamilyParticipation["participationStatus"],
      participants: fpParticipants ? fpParticipants.split(",").map(p => p.trim()).filter(Boolean) : undefined,
      engagementLevel: fpEngagementLevel as FamilyParticipation["engagementLevel"],
      communicationFrequency: fpCommunicationFreq as FamilyParticipation["communicationFrequency"],
      preferredContactMethod: fpContactMethod as FamilyParticipation["preferredContactMethod"],
      parentAvailability: fpAvailability || undefined,
      notes: fpNotes || undefined,
      recordedBy: "Sistem",
      recordedAt: new Date().toISOString(),
    };
    
    addFamilyParticipation(familyParticipation);
    
    // Form alanlarını temizle
    setFpEventName("");
    setFpParticipants("");
    setFpAvailability("");
    setFpNotes("");
    setRefresh((x) => x + 1);
  };

  const fullName = student ? `${student.ad} ${student.soyad}` : "";

  const onAdd = async () => {
    if (!sid || !note.trim()) return;
    await addNote({
      id: crypto.randomUUID(),
      studentId: sid,
      date,
      type,
      note,
      plan,
    });
    setNote("");
    setPlan("");
    setRefresh((x) => x + 1);
  };

  const devamsiz30 = useMemo(
    () =>
      attendanceRecords.filter(
        (a) =>
          a.status === "Devamsız" &&
          Date.now() - new Date(a.date).getTime() <= 30 * 24 * 60 * 60 * 1000,
      ).length,
    [attendanceRecords],
  );
  const lastSurvey = surveyResults[0];
  const riskLevel = student?.risk || (devamsiz30 >= 2 ? "Orta" : "Düşük");

  if (!student) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Öğrenci bulunamadı</CardTitle>
          <CardDescription>No: {id}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link to="/ogrenci">Listeye Dön</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <User className="h-6 w-6" /> {fullName}
          </CardTitle>
          <CardDescription>
            <span className="flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1">
                <GraduationCap className="h-4 w-4" /> Sınıf: {student.sinif}
              </span>
              <span>Cinsiyet: {student.cinsiyet}</span>
              <span className="inline-flex items-center gap-1">
                <ShieldAlert className="h-4 w-4" /> Risk:{" "}
                <RiskPill risk={student.risk} />
              </span>
            </span>
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-md border p-3">
            <div className="text-xs text-muted-foreground">Risk</div>
            <div className="mt-1">
              <RiskPill risk={riskLevel} />
            </div>
          </div>
          <div className="rounded-md border p-3">
            <div className="text-xs text-muted-foreground">Son Anket</div>
            <div className="mt-1 text-sm">
              {typeof lastSurvey?.score === "number"
                ? `${lastSurvey.score}`
                : "-"}
            </div>
          </div>
          <div className="rounded-md border p-3">
            <div className="text-xs text-muted-foreground">
              30 Günde Devamsız
            </div>
            <div className="mt-1 text-sm">{devamsiz30}</div>
          </div>
          <div className="rounded-md border p-3">
            <div className="text-xs text-muted-foreground">Müdahaleler</div>
            <div className="mt-1 text-sm">
              {interventions.length}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="temel">
        <TabsList className="flex flex-wrap gap-1 h-auto w-full justify-start">
          <TabsTrigger value="temel" className="flex items-center gap-1 text-xs">
            <User className="h-3 w-3" /> Temel Bilgiler
          </TabsTrigger>
          <TabsTrigger value="akademik" className="flex items-center gap-1 text-xs">
            <GraduationCap className="h-3 w-3" /> Akademik Alan
          </TabsTrigger>
          <TabsTrigger value="kisisel" className="flex items-center gap-1 text-xs">
            <Brain className="h-3 w-3" /> Kişisel Gelişim
          </TabsTrigger>
          <TabsTrigger value="sosyal" className="flex items-center gap-1 text-xs">
            <MessageCircle className="h-3 w-3" /> Sosyal/İletişim
          </TabsTrigger>
          <TabsTrigger value="aile-iletisimi" className="flex items-center gap-1 text-xs">
            <Heart className="h-3 w-3" /> Aile İletişimi
          </TabsTrigger>
          <TabsTrigger value="saglik-risk" className="flex items-center gap-1 text-xs">
            <Activity className="h-3 w-3" /> Sağlık & Risk
          </TabsTrigger>
        </TabsList>

        {/* Temel Bilgiler */}
        <TabsContent value="temel">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Öğrenci Bilgileri (Düzenle)</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  defaultValue={student.ad}
                  placeholder="Ad"
                  onChange={(e) => (student.ad = e.target.value)}
                />
                <Input
                  defaultValue={student.soyad}
                  placeholder="Soyad"
                  onChange={(e) => (student.soyad = e.target.value)}
                />
                <Input
                  defaultValue={student.sinif}
                  placeholder="Sınıf (örn. 9/A)"
                  onChange={(e) => (student.sinif = e.target.value)}
                />
                <Select
                  defaultValue={student.cinsiyet}
                  onValueChange={(v) => (student.cinsiyet = v as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Cinsiyet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="K">Kız</SelectItem>
                    <SelectItem value="E">Erkek</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  defaultValue={student.id}
                  placeholder="Öğrenci No"
                  readOnly
                  className="bg-gray-50"
                />
                <Input
                  defaultValue={student.dogumTarihi}
                  type="date"
                  placeholder="Doğum Tarihi"
                  onChange={(e) => (student.dogumTarihi = e.target.value)}
                />
                <Input
                  defaultValue={student.telefon}
                  placeholder="Telefon"
                  onChange={(e) => (student.telefon = e.target.value)}
                />
                <Input
                  defaultValue={student.eposta}
                  placeholder="E-posta"
                  onChange={(e) => (student.eposta = e.target.value)}
                />
                <Input
                  defaultValue={student.il}
                  placeholder="İl"
                  onChange={(e) => (student.il = e.target.value)}
                />
                <Input
                  defaultValue={student.ilce}
                  placeholder="İlçe"
                  onChange={(e) => (student.ilce = e.target.value)}
                />
                <Input
                  defaultValue={student.adres}
                  placeholder="Adres"
                  onChange={(e) => (student.adres = e.target.value)}
                />
                <Input
                  defaultValue={student.rehberOgretmen}
                  placeholder="Rehber Öğretmen"
                  onChange={(e) => (student.rehberOgretmen = e.target.value)}
                />
                <Select
                  defaultValue={student.risk || "Düşük"}
                  onValueChange={(v) => (student.risk = v as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Risk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Düşük">Düşük</SelectItem>
                    <SelectItem value="Orta">Orta</SelectItem>
                    <SelectItem value="Yüksek">Yüksek</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  defaultValue={(student.etiketler || []).join(", ")}
                  placeholder="Etiketler (virgülle)"
                  onChange={(e) =>
                    (student.etiketler = e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean))
                  }
                />
                <Input
                  defaultValue={student.kanGrubu}
                  placeholder="Kan Grubu (ops.)"
                  onChange={(e) => (student.kanGrubu = e.target.value)}
                />
                <Textarea
                  defaultValue={student.saglikNotu}
                  placeholder="Sağlık Notu (ops.)"
                  onChange={(e) => (student.saglikNotu = e.target.value)}
                />
                <div className="md:col-span-2">
                  <Button
                    onClick={() => {
                      upsertStudent(student);
                      setRefresh((x) => x + 1);
                    }}
                  >
                    Kaydet
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Veli & Acil Durum</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  defaultValue={student.veliAdi}
                  placeholder="Veli Adı"
                  onChange={(e) => (student.veliAdi = e.target.value)}
                />
                <Input
                  defaultValue={student.veliTelefon}
                  placeholder="Veli Telefon"
                  onChange={(e) => (student.veliTelefon = e.target.value)}
                />
                <Input
                  defaultValue={student.acilKisi}
                  placeholder="Acil Durum Kişisi"
                  onChange={(e) => (student.acilKisi = e.target.value)}
                />
                <Input
                  defaultValue={student.acilTelefon}
                  placeholder="Acil Durum Telefon"
                  onChange={(e) => (student.acilTelefon = e.target.value)}
                />
                <div className="md:col-span-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      upsertStudent(student);
                      setRefresh((x) => x + 1);
                    }}
                  >
                    Kaydet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Akademik Alan */}
        <TabsContent value="akademik">
          <Tabs defaultValue="devamsizlik" className="space-y-4">
            <TabsList>
              <TabsTrigger value="devamsizlik" className="flex items-center gap-1 text-xs">
                <CalendarDays className="h-3 w-3" /> Devamsızlık
              </TabsTrigger>
              <TabsTrigger value="calisma" className="flex items-center gap-1 text-xs">
                <BookOpen className="h-3 w-3" /> Çalışma Programı
              </TabsTrigger>
              <TabsTrigger value="dijital-kocluk" className="flex items-center gap-1 text-xs">
                <Zap className="h-3 w-3" /> Dijital Koçluk
              </TabsTrigger>
              <TabsTrigger value="akademik-performans" className="flex items-center gap-1 text-xs">
                <TrendingUp className="h-3 w-3" /> Akademik Performans
              </TabsTrigger>
              <TabsTrigger value="mudahaleler" className="flex items-center gap-1 text-xs">
                <ShieldAlert className="h-3 w-3" /> Müdahaleler
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="devamsizlik">
              <Card>
                <CardHeader>
                  <CardTitle>Devamsızlık</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Input
                      type="date"
                      value={attDate}
                      onChange={(e) => setAttDate(e.target.value)}
                    />
                    <Select
                      value={attStatus}
                      onValueChange={setAttStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Durum" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Var">Var</SelectItem>
                        <SelectItem value="Devamsız">Devamsız</SelectItem>
                        <SelectItem value="Geç">Geç Kaldı</SelectItem>
                        <SelectItem value="İzinli">İzinli</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Sebep (opsiyonel)"
                      value={attReason}
                      onChange={(e) => setAttReason(e.target.value)}
                    />
                    <Button 
                      onClick={async () => {
                        if (!sid) return;
                        const attendanceRecord: AttendanceRecord = {
                          id: crypto.randomUUID(),
                          studentId: sid,
                          date: attDate,
                          status: attStatus as any,
                          reason: attReason || undefined,
                        };
                        await addAttendance(attendanceRecord);
                        setRefresh(x => x + 1);
                      }}
                    >
                      Kaydet
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    {attendanceRecords.length === 0 && (
                      <div className="text-sm text-muted-foreground">Kayıt yok.</div>
                    )}
                    {attendanceRecords.map((a) => (
                      <div
                        key={a.id}
                        className="flex items-center justify-between rounded border p-2 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {new Date(a.date).toLocaleDateString()}
                          </Badge>
                          <Badge 
                            variant={a.status === "Var" ? "secondary" : 
                                   a.status === "Devamsız" ? "destructive" : "outline"}
                          >
                            {a.status}
                          </Badge>
                        </div>
                        {a.reason && (
                          <span className="text-muted-foreground">{a.reason}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="calisma">
              <div className="grid gap-4">
                <WeeklySchedule sid={sid} />
                <TopicPlanner sid={sid} />
              </div>
            </TabsContent>

            <TabsContent value="dijital-kocluk">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Dijital Koçluk Önerileri
                    </CardTitle>
                    <CardDescription>AI destekli kişiselleştirilmiş öneriler</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      onClick={() => {
                        generateAutoRecommendations(sid);
                        setRefresh(x => x + 1);
                      }}
                      className="w-full"
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Yeni Öneriler Oluştur
                    </Button>

                    <div className="space-y-3">
                      {coachingRecommendations.map(rec => (
                        <div key={rec.id} className="border rounded-lg p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant={rec.priority === "Yüksek" ? "destructive" : 
                                           rec.priority === "Orta" ? "default" : "secondary"}>
                              {rec.priority} Öncelik
                            </Badge>
                            <Badge variant="outline">{rec.type}</Badge>
                          </div>
                          <h4 className="font-medium">{rec.title}</h4>
                          <p className="text-sm text-muted-foreground">{rec.description}</p>
                          {rec.description && (
                            <div className="mt-2">
                              <div className="text-sm font-medium mb-1">Detaylar:</div>
                              <p className="text-sm">{rec.description}</p>
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {new Date(rec.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="akademik-performans">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Akademik Performans
                    </CardTitle>
                    <CardDescription>Detaylı akademik analiz ve raporlama</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        placeholder="Dönem (örn. 2024-Güz)"
                        value={academicTerm}
                        onChange={(e) => setAcademicTerm(e.target.value)}
                      />
                      <Input
                        placeholder="GPA (0-4 arası)"
                        value={academicGpa}
                        onChange={(e) => setAcademicGpa(e.target.value)}
                      />
                      <Button 
                        onClick={async () => {
                          if (!sid || !academicTerm) return;
                          const gpa = parseNumberOrUndefined(academicGpa);
                          const academicRecord: AcademicRecord = {
                            id: crypto.randomUUID(),
                            studentId: sid,
                            term: academicTerm,
                            gpa,
                            notes: academicNotes || undefined,
                            // Date information will be tracked separately
                          };
                          await addAcademic(academicRecord);
                          setAcademicTerm("");
                          setAcademicGpa("");
                          setAcademicNotes("");
                          setRefresh(x => x + 1);
                        }}
                      >
                        Kaydet
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Notlar (opsiyonel)"
                      value={academicNotes}
                      onChange={(e) => setAcademicNotes(e.target.value)}
                    />
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Akademik Kayıtlar</h4>
                      {academicRecords.map(record => (
                        <div key={record.id} className="border rounded p-3 space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{record.term}</div>
                            {record.gpa && (
                              <Badge variant={record.gpa >= 3.5 ? "default" : 
                                             record.gpa >= 2.5 ? "secondary" : "destructive"}>
                                GPA: {record.gpa}
                              </Badge>
                            )}
                          </div>
                          {record.notes && (
                            <p className="text-sm text-muted-foreground">{record.notes}</p>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {record.term} dönemi
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="mudahaleler">
              <Card>
                <CardHeader>
                  <CardTitle>Müdahaleler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Input
                      type="date"
                      value={interventionDate}
                      onChange={(e) => setInterventionDate(e.target.value)}
                    />
                    <Input
                      placeholder="Müdahale Başlığı"
                      value={interventionTitle}
                      onChange={(e) => setInterventionTitle(e.target.value)}
                    />
                    <Select
                      value={interventionStatus}
                      onValueChange={setInterventionStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Durum" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planlandı">Planlandı</SelectItem>
                        <SelectItem value="Devam Ediyor">Devam Ediyor</SelectItem>
                        <SelectItem value="Tamamlandı">Tamamlandı</SelectItem>
                        <SelectItem value="İptal Edildi">İptal Edildi</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={async () => {
                        if (!sid || !interventionTitle) return;
                        const intervention: Intervention = {
                          id: crypto.randomUUID(),
                          studentId: sid,
                          title: interventionTitle,
                          status: interventionStatus as any,
                          date: interventionDate,
                        };
                        await addIntervention(intervention);
                        setInterventionTitle("");
                        setRefresh(x => x + 1);
                      }}
                    >
                      Kaydet
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {interventions.map(intervention => (
                      <div key={intervention.id} className="border rounded p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{intervention.title}</div>
                          <Badge variant={intervention.status === "Tamamlandı" ? "default" : 
                                         intervention.status === "Devam" ? "secondary" : "outline"}>
                            {intervention.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Tarih: {new Date(intervention.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Kişisel Gelişim */}
        <TabsContent value="kisisel">
          <Tabs defaultValue="kisilik-profil" className="space-y-4">
            <TabsList>
              <TabsTrigger value="kisilik-profil" className="flex items-center gap-1 text-xs">
                <Brain className="h-3 w-3" /> Kişilik Profili
              </TabsTrigger>
              <TabsTrigger value="hedefler" className="flex items-center gap-1 text-xs">
                <Target className="h-3 w-3" /> Hedefler & Planlama
              </TabsTrigger>
              <TabsTrigger value="360-degerlendirme" className="flex items-center gap-1 text-xs">
                <Users className="h-3 w-3" /> 360° Değerlendirme
              </TabsTrigger>
              <TabsTrigger value="ilerleme-takip" className="flex items-center gap-1 text-xs">
                <Trophy className="h-3 w-3" /> İlerleme Takibi
              </TabsTrigger>
            </TabsList>

            <TabsContent value="kisilik-profil">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Çoklu Zeka Profili
                    </CardTitle>
                    <CardDescription>8 farklı zeka alanında kendini değerlendir (1-10 arası)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Dilsel Zeka</label>
                        <Input 
                          type="number" 
                          min="1" 
                          max="10" 
                          onChange={(e) => ((window as any).__linguistic = e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Mantıksal-Matematik</label>
                        <Input 
                          type="number" 
                          min="1" 
                          max="10"
                          onChange={(e) => ((window as any).__logical = e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Uzamsal Zeka</label>
                        <Input 
                          type="number" 
                          min="1" 
                          max="10"
                          onChange={(e) => ((window as any).__spatial = e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Müzikal Zeka</label>
                        <Input 
                          type="number" 
                          min="1" 
                          max="10"
                          onChange={(e) => ((window as any).__musical = e.target.value)}
                        />
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => {
                        if (!sid) return;
                        const multipleIntel: MultipleIntelligence = {
                          id: crypto.randomUUID(),
                          studentId: sid,
                          linguistic: Number((window as any).__linguistic || 5),
                          logicalMathematical: Number((window as any).__logical || 5),
                          spatial: Number((window as any).__spatial || 5),
                          musicalRhythmic: 5,
                          bodilyKinesthetic: 5,
                          interpersonal: 5,
                          intrapersonal: 5,
                          naturalistic: 5,
                          existential: 5,
                          assessmentDate: new Date().toISOString(),
                        };
                        addMultipleIntelligence(multipleIntel);
                        setRefresh(x => x + 1);
                      }}
                    >
                      Çoklu Zeka Profili Kaydet
                    </Button>

                    {/* Mevcut Değerlendirme */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Son Zeka Profili</h4>
                      {(() => {
                        const intel = multipleIntelligence;
                        if (!intel) {
                          return <div className="text-sm text-muted-foreground">Henüz değerlendirme yok.</div>;
                        }
                        return (
                          <div className="border rounded p-3 space-y-2">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                              <div>Dilsel: {intel.linguistic}/10</div>
                              <div>Matematik: {intel.logicalMathematical}/10</div>
                              <div>Uzamsal: {intel.spatial}/10</div>
                              <div>Müzikal: {intel.musicalRhythmic}/10</div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(intel.assessmentDate).toLocaleDateString()}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="hedefler">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      SMART Hedefler
                    </CardTitle>
                    <CardDescription>Spesifik, Ölçülebilir, Ulaşılabilir, Relevans, Zaman-bound hedefler</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Select
                        value={examType}
                        onValueChange={setExamType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sınav Türü" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="YKS">YKS</SelectItem>
                          <SelectItem value="LGS">LGS</SelectItem>
                          <SelectItem value="TYT">TYT</SelectItem>
                          <SelectItem value="AYT">AYT</SelectItem>
                          <SelectItem value="Kişisel">Kişisel Hedef</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Hedef Puan"
                        value={targetScore}
                        onChange={(e) => setTargetScore(e.target.value)}
                      />
                      <Input
                        placeholder="Mevcut Puan"
                        value={currentScore}
                        onChange={(e) => setCurrentScore(e.target.value)}
                      />
                    </div>

                    <Button
                      onClick={() => {
                        if (!sid || !examType) return;
                        const target = parseNumberOrUndefined(targetScore);
                        const current = parseNumberOrUndefined(currentScore);
                        
                        const academicGoal: AcademicGoal = {
                          id: crypto.randomUUID(),
                          studentId: sid,
                          examType: examType as any,
                          targetScore: target,
                          currentScore: current,
                          deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // 1 yıl sonra
                          createdAt: new Date().toISOString(),
                        };
                        addAcademicGoal(academicGoal);
                        setExamType("YKS");
                        setTargetScore("");
                        setCurrentScore("");
                        setRefresh(x => x + 1);
                      }}
                    >
                      Akademik Hedef Ekle
                    </Button>

                    {/* Mevcut Hedefler */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Mevcut Hedefler</h4>
                      {academicGoals.map(goal => (
                        <div key={goal.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{goal.examType} Hedefi</div>
                            <Badge variant="outline">
                              Son Tarih: {new Date(goal.deadline).toLocaleDateString()}
                            </Badge>
                          </div>
                          {goal.targetScore && goal.currentScore && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>İlerleme: {goal.currentScore} / {goal.targetScore}</span>
                                <span>{Math.round((goal.currentScore / goal.targetScore) * 100)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="h-2 bg-primary rounded-full transition-all"
                                  style={{ width: `${Math.min(100, (goal.currentScore / goal.targetScore) * 100)}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="360-degerlendirme">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    360° Değerlendirme
                  </CardTitle>
                  <CardDescription>Çok yönlü değerlendirme (1-10 arası)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm">Değerlendirici</label>
                      <Select
                        onValueChange={(v) => ((window as any).__evaluatorType = v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seçiniz" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ÖĞRENCI">Öğrenci</SelectItem>
                          <SelectItem value="ÖĞRETMEN">Öğretmen</SelectItem>
                          <SelectItem value="VELİ">Veli</SelectItem>
                          <SelectItem value="ARKADAŞ">Arkadaş</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm">Değerlendirici Adı</label>
                      <Input 
                        placeholder="İsim (opsiyonel)"
                        onChange={(e) => ((window as any).__evaluatorName = e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm">Akademik</label>
                      <Input type="number" min="1" max="10" onChange={(e) => ((window as any).__academic = e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm">Sosyal</label>
                      <Input type="number" min="1" max="10" onChange={(e) => ((window as any).__social = e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm">İletişim</label>
                      <Input type="number" min="1" max="10" onChange={(e) => ((window as any).__communication = e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm">Liderlik</label>
                      <Input type="number" min="1" max="10" onChange={(e) => ((window as any).__leadership = e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm">Takım Çalışması</label>
                      <Input type="number" min="1" max="10" onChange={(e) => ((window as any).__teamwork = e.target.value)} />
                    </div>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={() => {
                      if (!sid) return;
                      const scores = {
                        academic: Number((window as any).__academic || 5),
                        social: Number((window as any).__social || 5),
                        communication: Number((window as any).__communication || 5),
                        leadership: Number((window as any).__leadership || 5),
                        teamwork: Number((window as any).__teamwork || 5),
                        confidence: 5,
                        motivation: 5,
                        timeManagement: 5,
                        problemSolving: 5,
                        creativity: 5,
                      };
                      const overallRating = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;
                      
                      const eval360: Evaluation360 = {
                        id: crypto.randomUUID(),
                        studentId: sid,
                        evaluatorType: (window as any).__evaluatorType || "ÖĞRENCI" as any,
                        evaluatorName: (window as any).__evaluatorName,
                        academicPerformance: scores.academic,
                        socialSkills: scores.social,
                        communication: scores.communication,
                        leadership: scores.leadership,
                        teamwork: scores.teamwork,
                        selfConfidence: scores.confidence,
                        motivation: scores.motivation,
                        timeManagement: scores.timeManagement,
                        problemSolving: scores.problemSolving,
                        creativity: scores.creativity,
                        overallRating,
                        evaluationDate: new Date().toISOString(),
                      };
                      addEvaluation360(eval360);
                      setRefresh(x => x + 1);
                    }}
                  >
                    360° Değerlendirme Kaydet
                  </Button>

                  {/* Mevcut Değerlendirmeler */}
                  <div className="space-y-3">
                    <h3 className="font-medium">Değerlendirme Geçmişi</h3>
                    {evaluations360.map(evaluation => (
                      <div key={evaluation.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{evaluation.evaluatorType}</Badge>
                            {evaluation.evaluatorName && (
                              <span className="text-sm text-muted-foreground">
                                {evaluation.evaluatorName}
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Genel Puan</div>
                            <div className="font-medium">{evaluation.overallRating.toFixed(1)}/10</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                          <div>Akademik: {evaluation.academicPerformance}/10</div>
                          <div>Sosyal: {evaluation.socialSkills}/10</div>
                          <div>İletişim: {evaluation.communication}/10</div>
                          <div>Liderlik: {evaluation.leadership}/10</div>
                          <div>Takım: {evaluation.teamwork}/10</div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          {new Date(evaluation.evaluationDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ilerleme-takip">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Başarı Rozetleri
                    </CardTitle>
                    <CardDescription>Kazanılan rozetler ve başarılar</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      onClick={() => {
                        const achievement: Achievement = {
                          id: crypto.randomUUID(),
                          studentId: sid,
                          type: "ROZETLeR",
                          title: "İlk Hedef Tamamlandı",
                          description: "İlk SMART hedefini başarıyla tamamladı",
                          icon: "trophy",
                          color: "#FFD700",
                          points: 50,
                          earnedAt: new Date().toISOString(),
                          category: "HEDEFLeR",
                          criteria: "Bir SMART hedefi %100 tamamlama"
                        };
                        addAchievement(achievement);
                        setRefresh(x => x + 1);
                      }}
                    >
                      <Award className="mr-2 h-4 w-4" />
                      Örnek Rozet Ver
                    </Button>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {achievements.map(achievement => (
                        <div key={achievement.id} className="border rounded-lg p-3 text-center space-y-2">
                          <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center" 
                               style={{ backgroundColor: achievement.color + "20", color: achievement.color }}>
                            <Trophy className="h-6 w-6" />
                          </div>
                          <div className="font-medium text-sm">{achievement.title}</div>
                          <div className="text-xs text-muted-foreground">{achievement.description}</div>
                          <Badge variant="secondary">{achievement.category}</Badge>
                          {achievement.points && (
                            <div className="text-xs text-muted-foreground">{achievement.points} puan</div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {new Date(achievement.earnedAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Günlük Değerlendirme
                    </CardTitle>
                    <CardDescription>Bugünkü ruh halin ve performansın nasıldı?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(() => {
                      const todaysAssessmentData = todaysAssessment;
                      if (todaysAssessmentData) {
                        return (
                          <div className="p-4 bg-muted rounded-lg space-y-2">
                            <div className="font-medium">Bugünkü Değerlendirmen Tamamlandı!</div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>Ruh Hali: {todaysAssessment.moodRating}/10</div>
                              <div>Motivasyon: {todaysAssessment.motivationLevel}/10</div>
                              <div>Stres: {todaysAssessment.stressLevel}/10</div>
                              <div>Özgüven: {todaysAssessment.confidenceLevel}/10</div>
                            </div>
                            {todaysAssessment.todayHighlight && (
                              <div className="text-sm">
                                <strong>Günün En İyisi:</strong> {todaysAssessment.todayHighlight}
                              </div>
                            )}
                          </div>
                        );
                      }

                      return (
                        <div className="grid gap-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-1">
                              <label className="text-sm">Ruh Halim (1-10)</label>
                              <Input type="number" min="1" max="10" onChange={(e) => ((window as any).__mood = e.target.value)} />
                            </div>
                            <div className="space-y-1">
                              <label className="text-sm">Motivasyon (1-10)</label>
                              <Input type="number" min="1" max="10" onChange={(e) => ((window as any).__motivationDaily = e.target.value)} />
                            </div>
                            <div className="space-y-1">
                              <label className="text-sm">Stres Seviyesi (1-10)</label>
                              <Input type="number" min="1" max="10" onChange={(e) => ((window as any).__stress = e.target.value)} />
                            </div>
                            <div className="space-y-1">
                              <label className="text-sm">Özgüven (1-10)</label>
                              <Input type="number" min="1" max="10" onChange={(e) => ((window as any).__confidenceDaily = e.target.value)} />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="Günün en iyi yanı neydi?" onChange={(e) => ((window as any).__highlight = e.target.value)} />
                            <Input placeholder="Bugün zorlandığın şey?" onChange={(e) => ((window as any).__challenge = e.target.value)} />
                          </div>
                          
                          <Input placeholder="Yarın için hedefin?" onChange={(e) => ((window as any).__tomorrowGoal = e.target.value)} />

                          <Button
                            className="w-full"
                            onClick={() => {
                              if (!sid) return;
                              const assessment: SelfAssessment = {
                                id: crypto.randomUUID(),
                                studentId: sid,
                                moodRating: Number((window as any).__mood || 5),
                                motivationLevel: Number((window as any).__motivationDaily || 5),
                                stressLevel: Number((window as any).__stress || 5),
                                confidenceLevel: Number((window as any).__confidenceDaily || 5),
                                studyDifficulty: 5, // Default
                                socialInteraction: 5, // Default
                                sleepQuality: 5, // Default
                                physicalActivity: 5, // Default
                                dailyGoalsAchieved: 50, // Default
                                todayHighlight: (window as any).__highlight,
                                todayChallenge: (window as any).__challenge,
                                tomorrowGoal: (window as any).__tomorrowGoal,
                                assessmentDate: new Date().toISOString().slice(0, 10),
                              };
                              addSelfAssessment(assessment);
                              setRefresh(x => x + 1);
                            }}
                          >
                            Günlük Değerlendirme Kaydet
                          </Button>
                        </div>
                      );
                    })()}

                    {/* Son Değerlendirmeler */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Son Değerlendirmeler</h4>
                      {selfAssessments.slice(0, 5).map(assessment => (
                        <div key={assessment.id} className="border rounded p-2 space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{new Date(assessment.assessmentDate).toLocaleDateString()}</span>
                            <div className="flex gap-2 text-xs">
                              <span>Ruh: {assessment.moodRating}</span>
                              <span>Motivasyon: {assessment.motivationLevel}</span>
                              <span>Stres: {assessment.stressLevel}</span>
                            </div>
                          </div>
                          {assessment.todayHighlight && (
                            <div className="text-xs text-muted-foreground">
                              💡 {assessment.todayHighlight}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Sosyal/İletişim */}
        <TabsContent value="sosyal">
          <Tabs defaultValue="gorusmeler" className="space-y-4">
            <TabsList>
              <TabsTrigger value="gorusmeler" className="flex items-center gap-1 text-xs">
                <MessageCircle className="h-3 w-3" /> Görüşmeler
              </TabsTrigger>
              <TabsTrigger value="anketler" className="flex items-center gap-1 text-xs">
                <PieChart className="h-3 w-3" /> Anket/Test
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="gorusmeler">
              <Card>
                <CardHeader>
                  <CardTitle>Görüşme Kayıtları</CardTitle>
                  <CardDescription>
                    Not ekleyin ve eylem planını takip edin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                      <Input
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                    <Select
                      value={type}
                      onValueChange={(v) => setType(v as MeetingNote["type"])}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tür" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bireysel">Bireysel</SelectItem>
                        <SelectItem value="Grup">Grup</SelectItem>
                        <SelectItem value="Veli">Veli</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={onAdd}>
                      <CalendarDays className="mr-2 h-4 w-4" /> Kaydı Ekle
                    </Button>
                  </div>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Görüşme notu"
                  />
                  <Input
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    placeholder="Eylem planı (opsiyonel)"
                  />

                  <div className="space-y-3">
                    {notes.length === 0 && (
                      <div className="text-sm text-muted-foreground">
                        Henüz kayıt yok.
                      </div>
                    )}
                    {notes.map((n) => (
                      <div key={n.id} className="rounded-md border p-3">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{n.type}</Badge>{" "}
                            {new Date(n.date).toLocaleString()}
                          </div>
                          {n.plan && (
                            <span className="text-xs">Plan: {n.plan}</span>
                          )}
                        </div>
                        <div className="mt-2 whitespace-pre-wrap text-sm">
                          {n.note}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="anketler">
              <Card>
                <CardHeader>
                  <CardTitle>Anket / Test Sonuçları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Input
                      placeholder="Başlık (örn. Beck Depresyon)"
                      value={srTitle}
                      onChange={(e) => setSrTitle(e.target.value)}
                    />
                    <Input
                      placeholder="Puan (opsiyonel)"
                      value={srScore}
                      onChange={(e) => setSrScore(e.target.value)}
                    />
                    <div className="md:col-span-2">
                      <Button onClick={addSurvey}>Sonuç Ekle</Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    {surveyResults.length === 0 && (
                      <div className="text-sm text-muted-foreground">
                        Kayıt yok.
                      </div>
                    )}
                    {surveyResults.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between rounded border p-2 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {new Date(r.date).toLocaleDateString()}
                          </Badge>
                          <span>{r.title}</span>
                        </div>
                        {typeof r.score === "number" && (
                          <Badge variant="secondary">Puan: {r.score}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Aile İletişimi */}
        <TabsContent value="aile-iletisimi">
          <Tabs defaultValue="veli-gorusmeleri" className="space-y-4">
            <TabsList>
              <TabsTrigger value="veli-gorusmeleri" className="flex items-center gap-1 text-xs">
                <Users className="h-3 w-3" /> Veli Görüşmeleri
              </TabsTrigger>
              <TabsTrigger value="ev-ziyaretleri" className="flex items-center gap-1 text-xs">
                <Heart className="h-3 w-3" /> Ev Ziyaretleri  
              </TabsTrigger>
              <TabsTrigger value="aile-katilim" className="flex items-center gap-1 text-xs">
                <Star className="h-3 w-3" /> Aile Katılımı
              </TabsTrigger>
            </TabsList>

            <TabsContent value="veli-gorusmeleri">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Veli Görüşme Kayıtları
                  </CardTitle>
                  <CardDescription>
                    Detaylı veli görüşme kayıtları ve takip planları
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      type="date"
                      placeholder="Görüşme Tarihi"
                      value={pmDate}
                      onChange={(e) => setPmDate(e.target.value)}
                    />
                    <Input
                      type="time"
                      placeholder="Görüşme Saati"
                      value={pmTime}
                      onChange={(e) => setPmTime(e.target.value)}
                    />
                    <Select value={pmType} onValueChange={setPmType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Görüşme Türü" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="YÜZ_YÜZE">Yüz Yüze</SelectItem>
                        <SelectItem value="TELEFON">Telefon</SelectItem>
                        <SelectItem value="ONLINE">Online</SelectItem>
                        <SelectItem value="EV_ZİYARETİ">Ev Ziyareti</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Katılımcılar (virgülle ayırın)"
                      value={pmParticipants}
                      onChange={(e) => setPmParticipants(e.target.value)}
                    />
                  </div>
                  
                  <Textarea
                    placeholder="Ana konular (virgülle ayırın)"
                    value={pmTopics}
                    onChange={(e) => setPmTopics(e.target.value)}
                  />
                  
                  <Textarea
                    placeholder="Endişeler ve sorunlar"
                    value={pmConcerns}
                    onChange={(e) => setPmConcerns(e.target.value)}
                  />
                  
                  <Textarea
                    placeholder="Alınan kararlar"
                    value={pmDecisions}
                    onChange={(e) => setPmDecisions(e.target.value)}
                  />
                  
                  <Textarea
                    placeholder="Eylem planı"
                    value={pmActionPlan}
                    onChange={(e) => setPmActionPlan(e.target.value)}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      type="date"
                      placeholder="Sonraki görüşme tarihi"
                      value={pmNextDate}
                      onChange={(e) => setPmNextDate(e.target.value)}
                    />
                    <Select value={pmSatisfaction} onValueChange={setPmSatisfaction}>
                      <SelectTrigger>
                        <SelectValue placeholder="Veli Memnuniyeti (1-10)" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8,9,10].map(num => (
                          <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full" onClick={saveParentMeeting}>
                    <Users className="mr-2 h-4 w-4" />
                    Veli Görüşmesi Kaydet
                  </Button>

                  <div className="space-y-3">
                    <h4 className="font-medium">Görüşme Geçmişi</h4>
                    {parentMeetings.length === 0 && (
                      <div className="text-sm text-muted-foreground">
                        Henüz veli görüşmesi kaydı yok.
                      </div>
                    )}
                    {parentMeetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className="border rounded-lg p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium">
                            {new Date(meeting.date).toLocaleDateString()} - {meeting.time}
                          </div>
                          <Badge variant="outline">{meeting.type}</Badge>
                        </div>
                        <div className="text-sm">
                          <strong>Katılımcılar:</strong> {meeting.participants.join(", ")}
                        </div>
                        <div className="text-sm">
                          <strong>Ana Konular:</strong> {meeting.mainTopics.join(", ")}
                        </div>
                        {meeting.concerns && (
                          <div className="text-sm text-muted-foreground">
                            <strong>Endişeler:</strong> {meeting.concerns}
                          </div>
                        )}
                        {meeting.actionPlan && (
                          <div className="text-sm text-muted-foreground">
                            <strong>Eylem Planı:</strong> {meeting.actionPlan}
                          </div>
                        )}
                        {meeting.parentSatisfaction && (
                          <div className="text-sm">
                            <Badge variant="secondary">
                              Memnuniyet: {meeting.parentSatisfaction}/10
                            </Badge>
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          Kaydeden: {meeting.createdBy}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ev-ziyaretleri">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Ev Ziyareti Kayıtları
                  </CardTitle>
                  <CardDescription>
                    Ev ziyareti gözlemleri ve önerileri
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                      type="date"
                      placeholder="Ziyaret Tarihi"
                      value={hvDate}
                      onChange={(e) => setHvDate(e.target.value)}
                    />
                    <Input
                      type="time"
                      placeholder="Ziyaret Saati"
                      value={hvTime}
                      onChange={(e) => setHvTime(e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Süre (dakika)"
                      value={hvDuration}
                      onChange={(e) => setHvDuration(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      placeholder="Ziyaretçiler (virgülle ayırın)"
                      value={hvVisitors}
                      onChange={(e) => setHvVisitors(e.target.value)}
                    />
                    <Input
                      placeholder="Evde bulunanlar (virgülle ayırın)"
                      value={hvFamilyPresent}
                      onChange={(e) => setHvFamilyPresent(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Select value={hvEnvironment} onValueChange={setHvEnvironment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Ev Ortamı" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UYGUN">Uygun</SelectItem>
                        <SelectItem value="ORTA">Orta</SelectItem>
                        <SelectItem value="ZOR_KOŞULLAR">Zor Koşullar</SelectItem>
                        <SelectItem value="DEĞERLENDİRİLEMEDİ">Değerlendirilemedi</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={hvInteraction} onValueChange={setHvInteraction}>
                      <SelectTrigger>
                        <SelectValue placeholder="Aile Etkileşimi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OLUMLU">Olumlu</SelectItem>
                        <SelectItem value="NORMAL">Normal</SelectItem>
                        <SelectItem value="GERGİN">Gergin</SelectItem>
                        <SelectItem value="İŞBİRLİKSİZ">İşbirliksiz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Textarea
                    placeholder="Gözlemler"
                    value={hvObservations}
                    onChange={(e) => setHvObservations(e.target.value)}
                  />
                  
                  <Textarea
                    placeholder="Öneriler"
                    value={hvRecommendations}
                    onChange={(e) => setHvRecommendations(e.target.value)}
                  />
                  
                  <Textarea
                    placeholder="Tespit edilen sorunlar"
                    value={hvConcerns}
                    onChange={(e) => setHvConcerns(e.target.value)}
                  />
                  
                  <Textarea
                    placeholder="Sağlanan kaynaklar/yardımlar"
                    value={hvResources}
                    onChange={(e) => setHvResources(e.target.value)}
                  />

                  <Input
                    type="date"
                    placeholder="Sonraki ziyaret tarihi"
                    value={hvNextVisit}
                    onChange={(e) => setHvNextVisit(e.target.value)}
                  />

                  <Button className="w-full" onClick={saveHomeVisit}>
                    <Heart className="mr-2 h-4 w-4" />
                    Ev Ziyareti Kaydet
                  </Button>

                  <div className="space-y-3">
                    <h4 className="font-medium">Ziyaret Geçmişi</h4>
                    {homeVisits.length === 0 && (
                      <div className="text-sm text-muted-foreground">
                        Henüz ev ziyareti kaydı yok.
                      </div>
                    )}
                    {homeVisits.map((visit) => (
                      <div
                        key={visit.id}
                        className="border rounded-lg p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium">
                            {new Date(visit.date).toLocaleDateString()} - {visit.time}
                          </div>
                          <Badge variant="outline">{visit.visitDuration} dk</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <strong>Ev Ortamı:</strong> {visit.homeEnvironment}
                          </div>
                          <div>
                            <strong>Aile Etkileşimi:</strong> {visit.familyInteraction}
                          </div>
                        </div>
                        <div className="text-sm">
                          <strong>Ziyaretçiler:</strong> {visit.visitors.join(", ")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <strong>Gözlemler:</strong> {visit.observations}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <strong>Öneriler:</strong> {visit.recommendations}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Kaydeden: {visit.createdBy}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="aile-katilim">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Aile Katılım Durumu
                  </CardTitle>
                  <CardDescription>
                    Okul etkinlikleri ve görüşmelere katılım takibi
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Select value={fpEventType} onValueChange={setFpEventType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Etkinlik Türü" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VELI_TOPLANTISI">Veli Toplantısı</SelectItem>
                        <SelectItem value="OKUL_ETKİNLİĞİ">Okul Etkinliği</SelectItem>
                        <SelectItem value="ÖĞRETMEN_GÖRÜŞMESİ">Öğretmen Görüşmesi</SelectItem>
                        <SelectItem value="PERFORMANS_DEĞERLENDİRME">Performans Değerlendirme</SelectItem>
                        <SelectItem value="DİĞER">Diğer</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Etkinlik Adı"
                      value={fpEventName}
                      onChange={(e) => setFpEventName(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      type="date"
                      placeholder="Etkinlik Tarihi"
                      value={fpEventDate}
                      onChange={(e) => setFpEventDate(e.target.value)}
                    />
                    <Select value={fpParticipationStatus} onValueChange={setFpParticipationStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Katılım Durumu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KATILDI">Katıldı</SelectItem>
                        <SelectItem value="KATILMADI">Katılmadı</SelectItem>
                        <SelectItem value="GEÇ_KATILDI">Geç Katıldı</SelectItem>
                        <SelectItem value="ERKEN_AYRILDI">Erken Ayrıldı</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Input
                    placeholder="Katılan aile üyeleri (virgülle ayırın)"
                    value={fpParticipants}
                    onChange={(e) => setFpParticipants(e.target.value)}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Select value={fpEngagementLevel} onValueChange={setFpEngagementLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Katılım Düzeyi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ÇOK_AKTİF">Çok Aktif</SelectItem>
                        <SelectItem value="AKTİF">Aktif</SelectItem>
                        <SelectItem value="PASİF">Pasif</SelectItem>
                        <SelectItem value="İLGİSİZ">İlgisiz</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={fpCommunicationFreq} onValueChange={setFpCommunicationFreq}>
                      <SelectTrigger>
                        <SelectValue placeholder="İletişim Sıklığı" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GÜNLÜK">Günlük</SelectItem>
                        <SelectItem value="HAFTALIK">Haftalık</SelectItem>
                        <SelectItem value="AYLIK">Aylık</SelectItem>
                        <SelectItem value="SADECE_GEREKENDE">Sadece Gerekende</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Select value={fpContactMethod} onValueChange={setFpContactMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tercih Edilen İletişim Yöntemi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TELEFON">Telefon</SelectItem>
                      <SelectItem value="EMAIL">E-mail</SelectItem>
                      <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                      <SelectItem value="YÜZ_YÜZE">Yüz Yüze</SelectItem>
                      <SelectItem value="OKUL_SISTEMI">Okul Sistemi</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Veli müsait olduğu zamanlar"
                    value={fpAvailability}
                    onChange={(e) => setFpAvailability(e.target.value)}
                  />

                  <Textarea
                    placeholder="Notlar"
                    value={fpNotes}
                    onChange={(e) => setFpNotes(e.target.value)}
                  />

                  <Button className="w-full" onClick={saveFamilyParticipation}>
                    <Star className="mr-2 h-4 w-4" />
                    Katılım Kaydı Ekle
                  </Button>

                  <div className="space-y-3">
                    <h4 className="font-medium">Katılım Geçmişi</h4>
                    {familyParticipation.length === 0 && (
                      <div className="text-sm text-muted-foreground">
                        Henüz katılım kaydı yok.
                      </div>
                    )}
                    {familyParticipation.map((participation) => (
                      <div
                        key={participation.id}
                        className="border rounded-lg p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{participation.eventName}</div>
                          <Badge variant="outline">{participation.eventType}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            {new Date(participation.eventDate).toLocaleDateString()}
                          </div>
                          <Badge 
                            variant={participation.participationStatus === "KATILDI" ? "default" : "secondary"}
                          >
                            {participation.participationStatus}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <strong>Katılım Düzeyi:</strong> {participation.engagementLevel}
                          </div>
                          <div>
                            <strong>İletişim:</strong> {participation.communicationFrequency}
                          </div>
                        </div>
                        <div className="text-sm">
                          <strong>Tercih Edilen Yöntem:</strong> {participation.preferredContactMethod}
                        </div>
                        {participation.participants && (
                          <div className="text-sm text-muted-foreground">
                            <strong>Katılanlar:</strong> {participation.participants.join(", ")}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          Kaydeden: {participation.recordedBy}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Sağlık & Risk */}
        <TabsContent value="saglik-risk">
          <Tabs defaultValue="saglik">
            <TabsList className="flex flex-wrap gap-1 h-auto w-full justify-start bg-slate-100">
              <TabsTrigger value="saglik" className="flex items-center gap-1 text-xs">
                <Activity className="h-3 w-3" /> Sağlık Bilgileri
              </TabsTrigger>
              <TabsTrigger value="ozel-egitim" className="flex items-center gap-1 text-xs">
                <FileText className="h-3 w-3" /> Özel Eğitim
              </TabsTrigger>
              <TabsTrigger value="risk-degerlendirme" className="flex items-center gap-1 text-xs">
                <AlertTriangle className="h-3 w-3" /> Risk Değerlendirme
              </TabsTrigger>
              <TabsTrigger value="davranis" className="flex items-center gap-1 text-xs">
                <ClipboardList className="h-3 w-3" /> Davranış Takibi
              </TabsTrigger>
              <TabsTrigger value="sinavlar" className="flex items-center gap-1 text-xs">
                <BarChart2 className="h-3 w-3" /> Sınav Sonuçları
              </TabsTrigger>
            </TabsList>

            {/* Sağlık Bilgileri */}
            <TabsContent value="saglik">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Sağlık Bilgileri ve Acil Durum</CardTitle>
                    <CardDescription>Öğrencinin sağlık bilgileri ve acil iletişim</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input placeholder="Kan Grubu" id="health-bloodType" />
                      <Input placeholder="Doktor Adı" id="health-physicianName" />
                      <Input placeholder="Doktor Telefon" id="health-physicianPhone" />
                    </div>
                    <Textarea placeholder="Kronik Hastalıklar" id="health-chronicDiseases" rows={2} />
                    <Textarea placeholder="Alerjiler" id="health-allergies" rows={2} />
                    <Textarea placeholder="İlaçlar" id="health-medications" rows={2} />
                    <Textarea placeholder="Özel İhtiyaçlar" id="health-specialNeeds" rows={2} />
                    
                    <div className="border-t pt-3 mt-3">
                      <h4 className="font-medium mb-3">Acil İletişim Kişileri</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input placeholder="1. Kişi Adı" id="health-emergency1Name" />
                        <Input placeholder="1. Kişi Telefon" id="health-emergency1Phone" />
                        <Input placeholder="1. Kişi Yakınlık" id="health-emergency1Relation" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                        <Input placeholder="2. Kişi Adı" id="health-emergency2Name" />
                        <Input placeholder="2. Kişi Telefon" id="health-emergency2Phone" />
                        <Input placeholder="2. Kişi Yakınlık" id="health-emergency2Relation" />
                      </div>
                    </div>
                    
                    <Input type="date" placeholder="Son Sağlık Kontrolü" id="health-lastCheckup" />
                    <Textarea placeholder="Ek Notlar" id="health-notes" rows={2} />
                    
                    <Button className="w-full" onClick={async () => {
                      const healthData: HealthInfo = {
                        id: crypto.randomUUID(),
                        studentId: sid,
                        bloodType: (document.getElementById('health-bloodType') as HTMLInputElement)?.value,
                        chronicDiseases: (document.getElementById('health-chronicDiseases') as HTMLTextAreaElement)?.value,
                        allergies: (document.getElementById('health-allergies') as HTMLTextAreaElement)?.value,
                        medications: (document.getElementById('health-medications') as HTMLTextAreaElement)?.value,
                        specialNeeds: (document.getElementById('health-specialNeeds') as HTMLTextAreaElement)?.value,
                        emergencyContact1Name: (document.getElementById('health-emergency1Name') as HTMLInputElement)?.value,
                        emergencyContact1Phone: (document.getElementById('health-emergency1Phone') as HTMLInputElement)?.value,
                        emergencyContact1Relation: (document.getElementById('health-emergency1Relation') as HTMLInputElement)?.value,
                        emergencyContact2Name: (document.getElementById('health-emergency2Name') as HTMLInputElement)?.value,
                        emergencyContact2Phone: (document.getElementById('health-emergency2Phone') as HTMLInputElement)?.value,
                        emergencyContact2Relation: (document.getElementById('health-emergency2Relation') as HTMLInputElement)?.value,
                        physicianName: (document.getElementById('health-physicianName') as HTMLInputElement)?.value,
                        physicianPhone: (document.getElementById('health-physicianPhone') as HTMLInputElement)?.value,
                        lastHealthCheckup: (document.getElementById('health-lastCheckup') as HTMLInputElement)?.value,
                        notes: (document.getElementById('health-notes') as HTMLTextAreaElement)?.value,
                      };
                      await saveHealthInfo(healthData);
                      setRefresh(r => r + 1);
                    }}>
                      <Activity className="mr-2 h-4 w-4" />
                      Sağlık Bilgisi Kaydet
                    </Button>
                    
                    {healthInfo && (
                      <div className="space-y-2 mt-4">
                        <h4 className="font-medium">Kayıtlı Sağlık Bilgileri</h4>
                        <div className="border rounded-lg p-3 space-y-2 text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            {healthInfo.bloodType && <div><strong>Kan Grubu:</strong> {healthInfo.bloodType}</div>}
                            {healthInfo.physicianName && <div><strong>Doktor:</strong> {healthInfo.physicianName}</div>}
                          </div>
                          {healthInfo.chronicDiseases && <div><strong>Kronik Hastalıklar:</strong> {healthInfo.chronicDiseases}</div>}
                          {healthInfo.allergies && <div><strong>Alerjiler:</strong> {healthInfo.allergies}</div>}
                          {healthInfo.emergencyContact1Name && (
                            <div><strong>Acil İletişim 1:</strong> {healthInfo.emergencyContact1Name} - {healthInfo.emergencyContact1Phone}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Özel Eğitim */}
            <TabsContent value="ozel-egitim">
              <Card>
                <CardHeader>
                  <CardTitle>Özel Eğitim - BEP Takibi</CardTitle>
                  <CardDescription>Bireysel Eğitim Planı ve RAM raporları</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="special-hasIEP" className="h-4 w-4" />
                    <label htmlFor="special-hasIEP">BEP var</label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input type="date" placeholder="BEP Başlangıç" id="special-iepStart" />
                    <Input type="date" placeholder="BEP Bitiş" id="special-iepEnd" />
                  </div>
                  
                  <Textarea placeholder="BEP Hedefleri" id="special-iepGoals" rows={3} />
                  <Textarea placeholder="Tanı" id="special-diagnosis" rows={2} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input type="date" placeholder="RAM Rapor Tarihi" id="special-ramDate" />
                    <Select defaultValue="AKTİF">
                      <SelectTrigger>
                        <SelectValue placeholder="Durum" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AKTİF">Aktif</SelectItem>
                        <SelectItem value="TAMAMLANDI">Tamamlandı</SelectItem>
                        <SelectItem value="İPTAL">İptal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Textarea placeholder="RAM Rapor Özeti" id="special-ramSummary" rows={2} />
                  <Textarea placeholder="Destek Hizmetleri" id="special-support" rows={2} />
                  <Textarea placeholder="Uyarlamalar" id="special-accommodations" rows={2} />
                  <Input type="date" placeholder="Sonraki Değerlendirme" id="special-nextReview" />
                  <Textarea placeholder="Notlar" id="special-notes" rows={2} />
                  
                  <Button className="w-full" onClick={async () => {
                    const specialEd: SpecialEducation = {
                      id: crypto.randomUUID(),
                      studentId: sid,
                      hasIEP: (document.getElementById('special-hasIEP') as HTMLInputElement)?.checked || false,
                      iepStartDate: (document.getElementById('special-iepStart') as HTMLInputElement)?.value,
                      iepEndDate: (document.getElementById('special-iepEnd') as HTMLInputElement)?.value,
                      iepGoals: (document.getElementById('special-iepGoals') as HTMLTextAreaElement)?.value,
                      diagnosis: (document.getElementById('special-diagnosis') as HTMLTextAreaElement)?.value,
                      ramReportDate: (document.getElementById('special-ramDate') as HTMLInputElement)?.value,
                      ramReportSummary: (document.getElementById('special-ramSummary') as HTMLTextAreaElement)?.value,
                      supportServices: (document.getElementById('special-support') as HTMLTextAreaElement)?.value,
                      accommodations: (document.getElementById('special-accommodations') as HTMLTextAreaElement)?.value,
                      status: (document.getElementById('special-status') as HTMLSelectElement)?.value || 'AKTİF',
                      nextReviewDate: (document.getElementById('special-nextReview') as HTMLInputElement)?.value,
                      notes: (document.getElementById('special-notes') as HTMLTextAreaElement)?.value,
                    };
                    await addSpecialEducation(specialEd);
                    setRefresh(r => r + 1);
                  }}>
                    <FileText className="mr-2 h-4 w-4" />
                    BEP Kaydı Ekle
                  </Button>
                  
                  {specialEducation && specialEducation.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <h4 className="font-medium">BEP Kaydı</h4>
                      <div className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant={specialEducation[0].hasIEP ? "default" : "secondary"}>
                            {specialEducation[0].hasIEP ? "BEP Var" : "BEP Yok"}
                          </Badge>
                          <Badge variant="outline">{specialEducation[0].status}</Badge>
                        </div>
                        {specialEducation[0].diagnosis && <div className="text-sm"><strong>Tanı:</strong> {specialEducation[0].diagnosis}</div>}
                        {specialEducation[0].iepGoals && <div className="text-sm"><strong>Hedefler:</strong> {specialEducation[0].iepGoals}</div>}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Risk Değerlendirme */}
            <TabsContent value="risk-degerlendirme">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Değerlendirme ve Erken Uyarı</CardTitle>
                  <CardDescription>Akademik, davranışsal ve sosyal-duygusal risk faktörleri</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input type="date" placeholder="Değerlendirme Tarihi" id="risk-assessmentDate" defaultValue={new Date().toISOString().slice(0, 10)} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Select defaultValue="DÜŞÜK">
                      <SelectTrigger>
                        <SelectValue placeholder="Akademik Risk" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DÜŞÜK">Düşük</SelectItem>
                        <SelectItem value="ORTA">Orta</SelectItem>
                        <SelectItem value="YÜKSEK">Yüksek</SelectItem>
                        <SelectItem value="ÇOK_YÜKSEK">Çok Yüksek</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select defaultValue="DÜŞÜK">
                      <SelectTrigger>
                        <SelectValue placeholder="Davranışsal Risk" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DÜŞÜK">Düşük</SelectItem>
                        <SelectItem value="ORTA">Orta</SelectItem>
                        <SelectItem value="YÜKSEK">Yüksek</SelectItem>
                        <SelectItem value="ÇOK_YÜKSEK">Çok Yüksek</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Select defaultValue="DÜŞÜK">
                      <SelectTrigger>
                        <SelectValue placeholder="Devamsızlık Riski" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DÜŞÜK">Düşük</SelectItem>
                        <SelectItem value="ORTA">Orta</SelectItem>
                        <SelectItem value="YÜKSEK">Yüksek</SelectItem>
                        <SelectItem value="ÇOK_YÜKSEK">Çok Yüksek</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select defaultValue="DÜŞÜK">
                      <SelectTrigger>
                        <SelectValue placeholder="Sosyal-Duygusal Risk" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DÜŞÜK">Düşük</SelectItem>
                        <SelectItem value="ORTA">Orta</SelectItem>
                        <SelectItem value="YÜKSEK">Yüksek</SelectItem>
                        <SelectItem value="ÇOK_YÜKSEK">Çok Yüksek</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Textarea placeholder="Akademik Risk Faktörleri" id="risk-academicFactors" rows={2} />
                  <Textarea placeholder="Davranışsal Faktörler" id="risk-behavioralFactors" rows={2} />
                  <Textarea placeholder="Koruyucu Faktörler" id="risk-protectiveFactors" rows={2} />
                  <Textarea placeholder="Gerekli Müdahaleler" id="risk-interventions" rows={2} />
                  
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="risk-parentNotified" className="h-4 w-4" />
                    <label htmlFor="risk-parentNotified">Veli bilgilendirildi</label>
                  </div>
                  
                  <Input placeholder="Sorumlu Danışman" id="risk-counselor" />
                  <Input type="date" placeholder="Sonraki Değerlendirme" id="risk-nextAssessment" />
                  
                  <Button className="w-full" onClick={async () => {
                    const riskData: RiskFactors = {
                      id: crypto.randomUUID(),
                      studentId: sid,
                      assessmentDate: (document.getElementById('risk-assessmentDate') as HTMLInputElement)?.value || new Date().toISOString().slice(0, 10),
                      academicRiskLevel: (document.getElementById('risk-academic') as HTMLSelectElement)?.value || 'DÜŞÜK',
                      behavioralRiskLevel: (document.getElementById('risk-behavioral') as HTMLSelectElement)?.value || 'DÜŞÜK',
                      attendanceRiskLevel: (document.getElementById('risk-attendance') as HTMLSelectElement)?.value || 'DÜŞÜK',
                      socialEmotionalRiskLevel: (document.getElementById('risk-socialEmotional') as HTMLSelectElement)?.value || 'DÜŞÜK',
                      academicFactors: (document.getElementById('risk-academicFactors') as HTMLTextAreaElement)?.value,
                      behavioralFactors: (document.getElementById('risk-behavioralFactors') as HTMLTextAreaElement)?.value,
                      protectiveFactors: (document.getElementById('risk-protectiveFactors') as HTMLTextAreaElement)?.value,
                      interventionsNeeded: (document.getElementById('risk-interventions') as HTMLTextAreaElement)?.value,
                      parentNotified: (document.getElementById('risk-parentNotified') as HTMLInputElement)?.checked || false,
                      assignedCounselor: (document.getElementById('risk-counselor') as HTMLInputElement)?.value,
                      nextAssessmentDate: (document.getElementById('risk-nextAssessment') as HTMLInputElement)?.value,
                      status: 'AKTİF'
                    };
                    await addRiskFactors(riskData);
                    setRefresh(r => r + 1);
                  }}>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Risk Değerlendirmesi Kaydet
                  </Button>
                  
                  {riskFactors && (
                    <div className="space-y-2 mt-4">
                      <h4 className="font-medium">Son Risk Değerlendirmesi</h4>
                      <div className="border rounded-lg p-3 space-y-2">
                        <div className="text-sm font-medium">
                          {new Date(riskFactors.assessmentDate).toLocaleDateString()}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <span>Akademik:</span>
                            <Badge variant={riskFactors.academicRiskLevel === 'YÜKSEK' || riskFactors.academicRiskLevel === 'ÇOK_YÜKSEK' ? 'destructive' : 'secondary'}>
                              {riskFactors.academicRiskLevel}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>Davranış:</span>
                            <Badge variant={riskFactors.behavioralRiskLevel === 'YÜKSEK' || riskFactors.behavioralRiskLevel === 'ÇOK_YÜKSEK' ? 'destructive' : 'secondary'}>
                              {riskFactors.behavioralRiskLevel}
                            </Badge>
                          </div>
                        </div>
                        {riskFactors.interventionsNeeded && (
                          <div className="text-sm"><strong>Müdahaleler:</strong> {riskFactors.interventionsNeeded}</div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Davranış Takibi */}
            <TabsContent value="davranis">
              <Card>
                <CardHeader>
                  <CardTitle>Davranış Takibi - ABC Analizi</CardTitle>
                  <CardDescription>Davranış olayları ve müdahale etkinliği</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input type="date" placeholder="Olay Tarihi" id="behavior-date" defaultValue={new Date().toISOString().slice(0, 10)} />
                    <Input type="time" placeholder="Olay Saati" id="behavior-time" />
                  </div>
                  
                  <Input placeholder="Konum (Sınıf, bahçe, vb.)" id="behavior-location" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Select defaultValue="SÖZLÜ">
                      <SelectTrigger>
                        <SelectValue placeholder="Davranış Türü" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SÖZLÜ">Sözlü</SelectItem>
                        <SelectItem value="FİZİKSEL">Fiziksel</SelectItem>
                        <SelectItem value="KURALLARA_UYMAMA">Kurallara Uymama</SelectItem>
                        <SelectItem value="DERSE_KATILMAMA">Derse Katılmama</SelectItem>
                        <SelectItem value="DİĞER">Diğer</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select defaultValue="ORTA">
                      <SelectTrigger>
                        <SelectValue placeholder="Yoğunluk" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DÜŞÜK">Düşük</SelectItem>
                        <SelectItem value="ORTA">Orta</SelectItem>
                        <SelectItem value="YÜKSEK">Yüksek</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Textarea placeholder="Davranış Açıklaması" id="behavior-description" rows={2} />
                  <Textarea placeholder="Öncül (Antecedent) - Davranıştan önce ne oldu?" id="behavior-antecedent" rows={2} />
                  <Textarea placeholder="Sonuç (Consequence) - Davranıştan sonra ne oldu?" id="behavior-consequence" rows={2} />
                  <Textarea placeholder="Kullanılan Müdahale" id="behavior-intervention" rows={2} />
                  
                  <Select defaultValue="KISMEN_ETKİLİ">
                    <SelectTrigger>
                      <SelectValue placeholder="Müdahale Etkinliği" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ÇOK_ETKİLİ">Çok Etkili</SelectItem>
                      <SelectItem value="ETKİLİ">Etkili</SelectItem>
                      <SelectItem value="KISMEN_ETKİLİ">Kısmen Etkili</SelectItem>
                      <SelectItem value="ETKİSİZ">Etkisiz</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="behavior-parentNotified" className="h-4 w-4" />
                    <label htmlFor="behavior-parentNotified">Veli bilgilendirildi</label>
                  </div>
                  
                  <Input placeholder="Kaydeden Kişi" id="behavior-recordedBy" />
                  <Textarea placeholder="Notlar ve Patern Analizi" id="behavior-notes" rows={2} />
                  
                  <Button className="w-full" onClick={async () => {
                    const behaviorData: BehaviorIncident = {
                      id: crypto.randomUUID(),
                      studentId: sid,
                      incidentDate: (document.getElementById('behavior-date') as HTMLInputElement)?.value || new Date().toISOString().slice(0, 10),
                      incidentTime: (document.getElementById('behavior-time') as HTMLInputElement)?.value || '',
                      location: (document.getElementById('behavior-location') as HTMLInputElement)?.value || '',
                      behaviorType: (document.getElementById('behavior-type') as HTMLSelectElement)?.value || 'DİĞER',
                      behaviorCategory: (document.getElementById('behavior-type') as HTMLSelectElement)?.value || 'DİĞER',
                      description: (document.getElementById('behavior-description') as HTMLTextAreaElement)?.value || '',
                      antecedent: (document.getElementById('behavior-antecedent') as HTMLTextAreaElement)?.value,
                      consequence: (document.getElementById('behavior-consequence') as HTMLTextAreaElement)?.value,
                      intensity: (document.getElementById('behavior-intensity') as HTMLSelectElement)?.value,
                      interventionUsed: (document.getElementById('behavior-intervention') as HTMLTextAreaElement)?.value,
                      interventionEffectiveness: (document.getElementById('behavior-effectiveness') as HTMLSelectElement)?.value,
                      parentNotified: (document.getElementById('behavior-parentNotified') as HTMLInputElement)?.checked || false,
                      followUpRequired: false,
                      adminNotified: false,
                      status: 'KAYITLI',
                      recordedBy: (document.getElementById('behavior-recordedBy') as HTMLInputElement)?.value || 'Sistem',
                      notes: (document.getElementById('behavior-notes') as HTMLTextAreaElement)?.value,
                    };
                    await addBehaviorIncident(behaviorData);
                    setRefresh(r => r + 1);
                  }}>
                    <ClipboardList className="mr-2 h-4 w-4" />
                    Davranış Kaydı Ekle
                  </Button>
                  
                  {behaviorIncidents.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <h4 className="font-medium">Davranış Kayıtları</h4>
                      {behaviorIncidents.map(incident => (
                        <div key={incident.id} className="border rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">
                              {new Date(incident.incidentDate).toLocaleDateString()} {incident.incidentTime}
                            </div>
                            <Badge>{incident.behaviorType}</Badge>
                          </div>
                          <div className="text-sm">{incident.description}</div>
                          {incident.antecedent && (
                            <div className="text-xs"><strong>Öncül:</strong> {incident.antecedent}</div>
                          )}
                          {incident.interventionUsed && (
                            <div className="text-xs"><strong>Müdahale:</strong> {incident.interventionUsed}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sınav Sonuçları */}
            <TabsContent value="sinavlar">
              <Card>
                <CardHeader>
                  <CardTitle>Sınav Sonuçları - LGS/YKS</CardTitle>
                  <CardDescription>Merkezi sınav ve deneme sonuçları takibi</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Select defaultValue="DENEME">
                      <SelectTrigger>
                        <SelectValue placeholder="Sınav Türü" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LGS">LGS</SelectItem>
                        <SelectItem value="YKS_TYT">YKS - TYT</SelectItem>
                        <SelectItem value="YKS_AYT">YKS - AYT</SelectItem>
                        <SelectItem value="YKS_YDT">YKS - YDT</SelectItem>
                        <SelectItem value="DENEME">Deneme Sınavı</SelectItem>
                        <SelectItem value="DİĞER">Diğer</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Input placeholder="Sınav Adı" id="exam-name" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input type="date" placeholder="Sınav Tarihi" id="exam-date" />
                    <Input placeholder="Sınav Sağlayıcı" id="exam-provider" />
                  </div>
                  
                  <div className="border-t pt-3 mt-3">
                    <h4 className="font-medium mb-2">Puan Bilgileri</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <Input type="number" placeholder="Toplam Puan" id="exam-totalScore" />
                      <Input type="number" placeholder="Türkçe Puan" id="exam-turkish" />
                      <Input type="number" placeholder="Matematik Puan" id="exam-math" />
                      <Input type="number" placeholder="Fen Puan" id="exam-science" />
                      <Input type="number" placeholder="Sosyal Puan" id="exam-social" />
                      <Input type="number" placeholder="Yabancı Dil" id="exam-foreign" />
                    </div>
                  </div>
                  
                  <div className="border-t pt-3 mt-3">
                    <h4 className="font-medium mb-2">Net Bilgileri</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <Input type="number" step="0.25" placeholder="Türkçe Net" id="exam-turkishNet" />
                      <Input type="number" step="0.25" placeholder="Matematik Net" id="exam-mathNet" />
                      <Input type="number" step="0.25" placeholder="Fen Net" id="exam-scienceNet" />
                      <Input type="number" step="0.25" placeholder="Sosyal Net" id="exam-socialNet" />
                      <Input type="number" step="0.25" placeholder="Yabancı Dil Net" id="exam-foreignNet" />
                      <Input type="number" step="0.25" placeholder="Toplam Net" id="exam-totalNet" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input type="number" placeholder="Sınıf Sıralaması" id="exam-classRank" />
                    <Input type="number" placeholder="Okul Sıralaması" id="exam-schoolRank" />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="exam-isOfficial" className="h-4 w-4" />
                    <label htmlFor="exam-isOfficial">Resmi Sınav</label>
                  </div>
                  
                  <Textarea placeholder="Güçlü Alanlar (virgülle ayırın)" id="exam-strengths" rows={2} />
                  <Textarea placeholder="Gelişim Alanları (virgülle ayırın)" id="exam-weaknesses" rows={2} />
                  <Textarea placeholder="Danışman Notları ve Eylem Planı" id="exam-counselorNotes" rows={2} />
                  
                  <Button className="w-full" onClick={async () => {
                    const examData: ExamResult = {
                      id: crypto.randomUUID(),
                      studentId: sid,
                      examType: (document.getElementById('exam-type') as HTMLSelectElement)?.value || 'DENEME',
                      examName: (document.getElementById('exam-name') as HTMLInputElement)?.value || '',
                      examDate: (document.getElementById('exam-date') as HTMLInputElement)?.value || new Date().toISOString().slice(0, 10),
                      examProvider: (document.getElementById('exam-provider') as HTMLInputElement)?.value,
                      totalScore: parseFloat((document.getElementById('exam-totalScore') as HTMLInputElement)?.value) || undefined,
                      turkishScore: parseFloat((document.getElementById('exam-turkish') as HTMLInputElement)?.value) || undefined,
                      mathScore: parseFloat((document.getElementById('exam-math') as HTMLInputElement)?.value) || undefined,
                      scienceScore: parseFloat((document.getElementById('exam-science') as HTMLInputElement)?.value) || undefined,
                      socialScore: parseFloat((document.getElementById('exam-social') as HTMLInputElement)?.value) || undefined,
                      foreignLanguageScore: parseFloat((document.getElementById('exam-foreign') as HTMLInputElement)?.value) || undefined,
                      turkishNet: parseFloat((document.getElementById('exam-turkishNet') as HTMLInputElement)?.value) || undefined,
                      mathNet: parseFloat((document.getElementById('exam-mathNet') as HTMLInputElement)?.value) || undefined,
                      scienceNet: parseFloat((document.getElementById('exam-scienceNet') as HTMLInputElement)?.value) || undefined,
                      socialNet: parseFloat((document.getElementById('exam-socialNet') as HTMLInputElement)?.value) || undefined,
                      foreignLanguageNet: parseFloat((document.getElementById('exam-foreignNet') as HTMLInputElement)?.value) || undefined,
                      totalNet: parseFloat((document.getElementById('exam-totalNet') as HTMLInputElement)?.value) || undefined,
                      classRank: parseInt((document.getElementById('exam-classRank') as HTMLInputElement)?.value) || undefined,
                      schoolRank: parseInt((document.getElementById('exam-schoolRank') as HTMLInputElement)?.value) || undefined,
                      isOfficial: (document.getElementById('exam-isOfficial') as HTMLInputElement)?.checked || false,
                      strengthAreas: (document.getElementById('exam-strengths') as HTMLTextAreaElement)?.value.split(',').map(s => s.trim()).filter(Boolean),
                      weaknessAreas: (document.getElementById('exam-weaknesses') as HTMLTextAreaElement)?.value.split(',').map(s => s.trim()).filter(Boolean),
                      counselorNotes: (document.getElementById('exam-counselorNotes') as HTMLTextAreaElement)?.value,
                      goalsMet: false,
                      parentNotified: false,
                    };
                    await addExamResult(examData);
                    setRefresh(r => r + 1);
                  }}>
                    <BarChart2 className="mr-2 h-4 w-4" />
                    Sınav Sonucu Kaydet
                  </Button>
                  
                  {examResults.length > 0 && (
                    <div className="space-y-2 mt-4">
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
            </TabsContent>

          </Tabs>
        </TabsContent>

      </Tabs>
    </div>
  );
}