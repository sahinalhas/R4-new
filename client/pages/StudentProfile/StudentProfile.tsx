import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useStudentProfile, useStudentData } from "@/hooks/student-profile";
import { StudentHeader, StudentStats } from "./components";
import { ProfileDashboard } from "./components/ProfileDashboard";
import { StudentProfileTabs } from "./StudentProfileTabs";
import { EnhancedRiskCard } from "@/components/analytics/EnhancedRiskCard";
import { PersonalizedLearningCard } from "@/components/learning/PersonalizedLearningCard";
import { AdvancedAnalyticsCard } from "@/components/analytics/AdvancedAnalyticsCard";
import { SocialNetworkMap } from "@/components/social/SocialNetworkMap";
import { VoiceRecorder } from "@/components/voice/VoiceRecorder";
import LiveProfileCard from "@/components/live-profile/LiveProfileCard";
import ProfileUpdateTimeline from "@/components/live-profile/ProfileUpdateTimeline";

export default function StudentProfile() {
  const { id } = useParams();
  const [refresh, setRefresh] = useState(0);
  const [scoresData, setScoresData] = useState<any>(null);
  const [loadingScores, setLoadingScores] = useState(false);
  
  const { student, studentId, isLoading, error } = useStudentProfile(id);
  const { data } = useStudentData(studentId, refresh);

  const handleUpdate = () => setRefresh((x) => x + 1);

  // Fetch standardized scores and profile completeness
  useEffect(() => {
    if (!studentId) return;
    
    setLoadingScores(true);
    fetch(`/api/student-profile/${studentId}/scores`)
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setScoresData(result.data);
        }
      })
      .catch(err => console.error('Error loading scores:', err))
      .finally(() => setLoadingScores(false));
  }, [studentId, refresh]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Yükleniyor...</CardTitle>
          <CardDescription>Öğrenci bilgileri yükleniyor</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Hata Oluştu
          </CardTitle>
          <CardDescription>
            Öğrenci verileri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link to="/ogrenci">Listeye Dön</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

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
      <StudentHeader student={student} />
      
      {/* 🔥 CANLI ÖĞRENCİ PROFİLİ - "Öğrenci Kimdir?" */}
      <LiveProfileCard studentId={studentId as string} />
      
      <ProfileDashboard
        studentId={studentId as string}
        scores={scoresData?.scores}
        completeness={scoresData?.completeness}
        isLoading={loadingScores}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EnhancedRiskCard studentId={studentId as string} />
        <PersonalizedLearningCard studentId={studentId as string} />
      </div>

      <AdvancedAnalyticsCard studentId={studentId as string} />
      
      {/* 🔥 PROFİL GÜNCELLEME GEÇMİŞİ - Timeline */}
      <ProfileUpdateTimeline studentId={studentId as string} />
      
      <SocialNetworkMap studentId={studentId as string} />

      <Card>
        <CardHeader>
          <CardTitle>Sesli Not ve AI Analizi</CardTitle>
          <CardDescription>
            Öğrenci ile ilgili sesli not alın, otomatik transkript ve AI analizi alın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VoiceRecorder
            studentId={studentId as string}
            sessionType="INDIVIDUAL"
            onTranscriptionComplete={(result) => {
              console.log('Voice note completed:', result);
              // Buraya isterseniz bir backend kayıt işlemi eklenebilir
              handleUpdate();
            }}
          />
        </CardContent>
      </Card>

      <StudentProfileTabs
        student={student}
        studentId={studentId as string}
        data={data}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
