import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MAIN_TABS,
  TEMEL_TABS,
  EGITSEL_TABS,
  MESLEKI_TABS,
  KISISEL_PSIKOSOSYAL_TABS,
  AILE_TABS,
  STANDARDIZED_TABS,
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

import StrengthsSection from "@/components/student-profile/holistic-sections/StrengthsSection";
import SocialRelationsSection from "@/components/student-profile/holistic-sections/SocialRelationsSection";
import InterestsSection from "@/components/student-profile/holistic-sections/InterestsSection";
import FutureVisionSection from "@/components/student-profile/holistic-sections/FutureVisionSection";
import SELCompetenciesSection from "@/components/student-profile/holistic-sections/SELCompetenciesSection";
import SocioeconomicSection from "@/components/student-profile/holistic-sections/SocioeconomicSection";

import StandardizedAcademicSection from "@/components/student-profile/sections/StandardizedAcademicSection";
import StandardizedSocialEmotionalSection from "@/components/student-profile/sections/StandardizedSocialEmotionalSection";
import StandardizedTalentsSection from "@/components/student-profile/sections/StandardizedTalentsSection";
import StandardizedHealthSection from "@/components/student-profile/sections/StandardizedHealthSection";
import StandardizedBehaviorSection from "@/components/student-profile/sections/StandardizedBehaviorSection";
import MotivationProfileSection from "@/components/student-profile/sections/MotivationProfileSection";
import RiskProtectiveProfileSection from "@/components/student-profile/sections/RiskProtectiveProfileSection";

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
        <Tabs defaultValue="ogrenci-bilgileri" className="space-y-4">
          <TabsList>
            {TEMEL_TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="flex items-center gap-1 text-xs">
                <Icon className="h-3 w-3" /> {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="ogrenci-bilgileri">
            <BasicInfoSection student={student} onUpdate={onUpdate} />
          </TabsContent>

          <TabsContent value="saglik">
            <SaglikBilgileriSection
              studentId={studentId}
              healthInfo={data.healthInfo}
              onUpdate={onUpdate}
            />
          </TabsContent>
        </Tabs>
      </TabsContent>

      <TabsContent value="egitsel-rehberlik">
        <Tabs defaultValue="akademik-performans" className="space-y-4">
          <TabsList className="flex flex-wrap gap-1 h-auto w-full justify-start">
            {EGITSEL_TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="flex items-center gap-1 text-xs">
                <Icon className="h-3 w-3" /> {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="akademik-performans">
            <AkademikPerformansSection
              studentId={studentId}
              academicRecords={data.academicRecords}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="devamsizlik">
            <DevamsizlikSection
              studentId={studentId}
              attendanceRecords={data.attendanceRecords}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="calisma-programi">
            <CalismaProgramiSection studentId={studentId} />
          </TabsContent>

          <TabsContent value="sinavlar">
            <SinavSonuclariSection
              studentId={studentId}
              examResults={data.examResults}
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

          <TabsContent value="mudahaleler">
            <MudahalelerSection
              studentId={studentId}
              interventions={data.interventions}
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

          <TabsContent value="anketler">
            <AnketlerSection
              studentId={studentId}
              surveyResults={data.surveyResults}
              onUpdate={onUpdate}
            />
          </TabsContent>
        </Tabs>
      </TabsContent>

      <TabsContent value="mesleki-rehberlik">
        <Tabs defaultValue="hedefler" className="space-y-4">
          <TabsList>
            {MESLEKI_TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="flex items-center gap-1 text-xs">
                <Icon className="h-3 w-3" /> {label}
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
        </Tabs>
      </TabsContent>

      <TabsContent value="kisisel-psikososyal">
        <Tabs defaultValue="butuncul-profil" className="space-y-4">
          <TabsList className="flex flex-wrap gap-1 h-auto w-full justify-start">
            {KISISEL_PSIKOSOSYAL_TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="flex items-center gap-1 text-xs">
                <Icon className="h-3 w-3" /> {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="butuncul-profil">
            <div className="space-y-6">
              <StrengthsSection studentId={studentId} onUpdate={onUpdate} />
              <SocialRelationsSection studentId={studentId} onUpdate={onUpdate} />
              <InterestsSection studentId={studentId} onUpdate={onUpdate} />
              <FutureVisionSection studentId={studentId} onUpdate={onUpdate} />
              <SELCompetenciesSection studentId={studentId} onUpdate={onUpdate} />
              <SocioeconomicSection studentId={studentId} onUpdate={onUpdate} />
            </div>
          </TabsContent>

          <TabsContent value="kisilik-profil">
            <KisilikProfiliSection
              studentId={studentId}
              multipleIntelligence={data.multipleIntelligence}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="dijital-kocluk">
            <DijitalCoclukSection
              studentId={studentId}
              coachingRecommendations={data.coachingRecommendations}
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

          <TabsContent value="gorusmeler">
            <GorusmelerSection
              studentId={studentId}
              notes={data.notes}
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

      <TabsContent value="standartlastirilmis-profil">
        <Tabs defaultValue="akademik-profil" className="space-y-4">
          <TabsList className="flex flex-wrap gap-1 h-auto w-full justify-start">
            {STANDARDIZED_TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="flex items-center gap-1 text-xs">
                <Icon className="h-3 w-3" /> {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="akademik-profil">
            <StandardizedAcademicSection
              studentId={studentId}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="sosyal-duygusal">
            <StandardizedSocialEmotionalSection
              studentId={studentId}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="yetenek-ilgi">
            <StandardizedTalentsSection
              studentId={studentId}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="saglik-profil">
            <StandardizedHealthSection
              studentId={studentId}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="davranis-abc">
            <StandardizedBehaviorSection
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

          <TabsContent value="risk-koruyucu">
            <RiskProtectiveProfileSection
              studentId={studentId}
              onUpdate={onUpdate}
            />
          </TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  );
}
