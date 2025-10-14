import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MAIN_TABS,
  GENEL_TABS,
  EGITSEL_TABS,
  MESLEKI_TABS,
  KISISEL_GELISIM_TABS,
  AILE_TABS,
} from "./constants";
import { StudentData } from "@/hooks/student-profile";
import { Student } from "@/lib/storage";

import BasicInfoSection from "@/components/student-profile/sections/BasicInfoSection";
import CalismaProgramiSection from "@/components/student-profile/sections/CalismaProgramiSection";
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
import OzelEgitimSection from "@/components/student-profile/sections/OzelEgitimSection";
import RiskDegerlendirmeSection from "@/components/student-profile/sections/RiskDegerlendirmeSection";
import DavranisTakibiSection from "@/components/student-profile/sections/DavranisTakibiSection";

import StandardizedAcademicSection from "@/components/student-profile/sections/StandardizedAcademicSection";
import StandardizedSocialEmotionalSection from "@/components/student-profile/sections/StandardizedSocialEmotionalSection";
import StandardizedTalentsSection from "@/components/student-profile/sections/StandardizedTalentsSection";
import StandardizedHealthSection from "@/components/student-profile/sections/StandardizedHealthSection";
import StandardizedBehaviorSection from "@/components/student-profile/sections/StandardizedBehaviorSection";
import MotivationProfileSection from "@/components/student-profile/sections/MotivationProfileSection";
import RiskProtectiveProfileSection from "@/components/student-profile/sections/RiskProtectiveProfileSection";
import CareerGuidanceSection from "@/components/student-profile/sections/CareerGuidanceSection";

import ParentCommunication from "@/components/ai/ParentCommunication";
import InterventionRecommendations from "@/components/ai/InterventionRecommendations";
import AutoReportGenerator from "@/components/ai/AutoReportGenerator";

