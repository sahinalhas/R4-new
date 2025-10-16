import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MAIN_TABS,
  KIMLIK_TABS,
  AKADEMIK_TABS,
  KISISEL_SOSYAL_TABS,
  RISK_MUDAHALE_TABS,
  AILE_ILETISIM_TABS,
  MESLEKI_TABS,
  AI_TOOLS_TABS,
  SISTEM_TABS,
} from "./constants";
import { StudentData } from "@/hooks/student-profile";
import { Student } from "@/lib/storage";

// Temel bilgi bileşenleri
import BasicInfoSection from "@/components/student-profile/sections/BasicInfoSection";
import StandardizedHealthSection from "@/components/student-profile/sections/StandardizedHealthSection";
import OzelEgitimSection from "@/components/student-profile/sections/OzelEgitimSection";

// Akademik bileşenler
import StandardizedAcademicSection from "@/components/student-profile/sections/StandardizedAcademicSection";
import CalismaProgramiSection from "@/components/student-profile/sections/CalismaProgramiSection";
import IlerlemeTakibiSection from "@/components/student-profile/sections/IlerlemeTakibiSection";
import AnketlerSection from "@/components/student-profile/sections/AnketlerSection";

// Kişisel & Sosyal bileşenler
import StandardizedSocialEmotionalSection from "@/components/student-profile/sections/StandardizedSocialEmotionalSection";
import KisilikProfiliSection from "@/components/student-profile/sections/KisilikProfiliSection";
import StandardizedTalentsSection from "@/components/student-profile/sections/StandardizedTalentsSection";
import MotivationProfileSection from "@/components/student-profile/sections/MotivationProfileSection";
import Degerlendirme360Section from "@/components/student-profile/sections/Degerlendirme360Section";

// Aile & İletişim bileşenleri
import EvZiyaretleriSection from "@/components/student-profile/sections/EvZiyaretleriSection";
import AileKatilimiSection from "@/components/student-profile/sections/AileKatilimiSection";

// Mesleki bileşenler
import HedeflerPlanlamaSection from "@/components/student-profile/sections/HedeflerPlanlamaSection";
import CareerGuidanceSection from "@/components/student-profile/sections/CareerGuidanceSection";

// Birleştirilmiş bileşenler (Yeni!)
import UnifiedRiskSection from "@/components/student-profile/sections/UnifiedRiskSection";
import UnifiedMeetingsSection from "@/components/student-profile/sections/UnifiedMeetingsSection";
import AIToolsHub from "@/components/student-profile/sections/AIToolsHub";

// Dashboard bileşenleri
import LiveProfileCard from "@/components/live-profile/LiveProfileCard";
import ProfileUpdateTimeline from "@/components/live-profile/ProfileUpdateTimeline";
import { EnhancedRiskCard } from "@/components/analytics/EnhancedRiskCard";
import { PersonalizedLearningCard } from "@/components/learning/PersonalizedLearningCard";

// Sistem bileşenleri
import ManualCorrectionPanel from "@/components/profile-sync/ManualCorrectionPanel";
import ConflictResolutionUI from "@/components/profile-sync/ConflictResolutionUI";
import ProfileChangeTimeline from "@/components/profile-sync/ProfileChangeTimeline";
import ConflictResolutionPanel from "@/components/profile-sync/ConflictResolutionPanel";
import UnifiedProfileCard from "@/components/profile-sync/UnifiedProfileCard";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, User, Users } from "lucide-react";

interface StudentProfileTabsProps {
  student: Student;
  studentId: string;
  data: StudentData;
  onUpdate: () => void;
  scoresData?: any;
  loadingScores?: boolean;
}

