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
import BasicInfoSection from "@/components/student-profile/sections/BasicInfoSection";
import DevamsizlikSection from "@/components/student-profile/sections/DevamsizlikSection";
import CalismaProgramiSection from "@/components/student-profile/sections/CalismaProgramiSection";
import DijitalCoclukSection from "@/components/student-profile/sections/DijitalCoclukSection";
import AkademikPerformansSection from "@/components/student-profile/sections/AkademikPerformansSection";
import MudahalelerSection from "@/components/student-profile/sections/MudahalelerSection";
import KisilikProfiliSection from "@/components/student-profile/sections/KisilikProfiliSection";
import HedeflerPlanlamaSection from "@/components/student-profile/sections/HedeflerPlanlamaSection";
import Degerlendirme360Section from "@/components/student-profile/sections/Degerlendirme360Section";
import IlerlemeTakibiSection from "@/components/student-profile/sections/IlerlemeTakibiSection";
import GorusmelerSection from "@/components/student-profile/sections/GorusmelerSection";
import AnketlerSection from "@/components/student-profile/sections/AnketlerSection";
import VeliGorusmeleriSection from "@/components/student-profile/sections/VeliGorusmeleriSection";
import EvZiyaretleriSection from "@/components/student-profile/sections/EvZiyaretleriSection";
import AileKatilimiSection from "@/components/student-profile/sections/AileKatilimiSection";
import SaglikBilgileriSection from "@/components/student-profile/sections/SaglikBilgileriSection";
import OzelEgitimSection from "@/components/student-profile/sections/OzelEgitimSection";
import RiskDegerlendirmeSection from "@/components/student-profile/sections/RiskDegerlendirmeSection";
import DavranisTakibiSection from "@/components/student-profile/sections/DavranisTakibiSection";
import SinavSonuclariSection from "@/components/student-profile/sections/SinavSonuclariSection";
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
          <BasicInfoSection 
            student={student} 
            onUpdate={() => setRefresh((x) => x + 1)} 
          />
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
              <DevamsizlikSection 
                studentId={sid} 
                attendanceRecords={attendanceRecords} 
                onUpdate={() => setRefresh(x => x + 1)} 
              />
            </TabsContent>
            
            <TabsContent value="calisma">
              <CalismaProgramiSection studentId={sid} />
            </TabsContent>

            <TabsContent value="dijital-kocluk">
              <DijitalCoclukSection 
                studentId={sid} 
                coachingRecommendations={coachingRecommendations} 
                onUpdate={() => setRefresh(x => x + 1)} 
              />
            </TabsContent>

            <TabsContent value="akademik-performans">
              <AkademikPerformansSection 
                studentId={sid} 
                academicRecords={academicRecords} 
                onUpdate={() => setRefresh(x => x + 1)} 
              />
            </TabsContent>

            <TabsContent value="mudahaleler">
              <MudahalelerSection 
                studentId={sid} 
                interventions={interventions} 
                onUpdate={() => setRefresh(x => x + 1)} 
              />
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
              <KisilikProfiliSection 
                studentId={sid} 
                multipleIntelligence={multipleIntelligence} 
                onUpdate={() => setRefresh(x => x + 1)} 
              />
            </TabsContent>

            <TabsContent value="hedefler">
              <HedeflerPlanlamaSection 
                studentId={sid} 
                academicGoals={academicGoals} 
                onUpdate={() => setRefresh(x => x + 1)} 
              />
            </TabsContent>

            <TabsContent value="360-degerlendirme">
              <Degerlendirme360Section 
                studentId={sid} 
                evaluations360={evaluations360} 
                onUpdate={() => setRefresh(x => x + 1)} 
              />
            </TabsContent>

            <TabsContent value="ilerleme-takip">
              <IlerlemeTakibiSection 
                studentId={sid} 
                achievements={achievements} 
                selfAssessments={selfAssessments}
                todaysAssessment={todaysAssessment}
                onUpdate={() => setRefresh(x => x + 1)} 
              />
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
              <GorusmelerSection 
                studentId={sid} 
                notes={notes} 
                onUpdate={() => setRefresh(x => x + 1)} 
              />
            </TabsContent>
            
            <TabsContent value="anketler">
              <AnketlerSection 
                studentId={sid} 
                surveyResults={surveyResults} 
                onUpdate={() => setRefresh(x => x + 1)} 
              />
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
              <VeliGorusmeleriSection 
                studentId={sid} 
                parentMeetings={parentMeetings} 
                onUpdate={() => setRefresh(x => x + 1)} 
              />
            </TabsContent>

            <TabsContent value="ev-ziyaretleri">
              <EvZiyaretleriSection 
                studentId={sid} 
                homeVisits={homeVisits} 
                onUpdate={() => setRefresh(x => x + 1)} 
              />
            </TabsContent>

            <TabsContent value="aile-katilim">
              <AileKatilimiSection 
                studentId={sid} 
                familyParticipation={familyParticipation} 
                onUpdate={() => setRefresh(x => x + 1)} 
              />
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
              <SaglikBilgileriSection 
                studentId={sid} 
                healthInfo={healthInfo} 
                onUpdate={() => setRefresh(x => x + 1)} 
              />
            </TabsContent>

            {/* Özel Eğitim */}
            <TabsContent value="ozel-egitim">
              <OzelEgitimSection 
                studentId={sid} 
                specialEducation={specialEducation} 
                onUpdate={() => setRefresh(x => x + 1)} 
              />
            </TabsContent>

            {/* Risk Değerlendirme */}
            <TabsContent value="risk-degerlendirme">
              <RiskDegerlendirmeSection 
                studentId={sid} 
                riskFactors={riskFactors} 
                onUpdate={() => setRefresh(x => x + 1)} 
              />
            </TabsContent>

            {/* Davranış Takibi */}
            <TabsContent value="davranis">
              <DavranisTakibiSection 
                studentId={sid} 
                behaviorIncidents={behaviorIncidents} 
                onUpdate={() => setRefresh(x => x + 1)} 
              />
            </TabsContent>

            {/* Sınav Sonuçları */}
            <TabsContent value="sinavlar">
              <SinavSonuclariSection 
                studentId={sid} 
                examResults={examResults} 
                onUpdate={() => setRefresh(x => x + 1)} 
              />
            </TabsContent>

          </Tabs>
        </TabsContent>

      </Tabs>
    </div>
  );
}