import { ProfileDashboard } from "./components/ProfileDashboard";
import { EnhancedRiskCard } from "@/components/analytics/EnhancedRiskCard";
import { PersonalizedLearningCard } from "@/components/learning/PersonalizedLearningCard";
import { AdvancedAnalyticsCard } from "@/components/analytics/AdvancedAnalyticsCard";
import { SocialNetworkMap } from "@/components/social/SocialNetworkMap";
import { VoiceRecorder } from "@/components/voice/VoiceRecorder";
import LiveProfileCard from "@/components/live-profile/LiveProfileCard";
import ProfileUpdateTimeline from "@/components/live-profile/ProfileUpdateTimeline";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

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
      <TabsList className="flex flex-wrap gap-1 h-auto w-full justify-start">
        {MAIN_TABS.map(({ value, label, icon: Icon }) => (
          <TabsTrigger key={value} value={value} className="flex items-center gap-1 text-xs">
            <Icon className="h-3 w-3" /> {label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="dashboard" className="mt-4 space-y-4">
        <LiveProfileCard studentId={studentId} />
        
        <ProfileDashboard
          studentId={studentId}
          scores={scoresData?.scores}
          completeness={scoresData?.completeness}
          isLoading={loadingScores}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EnhancedRiskCard studentId={studentId} />
          <PersonalizedLearningCard studentId={studentId} />
        </div>

        <AdvancedAnalyticsCard studentId={studentId} />
        
        <ProfileUpdateTimeline studentId={studentId} />
        
        <SocialNetworkMap studentId={studentId} />

        <Card>
          <CardHeader>
            <CardTitle>Sesli Not ve AI Analizi</CardTitle>
            <CardDescription>
              Öğrenci ile ilgili sesli not alın, otomatik transkript ve AI analizi alın
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VoiceRecorder
              studentId={studentId}
              sessionType="INDIVIDUAL"
              onTranscriptionComplete={(result) => {
                console.log('Voice note completed:', result);
                onUpdate();
              }}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="genel" className="mt-4">
        <Tabs defaultValue="ogrenci" className="space-y-4">
          <TabsList className="w-full justify-start bg-muted/50 p-1">
            {GENEL_TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger 
                key={value} 
                value={value} 
                className="flex items-center gap-1.5 text-xs data-[state=active]:bg-background"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="ogrenci">
            <BasicInfoSection student={student} onUpdate={onUpdate} />
          </TabsContent>

          <TabsContent value="saglik">
            <StandardizedHealthSection
              studentId={studentId}
              onUpdate={onUpdate}
            />
          </TabsContent>
        </Tabs>
      </TabsContent>

      <TabsContent value="aile" className="mt-4">
        <Tabs defaultValue="veli-gorusmeleri" className="space-y-4">
          <TabsList className="w-full justify-start bg-muted/50 p-1 flex-wrap h-auto">
            {AILE_TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger 
                key={value} 
                value={value} 
                className="flex items-center gap-1.5 text-xs data-[state=active]:bg-background"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="veli-gorusmeleri">
            <VeliGorusmeleriSection
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

          <TabsContent value="ai-iletisim">
            <ParentCommunication
              studentId={studentId}
              studentName={`${student.ad} ${student.soyad}`}
            />
          </TabsContent>
        </Tabs>
      </TabsContent>

      <TabsContent value="egitsel" className="mt-4">
        <Tabs defaultValue="akademik" className="space-y-4">
          <TabsList className="w-full justify-start bg-muted/50 p-1 flex-wrap h-auto">
            {EGITSEL_TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger 
                key={value} 
                value={value} 
                className="flex items-center gap-1.5 text-xs data-[state=active]:bg-background"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="akademik">
            <StandardizedAcademicSection
              studentId={studentId}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="calisma-programi">
            <CalismaProgramiSection studentId={studentId} />
          </TabsContent>

          <TabsContent value="ozel-egitim">
            <OzelEgitimSection
              studentId={studentId}
              specialEducation={data.specialEducation}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="mudahaleler">
            <MudahalelerSection
              studentId={studentId}
              interventions={data.interventions}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="ilerleme">
            <IlerlemeTakibiSection
              studentId={studentId}
              achievements={data.achievements}
              selfAssessments={data.selfAssessments}
              todaysAssessment={data.todaysAssessment}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="anketler">
            <AnketlerSection
              studentId={studentId}
              surveyResults={data.surveyResults}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="ai-mudahale">
            <InterventionRecommendations
              studentId={studentId}
              studentName={`${student.ad} ${student.soyad}`}
            />
          </TabsContent>

          <TabsContent value="ai-raporlar">
            <AutoReportGenerator
              studentId={studentId}
              studentName={`${student.ad} ${student.soyad}`}
            />
          </TabsContent>
        </Tabs>
      </TabsContent>

      <TabsContent value="kisisel-gelisim" className="mt-4">
        <Tabs defaultValue="sosyal-duygusal" className="space-y-4">
          <TabsList className="w-full justify-start bg-muted/50 p-1 flex-wrap h-auto">
            {KISISEL_GELISIM_TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger 
                key={value} 
                value={value} 
                className="flex items-center gap-1.5 text-xs data-[state=active]:bg-background"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="sosyal-duygusal">
            <div className="space-y-6">
              <StandardizedSocialEmotionalSection
                studentId={studentId}
                onUpdate={onUpdate}
              />
              <StandardizedTalentsSection
                studentId={studentId}
                onUpdate={onUpdate}
              />
            </div>
          </TabsContent>

          <TabsContent value="davranis">
            <div className="space-y-6">
              <DavranisTakibiSection
                studentId={studentId}
                behaviorIncidents={data.behaviorIncidents}
                onUpdate={onUpdate}
              />
              <StandardizedBehaviorSection
                studentId={studentId}
                onUpdate={onUpdate}
              />
            </div>
          </TabsContent>

          <TabsContent value="risk">
            <div className="space-y-6">
              <RiskDegerlendirmeSection
                studentId={studentId}
                riskFactors={data.riskFactors}
                onUpdate={onUpdate}
              />
              <RiskProtectiveProfileSection
                studentId={studentId}
                onUpdate={onUpdate}
              />
            </div>
          </TabsContent>

          <TabsContent value="gorusmeler">
            <GorusmelerSection
              studentId={studentId}
              notes={data.notes}
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

          <TabsContent value="360-degerlendirme">
            <Degerlendirme360Section
              studentId={studentId}
              evaluations360={data.evaluations360}
              onUpdate={onUpdate}
            />
          </TabsContent>
        </Tabs>
      </TabsContent>

      <TabsContent value="mesleki" className="mt-4">
        <Tabs defaultValue="hedefler" className="space-y-4">
          <TabsList className="w-full justify-start bg-muted/50 p-1 flex-wrap h-auto">
            {MESLEKI_TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger 
                key={value} 
                value={value} 
                className="flex items-center gap-1.5 text-xs data-[state=active]:bg-background"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="hedefler">
            <div className="space-y-6">
              <HedeflerPlanlamaSection
                studentId={studentId}
                academicGoals={data.academicGoals}
                onUpdate={onUpdate}
              />
              <MotivationProfileSection
                studentId={studentId}
                onUpdate={onUpdate}
              />
            </div>
          </TabsContent>

          <TabsContent value="kariyer">
            <CareerGuidanceSection
              studentId={studentId}
              studentName={`${student.ad} ${student.soyad}`}
            />
          </TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  );
}