export function StudentProfileTabs({
  student,
  studentId,
  data,
  onUpdate,
  scoresData,
  loadingScores,
}: StudentProfileTabsProps) {
  return (
    <Tabs defaultValue="dashboard" className="space-y-4">
      {/* Ana Sekmeler */}
      <TabsList className="flex flex-wrap gap-1 h-auto w-full justify-start min-h-[2.5rem]">
        {MAIN_TABS.map(({ value, label, icon: Icon }) => (
          <TabsTrigger key={value} value={value} className="flex items-center gap-2 shrink-0">
            <Icon className="h-4 w-4" /> {label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* DASHBOARD - SADELEŞTİRİLMİŞ */}
      <TabsContent value="dashboard" className="mt-4 space-y-4 min-h-[400px]">
        <LiveProfileCard studentId={studentId} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EnhancedRiskCard studentId={studentId} />
          <PersonalizedLearningCard studentId={studentId} />
        </div>
        
        <ProfileUpdateTimeline studentId={studentId} />
      </TabsContent>

      {/* KİMLİK & TEMEL BİLGİLER */}
      <TabsContent value="kimlik" className="mt-4 min-h-[400px]">
        <Tabs defaultValue="kisisel" className="space-y-4">
          <TabsList className="w-full justify-start bg-muted/50 p-1 flex-wrap h-auto min-h-[2.5rem]">
            {KIMLIK_TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger 
                key={value} 
                value={value} 
                className="flex items-center gap-2 data-[state=active]:bg-background shrink-0"
              >
                <Icon className="h-4 w-4" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="kisisel">
            <BasicInfoSection student={student} onUpdate={onUpdate} />
          </TabsContent>

          <TabsContent value="saglik">
            <StandardizedHealthSection
              studentId={studentId}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="ozel-durum">
            <OzelEgitimSection
              studentId={studentId}
              specialEducation={data.specialEducation}
              onUpdate={onUpdate}
            />
          </TabsContent>
        </Tabs>
      </TabsContent>

      {/* AKADEMİK PROFİL */}
      <TabsContent value="akademik" className="mt-4 min-h-[400px]">
        <Tabs defaultValue="performans" className="space-y-4">
          <TabsList className="w-full justify-start bg-muted/50 p-1 flex-wrap h-auto min-h-[2.5rem]">
            {AKADEMIK_TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger 
                key={value} 
                value={value} 
                className="flex items-center gap-2 data-[state=active]:bg-background shrink-0"
              >
                <Icon className="h-4 w-4" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="performans">
            <StandardizedAcademicSection
              studentId={studentId}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="calisma-programi">
            <CalismaProgramiSection studentId={studentId} />
          </TabsContent>

          <TabsContent value="ilerleme">
            <IlerlemeTakibiSection
              studentId={studentId}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="anketler">
            <AnketlerSection
              studentId={studentId}
              onUpdate={onUpdate}
            />
          </TabsContent>
        </Tabs>
      </TabsContent>

      {/* KİŞİSEL & SOSYAL GELİŞİM */}
      <TabsContent value="kisisel-sosyal" className="mt-4 min-h-[400px]">
        <Tabs defaultValue="sosyal-duygusal" className="space-y-4">
          <TabsList className="w-full justify-start bg-muted/50 p-1 flex-wrap h-auto min-h-[2.5rem]">
            {KISISEL_SOSYAL_TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger 
                key={value} 
                value={value} 
                className="flex items-center gap-2 data-[state=active]:bg-background shrink-0"
              >
                <Icon className="h-4 w-4" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="sosyal-duygusal">
            <StandardizedSocialEmotionalSection
              studentId={studentId}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="kisilik">
            <KisilikProfiliSection
              studentId={studentId}
              multipleIntelligence={data.multipleIntelligence}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="yetenek-ilgi">
            <StandardizedTalentsSection
              studentId={studentId}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="motivasyon">
            <MotivationProfileSection
              studentId={studentId}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="360-degerlendirme">
            <Degerlendirme360Section
              studentId={studentId}
              evaluations360={data.evaluations360}
              onUpdate={onUpdate}
            />
          </TabsContent>
        </Tabs>
      </TabsContent>

      {/* RİSK & MÜDAHALE - BİRLEŞTİRİLMİŞ */}
      <TabsContent value="risk-mudahale" className="mt-4 min-h-[400px]">
        <UnifiedRiskSection
          studentId={studentId}
          student={student}
          onUpdate={onUpdate}
        />
      </TabsContent>

      {/* AİLE & İLETİŞİM - BİRLEŞTİRİLMİŞ */}
      <TabsContent value="aile-iletisim" className="mt-4 min-h-[400px]">
        <Tabs defaultValue="gorusmeler" className="space-y-4">
          <TabsList className="w-full justify-start bg-muted/50 p-1 flex-wrap h-auto min-h-[2.5rem]">
            {AILE_ILETISIM_TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger 
                key={value} 
                value={value} 
                className="flex items-center gap-2 data-[state=active]:bg-background shrink-0"
              >
                <Icon className="h-4 w-4" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="gorusmeler">
            <UnifiedMeetingsSection
              studentId={studentId}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="ev-ziyaretleri">
            <EvZiyaretleriSection
              studentId={studentId}
              homeVisits={data.homeVisits}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="aile-katilim">
            <AileKatilimiSection
              studentId={studentId}
              familyParticipation={data.familyParticipation}
              onUpdate={onUpdate}
            />
          </TabsContent>
        </Tabs>
      </TabsContent>

      {/* MESLEKİ REHBERLİK */}
      <TabsContent value="mesleki" className="mt-4 min-h-[400px]">
        <Tabs defaultValue="hedefler" className="space-y-4">
          <TabsList className="w-full justify-start bg-muted/50 p-1 flex-wrap h-auto min-h-[2.5rem]">
            {MESLEKI_TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger 
                key={value} 
                value={value} 
                className="flex items-center gap-2 data-[state=active]:bg-background shrink-0"
              >
                <Icon className="h-4 w-4" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="hedefler">
            <HedeflerPlanlamaSection
              studentId={studentId}
              academicGoals={data.academicGoals}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="kariyer">
            <CareerGuidanceSection
              studentId={studentId}
              studentName={`${student.ad} ${student.soyad}`}
            />
          </TabsContent>
        </Tabs>
      </TabsContent>

      {/* AI ARAÇLARI - BİRLEŞTİRİLMİŞ */}
      <TabsContent value="ai-tools" className="mt-4 min-h-[400px]">
        <AIToolsHub
          studentId={studentId}
          studentName={`${student.ad} ${student.soyad}`}
          onUpdate={onUpdate}
        />
      </TabsContent>

      {/* SİSTEM - TEKNİK ARAÇLAR */}
      <TabsContent value="sistem" className="mt-4 min-h-[400px]">
        <Tabs defaultValue="profil-gecmisi" className="space-y-4">
          <TabsList className="w-full justify-start bg-muted/50 p-1 flex-wrap h-auto min-h-[2.5rem]">
            {SISTEM_TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger 
                key={value} 
                value={value} 
                className="flex items-center gap-2 data-[state=active]:bg-background shrink-0"
              >
                <Icon className="h-4 w-4" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="profil-gecmisi">
            <div className="space-y-4">
              <UnifiedProfileCard studentId={studentId} />
              <ProfileChangeTimeline studentId={studentId} />
            </div>
          </TabsContent>

          <TabsContent value="manuel-duzeltme">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ManualCorrectionPanel studentId={studentId} />
              <ConflictResolutionPanel studentId={studentId} />
            </div>
          </TabsContent>

          <TabsContent value="celiski-cozum">
            <ConflictResolutionUI studentId={studentId} />
          </TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  );
}
