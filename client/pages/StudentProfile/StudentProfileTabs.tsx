import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { User, Activity } from "lucide-react";
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
    <Tabs defaultValue="genel">
      <TabsList className="flex flex-wrap gap-1 h-auto w-full justify-start">
        {MAIN_TABS.map(({ value, label, icon: Icon }) => (
          <TabsTrigger key={value} value={value} className="flex items-center gap-1 text-xs">
            <Icon className="h-3 w-3" /> {label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="genel">
        <Accordion type="single" collapsible defaultValue="ogrenci" className="space-y-2">
          <AccordionItem value="ogrenci">
            <AccordionTrigger className="text-base font-semibold">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Öğrenci Bilgileri
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <BasicInfoSection student={student} onUpdate={onUpdate} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="saglik">
            <AccordionTrigger className="text-base font-semibold">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Sağlık Bilgileri
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <StandardizedHealthSection
                studentId={studentId}
                onUpdate={onUpdate}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </TabsContent>

      <TabsContent value="aile">
        <Accordion type="single" collapsible defaultValue="veli-gorusmeleri" className="space-y-2">
          {AILE_TABS.map(({ value, label, icon: Icon }) => (
            <AccordionItem key={value} value={value}>
              <AccordionTrigger className="text-base font-semibold">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {label}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {value === "veli-gorusmeleri" && (
                  <VeliGorusmeleriSection
                    studentId={studentId}
                    onUpdate={onUpdate}
                  />
                )}
                {value === "ev-ziyaretleri" && (
                  <EvZiyaretleriSection
                    studentId={studentId}
                    homeVisits={data.homeVisits}
                    onUpdate={onUpdate}
                  />
                )}
                {value === "aile-katilim" && (
                  <AileKatilimiSection
                    studentId={studentId}
                    familyParticipation={data.familyParticipation}
                    onUpdate={onUpdate}
                  />
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </TabsContent>

      <TabsContent value="egitsel">
        <Accordion type="single" collapsible defaultValue="akademik" className="space-y-2">
          {EGITSEL_TABS.map(({ value, label, icon: Icon }) => (
            <AccordionItem key={value} value={value}>
              <AccordionTrigger className="text-base font-semibold">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {label}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {value === "akademik" && (
                  <StandardizedAcademicSection
                    studentId={studentId}
                    onUpdate={onUpdate}
                  />
                )}
                {value === "calisma-programi" && (
                  <CalismaProgramiSection studentId={studentId} />
                )}
                {value === "ozel-egitim" && (
                  <OzelEgitimSection
                    studentId={studentId}
                    specialEducation={data.specialEducation}
                    onUpdate={onUpdate}
                  />
                )}
                {value === "mudahaleler" && (
                  <MudahalelerSection
                    studentId={studentId}
                    interventions={data.interventions}
                    onUpdate={onUpdate}
                  />
                )}
                {value === "ilerleme" && (
                  <IlerlemeTakibiSection
                    studentId={studentId}
                    achievements={data.achievements}
                    selfAssessments={data.selfAssessments}
                    todaysAssessment={data.todaysAssessment}
                    onUpdate={onUpdate}
                  />
                )}
                {value === "anketler" && (
                  <AnketlerSection
                    studentId={studentId}
                    surveyResults={data.surveyResults}
                    onUpdate={onUpdate}
                  />
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </TabsContent>

      <TabsContent value="kisisel-gelisim">
        <Accordion type="single" collapsible defaultValue="sosyal-duygusal" className="space-y-2">
          {KISISEL_GELISIM_TABS.map(({ value, label, icon: Icon }) => (
            <AccordionItem key={value} value={value}>
              <AccordionTrigger className="text-base font-semibold">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {label}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {value === "sosyal-duygusal" && (
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
                )}
                {value === "davranis" && (
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
                )}
                {value === "risk" && (
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
                )}
                {value === "gorusmeler" && (
                  <GorusmelerSection
                    studentId={studentId}
                    notes={data.notes}
                    onUpdate={onUpdate}
                  />
                )}
                {value === "kisilik" && (
                  <KisilikProfiliSection
                    studentId={studentId}
                    multipleIntelligence={data.multipleIntelligence}
                    onUpdate={onUpdate}
                  />
                )}
                {value === "360-degerlendirme" && (
                  <Degerlendirme360Section
                    studentId={studentId}
                    evaluations360={data.evaluations360}
                    onUpdate={onUpdate}
                  />
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </TabsContent>

      <TabsContent value="mesleki">
        <Accordion type="single" collapsible defaultValue="hedefler" className="space-y-2">
          {MESLEKI_TABS.map(({ value, label, icon: Icon }) => (
            <AccordionItem key={value} value={value}>
              <AccordionTrigger className="text-base font-semibold">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {label}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {value === "hedefler" && (
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
                )}
                {value === "kariyer" && (
                  <div className="p-6 text-center text-muted-foreground">
                    Kariyer planlama bölümü yakında eklenecek
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </TabsContent>
    </Tabs>
  );
}
