import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MAIN_TABS,
  AKADEMIK_TABS,
  KISISEL_TABS,
  SOSYAL_TABS,
  AILE_TABS,
  SAGLIK_RISK_TABS,
} from "./constants";
import { StudentData } from "@/hooks/student-profile";
import { Student } from "@/lib/storage";

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

interface StudentProfileTabsProps {
  student: Student;
  studentId: string;
  data: StudentData;
  onUpdate: () => void;
}

export function StudentProfileTabs({
  student,
  studentId,
  data,
  onUpdate,
}: StudentProfileTabsProps) {
  return (
    <Tabs defaultValue="temel">
      <TabsList className="flex flex-wrap gap-1 h-auto w-full justify-start">
        {MAIN_TABS.map(({ value, label, icon: Icon }) => (
          <TabsTrigger key={value} value={value} className="flex items-center gap-1 text-xs">
            <Icon className="h-3 w-3" /> {label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="temel">
        <BasicInfoSection student={student} onUpdate={onUpdate} />
      </TabsContent>

      <TabsContent value="akademik">
        <Tabs defaultValue="devamsizlik" className="space-y-4">
          <TabsList>
            {AKADEMIK_TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="flex items-center gap-1 text-xs">
                <Icon className="h-3 w-3" /> {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="devamsizlik">
            <DevamsizlikSection
              studentId={studentId}
              attendanceRecords={data.attendanceRecords}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="calisma">
            <CalismaProgramiSection studentId={studentId} />
          </TabsContent>

          <TabsContent value="dijital-kocluk">
            <DijitalCoclukSection
              studentId={studentId}
              coachingRecommendations={data.coachingRecommendations}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="akademik-performans">
            <AkademikPerformansSection
              studentId={studentId}
              academicRecords={data.academicRecords}
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
        </Tabs>
      </TabsContent>

      <TabsContent value="kisisel">
        <Tabs defaultValue="kisilik-profil" className="space-y-4">
          <TabsList>
            {KISISEL_TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="flex items-center gap-1 text-xs">
                <Icon className="h-3 w-3" /> {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="kisilik-profil">
            <KisilikProfiliSection
              studentId={studentId}
              multipleIntelligence={data.multipleIntelligence}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="hedefler">
            <HedeflerPlanlamaSection
              studentId={studentId}
              academicGoals={data.academicGoals}
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

          <TabsContent value="ilerleme-takip">
            <IlerlemeTakibiSection
              studentId={studentId}
              achievements={data.achievements}
              selfAssessments={data.selfAssessments}
              todaysAssessment={data.todaysAssessment}
              onUpdate={onUpdate}
            />
          </TabsContent>
        </Tabs>
      </TabsContent>

      <TabsContent value="sosyal">
        <Tabs defaultValue="gorusmeler" className="space-y-4">
          <TabsList>
            {SOSYAL_TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="flex items-center gap-1 text-xs">
                <Icon className="h-3 w-3" /> {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="gorusmeler">
            <GorusmelerSection
              studentId={studentId}
              notes={data.notes}
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
        </Tabs>
      </TabsContent>

      <TabsContent value="aile-iletisimi">
        <Tabs defaultValue="veli-gorusmeleri" className="space-y-4">
          <TabsList>
            {AILE_TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="flex items-center gap-1 text-xs">
                <Icon className="h-3 w-3" /> {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="veli-gorusmeleri">
            <VeliGorusmeleriSection
              studentId={studentId}
              parentMeetings={data.parentMeetings}
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

      <TabsContent value="saglik-risk">
        <Tabs defaultValue="saglik">
          <TabsList className="flex flex-wrap gap-1 h-auto w-full justify-start bg-slate-100">
            {SAGLIK_RISK_TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="flex items-center gap-1 text-xs">
                <Icon className="h-3 w-3" /> {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="saglik">
            <SaglikBilgileriSection
              studentId={studentId}
              healthInfo={data.healthInfo}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="ozel-egitim">
            <OzelEgitimSection
              studentId={studentId}
              specialEducation={data.specialEducation}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="risk-degerlendirme">
            <RiskDegerlendirmeSection
              studentId={studentId}
              riskFactors={data.riskFactors}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="davranis">
            <DavranisTakibiSection
              studentId={studentId}
              behaviorIncidents={data.behaviorIncidents}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="sinavlar">
            <SinavSonuclariSection
              studentId={studentId}
              examResults={data.examResults}
              onUpdate={onUpdate}
            />
          </TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  );
}
